import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return NextResponse.json(
    { service: "staffordmedia", connected_to: "abando.ai" },
    {
      headers: {
        // allow Abando to read this one endpoint (both apex & www)
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      }
    }
  );
}
