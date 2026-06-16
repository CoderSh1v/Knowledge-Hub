import getCurrentUser from "@/lib/getUserId";
import { createNote, createImage, createLink, createPdf } from "@/app/services/resources.service";

export async function POST(req: Request) {
   const userId = await getCurrentUser();
   if (!userId) return Response.json({ success: false, message: "UserId not found" }, { status: 401 })
   const data = await req.json()
   console.log(data)
   const { title, description, tags, url, resourceType } = data.formData
   let resourceId ;
   switch (resourceType) {
      case 'pdf':

         break;
      case 'note':
         createNote(title, data.projectId, userId)
         break;
      case 'image':

         break;
      case 'link':
         createLink(title, url, data.projectId, userId, description)
         break;

      default:
         break;
   }

   return Response.json({ success: true, message: 'resource created' }, { status: 201 })
}
