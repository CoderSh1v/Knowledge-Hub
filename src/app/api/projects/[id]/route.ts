import prisma from "@/lib/db";
import getCurrentUser from "@/lib/getUserId";
import { check_whether_project_is_deleted } from "@/lib/projectDeleteOrNot";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const userId = await getCurrentUser();
    if (!userId) {
        return Response.json({
            success: false,
            message: "User Id not Found"
        }, { status: 404 })
    }

    const project = await prisma.project.findUnique({
        where: {
            id: id,
            userId: userId
        }
    })
    return Response.json({
        success: true,
        project
    }, { status: 200 })
    
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getCurrentUser();
    if (!userId) {
        return Response.json({
            success: false,
            message: "User Id not Found"
        }, { status: 404 })
    }
    
    const project = await prisma.project.update({
        where: { id: id },
        data: {
            deletedAt: new Date()
        }
    })

    await prisma.activityLog.create({
         data: {
                actionType: "PROJECT_UPDATED",
                user: { connect: { id: userId } },
                project: { connect: { id: project.id } },
                metadata : {
                    message : "Project Soft Deleted"
                }
            }
    })
    return Response.json({ success: true,message :"Project Soft Deleted" }, { status: 202 })

}