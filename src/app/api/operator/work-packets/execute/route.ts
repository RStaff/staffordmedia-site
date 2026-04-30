import { NextResponse } from "next/server";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

export async function POST() {
  const root = process.cwd();
  const packetDir = path.join(root, "staffordos", "work_packets");
  const outDir = path.join(root, "staffordos", "system_inventory", "output");

  if (!existsSync(packetDir)) {
    return NextResponse.json({ ok: false, error: "no_packets" }, { status: 400 });
  }

  const file = readdirSync(packetDir).find(f => f.endsWith(".json"));
  if (!file) {
    return NextResponse.json({ ok: false, error: "no_active_packet" }, { status: 400 });
  }

  const packet = JSON.parse(
    readFileSync(path.join(packetDir, file), "utf-8")
  );

  mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, "active_execution_request_v1.json");

  const result = {
    generated_at: new Date().toISOString(),
    work_id: packet.work_id,
    next_action: packet.next_action,
    owner_files: packet.owner_files,
    execution_plan: {
      type: "code_patch",
      target_files: packet.owner_files,
      actions: [
        "tighten CTA dominance",
        "reduce repeated explanatory copy",
        "reduce scroll friction before audit form"
      ],
      forbidden_areas: packet.blocked_areas
    },
    status: "READY_FOR_EXECUTION"
  };

  writeFileSync(outFile, JSON.stringify(result, null, 2));

  return NextResponse.json({ ok: true, result });
}
