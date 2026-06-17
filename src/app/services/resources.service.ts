import prisma from "@/lib/db";
import { ResourceType } from "@/generated/prisma/enums";

export async function createNote(title: string, projectId: string, userId: string, tags?: string[]) {

    const tagsData = await createTags(userId, tags)
    const resource = await prisma.resource.create({
        data: {
            title: title.toLowerCase(),
            displayName: title,
            type: 'NOTE',
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } },
            resourceTags: {
                create: tagsData.map((tag) => ({
                    tag: { connect: { id: tag.id } }
                }))
            }
        }
    })
    return resource
}
export async function createLink(title: string, url: string, projectId: string, userId: string, description?: string, tags?: string[]) {

    const tagsData = await createTags(userId, tags)
    const resource = await prisma.resource.create({
        data: {
            title: title.toLowerCase(),
            displayName: title,
            type: 'LINK',
            description: description,
            externalLink: url,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } },
            resourceTags: {
                create: tagsData.map((tag) => ({
                    tag: { connect: { id: tag.id } }
                }))
            }
        }
    })
    return resource
}
export async function createPdf(title: string, projectId: string, userId: string, description?: string, tags?: string[]) {

    const tagsData = await createTags(userId, tags)
    const resource = await prisma.resource.create({
        data: {
            title: title.toLowerCase(),
            displayName: title,
            type: 'PDF',
            description: description,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } },
            resourceTags: {
                create: tagsData.map((tag) => ({
                    tag: { connect: { id: tag.id } }
                }))
            }
        }
    })
    return resource
}
export async function createFile(title: string, projectId: string, userId: string, resourceType: String, description?: string, tags?: string[]) {
    const type = resourceType.toUpperCase() as ResourceType
    const tagsData = await createTags(userId, tags)
    const resource = await prisma.resource.create({
        data: {
            title: title.toLowerCase(),
            displayName: title,
            type: type,
            description: description,
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } },
            resourceTags: {
                create: tagsData.map((tag) => ({
                    tag: { connect: { id: tag.id } }
                }))
            }
        }
    })
    return resource
}

export async function createTags(userId: string, tags?: string[]) {
    if (!tags || tags.length <= 0) {
        return []
    }
    await prisma.tag.createMany({
        data: tags.map(tag => ({
            name: tag.toLowerCase(),
            userId: userId
        })),
        skipDuplicates: true
    });
    const tagsData = await prisma.tag.findMany({ where: { userId: userId, name: { in: tags } } });
    return tagsData
}