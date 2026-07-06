"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { statusConfig } from '@/components/dashboard/projectCard'
import DeleteButton from '@/components/projects/deleteProject'
import Navbar from '@/components/navbar'
import ChangeStatusButton from '@/components/projects/changeStatusButton'
import EditButton from '@/components/projects/editDialog'
import CreateResourceDialog from '@/components/projects/createResourceDialog'
import ResourceSection from "@/components/resources/resourceSection"

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
    const [resources, setResources] = useState([])
    useEffect(() => {
        getProject()
    }, [])
    const getProject = async () => {
        const response = await fetch(`/api/projects/${params.id}`)
        const data = await response.json()
        if (!response.ok) {
            toast.error(data.message)
            return
        }
        setProject(data.project)
        setResources(data.resources)
    }

    if (!project) return (<>Loading...</>)
    const config = statusConfig[project.status];
    return (<div>

        <Navbar />
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
                    <ChangeStatusButton id={project.id} status={project.status} onSuccess={getProject} />
                    <EditButton id={project.id} name={project.name} description={project.description} onSuccess={getProject} />
                    <DeleteButton id={params.id} />
                </div>
                <br />
            <CreateResourceDialog projectId={params.id}/>
            <ResourceSection resources={resources} projectId ={params.id} onDelete={getProject}/>
            </div>
        </main>
    </div>
    )
}

export default SingleProject