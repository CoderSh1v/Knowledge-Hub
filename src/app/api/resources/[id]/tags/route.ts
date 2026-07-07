import prisma from "@/lib/db";
import getCurrentUser from "@/lib/getUserId";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const userId = await getCurrentUser();
    if (!userId) return Response.json({ message: "User Id not Found" }, { status: 404 })

    const { tagName } = await req.json()
    let tag = await prisma.tag.findUnique({ where: { userId_name: { userId: userId, name: tagName.trim().toLowerCase() } } })

    if (tag) {
        const resourceTag = await prisma.resourceTag.upsert({
            where: { resourceId_tagId: { resourceId: id, tagId: tag.id } },
            update: {},
            create: {
                resource: { connect: { id } },
                tag: { connect: { id: tag.id } }
            }
        })
        if (!resourceTag) return Response.json({ message: "Problem in creating resourcetag " }, { status: 400 })
    }
    else {
        tag = await prisma.tag.create({
            data: {
                user: { connect: { id: userId } },
                name: tagName.trim().toLowerCase(),
                resourceTags: {
                    create: { resourceId: id }
                }
            }
        })
    }
    return Response.json({ message: "Tag Created", tag }, { status: 201 })
}

