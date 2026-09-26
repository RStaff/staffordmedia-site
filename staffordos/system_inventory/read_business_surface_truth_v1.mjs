#!/usr/bin/env node
import fs from "node:fs";

const path = "staffordos/system_inventory/business_surface_truth_v1.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

console.log(JSON.stringify({
  ok: true,
  artifact: "business_surface_truth_v1",
  source: path,
  staffordmedia_role: data.products.staffordmedia.role,
  shopifixer_flow: data.products.shopifixer.correct_flow,
  abando_flow: data.products.abando.correct_flow,
  blockers: data.known_blockers,
  patch_rules: data.patch_rules
}, null, 2));
