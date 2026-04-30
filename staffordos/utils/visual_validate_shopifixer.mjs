import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2] || "http://localhost:3010/shopifixer";
const out = "staffordos/screenshots/shopifixer_visual_validation.png";
const report = "staffordos/system_inventory/output/shopifixer_visual_validation_v1.json";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out, fullPage: true });

const checks = {
  page_loaded: await page.locator("body").count().then(n => n > 0),
  brand_visible: await page.getByText("ShopiFixer").first().isVisible().catch(() => false),
  hero_visible: await page.getByText(/conversion leak|Shopify leak|revenue/i).first().isVisible().catch(() => false),
  audit_cta_visible: await page.getByText(/Run ShopiFixer Audit|Find My Revenue Leak/i).first().isVisible().catch(() => false),
  forbidden_brand_corruption_absent: !(await page.locator("body").innerText()).includes("Shopi2")
};

const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);

const result = {
  generated_at: new Date().toISOString(),
  url,
  screenshot: out,
  status: failed.length ? "FAIL" : "PASS",
  checks,
  failed
};

fs.writeFileSync(report, JSON.stringify(result, null, 2) + "\n");

await browser.close();

console.log(JSON.stringify(result, null, 2));

if (failed.length) process.exit(1);
