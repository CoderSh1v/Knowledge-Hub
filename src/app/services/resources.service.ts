import prisma from "@/lib/db";


export async function createNote(title: string, projectId: string, userId: string) {

    const resource = await prisma.resource.create({
        data: {
            title: title,
            type: 'NOTE',
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } }
        }
    })
    return
}
export async function createLink(title: string, url: string, projectId: string, userId: string, description?: string) {

    const resource = await prisma.resource.create({
        data: {
            title: title,
            type: 'LINK',
            description: description,
            externalLink: url,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } }
        }
    })
    return
}
export async function createPdf(title: string, projectId: string, userId: string, description?: string) {

    const resource = await prisma.resource.create({
        data: {
            title: title,
            type: 'PDF',
            description : description,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } }
        }
    })
    return
}
export async function createImage(title: string, projectId: string, userId: string, description?: string) {

    const resource = await prisma.resource.create({
        data: {
            title: title,
            type: 'IMAGE',
            description : description,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } }
        }
    })
    return
}