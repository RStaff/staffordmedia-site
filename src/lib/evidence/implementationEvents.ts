import type { EvidencePacket, EvidenceSurface } from "@/lib/evidence/evidencePacket";
import type {
  CanonicalIssueId,
  ImplementationContinuityState,
  ProductBoundary,
  ProofState,
  ReviewState,
} from "@/lib/evidence/operationalTopology";
import { buildOperationalTopology, canonicalIssueDefinitions } from "@/lib/evidence/operationalTopology";

export type ImplementationEventType =
  | "scope_approved"
  | "implementation_started"
  | "change_applied"
  | "changed_state_submitted"
  | "changed_state_validated"
  | "changed_state_rejected"
  | "proof_ready"
  | "closeout_confirmed"
  | "unresolved_recorded"
  | "reverted";

export type ChangedStateValidationState = "not_submitted" | "submitted" | "validated" | "rejected" | "blocked";

export type ChangedStateEvidence = {
  before_surface_ids: string[];
  after_surface_id?: string;
  changed_state_image_url?: string;
  changed_at?: string;
  operator_reviewed: boolean;
  merchant_review_required: true;
  validation_state: ChangedStateValidationState;
  resolved_issue_ids: CanonicalIssueId[];
  unresolved_issue_ids: CanonicalIssueId[];
  deferred_issue_ids: CanonicalIssueId[];
};

export type ImplementationEventGuardrails = {
  merchant_review_required: true;
  proof_requires_validated_changed_state: true;
  unresolved_items_preserved: boolean;
  outcome_claims_allowed: false;
  recovery_activation_allowed: false;
};

export type ImplementationEvent = {
  event_id: string;
  packet_id: string;
  store: string;
  product_boundary: ProductBoundary;
  event_type: ImplementationEventType;
  issue_ids: CanonicalIssueId[];
  review_state: ReviewState;
  proof_state: ProofState;
  implementation_continuity: ImplementationContinuityState;
  changed_state_evidence: ChangedStateEvidence;
  created_at?: string;
  operator?: string;
  notes?: string;
  guardrails: ImplementationEventGuardrails;
};

export type ImplementationEventInput = {
  eventType: ImplementationEventType;
  issueIds?: CanonicalIssueId[];
  afterSurfaceId?: string;
  changedStateImageUrl?: string;
  changedAt?: string;
  validationState?: ChangedStateValidationState;
  resolvedIssueIds?: CanonicalIssueId[];
  unresolvedIssueIds?: CanonicalIssueId[];
  deferredIssueIds?: CanonicalIssueId[];
  operatorReviewed?: boolean;
  createdAt?: string;
  operator?: string;
  notes?: string;
};

export type ImplementationEventLedgerSummary = {
  packet_id: string;
  store: string;
  product_boundary: ProductBoundary;
  event_count: number;
  latest_event_type?: ImplementationEventType;
  latest_review_state?: ReviewState;
  latest_proof_state?: ProofState;
  latest_implementation_continuity?: ImplementationContinuityState;
  proof_supported: boolean;
  open_issue_ids: CanonicalIssueId[];
  resolved_issue_ids: CanonicalIssueId[];
  deferred_issue_ids: CanonicalIssueId[];
};

function uniqueIssueIds(issueIds: CanonicalIssueId[]): CanonicalIssueId[] {
  return Array.from(new Set(issueIds));
}

function issueBelongsToBoundary(issueId: CanonicalIssueId, productBoundary: ProductBoundary) {
  return canonicalIssueDefinitions[issueId].product_boundary === productBoundary;
}

export function issueIdsForPacket(packet: EvidencePacket): CanonicalIssueId[] {
  return uniqueIssueIds(
    packet.surfaces.flatMap((surface) => surface.observations.map((observation) => observation.issue_id)),
  );
}

export function unresolvedIssueIdsForPacket(packet: EvidencePacket): CanonicalIssueId[] {
  return uniqueIssueIds(
    packet.surfaces.flatMap((surface) =>
      surface.observations.filter((observation) => observation.unresolved).map((observation) => observation.issue_id),
    ),
  );
}

function filteredIssueIdsForBoundary(packet: EvidencePacket, issueIds?: CanonicalIssueId[]): CanonicalIssueId[] {
  const candidates = issueIds && issueIds.length > 0 ? issueIds : issueIdsForPacket(packet);
  return uniqueIssueIds(candidates.filter((issueId) => issueBelongsToBoundary(issueId, packet.product_boundary)));
}

function surfaceIdsForIssues(packet: EvidencePacket, issueIds: CanonicalIssueId[]): string[] {
  const issueSet = new Set(issueIds);
  return packet.surfaces
    .filter((surface: EvidenceSurface) => surface.observations.some((observation) => issueSet.has(observation.issue_id)))
    .map((surface) => surface.id);
}

function eventIdFor(packet: EvidencePacket, eventType: ImplementationEventType, issueIds: CanonicalIssueId[]) {
  const issueKey = issueIds.length > 0 ? issueIds.join("-").toLowerCase().replace(/_/g, "-") : "no-issue";
  return `implementation_${packet.packet_id}_${eventType}_${issueKey}`;
}

export function changedStateEvidenceSupportsProof(evidence: ChangedStateEvidence): boolean {
  return (
    evidence.validation_state === "validated" &&
    evidence.operator_reviewed &&
    Boolean(evidence.changed_state_image_url || evidence.after_surface_id)
  );
}

function reviewStateForEvent(eventType: ImplementationEventType, validationState: ChangedStateValidationState): ReviewState {
  if (eventType === "scope_approved" || eventType === "implementation_started" || eventType === "change_applied") {
    return "approved";
  }
  if (eventType === "changed_state_rejected" || validationState === "rejected") return "revision_requested";
  if (eventType === "unresolved_recorded" || validationState === "blocked") return "revision_requested";
  if (eventType === "reverted") return "deferred";
  return "under_review";
}

function implementationContinuityForEvent(
  eventType: ImplementationEventType,
  evidence: ChangedStateEvidence,
): ImplementationContinuityState {
  if (eventType === "scope_approved") return "approved_for_work";
  if (eventType === "implementation_started" || eventType === "change_applied") return "implementation_in_progress";
  if (eventType === "changed_state_submitted" || eventType === "changed_state_validated") return "evidence_review";
  if (eventType === "proof_ready" && changedStateEvidenceSupportsProof(evidence)) return "closeout_review";
  if (eventType === "closeout_confirmed" && changedStateEvidenceSupportsProof(evidence)) return "closed";
  if (eventType === "unresolved_recorded" || eventType === "changed_state_rejected" || eventType === "reverted") {
    return "unresolved";
  }
  return "scope_review";
}

function proofStateForEvent(eventType: ImplementationEventType, evidence: ChangedStateEvidence): ProofState {
  if (eventType === "closeout_confirmed" && changedStateEvidenceSupportsProof(evidence)) return "confirmed";
  if ((eventType === "proof_ready" || eventType === "changed_state_validated") && changedStateEvidenceSupportsProof(evidence)) {
    return "proof_ready";
  }
  if (eventType === "changed_state_submitted" && evidence.validation_state === "submitted") return "evidence_attached";
  if (evidence.unresolved_issue_ids.length > 0 || eventType === "unresolved_recorded") return "unresolved";
  return "not_ready";
}

export function buildChangedStateEvidence(packet: EvidencePacket, input: ImplementationEventInput): ChangedStateEvidence {
  const issueIds = filteredIssueIdsForBoundary(packet, input.issueIds);
  const packetUnresolvedIssueIds = unresolvedIssueIdsForPacket(packet).filter((issueId) => issueIds.includes(issueId));
  const resolvedIssueIds = uniqueIssueIds(input.resolvedIssueIds || []).filter((issueId) => issueIds.includes(issueId));
  const deferredIssueIds = uniqueIssueIds(input.deferredIssueIds || []).filter((issueId) => issueIds.includes(issueId));
  const explicitUnresolvedIssueIds = input.unresolvedIssueIds
    ? uniqueIssueIds(input.unresolvedIssueIds).filter((issueId) => issueIds.includes(issueId))
    : packetUnresolvedIssueIds.filter((issueId) => !resolvedIssueIds.includes(issueId) && !deferredIssueIds.includes(issueId));

  return {
    before_surface_ids: surfaceIdsForIssues(packet, issueIds),
    after_surface_id: input.afterSurfaceId,
    changed_state_image_url: input.changedStateImageUrl,
    changed_at: input.changedAt,
    operator_reviewed: Boolean(input.operatorReviewed),
    merchant_review_required: true,
    validation_state: input.validationState || "not_submitted",
    resolved_issue_ids: resolvedIssueIds,
    unresolved_issue_ids: explicitUnresolvedIssueIds,
    deferred_issue_ids: deferredIssueIds,
  };
}

export function buildImplementationEvent(packet: EvidencePacket, input: ImplementationEventInput): ImplementationEvent {
  const topology = buildOperationalTopology(packet, packet.product_boundary);
  const issueIds = filteredIssueIdsForBoundary(packet, input.issueIds);
  const changedStateEvidence = buildChangedStateEvidence(packet, input);
  const reviewState = reviewStateForEvent(input.eventType, changedStateEvidence.validation_state);
  const proofState = proofStateForEvent(input.eventType, changedStateEvidence);
  const implementationContinuity = implementationContinuityForEvent(input.eventType, changedStateEvidence);

  return {
    event_id: eventIdFor(packet, input.eventType, issueIds),
    packet_id: packet.packet_id,
    store: packet.store,
    product_boundary: topology.product_boundary,
    event_type: input.eventType,
    issue_ids: issueIds,
    review_state: reviewState,
    proof_state: proofState,
    implementation_continuity: implementationContinuity,
    changed_state_evidence: changedStateEvidence,
    created_at: input.createdAt,
    operator: input.operator,
    notes: input.notes,
    guardrails: {
      merchant_review_required: true,
      proof_requires_validated_changed_state: true,
      unresolved_items_preserved: changedStateEvidence.unresolved_issue_ids.length > 0,
      outcome_claims_allowed: false,
      recovery_activation_allowed: false,
    },
  };
}

export function buildImplementationEventLedger(
  packet: EvidencePacket,
  inputs: ImplementationEventInput[],
): ImplementationEvent[] {
  return inputs.map((input) => buildImplementationEvent(packet, input));
}

export function implementationEventCanSupportProof(event: ImplementationEvent): boolean {
  return changedStateEvidenceSupportsProof(event.changed_state_evidence);
}

export function summarizeImplementationEventLedger(events: ImplementationEvent[]): ImplementationEventLedgerSummary | null {
  const latestEvent = events[events.length - 1];
  if (!latestEvent) return null;

  const resolvedIssueIds = uniqueIssueIds(
    events.flatMap((event) => event.changed_state_evidence.resolved_issue_ids),
  );
  const deferredIssueIds = uniqueIssueIds(
    events.flatMap((event) => event.changed_state_evidence.deferred_issue_ids),
  );
  const openIssueIds = uniqueIssueIds(events.flatMap((event) => event.changed_state_evidence.unresolved_issue_ids)).filter(
    (issueId) => !resolvedIssueIds.includes(issueId) && !deferredIssueIds.includes(issueId),
  );

  return {
    packet_id: latestEvent.packet_id,
    store: latestEvent.store,
    product_boundary: latestEvent.product_boundary,
    event_count: events.length,
    latest_event_type: latestEvent.event_type,
    latest_review_state: latestEvent.review_state,
    latest_proof_state: latestEvent.proof_state,
    latest_implementation_continuity: latestEvent.implementation_continuity,
    proof_supported: implementationEventCanSupportProof(latestEvent),
    open_issue_ids: openIssueIds,
    resolved_issue_ids: resolvedIssueIds,
    deferred_issue_ids: deferredIssueIds,
  };
}
