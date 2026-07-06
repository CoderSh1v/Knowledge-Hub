import prisma from "@/lib/db";
import getCurrentUser from "@/lib/getUserId";

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
    const fullResource = await prisma.resource.findMany({
        where: {
            userId: userId,
            projectId: id
        },
        include: { resourceTags: { include: { tag: true } } }
    })
    const resources = fullResource.map((resource) => ({
        ...resource,
        resourceTags: resource.resourceTags?.map((rt) => rt.tag)
    }))
    return Response.json({
        success: true,
        project,
        resources
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
            metadata: {
                message: "Project Soft Deleted"
            }
        }
    })
    return Response.json({ success: true, message: "Project Soft Deleted" }, { status: 202 })

}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getCurrentUser();
    const body = await req.json()
    if (!userId) {
        return Response.json({
            success: false,
            message: "User Id not Found"
        }, { status: 404 })
    }
    const project = await prisma.project.update({
        where: { id: id },
        data: body
    })
    if (body.status) {
        await prisma.activityLog.create({
            data: {
                actionType: "PROJECT_UPDATED",
                user: { connect: { id: userId } },
                project: { connect: { id: project.id } },
                metadata: { message: `Changed status to ${body.status}` }
            }
        })
    }
    if (body.name) {
        await prisma.activityLog.create({
            data: {
                actionType: "PROJECT_UPDATED",
                user: { connect: { id: userId } },
                project: { connect: { id: project.id } },
                metadata: { message: `Changed name and description to ${body}` }
            }
        })
    }
    return Response.json({ success: true, message: "Project Updated" }, { status: 200 })

}