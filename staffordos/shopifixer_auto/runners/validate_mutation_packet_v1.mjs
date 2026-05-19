#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shopifixerAutoRoot = path.resolve(__dirname, "..");
const schemaPath = path.join(shopifixerAutoRoot, "mutation_packet_schema_v1.json");
const allowedExecutionStatuses = new Set(["DRAFT", "READY_FOR_VALIDATION"]);

function usage() {
  return [
    "Usage:",
    "  node staffordos/shopifixer_auto/runners/validate_mutation_packet_v1.mjs <packet.json> [--output <result.json>]",
  ].join("\n");
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addRequiredFieldFailures(packet, schema, reasons) {
  for (const field of schema.required_fields || []) {
    if (!(field in packet)) {
      reasons.push(`missing required field: ${field}`);
    }
  }
}

function validateArrayField(packet, field, reasons) {
  if (!(field in packet)) return;
  if (!Array.isArray(packet[field])) {
    reasons.push(`${field} must be an array`);
    return;
  }
  if (packet[field].length === 0) {
    reasons.push(`${field} must not be empty`);
  }
}

function validateObjectField(packet, field, reasons) {
  if (!(field in packet)) return;
  if (!isPlainObject(packet[field])) {
    reasons.push(`${field} must be an object`);
  }
}

function validatePacket(packet, schema) {
  const reasons = [];
  const warnings = [];
  const mutationDepthValues =
    schema.field_definitions?.mutation_depth?.allowed_values || [];

  addRequiredFieldFailures(packet, schema, reasons);

  if (
    "mutation_depth" in packet &&
    !mutationDepthValues.includes(packet.mutation_depth)
  ) {
    reasons.push(`mutation_depth is not allowed: ${packet.mutation_depth}`);
  }

  validateArrayField(packet, "allowed_files", reasons);
  validateArrayField(packet, "prohibited_files", reasons);
  validateObjectField(packet, "rollback_plan", reasons);
  validateObjectField(packet, "approval_gates", reasons);
  validateObjectField(packet, "required_snapshots", reasons);

  if (
    "execution_status" in packet &&
    !allowedExecutionStatuses.has(packet.execution_status)
  ) {
    reasons.push(
      `execution_status must be DRAFT or READY_FOR_VALIDATION, received: ${packet.execution_status}`,
    );
  }

  if (packet.allowed_files?.some((file) => typeof file !== "string")) {
    reasons.push("allowed_files must contain only string paths");
  }

  if (packet.prohibited_files?.some((file) => typeof file !== "string")) {
    reasons.push("prohibited_files must contain only string paths");
  }

  if (
    isPlainObject(packet.rollback_plan) &&
    packet.mutation_depth !== "LEVEL_0_AUDIT_ONLY" &&
    packet.rollback_plan.rollback_required !== true
  ) {
    reasons.push(
      "rollback_plan.rollback_required must be true for mutation packets",
    );
  }

  if (
    isPlainObject(packet.target_surface) &&
    packet.target_surface.live_theme_mutation_allowed === true
  ) {
    reasons.push("live theme mutation is not allowed by this validator");
  }

  if (
    isPlainObject(packet.approval_gates) &&
    packet.approval_gates.approval_status
  ) {
    warnings.push(
      "approval status is recorded but does not authorize execution",
    );
  }

  return {
    packet_id: packet.packet_id || null,
    validated_at: new Date().toISOString(),
    status: reasons.length === 0 ? "PASS" : "BLOCKED",
    blocking_reasons: reasons,
    warnings,
    next_allowed_state:
      reasons.length === 0 ? "BLOCKED_PENDING_APPROVAL" : "REMAIN_BLOCKED",
  };
}

async function readJson(jsonPath) {
  const raw = await readFile(jsonPath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const args = process.argv.slice(2);
  const packetArg = args.find((arg) => !arg.startsWith("--"));
  const outputArg = getArgValue(args, "--output");

  if (!packetArg || args.includes("--help") || args.includes("-h")) {
    console.error(usage());
    process.exitCode = 2;
    return;
  }

  const packetPath = path.resolve(process.cwd(), packetArg);
  const [schema, packet] = await Promise.all([
    readJson(schemaPath),
    readJson(packetPath),
  ]);

  const result = validatePacket(packet, schema);

  if (outputArg) {
    const outputPath = path.resolve(process.cwd(), outputArg);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  }

  if (result.status === "PASS") {
    console.log(`PASS ${result.packet_id}`);
  } else {
    console.log(`BLOCKED ${result.packet_id || packetPath}`);
    for (const reason of result.blocking_reasons) {
      console.log(`- ${reason}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`BLOCKED ${error.message}`);
  process.exitCode = 1;
});
