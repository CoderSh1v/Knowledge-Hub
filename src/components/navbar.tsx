import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            <Link href="/dashboard" className="font-bold text-lg text-gray-900">
                Knowledge Hub
            </Link>
            <div className="flex gap-3">
                Hello User
            </div>
        </nav>
    )
}

export default Navbar
