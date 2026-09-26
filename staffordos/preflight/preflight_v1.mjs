import { execSync } from "node:child_process";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return String(error.stdout || error.stderr || error.message).trim();
  }
}

const branch = sh("git branch --show-current");
const status = sh("git status --short");
const remote = sh("git remote -v");
const root = sh("pwd");

const expectedRepo = "staffordmedia-site";
const protectedBranches = ["main", "launch/website"];
const allowedPrefixes = ["surface/", "fix/", "infra/", "ci/"];

const issues = [];
const warnings = [];

if (!remote.includes(expectedRepo)) {
  issues.push("Wrong repo: expected staffordmedia-site remote.");
}

if (protectedBranches.includes(branch)) {
  issues.push(`On protected branch '${branch}'. Create a scoped feature branch before changing files.`);
}

if (!allowedPrefixes.some((prefix) => branch.startsWith(prefix))) {
  issues.push(`Branch '${branch}' does not use allowed prefix: ${allowedPrefixes.join(", ")}`);
}

if (status.includes(".eslintcache")) {
  warnings.push("Local eslint cache is dirty. Restore or ignore before committing.");
}

if (status.includes(".next") || status.includes("node_modules")) {
  issues.push("Generated build/dependency artifacts detected in git status.");
}

const correctVercelProject = "staffordmedia-site-website";
const legacyVercelProject = "staffordmedia-site";

const report = {
  ok: issues.length === 0,
  agent: "staffordos_preflight_v1",
  generated_at: new Date().toISOString(),
  repo_root: root,
  branch,
  remote,
  status: status || "clean",
  source_of_truth: {
    production_branch: "launch/website",
    correct_vercel_project: correctVercelProject,
    legacy_vercel_project_to_cleanup: legacyVercelProject
  },
  issues,
  warnings,
  next_action: issues.length
    ? "Stop. Fix preflight issues before product changes."
    : "Proceed only with scoped branch work, then CI/preview/promotion gate."
};

mkdirSync("staffordos/preflight", { recursive: true });
writeFileSync("staffordos/preflight/preflight_report_v1.json", JSON.stringify(report, null, 2) + "\n");

console.log(JSON.stringify(report, null, 2));

if (!report.ok) process.exit(1);
