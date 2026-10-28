import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ExecutionReviewBoard, { type ExecutionReviewData } from "@/components/operator/ExecutionReviewBoard";
import OperatorShell from "@/components/operator/OperatorShell";

export const dynamic = "force-dynamic";

type FulfillmentAttachment = {
  attachment_id: string;
  merchant_id: string;
  runtime_state_reference: { runtime_id: string; path: string; lifecycle_state: string };
  execution_task_reference: { task_id: string; path: string; execution_status: string; allowed_executor: string };
  mutation_packet_reference: { packet_id: string; path: string; mutation_depth: string; execution_status: string };
  qa_proof_reference: { path: string; status: string; next_allowed_state?: string | null; warnings?: string[] };
  approval_state: string;
  rollback_required: boolean;
  replayable: boolean;
  mutation_depth: string;
  risk_level: string;
  current_fulfillment_state: string;
  allowed_next_transitions: string[];
  runtime_owner: string;
  surface_origin: string;
  created_at: string;
  compatibility?: Record<string, boolean>;
};

type RuntimeState = {
  merchant_id: string;
  store_domain: string;
  current_lifecycle_state?: string;
  lifecycle_state?: string;
  runtime_owner?: string;
  current_owner?: string;
  risk_level?: string;
  mutation_depth?: string;
  mutation_depth_allowed?: string;
  replayable?: boolean;
  rollback_ready?: boolean;
  artifact_references?: {
    rollback_reference?: string;
  };
};

type ExecutionTask = {
  task_id: string;
  execution_scope: string;
  allowed_executor: string;
  execution_status: string;
  approval_state: string;
  requires_operator_approval: boolean;
  requires_merchant_approval: boolean;
};

type MutationPacket = {
  packet_id: string;
  mutation_depth: string;
  target_surface?: {
    surface_type?: string;
    route_or_template?: string;
    theme_role?: string;
  };
  allowed_files?: string[];
  prohibited_files?: string[];
  rollback_plan?: {
    rollback_required?: boolean;
    rollback_reference?: string;
  };
  approval_gates?: {
    approval_status?: {
      ross?: string;
      merchant?: string;
    };
  };
};

type ProofArtifact = {
  status?: string;
  validation_reference?: string;
  next_allowed_state?: string;
  warnings?: string[];
  rollback_reference?: string;
};

const ROOT = process.cwd();
const ATTACHMENT_REGISTRY_DIR = path.join(ROOT, "staffordos", "fulfillment", "attachment_registry");

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function readJsonDirectory<T>(dirPath: string): Promise<T[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name))
    .sort();

  return Promise.all(jsonFiles.map((filePath) => readJsonFile<T>(filePath)));
}

function resolveArtifactPath(filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath);
}

function packetScope(packet: MutationPacket) {
  const target = packet.target_surface;
  return [target?.surface_type, target?.route_or_template, target?.theme_role].filter(Boolean).join(" / ") || "UNKNOWN";
}

async function buildReview(attachment: FulfillmentAttachment): Promise<ExecutionReviewData> {
  const runtimePath = resolveArtifactPath(attachment.runtime_state_reference.path);
  const taskPath = resolveArtifactPath(attachment.execution_task_reference.path);
  const packetPath = resolveArtifactPath(attachment.mutation_packet_reference.path);
  const proofPath = resolveArtifactPath(attachment.qa_proof_reference.path);

  const [runtime, task, packet, proof] = await Promise.all([
    readJsonFile<RuntimeState>(runtimePath),
    readJsonFile<ExecutionTask>(taskPath),
    readJsonFile<MutationPacket>(packetPath),
    readJsonFile<ProofArtifact>(proofPath),
  ]);

  const compatibility = attachment.compatibility || {};
  const lifecycleState = runtime.current_lifecycle_state || runtime.lifecycle_state || attachment.runtime_state_reference.lifecycle_state;
  const runtimeOwner = runtime.runtime_owner || runtime.current_owner || attachment.runtime_owner;
  const rollbackReference = proof.rollback_reference || packet.rollback_plan?.rollback_reference || runtime.artifact_references?.rollback_reference;
  const packetRossApproval = packet.approval_gates?.approval_status?.ross || "UNKNOWN";
  const packetMerchantApproval = packet.approval_gates?.approval_status?.merchant || "UNKNOWN";

  return {
    attachment: {
      attachmentId: attachment.attachment_id,
      merchantId: attachment.merchant_id,
      currentFulfillmentState: attachment.current_fulfillment_state,
      surfaceOrigin: attachment.surface_origin,
      createdAt: attachment.created_at,
      allowedNextTransitions: attachment.allowed_next_transitions || [],
      runtimeStateReference: runtimePath,
      executionTaskReference: taskPath,
      mutationPacketReference: packetPath,
      qaProofReference: proofPath,
    },
    runtime: {
      merchantId: runtime.merchant_id,
      storeDomain: runtime.store_domain,
      lifecycleState,
      runtimeOwner,
      riskLevel: runtime.risk_level || attachment.risk_level,
      mutationDepth: runtime.mutation_depth || runtime.mutation_depth_allowed || attachment.mutation_depth,
      replayable: runtime.replayable === true,
      rollbackReady: runtime.rollback_ready === true,
    },
    task: {
      taskId: task.task_id,
      executionScope: task.execution_scope,
      allowedExecutor: task.allowed_executor,
      executionStatus: task.execution_status,
      operatorApprovalRequired: task.requires_operator_approval,
      merchantApprovalRequired: task.requires_merchant_approval,
    },
    packet: {
      packetId: packet.packet_id,
      scope: packetScope(packet),
      mutationDepth: packet.mutation_depth,
      allowedFiles: packet.allowed_files || [],
      prohibitedFiles: packet.prohibited_files || [],
    },
    proof: {
      proofPath,
      status: proof.status || attachment.qa_proof_reference.status || "UNKNOWN",
      validationReference: proof.validation_reference || proofPath,
      replayable: attachment.replayable,
      rollbackReference,
      warnings: proof.warnings || attachment.qa_proof_reference.warnings || [],
    },
    risk: {
      riskLevel: attachment.risk_level,
      replayable: attachment.replayable,
      rollbackRequired: attachment.rollback_required,
      rollbackReady: runtime.rollback_ready === true,
      mutationDepth: attachment.mutation_depth,
      rollbackReference,
      compatibility: Object.entries(compatibility).map(([label, valid]) => ({ label, valid })),
    },
    approval: {
      approvalState: attachment.approval_state,
      operatorApprovalRequired: task.requires_operator_approval,
      merchantApprovalRequired: task.requires_merchant_approval,
      approvalCompatibilityValid: compatibility.approval_compatibility_valid === true,
      allowedNextTransitions: attachment.allowed_next_transitions || [],
      taskApprovalState: task.approval_state,
      packetRossApproval,
      packetMerchantApproval,
    },
  };
}

export const metadata = {
  title: "StaffordOS Execution Review",
  description: "Read-only pre-execution review over canonical fulfillment truth.",
};

export default async function ExecutionReviewPage() {
  const attachments = await readJsonDirectory<FulfillmentAttachment>(ATTACHMENT_REGISTRY_DIR);
  const reviews = await Promise.all(attachments.map((attachment) => buildReview(attachment)));

  return (
    <OperatorShell
      activeId="execution-review"
      title="Fulfillment Execution Review"
      description="Read-only pre-execution review of runtime, execution task, packet, QA/proof, approval, rollback, and replayability."
      eyebrow="StaffordOS Operator"
    >
      <ExecutionReviewBoard reviews={reviews} />
    </OperatorShell>
  );
}

