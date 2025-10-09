import { NextRequest, NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS' && req.nextUrl.pathname.startsWith('/api/')) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': req.headers.get('access-control-request-headers') || '*',
      },
    });
  }
  return NextResponse.next();
}
export const config = { matcher: ['/api/:path*'] };
