import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const outDir = path.join(root, "staffordos/system_inventory/output");
fs.mkdirSync(outDir, { recursive: true });

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (e) {
    return (e.stdout?.toString() || e.stderr?.toString() || e.message).trim();
  }
}

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

function read(p) {
  try { return fs.readFileSync(path.join(root, p), "utf8"); } catch { return ""; }
}

const branch = sh("git branch --show-current");
const commit = sh("git rev-parse --short HEAD");
const status = sh("git status --short");

const sourceOwners = [
  "src/components/site/HomeHero.tsx",
  "src/components/Header.tsx",
  "src/app/page.tsx",
  "src/app/shopifixer/page.tsx",
  "src/app/audit-result/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/shopifixer/result/page.tsx",
  "src/components/shopifixer/AuditHero.tsx",
  "src/components/shopifixer/AuditFormCard.tsx",
  "src/components/site/SystemFlow.tsx",
  "src/components/site/FinalCta.tsx"
];

const productIdentityFiles = [
  "src/components/site/HomeHero.tsx",
  "src/components/site/SystemFlow.tsx",
  "src/app/shopifixer/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/audit-result/page.tsx"
];

const identityText = productIdentityFiles.map(f => read(f)).join("\n");

const gates = {
  pre_patch_gate: {
    status: sourceOwners.every(exists) ? "PASS" : "FAIL",
    required: sourceOwners.map(file => ({ file, exists: exists(file) }))
  },

  source_owner_gate: {
    status: exists("src/components/site/HomeHero.tsx") && exists("src/components/Header.tsx") ? "PASS" : "FAIL",
    owners: {
      home_hero: "src/components/site/HomeHero.tsx",
      global_header: "src/components/Header.tsx",
      shopifixer_page: "src/app/shopifixer/page.tsx",
      audit_result: "src/app/audit-result/page.tsx",
      pricing: "src/app/pricing/page.tsx"
    }
  },

  product_identity_gate: {
    status:
      identityText.includes("ShopiFixer") &&
      identityText.includes("Abando") &&
      identityText.includes("Stafford Media")
        ? "PASS"
        : "FAIL",
    required_terms: {
      ShopiFixer: identityText.includes("ShopiFixer"),
      Abando: identityText.includes("Abando"),
      StaffordMedia: identityText.includes("Stafford Media")
    }
  },

  no_fake_proof_gate: {
    status: "REQUIRES_RUNTIME_PROOF",
    required_proof_types: [
      "HTTP status",
      "file diff",
      "build result",
      "provider id if email sent",
      "Stripe session if checkout opened"
    ]
  },

  money_path_gate: {
    status: "NOT_RUNTIME_TESTED",
    required_routes: ["/", "/shopifixer", "/audit-result", "/pricing", "/shopifixer/result"],
    note: "Run live/local HTTP checks before outreach or deploy approval."
  },

  no_client_facing_action_gate: {
    status: "BLOCKED_UNTIL_LIVE_SURFACE_AND_MONEY_PATH_PASS",
    blocks: ["outreach", "auto-send", "lead traffic", "public claims of readiness"]
  },

  commit_hygiene_gate: {
    status: status ? "DIRTY_REPO" : "CLEAN",
    git_status_short: status || "(clean)"
  },

  rollback_gate: {
    status: "PASS",
    rollback_command: `git checkout ${commit}`
  }
};

const summary = {
  generated_at: new Date().toISOString(),
  repo: root,
  branch,
  commit,
  dirty: Boolean(status),
  enforcement_level: "LOCAL_GATE_V1",
  rule: "No patch, deploy, send, or outreach unless relevant gates pass.",
  gates
};

fs.writeFileSync(
  path.join(outDir, "staffordmedia_gate_report_v1.json"),
  JSON.stringify(summary, null, 2)
);

console.log(JSON.stringify(summary, null, 2));
