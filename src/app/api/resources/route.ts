import getCurrentUser from "@/lib/getUserId";
import { createNote, createFile, createLink } from "@/app/services/resources.service";
import { Prisma } from "@/generated/prisma/client";
export async function POST(req: Request) {
   try {
      const userId = await getCurrentUser();
      if (!userId) return Response.json({ success: false, message: "UserId not found" }, { status: 401 })
      const data = await req.json()
      const { title, description, tags, url, resourceType } = data.formData
      let resourceId;
      switch (resourceType) {
         case 'pdf':
            resourceId = await createFile(title, data.projectId, userId, resourceType, description, tags)
            break;
         case 'note':
            resourceId = await createNote(title, data.projectId, userId, tags)
            break;
         case 'image':
            resourceId = await createFile(title, data.projectId, userId, resourceType, description, tags)
            break;
         case 'link':
            resourceId = await createLink(title, url, data.projectId, userId, description, tags)
            break;

         default:
            break;
      }
      return Response.json({ success: true, message: 'resource created', id: resourceId!.id }, { status: 201 })

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
