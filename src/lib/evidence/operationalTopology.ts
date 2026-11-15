import type { EvidencePacket, EvidenceSurface } from "@/lib/evidence/evidencePacket";

export type CanonicalIssueId =
  | "CTA_VISIBILITY_01"
  | "TRUST_INTERRUPT_01"
  | "MOBILE_STACKING_01"
  | "COMPETING_ATTENTION_01"
  | "RECOVERY_EXIT_CONTEXT_01"
  | "RECOVERY_TIMING_01";

export type ProductBoundary = "shopifixer" | "abando";

export type ReviewState = "proposed" | "under_review" | "approved" | "revision_requested" | "deferred";

export type ProofState = "not_ready" | "evidence_attached" | "proof_ready" | "merchant_reviewed" | "confirmed" | "unresolved";

export type ImplementationContinuityState =
  | "not_started"
  | "scope_review"
  | "approved_for_work"
  | "implementation_in_progress"
  | "evidence_review"
  | "closeout_review"
  | "closed"
  | "unresolved";

export type CanonicalIssueDefinition = {
  issue_id: CanonicalIssueId;
  product_boundary: ProductBoundary;
  label: string;
  issue_family:
    | "cta_visibility"
    | "trust_interruption"
    | "mobile_hierarchy"
    | "attention_competition"
    | "recovery_context"
    | "recovery_timing";
  continuity_rule: string;
  proof_rule: string;
  unresolved_rule: string;
};

export type EvidenceLineage = {
  issue_id: CanonicalIssueId;
  surface_id: string;
  surface_type: EvidenceSurface["type"];
  viewport: EvidenceSurface["viewport"];
  observation_id: string;
  unresolved: boolean;
};

export type OperationalTopology = {
  topology_version: "pass_6_operational_evidence_binding_v1";
  store: string;
  packet_id: string;
  product_boundary: ProductBoundary;
  review_state: ReviewState;
  proof_state: ProofState;
  implementation_continuity: ImplementationContinuityState;
  packet_lineage: {
    store: string;
    packet_id: string;
    evidence_state: EvidencePacket["evidence_state"];
  };
  evidence_lineage: EvidenceLineage[];
  unresolved_continuity: EvidenceLineage[];
  review_inheritance: {
    inherits_storefront_reference: boolean;
    inherits_issue_ids: CanonicalIssueId[];
    merchant_review_required: boolean;
  };
  proof_lineage: {
    proof_can_reference_issue_ids: CanonicalIssueId[];
    proof_requires_validated_change: boolean;
    proof_must_preserve_unresolved_items: boolean;
  };
  abando_eligibility_review: {
    product_boundary: "abando";
    independent_from_shopifixer_completion: boolean;
    eligible_issue_ids: CanonicalIssueId[];
  };
};

export const canonicalIssueDefinitions: Record<CanonicalIssueId, CanonicalIssueDefinition> = {
  CTA_VISIBILITY_01: {
    issue_id: "CTA_VISIBILITY_01",
    product_boundary: "shopifixer",
    label: "Primary action visibility",
    issue_family: "cta_visibility",
    continuity_rule: "Carry the same primary-action observation from review into proof and closeout until changed-state evidence resolves it.",
    proof_rule: "Proof may reference this issue only when implementation evidence shows the scoped CTA visibility change.",
    unresolved_rule: "If unresolved at review, keep visible in proof and completion as an open item.",
  },
  TRUST_INTERRUPT_01: {
    issue_id: "TRUST_INTERRUPT_01",
    product_boundary: "shopifixer",
    label: "Trust cue placement",
    issue_family: "trust_interruption",
    continuity_rule: "Carry reassurance-placement observations through review, proof, and closeout.",
    proof_rule: "Proof may reference this issue only when trust cue placement is visibly changed or explicitly deferred.",
    unresolved_rule: "If reassurance placement is not addressed, disclose it as open or deferred.",
  },
  MOBILE_STACKING_01: {
    issue_id: "MOBILE_STACKING_01",
    product_boundary: "shopifixer",
    label: "Mobile hierarchy compression",
    issue_family: "mobile_hierarchy",
    continuity_rule: "Carry mobile hierarchy observations through mobile review surfaces and closeout.",
    proof_rule: "Proof may reference this issue only when mobile evidence shows scoped hierarchy changes.",
    unresolved_rule: "If mobile hierarchy remains unresolved, preserve it as an open item.",
  },
  COMPETING_ATTENTION_01: {
    issue_id: "COMPETING_ATTENTION_01",
    product_boundary: "shopifixer",
    label: "Competing attention",
    issue_family: "attention_competition",
    continuity_rule: "Carry secondary-content competition observations until scope resolves or defers them.",
    proof_rule: "Proof may reference this issue only when the competing attention surface has been reviewed against the approved scope.",
    unresolved_rule: "If secondary content remains in conflict, show it as open or deferred.",
  },
  RECOVERY_EXIT_CONTEXT_01: {
    issue_id: "RECOVERY_EXIT_CONTEXT_01",
    product_boundary: "abando",
    label: "Post-exit context",
    issue_family: "recovery_context",
    continuity_rule: "Keep recovery context separate from ShopiFixer implementation proof.",
    proof_rule: "Recovery proof requires separate Abando evidence and cannot inherit ShopiFixer proof.",
    unresolved_rule: "If recovery context is not confirmed, keep Abando review deferred.",
  },
  RECOVERY_TIMING_01: {
    issue_id: "RECOVERY_TIMING_01",
    product_boundary: "abando",
    label: "Recovery timing",
    issue_family: "recovery_timing",
    continuity_rule: "Keep timing review inside Abando eligibility and activation review.",
    proof_rule: "Recovery timing proof requires real recovery evidence and cannot be inferred from storefront diagnosis.",
    unresolved_rule: "If timing is not reviewed, keep activation blocked.",
  },
};

export function buildEvidenceLineage(packet: EvidencePacket): EvidenceLineage[] {
  return packet.surfaces.flatMap((surface) =>
    surface.observations.map((observation) => ({
      issue_id: observation.issue_id,
      surface_id: surface.id,
      surface_type: surface.type,
      viewport: surface.viewport,
      observation_id: observation.id,
      unresolved: Boolean(observation.unresolved),
    })),
  );
}

function reviewStateFromEvidenceState(state: EvidencePacket["evidence_state"]): ReviewState {
  if (state === "approved") return "approved";
  if (state === "revision_requested") return "revision_requested";
  if (state === "deferred") return "deferred";
  return "under_review";
}

function proofStateFromEvidenceState(state: EvidencePacket["evidence_state"]): ProofState {
  if (state === "captured") return "evidence_attached";
  if (state === "approved") return "proof_ready";
  if (state === "revision_requested") return "unresolved";
  return "not_ready";
}

function implementationContinuityFromEvidenceState(state: EvidencePacket["evidence_state"]): ImplementationContinuityState {
  if (state === "approved") return "closeout_review";
  if (state === "captured") return "evidence_review";
  if (state === "revision_requested") return "unresolved";
  return "scope_review";
}

export function buildOperationalTopology(packet: EvidencePacket, productBoundary: ProductBoundary = "shopifixer"): OperationalTopology {
  const evidenceLineage = buildEvidenceLineage(packet);
  const inheritedIssueIds = Array.from(new Set(evidenceLineage.map((item) => item.issue_id)));
  const unresolvedContinuity = evidenceLineage.filter((item) => item.unresolved);

  return {
    topology_version: "pass_6_operational_evidence_binding_v1",
    store: packet.store,
    packet_id: packet.packet_id,
    product_boundary: productBoundary,
    review_state: reviewStateFromEvidenceState(packet.evidence_state),
    proof_state: proofStateFromEvidenceState(packet.evidence_state),
    implementation_continuity: implementationContinuityFromEvidenceState(packet.evidence_state),
    packet_lineage: {
      store: packet.store,
      packet_id: packet.packet_id,
      evidence_state: packet.evidence_state,
    },
    evidence_lineage: evidenceLineage,
    unresolved_continuity: unresolvedContinuity,
    review_inheritance: {
      inherits_storefront_reference: true,
      inherits_issue_ids: inheritedIssueIds,
      merchant_review_required: true,
    },
    proof_lineage: {
      proof_can_reference_issue_ids: inheritedIssueIds,
      proof_requires_validated_change: true,
      proof_must_preserve_unresolved_items: unresolvedContinuity.length > 0,
    },
    abando_eligibility_review: {
      product_boundary: "abando",
      independent_from_shopifixer_completion: true,
      eligible_issue_ids: inheritedIssueIds.filter((issueId) => canonicalIssueDefinitions[issueId].product_boundary === "abando"),
    },
  };
}
