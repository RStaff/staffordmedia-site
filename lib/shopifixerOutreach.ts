import type { AuditPayload } from "../src/lib/auditPayload";

type ShopifixerOutreachInput = {
  submitted_email: string;
  submitted_store: string;
  payload: AuditPayload;
};

type ShopifixerOutreachPayload = {
  source: "shopifixer_audit_submission";
  submitted_email: string;
  submitted_store: string;
  store_domain: string;
  audit_score: number;
  estimated_revenue_loss: string;
  top_issue: string;
  recommended_action: string;
  issues: string[];
  generated_at: string;
  full_review_url: string;
};

function buildFullReviewUrl(store: string) {
  return `https://staffordmedia.ai/audit-result?store=${encodeURIComponent(store)}`;
}

function buildOutreachPayload(input: ShopifixerOutreachInput): ShopifixerOutreachPayload {
  return {
    source: "shopifixer_audit_submission",
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
}

export async function triggerShopifixerOutreach(input: ShopifixerOutreachInput) {
  const normalizedPayload = buildOutreachPayload(input);
  const webhookUrl = String(process.env.SHOPIFIXER_OUTREACH_WEBHOOK_URL || "").trim();

  if (!webhookUrl) {
    console.log("[shopifixer-outreach]", normalizedPayload);
    return { ok: true, mode: "log_only" as const };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(normalizedPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[shopifixer-outreach] webhook failed", response.status, response.statusText);
      return { ok: false, mode: "webhook" as const };
    }

    return { ok: true, mode: "webhook" as const };
  } catch (error) {
    console.error("[shopifixer-outreach] webhook error", error);
    return { ok: false, mode: "webhook" as const };
  }
}
