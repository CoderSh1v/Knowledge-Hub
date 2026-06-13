import { toast } from "sonner"
import { Button } from "../ui/button"

const ChangeStatusButton = ({ id, status, onSuccess }: { id: string, status: string, onSuccess: () => Promise<void> }) => {
    let setStatusToThis = ''
    status === "ACTIVE" ? setStatusToThis = 'ARCHIVED' : setStatusToThis = 'ACTIVE'

    async function changeStatus() {
        const response = await fetch(`/api/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ status: setStatusToThis })
        })
        const data = await response.json()
        if (!response.ok) return toast.error(data.message)
        await onSuccess()
    }
    return (
        <Button variant="outline" size="lg" className="flex items-center gap-2" onClick={changeStatus}>
            Change Status
        </Button>
    )
}

export default ChangeStatusButton
