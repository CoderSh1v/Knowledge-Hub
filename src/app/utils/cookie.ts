"use server"
import { cookies } from 'next/headers';

export async function createCookie(id : string) {
    const cookieStore = await cookies();
    
    cookieStore.set('SessionId', id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    });
}
