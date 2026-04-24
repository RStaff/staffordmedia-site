import { redirect } from "next/navigation";
import { assertValidPayload } from "@/lib/auditPayload";
import { triggerShopifixerOutreach } from "../../../lib/shopifixerOutreach";
import { saveShopifixerLead } from "@/lib/shopifixerLeadStore";
import AuditBenefitsRow from "@/components/shopifixer/AuditBenefitsRow";
import AuditFormCard from "@/components/shopifixer/AuditFormCard";
import AuditHero from "@/components/shopifixer/AuditHero";
import AuditNextStep from "@/components/shopifixer/AuditNextStep";
import AuditReadPreview from "@/components/shopifixer/AuditReadPreview";

export const metadata = {
  title: "ShopiFixer — Stafford Media Consulting™",
  description: "Fast audit-style Shopify conversion review with the clearest issue and first fix to test.",
};

function normalizeStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function getFixAuditUrl() {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  if (!configured) {
    return "https://app.abando.ai/api/fix-audit";
  }

  return configured.includes("/api/")
    ? configured
    : `${configured.replace(/\/$/, "")}/api/fix-audit`;
}

async function submitAudit(formData: FormData) {
  "use server";

  const storeUrl = normalizeStoreDomain(String(formData.get("storeUrl") || ""));
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!storeUrl || !email) {
    throw new Error("INVALID_AUDIT_REQUEST");
  }

  const response = await fetch(getFixAuditUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      storeUrl,
      email,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  const leadId = json?.leadId || null;
  const payload = assertValidPayload(json?.payload || json);

  try {
    await saveShopifixerLead({
      submitted_email: email,
      submitted_store: storeUrl,
      payload,
      leadId,
    });
  } catch (error) {
    console.error("[shopifixer-lead-store] unexpected failure", error);
  }

  try {
    await triggerShopifixerOutreach({
      submitted_email: email,
      submitted_store: storeUrl,
      payload,
    });
  } catch (error) {
    console.error("[shopifixer-outreach] unexpected failure", error);
  }

  redirect(`/shopifixer/result?store=${encodeURIComponent(payload.store_domain)}`);
}

export default function ShopifixerPage() {
  return (
    <main>
      <section className="section-pad">
        <div className="site-shell">
          <div className="premium-panel p-6 md:p-10">
            <AuditHero />
            <AuditBenefitsRow />

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <AuditFormCard action={submitAudit} />
              <AuditReadPreview />
            </div>

            <AuditNextStep />
          </div>
        </div>
      </section>
    </main>
  );
}
