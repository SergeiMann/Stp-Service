import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  const res = NextResponse.next()

  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const isProd = process.env.NODE_ENV === 'production'
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-inline'",
    isProd ? "style-src 'self'" : "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
  ].filter(Boolean).join('; ')

  res.headers.set('Content-Security-Policy', csp)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


