"use client"
import CreateProject from "@/components/dashboard/createProject"
import ProjectCard from "@/components/dashboard/projectCard"
import { useEffect, useState } from "react"
import { Project } from "@/components/dashboard/projectCard"

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
        getprojects()
    }, [])
    const getprojects = async () => {
        const response = await fetch("/api/projects")
        if (!response.ok) {
            return
        }
        const data = (await response.json()).projects
        setProjects(data)
    }
    return (
        <div>
            <CreateProject />
            {projects.map((project) => {
                return <ProjectCard key={project.id} name={project.name} description={project.description} id={project.id} status={project.status} />
            })}
        </div>
    )
}

export default Dashboard
