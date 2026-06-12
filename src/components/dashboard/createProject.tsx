"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import z from "zod"
import { newProjectSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const CreateProject = () => {
    const router = useRouter()
    type Inputs = z.infer<typeof newProjectSchema>
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<Inputs>({ resolver: zodResolver(newProjectSchema) })
    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if (!response.ok) {
            toast.error(data.message)
            return setError("root.serverError", {
                type: 'server',
                message: data.message
            })
        }
        router.push(`/projects/${data.project.id}`)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Project</Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-sm" aria-describedby={undefined} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader><br />
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title" >Project Name</Label>
                            <Input {...register("title")} placeholder="Required" />
                            {errors.title && (<p className="text-sm text-red-500">  {errors.title.message}</p>)}
                        </Field>
                        <Field>
                            <Label htmlFor="description" >Description</Label>
                            <Textarea className="min-h-40 max-h-50 overflow-y-auto" {...register("description")} />
                            {errors.description && (<p className="text-sm text-red-500">  {errors.description.message}</p>)}
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="flex justify-center">
                        <Button type="submit" >Save </Button><br />

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default CreateProject
