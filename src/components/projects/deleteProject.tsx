import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
const DeleteButton = ({ id }: { id: string }) => {
    const router = useRouter();
    const deleteProject = async() => {
        const response = await fetch(`/api/projects/${id}`,{
            method : "DELETE",
            headers :{"Content-Type": "application/json"}
        })
        if(response.ok){
            router.replace("/dashboard")
            toast.message("Project moved to trash")
            return
        }
        return toast.error("There was an error in deleting. Try Again")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="lg" className="flex items-center gap-2 ml-auto">  Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">

                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl">Move project to trash?</DialogTitle>
                    <DialogDescription className="text-base leading-relaxed">
                        This project will be moved to the trash and will be deleted automatically after 30 days
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 gap-2 sm:justify-end">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={deleteProject} >Move to Trash</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
export default DeleteButton