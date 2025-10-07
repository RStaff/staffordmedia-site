import fs from "node:fs";

const p = process.env.LAYOUT_PATH;
if (!(p && fs.existsSync(p))) {
  console.error("❌ layout.tsx not found at", p);
  process.exit(1);
}
let s = fs.readFileSync(p, "utf8");

const hasImport =
  s.indexOf('from "./analytics/Analytics"') !== -1 ||
  s.indexOf("from './analytics/Analytics'") !== -1;

if (!hasImport) {
  s = s.replace(/(^\s*['"]use client['"];\s*)?/, (m) => m + 'import Analytics from "./analytics/Analytics"\n');
}

if (s.indexOf("<Analytics />") === -1) {
  s = s.replace(/(<body[^>]*>)/, "$1\n      <Analytics />");
}

fs.writeFileSync(p, s);
console.log("✅ layout.tsx wired with <Analytics />");
