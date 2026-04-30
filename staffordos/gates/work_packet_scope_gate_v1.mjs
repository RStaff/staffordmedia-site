import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packetDir = path.join(root, "staffordos", "work_packets");
const status = process.argv.slice(2);

if (!fs.existsSync(packetDir)) {
  console.error("❌ No work_packets directory found");
  process.exit(1);
}

const packets = fs.readdirSync(packetDir).filter((f) => f.endsWith(".json"));
if (!packets.length) {
  console.error("❌ No work packet found");
  process.exit(1);
}

const packetPath = path.join(packetDir, packets[0]);
const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
const ownerFiles = new Set(packet.owner_files || []);

const changed = status
  .map((line) => line.trim().split(/\s+/).pop())
  .filter(Boolean)
  .filter((file) => file && !file.startsWith("staffordos/") && file !== "package-lock.json" && file !== "apps/website/.eslintcache");

const outside = changed.filter((file) => !ownerFiles.has(file));

if (outside.length) {
  console.error("❌ Scope violation. Changed files outside active work packet:");
  for (const file of outside) console.error(`- ${file}`);
  console.error(`\nActive packet: ${packet.work_id}`);
  process.exit(1);
}

console.log("✅ Work packet scope gate passed");
console.log(`Active packet: ${packet.work_id}`);
