"use client"
import CreateProject from "@/components/dashboard/createProject"
import ProjectCard from "@/components/dashboard/projectCard"
import { useEffect, useState } from "react"
import { Project } from "@/components/dashboard/projectCard"
import { toast } from "sonner"
import Navbar from "@/components/navbar"
const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
        getprojects()
    }, [])
    const getprojects = async () => {
        const response = await fetch("/api/projects")
        const data = await response.json()
        if (!response.ok) return toast.error(data.message)
        setProjects(data.projects)
    }
    const visibleProjects = projects.filter(project => project.deletedAt === null)

    return (
        <div>
            <Navbar />
            <CreateProject />


            {projects.length === 0 ? <div>Loading... </div> :
                visibleProjects.map((project) => {
                    return <ProjectCard key={project.id} name={project.name} description={project.description} id={project.id} status={project.status} />
                })}
        </div>
    )
}

export default Dashboard
