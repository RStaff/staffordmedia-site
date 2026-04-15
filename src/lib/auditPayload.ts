export type AuditPayload = {
  store_domain: string;
  audit_score: number;
  estimated_revenue_loss: string;
  top_issue: string;
  recommended_action: string;
  issues: string[];
  generated_at: string;
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

  return candidate as AuditPayload;
}
