import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { toast } from "sonner"
const DeleteResourceButton = ({ id, children, projectId, onDelete }: { id: string, projectId: string, children?: ReactNode, onDelete?: () => Promise<void> }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const deleteResource = async () => {
        const response = await fetch(`/api/resources/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        if (response.ok) {
            setOpen(false)
            router.replace(`/projects/${projectId}`)
            toast.message("Resource moved to trash")
            if (onDelete) onDelete()
            return
        }
        return toast.error("There was an error in deleting. Try Again")
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? <Button variant="destructive" size="lg" className="flex items-center gap-2 ml-auto">  Delete</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl">Move resource to trash?</DialogTitle>
                    <DialogDescription className="text-base leading-relaxed">
                        This resource will be moved to the trash and will be deleted automatically after 30 days
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 gap-2 sm:justify-end">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={deleteResource} >Move to Trash</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default DeleteResourceButton