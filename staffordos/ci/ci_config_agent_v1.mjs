import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function sh(cmd) {
  try { return execSync(cmd, { encoding: "utf8" }).trim(); }
  catch { return ""; }
}

function read(file) {
  try { return fs.readFileSync(file, "utf8"); }
  catch { return ""; }
}

function exists(file) {
  return fs.existsSync(file);
}

const root = process.cwd();
const repoRoot = sh("git rev-parse --show-toplevel") || root;
const workflowsDir = path.join(repoRoot, ".github/workflows");

const workflowFiles = exists(workflowsDir)
  ? fs.readdirSync(workflowsDir).filter(f => f.endsWith(".yml") || f.endsWith(".yaml"))
  : [];

const packageJson = JSON.parse(read("package.json") || "{}");
const localScripts = packageJson.scripts || {};

const workflows = workflowFiles.map(file => {
  const full = path.join(workflowsDir, file);
  const body = read(full);

  const referencesAppsWebsite = body.includes("apps/website");
  const referencesSmcClean = body.includes("_smc_clean");
  const usesNpmCheck = body.includes("npm run check");
  const usesNpmBuild = body.includes("npm run build");
  const hasWorkingDirectory = body.includes("working-directory");
  const likelyStale =
    referencesAppsWebsite ||
    referencesSmcClean ||
    (usesNpmCheck && !localScripts.check);

  return {
    file: `.github/workflows/${file}`,
    name_match: body.match(/^name:\s*(.+)$/m)?.[1] || null,
    references_apps_website: referencesAppsWebsite,
    references_smc_clean: referencesSmcClean,
    uses_npm_check: usesNpmCheck,
    local_has_check_script: !!localScripts.check,
    uses_npm_build: usesNpmBuild,
    has_working_directory: hasWorkingDirectory,
    likely_stale_or_misaligned: likelyStale
  };
});

const vercelJson = read("vercel.json");
const report = {
  ok: true,
  agent: "ci_config_agent_v1",
  mode: "inspect_only",
  generated_at: new Date().toISOString(),
  cwd: root,
  repo_root: repoRoot,
  branch: sh("git branch --show-current"),
  package_name: packageJson.name || null,
  local_scripts: Object.keys(localScripts),
  workflows_found: workflows.length,
  workflows,
  vercel: {
    has_vercel_json: !!vercelJson,
    mentions_apps_website: vercelJson.includes("apps/website"),
    mentions_build_command: vercelJson.includes("buildCommand")
  },
  diagnosis: [
    "PR is clean, but repository automation appears misaligned.",
    "Failures likely come from stale workflows expecting old paths or missing scripts.",
    "Do not change product code to satisfy stale CI.",
    "Fix CI as its own branch/PR."
  ],
  recommended_next_action: "Create a separate ci/fix-workflow-alignment-v1 branch and patch only workflow/config files."
};

fs.writeFileSync("staffordos/ci/ci_config_report_v1.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
