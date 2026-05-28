export type AuditPayload = {
  store_domain: string;
  audit_score: number;
  estimated_revenue_loss: string;
  top_issue: string;
  recommended_action: string;
  issues: string[];
  generated_at: string;
  issue_explanation?: string;
  directional_impact?: string;
  scoped_next_step?: string;
  downstream_recovery_recommendation?: string;
  confidence_level?: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_SIGNAL";
};

export function assertValidPayload(payload: unknown): AuditPayload {
  if (!payload || typeof payload !== "object") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  const candidate = payload as Record<string, unknown>;

  if (typeof candidate.store_domain !== "string" || candidate.store_domain.trim() === "") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (typeof candidate.audit_score !== "number" || Number.isNaN(candidate.audit_score)) {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (typeof candidate.estimated_revenue_loss !== "string" || candidate.estimated_revenue_loss.trim() === "") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (typeof candidate.top_issue !== "string" || candidate.top_issue.trim() === "") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (typeof candidate.recommended_action !== "string" || candidate.recommended_action.trim() === "") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (!Array.isArray(candidate.issues) || candidate.issues.some((issue: unknown) => typeof issue !== "string" || issue.trim() === "")) {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  if (typeof candidate.generated_at !== "string" || candidate.generated_at.trim() === "") {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  for (const optionalField of [
    "issue_explanation",
    "directional_impact",
    "scoped_next_step",
    "downstream_recovery_recommendation",
  ]) {
    const value = candidate[optionalField];

    if (value !== undefined && typeof value !== "string") {
      throw new Error("INVALID_AUDIT_PAYLOAD");
    }
  }

  if (
    candidate.confidence_level !== undefined &&
    candidate.confidence_level !== "HIGH" &&
    candidate.confidence_level !== "MEDIUM" &&
    candidate.confidence_level !== "LOW" &&
    candidate.confidence_level !== "INSUFFICIENT_SIGNAL"
  ) {
    throw new Error("INVALID_AUDIT_PAYLOAD");
  }

  return candidate as AuditPayload;
}
