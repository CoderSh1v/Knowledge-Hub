import { NextResponse, NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("SessionId")?.value

    if (!sessionId) return NextResponse.redirect(new URL('/signin?reason=session_expired', request.url))

    return NextResponse.next()
}
export const config = {
    matcher: ['/dashboard', '/projects/:path*', '/resources/:path*',]
}

