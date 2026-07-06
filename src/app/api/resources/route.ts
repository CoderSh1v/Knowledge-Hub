import getCurrentUser from "@/lib/getUserId";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { ResourceType } from "@/generated/prisma/client";
interface CreateResourceRequest {
   formData: {
      title: string;
      resourceType: ResourceType;
      description: string | null;
      tags: string[];
      url: string | null;
      file: {
         fileName: string
         fileURL: string
         mimeType: string
         fileSize: number
      }
   }
   projectId: string;
}
export async function POST(req: Request) {
   try {
      const userId = await getCurrentUser();
      if (!userId) return Response.json({ success: false, message: "UserId not found" }, { status: 401 })

      const data: CreateResourceRequest = await req.json()
      const { title, resourceType } = data.formData
      if (!title || !resourceType) return Response.json({ message: "title is required" }, { status: 400 })
      let { description, tags, url, file } = data.formData
      const uniqueTags: string[] = [...new Set(tags.map((tag: string) => tag.trim().toLowerCase()))];

      if (!description) description = null;
      if (resourceType === "NOTE") {
         description = null;
         url = null;
      }
      if (resourceType === "LINK" && !url) return Response.json({ message: "URL is required for link type" }, { status: 400 })

      let resourceData: Prisma.ResourceCreateInput = {
         title: title.toLowerCase(),
         displayName: title,
         type: resourceType,
         description: description,
         externalLink: url,
         resourceTags: {
            create: uniqueTags.map((tag: string) => {
               return {
                  tag: {
                     connectOrCreate: {
                        where: { userId_name: { userId, name: tag } },
                        create: {
                           name: tag,
                           user: { connect: { id: userId } }
                        }
                     }
                  }
               }
            })
         },
         user: { connect: { id: userId } },
         project: { connect: { id: data.projectId } }
      }

      if (resourceType === "PDF" || resourceType === "IMAGE") {
         if (!file) return Response.json({ message: "File is missing" }, { status: 400 })
         url = null;
         resourceData.file = {
            create: {
               fileName: file.fileName,
               fileSize: file.fileSize,
               fileURL: file.fileURL,
               mimeType: file.mimeType
            }
         }
      }
      const resource = await prisma.resource.create({ data: resourceData })
      return Response.json({ success: true, message: 'resource created', resource }, { status: 201 })
   } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
         return Response.json({
            success: false,
            message: `Title already exists on the resource type `
         }, { status: 409 })
      }
      return Response.json(
         { success: false, err }, { status: 500 }
      );
   }
}
