import getCurrentUser from "@/lib/getUserId";
import prisma from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, tagId: string }> }) {
    const { id, tagId } = await params;
    const userId = await getCurrentUser();
    if (!userId) return Response.json({ message: "User Id not Found" }, { status: 404 })

    const tagExists = await prisma.resourceTag.findUnique({ where: { resourceId_tagId: { resourceId: id, tagId } } })

    if (!tagExists) return Response.json({ message: "Tag not Found" }, { status: 400 })

    await prisma.resourceTag.delete({ where: { resourceId_tagId: { resourceId: id, tagId } } })

    return Response.json({ status: 204 })
}