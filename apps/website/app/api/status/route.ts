import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return NextResponse.json(
    { service: "staffordmedia", connected_to: "abando.ai" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300"
      }
    }
  );
}
