#!/usr/bin/env node
import fs from "node:fs";
import { execSync } from "node:child_process";

const ownerMapPath = "staffordos/system_inventory/asset_code_owner_map_audit_v1.json";

function fail(id, detail) {
  console.error(JSON.stringify({ ok: false, check: "integrity_check_v1", id, detail }, null, 2));
  process.exit(1);
}

function ok(message, detail = {}) {
  console.log(JSON.stringify({ ok: true, message, ...detail }, null, 2));
}

function exists(path) {
  return fs.existsSync(path);
}

function routeExists(route) {
  if (route === "/") return exists("src/app/page.tsx");
  return exists(`src/app${route}/page.tsx`);
}

function run(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" });
}

if (!exists(ownerMapPath)) {
  fail("missing_owner_map", { ownerMapPath });
}

const ownerMap = JSON.parse(fs.readFileSync(ownerMapPath, "utf8"));

const routes = [
  ...(ownerMap.products?.staffordmedia?.primary_routes || []),
  ...(ownerMap.products?.shopifixer?.primary_routes || []),
  ...(ownerMap.products?.abando?.primary_staffordmedia_routes || []),
];

const missingRoutes = [...new Set(routes)].filter((route) => !routeExists(route));

if (missingRoutes.length) {
  fail("missing_routes", { missingRoutes });
}

const codeOwners = [
  ...(ownerMap.products?.staffordmedia?.code_owners || []),
  ...(ownerMap.products?.shopifixer?.code_owners || []),
];

const missingOwners = codeOwners.filter((file) => !exists(file));

if (missingOwners.length) {
  fail("missing_code_owners", { missingOwners });
}

const activeSource = run(
  'find src/app src/components lib -type f ' +
  '\\( -name "*.tsx" -o -name "*.ts" \\) ' +
  '-not -name "*.bak*" ' +
  '-not -path "*/node_modules/*" ' +
  '-not -path "*/.next/*"'
).trim().split("\n").filter(Boolean);

const sourceText = activeSource.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const requiredRoutes = ["/shopifixer", "/audit-result", "/pricing", "/recovery-demo"];
const missingReferences = requiredRoutes.filter((route) => !sourceText.includes(route));

if (missingReferences.length) {
  fail("missing_required_route_references", { missingReferences });
}

const forbiddenPatterns = [
  "/shopifixer/onboarding",
  "app.abando.ai/auth",
  "app.abando.ai/embedded",
  "app.abando.ai/dashboard"
];

const forbiddenHits = forbiddenPatterns.filter((pattern) => sourceText.includes(pattern));

if (forbiddenHits.length) {
  fail("forbidden_surface_references", { forbiddenHits });
}

run("node scripts/assert-no-duplicate-routes.cjs");
run("npm run build");

ok("integrity_check_v1 passed", {
  validated_routes: [...new Set(routes)],
  validated_code_owners: codeOwners.length,
  required_route_references: requiredRoutes
});
