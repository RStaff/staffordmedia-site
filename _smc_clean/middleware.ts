import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  // run on everything (pages, assets, etc.)
  matcher: ['/:path*'],
}

export function middleware(_req: NextRequest) {
  const res = NextResponse.next()
  const h = res.headers

  // Marker so we can verify easily
  h.set('x-smc-sec', 'on')

  // Security headers
  h.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload')
  h.set('x-frame-options', 'SAMEORIGIN')
  h.set('x-content-type-options', 'nosniff')
  h.set('referrer-policy', 'strict-origin-when-cross-origin')

  // Minimal, safe Permissions-Policy (expand later if you like)
  h.set('permissions-policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  )

  return res
}
