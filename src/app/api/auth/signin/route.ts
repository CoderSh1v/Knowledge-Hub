import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateSessionId } from "@/app/utils/generateSessionId";
import { createCookie } from "@/app/utils/cookie";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return Response.json({
            success: false,
            message: "Invalid Email"
        }, { status: 401 })
    }
    const comparePswd = await bcrypt.compare(password, user.passwordHash)
    if (!comparePswd) {
        return Response.json({
            success: false,
            message: "Incorrect Password"
        }, { status: 401 })
    }
    const sessionId = generateSessionId() 
    await prisma.session.create({
        data: {
            sessionId: sessionId,
            userId: user.id,
            expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })
    await createCookie(sessionId)
    
    return Response.json({
        success: true,
        message: "Sign In Successfull"
    }, { status: 200 })
}