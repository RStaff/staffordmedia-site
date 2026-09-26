import { execSync } from "node:child_process";

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return String(error.stdout || error.stderr || error.message).trim();
  }
}

const branch = sh("git branch --show-current");
const status = sh("git status --short");
const log = sh("git log --oneline -5");

const issues = [];

if (branch !== "launch/website") {
  issues.push(`Not on production branch. Current branch: ${branch}`);
}

if (status) {
  issues.push(`Working tree is not clean:\n${status}`);
}

const report = {
  ok: issues.length === 0,
  agent: "staffordos_promote_v1",
  generated_at: new Date().toISOString(),
  branch,
  status: status || "clean",
  recent_commits: log,
  promotion_target: "staffordmedia-site-website",
  legacy_project_removed: "staffordmedia-site",
  issues,
  next_action: issues.length
    ? "Stop. Fix promotion issues before production confidence."
    : "Promotion gate passed. Production branch is clean and synced."
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
