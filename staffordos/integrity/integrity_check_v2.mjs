#!/usr/bin/env node
import fs from "node:fs";
import { execSync } from "node:child_process";

const ownerMapPath = "staffordos/system_inventory/asset_code_owner_map_audit_v1.json";
const ctaPolicyPath = "staffordos/integrity/cta_policy_v1.json";
const flowMapPath = "staffordos/integrity/flow_map_v1.json";

function fail(id, detail) {
  console.error(JSON.stringify({ ok: false, check: "integrity_check_v2", id, detail }, null, 2));
  process.exit(1);
}

function ok(message, detail = {}) {
  console.log(JSON.stringify({ ok: true, message, ...detail }, null, 2));
}

function exists(path) {
  return fs.existsSync(path);
}

function readJson(path) {
  if (!exists(path)) fail("missing_json_artifact", { path });
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function routeToFile(route) {
  if (route === "/") return "src/app/page.tsx";
  return `src/app${route}/page.tsx`;
}

function routeExists(route) {
  return exists(routeToFile(route));
}

function run(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" });
}

function readRouteSource(route) {
  const file = routeToFile(route);
  if (!exists(file)) return "";
  return fs.readFileSync(file, "utf8");
}

function walkSourceFiles(dir, results = []) {
  if (!exists(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = `${dir}/${entry.name}`;

    if (fullPath.includes("/node_modules/") || fullPath.includes("/.next/") || entry.name.includes(".bak")) {
      continue;
    }

    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, results);
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      results.push(fullPath);
    }
  }

  return results;
}

function extractHrefs(source) {
  const hrefs = new Set();
  const patterns = [
    /href=["']([^"']+)["']/g,
    /href=\{`([^`]+)`\}/g,
    /href=\{([A-Za-z0-9_]+)\}/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      hrefs.add(match[1]);
    }
  }

  return [...hrefs];
}

function targetMatches(actual, expected) {
  if (actual === expected) return true;
  if (actual.includes(expected)) return true;
  if (expected.startsWith("/") && actual.startsWith(expected)) return true;
  return false;
}

const ownerMap = readJson(ownerMapPath);
const ctaPolicy = readJson(ctaPolicyPath);
const flowMap = readJson(flowMapPath);

const mappedRoutes = [
  ...(ownerMap.products?.staffordmedia?.primary_routes || []),
  ...(ownerMap.products?.shopifixer?.primary_routes || []),
  ...(ownerMap.products?.abando?.primary_staffordmedia_routes || []),
  "/abando"
];

const missingRoutes = [...new Set(mappedRoutes)].filter((route) => !routeExists(route));
if (missingRoutes.length) fail("missing_routes", { missingRoutes });

const codeOwners = [
  ...(ownerMap.products?.staffordmedia?.code_owners || []),
  ...(ownerMap.products?.shopifixer?.code_owners || [])
];

const missingOwners = codeOwners.filter((file) => !exists(file));
if (missingOwners.length) fail("missing_code_owners", { missingOwners });

const sourceFiles = [
  ...walkSourceFiles("src/app"),
  ...walkSourceFiles("src/components"),
  ...walkSourceFiles("lib")
];

const sourceText = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const globalForbidden = [
  "/shopifixer/onboarding",
  "app.abando.ai/auth",
  "app.abando.ai/embedded",
  "app.abando.ai/dashboard"
];

const globalForbiddenHits = globalForbidden.filter((pattern) => sourceText.includes(pattern));
if (globalForbiddenHits.length) fail("global_forbidden_surface_references", { globalForbiddenHits });

const policyViolations = [];

for (const [route, policy] of Object.entries(ctaPolicy.routes || {})) {
  if (!routeExists(route)) {
    policyViolations.push({ route, issue: "policy_route_missing" });
    continue;
  }

  const source = readRouteSource(route);
  const hrefs = extractHrefs(source);

  for (const forbidden of policy.forbidden_targets || []) {
    const hit = hrefs.find((href) => targetMatches(href, forbidden));
    if (hit) {
      policyViolations.push({ route, issue: "forbidden_cta_target", forbidden, hit });
    }
  }

  for (const href of hrefs) {
    if (!href.startsWith("/") && !href.includes("buy.stripe.com") && !href.startsWith("mailto:") && !href.startsWith("http")) {
      continue;
    }

    const allowed = (policy.allowed_targets || []).some((allowedTarget) => targetMatches(href, allowedTarget));
    const ignored = href.startsWith("mailto:") || href.startsWith("#");

    if (!allowed && !ignored) {
      policyViolations.push({ route, issue: "unapproved_target", href, allowed_targets: policy.allowed_targets || [] });
    }
  }
}

if (policyViolations.length) fail("cta_policy_violations", { policyViolations });

const flowViolations = [];

for (const [flowName, sequence] of Object.entries(flowMap.flows || {})) {
  for (const route of sequence) {
    if (!routeExists(route)) {
      flowViolations.push({ flowName, issue: "flow_route_missing", route });
    }
  }

  for (let i = 0; i < sequence.length - 1; i += 1) {
    const from = sequence[i];
    const to = sequence[i + 1];
    const source = readRouteSource(from);
    const hrefs = extractHrefs(source);
    const hasLink = hrefs.some((href) => targetMatches(href, to)) || source.includes(to);

    if (!hasLink) {
      flowViolations.push({ flowName, issue: "missing_flow_link", from, to });
    }
  }
}

if (flowViolations.length) fail("flow_violations", { flowViolations });

run("node scripts/assert-no-duplicate-routes.cjs");
run("npm run build");

ok("integrity_check_v2 passed", {
  validated_routes: [...new Set(mappedRoutes)],
  validated_code_owners: codeOwners.length,
  cta_policy_routes: Object.keys(ctaPolicy.routes || {}),
  flows: Object.keys(flowMap.flows || {})
});
