"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export default async function getCurrentUser() {
    const sessionId = (await cookies()).get("SessionId")?.value;

    if (!sessionId)
        return null;

    const session = await prisma.session.findUnique({
        where: {
            sessionId: sessionId
        },
        include: {
            user: true
        }
    });
   
    return session?.userId ;
}