import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "staffordos/system_inventory/output/staffordmedia_gate_report_v1.json");

if (!fs.existsSync(reportPath)) {
  console.error("BLOCKED: missing staffordmedia_gate_report_v1.json. Run gate runner first.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const gates = report.gates || {};

const blockers = [];

if (gates.pre_patch_gate?.status !== "PASS") blockers.push("pre_patch_gate");
if (gates.source_owner_gate?.status !== "PASS") blockers.push("source_owner_gate");
if (gates.product_identity_gate?.status !== "PASS") blockers.push("product_identity_gate");
if (gates.commit_hygiene_gate?.status === "DIRTY_REPO") blockers.push("dirty_repo");

const result = {
  generated_at: new Date().toISOString(),
  action: "client_facing_action",
  allowed: blockers.length === 0,
  blockers,
  rule: "No outreach, auto-send, live traffic, or public launch action while blocked."
};

fs.writeFileSync(
  path.join(root, "staffordos/system_inventory/output/no_client_facing_action_gate_v1.json"),
  JSON.stringify(result, null, 2)
);

console.log(JSON.stringify(result, null, 2));

if (!result.allowed) process.exit(1);
