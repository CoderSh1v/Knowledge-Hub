import prisma from "@/lib/db";
import getCurrentUser from "@/lib/getUserId";

export async function POST(req: Request) {
    try {
        const { title, description } = await req.json()
        const userId = await getCurrentUser()
        if (!userId) {
            return Response.json({ success: false, message: "UserId not found" }, { status: 401 })
        }

        const projectID = await prisma.project.create({
            data: {
                name: title,
                description: description,
                user: { connect: { id: userId } }
            }
        })

        await prisma.activityLog.create({
            data: {
                actionType: "PROJECT_CREATED",
                user: { connect: { id: userId } },
                project: { connect: { id: projectID.id } }
            }
        })

        return Response.json({ success: true, project: { id: projectID.id, name: projectID.name } }, { status: 201 })
    } catch (error: any) {
        if (error.code === "P2002") {
            return Response.json({ success: false, message: "Project Name already exists" }, { status: 409 });
        }
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}
export async function GET(req: Request) {
    try {
        const userId = await getCurrentUser()
        if (!userId) {
            return Response.json({ success: false, message: "UserId not found" }, { status: 401 })
        }
        const projects = await prisma.project.findMany({
            where: { userId: userId }
        })
        console.log(projects)


        return Response.json({ success: true, }, { status: 201 })
    } catch (error: any) {

    }

}