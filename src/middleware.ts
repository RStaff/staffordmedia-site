import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/operator/:path*"],
};

export function middleware(_request: NextRequest) {
  return new NextResponse(null, { status: 404 });
}
