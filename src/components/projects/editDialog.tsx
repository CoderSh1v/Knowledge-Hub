"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { newProjectSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useState } from "react"

const EditButton = (
    { id, name, description, onSuccess }: { id: string, name: string, description?: string, onSuccess: () => Promise<void> }
) => {
    const [open, setOpen] = useState(false)
    type Inputs = z.infer<typeof newProjectSchema>
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(newProjectSchema),
        defaultValues: {
            title: name,
            description: description ?? ""
        }
    })
    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const response = await fetch(`/api/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ name: formData.title, description: formData.description })
        })
        const data = await response.json()
        if (!response.ok) return toast.error(data.message)
        toast.message("Update Successfull")
        setOpen(false)
        await onSuccess()
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="flex items-center gap-2" onClick={() => setOpen(true)}> Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm" aria-describedby={undefined} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
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
                        <DialogClose asChild>
                            <Button type="button" >Cancel </Button>
                        </DialogClose>
                        <Button type="submit" >Save Changes </Button><br />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditButton
