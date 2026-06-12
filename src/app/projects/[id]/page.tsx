"use client"
import { Button } from '@/components/ui/button'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { statusConfig } from '@/components/dashboard/projectCard'
import DeleteButton from '@/components/projects/deleteProject'

type Project = {
    name: string,
    id: string,
    description?: string,
    status: 'ACTIVE' | 'ARCHIVED',
    userId: string,
    createadAt: string,
    updatedAt: string,
    deletedAt?: string
}

const SingleProject = () => {
    const params = useParams<{ id: string }>()
    const [project, setProject] = useState<Project | null>(null)

    useEffect(() => {
        getProject()
    }, [])
    const getProject = async () => {
        // const check = await check_whether_project_is_deleted(params.id)
        // if (check) {
        //     return <>This project is deleted. You can't access it here</>
        // }
        const response = await fetch(`/api/projects/${params.id}`)
        const data = await response.json()
        if (!response.ok) return toast.error(data.message)

        setProject(data.project)
    }

    if (!project) return (<>Loading...</>)
    const config = statusConfig[project.status];
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
                    <span className={`${config.bg} ${config.text} border-0`}>
                        {config.label}
                    </span>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                        Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="flex items-center gap-2">
                        Change Status
                    </Button>
                    <Button variant="outline" size="lg" className="flex items-center gap-2">
                        Edit
                    </Button>
                    <DeleteButton id={params.id} />
                </div>
            </div>
        </main>
    )
}

export default SingleProject