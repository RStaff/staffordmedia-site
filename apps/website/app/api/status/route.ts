import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return NextResponse.json(
    { service: "abando", connected_to: "staffordmedia.ai" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      }
    }
  );
}
