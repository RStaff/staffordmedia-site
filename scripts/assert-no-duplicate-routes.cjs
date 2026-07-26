const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const ALLOWED = new Set([
  path.join(ROOT, "src/app/shopifixer/page.tsx"),
  path.join(ROOT, "src/app/audit-result/page.tsx"),
]);

const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  ".vercel",
]);

function shouldIgnoreDir(fullPath) {
  const base = path.basename(fullPath);
  if (IGNORE_DIR_NAMES.has(base)) return true;
  if (base.startsWith("_archive")) return true;
  if (base.startsWith(".archive")) return true;
  if (base.startsWith("archive_")) return true;
  return false;
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldIgnoreDir(full)) continue;
      walk(full, out);
      continue;
    }

    const normalized = full.replace(/\\/g, "/");
    if (
      normalized.endsWith("/shopifixer/page.tsx") ||
      normalized.endsWith("/audit-result/page.tsx")
    ) {
      out.push(full);
    }
  }
  return out;
}

const found = walk(ROOT).filter((p) => !ALLOWED.has(p));

if (found.length > 0) {
  console.error("❌ DUPLICATE ROUTE TREE DETECTED — ABORT BUILD");
  for (const file of found) console.error(file);
  process.exit(1);
}

console.log("✅ No duplicate ShopiFixer route trees detected");
