import { NextResponse } from "next/server";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const dir = join(process.cwd(), "staffordos", "work_packets");

  if (!existsSync(dir)) {
    return NextResponse.json({ ok: true, packets: [] });
  }

  const packets = readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const full = join(dir, file);
      return JSON.parse(readFileSync(full, "utf8"));
    });

  return NextResponse.json({ ok: true, packets });
}
