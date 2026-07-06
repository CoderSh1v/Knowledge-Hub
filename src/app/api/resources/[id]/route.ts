import prisma from "@/lib/db";
import getCurrentUser from "@/lib/getUserId";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const userId = await getCurrentUser();
    if (!userId) {
        return Response.json({
            success: false,
            message: "User Id not Found"
        }, { status: 404 })
    }
    const fullResource = await prisma.resource.findFirst({
        where: {
            id: id,
            userId: userId
        },
        include: {
            resourceTags: {
                include: {
                    tag: true
                }
            }
        }
    })
    const resource = {
        ...fullResource,
        resourceTags: fullResource?.resourceTags?.map(rt => rt.tag) ?? []
    }
    return Response.json({ resource }, { status: 200 })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const userId = await getCurrentUser();
    if (!userId) {
        return Response.json({
            success: false,
            message: "User Id not Found"
        }, { status: 404 })
    }
    await prisma.resource.update({
        where: { id: id },
        data: { deletedAt: new Date() }
    })
    await prisma.activityLog.create({
        data: {
            actionType: "RESOURCE_DELETED",
            user: { connect: { id: userId } },
            resource: { connect: { id: id } },
            metadata: { message: "Resource moved to trash" }
        }
    })
    return Response.json({ message: "Resource Soft Deleted" }, { status: 200 })
}