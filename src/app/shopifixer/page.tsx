import { redirect } from "next/navigation";
import { assertValidPayload } from "@/lib/auditPayload";
import { triggerShopifixerOutreach } from "../../../lib/shopifixerOutreach";
import AuditBenefitsRow from "@/components/shopifixer/AuditBenefitsRow";
import AuditFormCard from "@/components/shopifixer/AuditFormCard";
import AuditHero from "@/components/shopifixer/AuditHero";
import AuditNextStep from "@/components/shopifixer/AuditNextStep";
import AuditSignalSummary from "@/components/shopifixer/AuditSignalSummary";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

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

function isSafeValidationMode() {
  return [process.env.SAFE_VALIDATION_MODE, process.env.SHOPIFIXER_SAFE_VALIDATION_MODE]
    .some((value) => String(value || "").trim().toLowerCase() === "true");
}

function buildSafeValidationEmail(store: string) {
  const token = store.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "store";
  return `validation+${token}@staffordmedia.ai`;
}

async function submitAudit(formData: FormData) {
  "use server";

  const storeUrl = normalizeStoreDomain(String(formData.get("storeUrl") || ""));
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!storeUrl || !email) {
    throw new Error("INVALID_AUDIT_REQUEST");
  }

  const safeValidationMode = isSafeValidationMode();
  const auditEmail = safeValidationMode ? buildSafeValidationEmail(storeUrl) : email;

  const response = await fetch(getFixAuditUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(safeValidationMode ? { "X-ShopiFixer-Validation-Mode": "true" } : {}),
    },
    body: JSON.stringify({
      storeUrl,
      email: auditEmail,
      ...(safeValidationMode
        ? {
            safe_validation_mode: true,
            suppress_email: true,
            suppress_outreach: true,
            source: "internal_validation",
          }
        : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  const payload = assertValidPayload(json?.payload || json);

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
      <SystemProgressRail currentStage="diagnose" stateLabel="Diagnose" />
      <RuntimeContinuityStrip
        items={[
          { label: "Now", value: "Find the clearest issue." },
          { label: "Next", value: "Review the first fix path." },
          { label: "Safe", value: "No store changes from the audit." },
        ]}
      />
      <section className="section-pad">
        <div className="site-shell">
          <div className="premium-panel p-5 md:p-8 lg:p-10">
            <AuditHero />
            <AuditBenefitsRow />

            <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-6">
              <AuditFormCard action={submitAudit} />
              <AuditSignalSummary />
            </div>

            <AuditNextStep />
          </div>
        </div>
      </section>
    </main>
  );
}
