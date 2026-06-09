import prisma from "@/lib/db";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
    const { name, email, password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 8)
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
        return Response.json({
            success: false,
            message: "User already exists"
        }, { status: 409 })
    }
    await prisma.user.create({
        data: {
            name: name,
            email: email,
            passwordHash: hashedPassword
        }
    })

    return Response.json({
        success: true,
        message: "User Created"
    }, { status: 201 })
}