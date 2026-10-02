#!/usr/bin/env node

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const SCAN_ROOT = "src";

const ROUTE_PRODUCT_MAP = [
  { match: /^\/shopifixer/, product: "shopifixer" },
  { match: /^\/pricing/, product: "shared_revenue" },
  { match: /^\/audit-result/, product: "shopifixer" },
  { match: /^\/services/, product: "staffordmedia" },
  { match: /^\/contact/, product: "staffordmedia" },
  { match: /^\//, product: "staffordmedia" }
];

function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];

  let results = [];

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;

    const full = path.join(abs, entry.name);
    const rel = path.relative(ROOT, full);

    if (entry.isDirectory()) {
      results = results.concat(walk(rel));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      results.push(rel);
    }
  }

  return results;
}

function routeFromFile(file) {
  if (!file.includes("src/app")) return null;
  if (!file.endsWith("page.tsx")) return null;

  let route = file
    .replace(/^src\/app/, "")
    .replace(/\/page\.tsx$/, "");

  if (!route) route = "/";
  return route;
}

function classifyRoute(route) {
  for (const rule of ROUTE_PRODUCT_MAP) {
    if (rule.match.test(route)) return rule.product;
  }
  return "unknown";
}

function extractLinks(content) {
  const links = [];
  const regex = /href=["'`]([^"'`]+)["'`]/g;

  let match;
  while ((match = regex.exec(content))) {
    links.push(match[1]);
  }

  return links;
}

function analyzeFile(file) {
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  const route = routeFromFile(file);
  const product = route ? classifyRoute(route) : "unknown";
  const links = extractLinks(content);

  return {
    file,
    route,
    product,
    links,
    content
  };
}

function detectRevenueBlockers(files) {
  const blockers = [];

  const allContent = files.map(f => f.content).join("\n");

  if (allContent.includes("buy.stripe.com/REPLACE")) {
    blockers.push({
      id: "stripe_placeholder",
      severity: "critical",
      message: "Stripe payment link is not live."
    });
  }

  const hasOnboardingRoute = files.some(f => f.route?.includes("onboarding"));
  if (!hasOnboardingRoute) {
    blockers.push({
      id: "missing_onboarding",
      severity: "high",
      message: "No onboarding route exists for conversion."
    });
  }

  return blockers;
}

function buildCTAFlow(files) {
  return files.flatMap(f =>
    f.links.map(link => ({
      from: f.route || f.file,
      to: link,
      product: f.product
    }))
  );
}

function main() {
  const files = walk(SCAN_ROOT).map(analyzeFile);

  const routes = files.filter(f => f.route);

  const routeMap = routes.map(r => ({
    route: r.route,
    product: r.product
  }));

  const blockers = detectRevenueBlockers(files);
  const ctaGraph = buildCTAFlow(files);

  const result = {
    ok: true,
    artifact: "surface_sync_agent_v2",
    generated_at: new Date().toISOString(),

    routes: routeMap,
    route_count: routeMap.length,

    revenue_blockers: blockers,

    cta_graph: ctaGraph,

    insights: {
      shopifixer_has_onboarding: routeMap.some(r => r.route.includes("onboarding")),
      stripe_live: !blockers.find(b => b.id === "stripe_placeholder")
    }
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
