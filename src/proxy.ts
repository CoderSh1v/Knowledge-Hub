import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export default async function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("SessionId")?.value
    if (!sessionId)
        return NextResponse.redirect(new URL('/signin', request.url))

    return NextResponse.next()
}
export const config = {
    matcher: '/dashboard'
}

