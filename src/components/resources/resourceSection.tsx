'use client'
import { Resource } from "@/generated/prisma/client"
import { ResourceCard } from "./resourceCard"
import Link from "next/link"
const ResourceSection = ({ resources }: { resources: Resource[] }) => {
    console.log(resources)

    return (
        <div>
            {resources.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500 text-center">
                        No resources yet. <br />
                        Create your first resource to get started.
                    </p>
                </div>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource: Resource) => {
                        let href;
                        switch (resource.type) {
                            case "NOTE":
                                href = `/resources/${resource.id}`;
                                break;
                            case "LINK":
                                href = `${resource.externalLink}`;
                                break;
                            case "IMAGE":
                                href = ``;
                                break;
                            case "PDF":
                                href = ``;
                                break;
                            default:
                                return null;
                        }
                        return (
                            <Link href={href} key={resource.id} target="_blank">
                                <ResourceCard displayName={resource.displayName} id={resource.id} type={resource.type} description={resource.description} />
                            </Link>

                        )
                    })}
                </div>
            )}
        </div >
    )
}

export default ResourceSection
