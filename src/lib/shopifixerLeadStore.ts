import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";
import type { AuditPayload } from "@/lib/auditPayload";

type ShopifixerLeadInput = {
  submitted_email: string;
  submitted_store: string;
  payload: AuditPayload;
  leadId?: string;
};

function buildFullReviewUrl(store: string) {
  return `https://staffordmedia.ai/audit-result?store=${encodeURIComponent(store)}`;
}

export async function saveShopifixerLead(input: ShopifixerLeadInput) {
  const dataDir = join(process.cwd(), ".data");
  const filePath = join(dataDir, "shopifixer-leads.jsonl");

  const record = {
    source: "shopifixer_audit_submission",
    captured_at: new Date().toISOString(),
    lead_id: input.leadId || null,
    submitted_email: input.submitted_email,
    submitted_store: input.submitted_store,
    store_domain: input.payload.store_domain,
    audit_score: input.payload.audit_score,
    estimated_revenue_loss: input.payload.estimated_revenue_loss,
    top_issue: input.payload.top_issue,
    recommended_action: input.payload.recommended_action,
    issues: input.payload.issues,
    generated_at: input.payload.generated_at,
    full_review_url: buildFullReviewUrl(input.payload.store_domain),
  };

  await mkdir(dataDir, { recursive: true });
  await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");

  return { ok: true, filePath };
}
