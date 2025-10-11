import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Exclude Next static dirs and any request that clearly targets a file
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site.webmanifest|apple-touch-icon.png|android-chrome-.*.png|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json|js|css)|api).*)',
  ],
}

export function middleware(_req: NextRequest) {
  return NextResponse.next()
}
