import { chromium } from 'playwright';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3010/shopifixer';
const out = process.argv[3] || 'staffordos/screenshots/shopifixer.png';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });
await page.setViewportSize({ width: 1440, height: 900 });

await page.screenshot({ path: out, fullPage: true });

await browser.close();

console.log("✅ Screenshot captured:", out);
