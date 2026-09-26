#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shopifixerAutoRoot = path.resolve(__dirname, "..");
const templatePath = path.join(
  shopifixerAutoRoot,
  "theme_snapshot_manifest_template_v1.json",
);
const defaultSnapshotOutput = path.join(shopifixerAutoRoot, "output", "snapshots");

function usage() {
  return [
    "Usage:",
    "  node staffordos/shopifixer_auto/runners/create_local_snapshot_sandbox_v1.mjs \\",
    "    --source <local-theme-path> \\",
    "    --output <sandbox-output-dir> \\",
    "    --merchant-id <id> \\",
    "    --store-domain <domain> \\",
    "    [--theme-id <id>] [--theme-name <name>] [--theme-archetype <name>] \\",
    "    [--allow-local-copy] [--validation-output <path>]",
  ].join("\n");
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function hasFlag(args, flag) {
  return args.includes(flag);
}

function slugify(value) {
  return String(value || "snapshot")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "snapshot";
}

function timestampSlug(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[:.]/g, "-");
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function assertDirectory(targetPath, label) {
  let info;
  try {
    info = await stat(targetPath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`${label} is missing: ${targetPath}`);
    }
    throw error;
  }

  if (!info.isDirectory()) {
    throw new Error(`${label} must be a directory: ${targetPath}`);
  }
}

async function countFiles(root) {
  let count = 0;
  const entries = await readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(fullPath);
    } else if (entry.isFile()) {
      count += 1;
    }
  }

  return count;
}

async function looksRiskyForLocalCopy(sourcePath) {
  const riskMarkers = [
    ".git",
    "package.json",
    "shopify.app.toml",
    "shopify.theme.toml",
    ".shopify",
  ];

  for (const marker of riskMarkers) {
    if (await pathExists(path.join(sourcePath, marker))) {
      return marker;
    }
  }

  return null;
}

async function readJson(jsonPath) {
  return JSON.parse(await readFile(jsonPath, "utf8"));
}

function buildManifest({ template, metadata, createdAt, sourcePath, sandboxPath }) {
  return {
    ...template,
    status: "LOCAL_SNAPSHOT_CREATED",
    merchant_id: metadata.merchantId,
    store_domain: metadata.storeDomain,
    theme_id: metadata.themeId,
    theme_name: metadata.themeName,
    theme_archetype: metadata.themeArchetype,
    original_theme_role: "local_source_only",
    duplicate_theme_id: path.basename(sandboxPath),
    duplicate_theme_name: `local-sandbox-${path.basename(sandboxPath)}`,
    snapshot_created_at: createdAt,
    before_screenshots: [],
    after_screenshots: [],
    files_changed: [],
    rollback_reference: {
      original_theme_id: metadata.themeId,
      duplicate_theme_id: path.basename(sandboxPath),
      patch_diff_path: "",
      original_snapshot_path: sourcePath,
      rollback_instructions_path: "",
      rollback_verified: false,
    },
    approval_status: {
      ross: "UNKNOWN",
      merchant: "UNKNOWN",
    },
    deployment_status: "NOT_DEPLOYED",
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  const sourceArg = getArgValue(args, "--source") || args[0];
  const outputArg = getArgValue(args, "--output") || args[1];
  const validationOutputArg = getArgValue(args, "--validation-output");
  const allowLocalCopy = hasFlag(args, "--allow-local-copy");

  if (!sourceArg || !outputArg) {
    console.error(usage());
    process.exitCode = 2;
    return;
  }

  const sourcePath = path.resolve(process.cwd(), sourceArg);
  const outputRoot = path.resolve(process.cwd(), outputArg);
  const sourceReal = path.resolve(sourcePath);
  const outputReal = path.resolve(outputRoot);

  await assertDirectory(sourceReal, "source path");

  if (outputReal === sourceReal || outputReal.startsWith(`${sourceReal}${path.sep}`)) {
    throw new Error("sandbox output path must not be inside the source path");
  }

  const riskMarker = await looksRiskyForLocalCopy(sourceReal);
  if (riskMarker && !allowLocalCopy) {
    throw new Error(
      `source path looks like a live production repo or app checkout (${riskMarker}); rerun with --allow-local-copy only for an intentional local copy`,
    );
  }

  const createdAt = new Date().toISOString();
  const merchantId = getArgValue(args, "--merchant-id") || "unknown-merchant";
  const storeDomain = getArgValue(args, "--store-domain") || "unknown-store";
  const sandboxName = `${timestampSlug(new Date(createdAt))}-${slugify(merchantId)}-${slugify(storeDomain)}`;
  const sandboxPath = path.join(outputReal, sandboxName);
  const snapshotOutputRoot = validationOutputArg
    ? path.dirname(path.resolve(process.cwd(), validationOutputArg))
    : defaultSnapshotOutput;
  const manifestPath = path.join(
    snapshotOutputRoot,
    `${sandboxName}_snapshot_manifest_v1.json`,
  );

  await mkdir(outputReal, { recursive: true });
  await mkdir(snapshotOutputRoot, { recursive: true });
  await cp(sourceReal, sandboxPath, {
    recursive: true,
    errorOnExist: true,
    force: false,
  });

  const filesCopied = await countFiles(sandboxPath);
  const template = await readJson(templatePath);
  const manifest = buildManifest({
    template,
    metadata: {
      merchantId,
      storeDomain,
      themeId: getArgValue(args, "--theme-id") || "LOCAL_ONLY",
      themeName: getArgValue(args, "--theme-name") || "Local Dummy Theme",
      themeArchetype: getArgValue(args, "--theme-archetype") || "Unknown/custom",
    },
    createdAt,
    sourcePath: sourceReal,
    sandboxPath,
  });

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const result = {
    status: "PASS",
    source_path: sourceReal,
    sandbox_path: sandboxPath,
    manifest_path: manifestPath,
    files_copied: filesCopied,
    rollback_reference: sourceReal,
    no_live_mutation_confirmed: true,
  };

  if (validationOutputArg) {
    const validationOutputPath = path.resolve(process.cwd(), validationOutputArg);
    await mkdir(path.dirname(validationOutputPath), { recursive: true });
    await writeFile(validationOutputPath, `${JSON.stringify(result, null, 2)}\n`);
  }

  console.log(`PASS local snapshot sandbox created: ${sandboxPath}`);
  console.log(`manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(`BLOCKED ${error.message}`);
  process.exitCode = 1;
});
