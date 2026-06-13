import Link from "next/link"
import { Button } from "./ui/button"

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            <Link href="/" className="font-bold text-lg text-gray-900">
                Knowledge Hub
            </Link>
            <div className="flex gap-3">
                <Button variant="ghost" size="sm">
                    <Link href="/signin">Sign in</Link>
                </Button>
                <Button size="sm">
                    <Link href="/signup">Sign up</Link>
                </Button>
            </div>
        </nav>
    )
}

export default Navbar
