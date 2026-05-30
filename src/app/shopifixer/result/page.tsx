import Link from "next/link";
import SummaryMetricCard from "@/components/shopifixer/SummaryMetricCard";
import type { AuditPayload } from "@/lib/auditPayload";
import { assertValidPayload } from "@/lib/auditPayload";
import { buildAuditConfidence } from "../../../../lib/buildAuditConfidence";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import { buildShopiFixerMerchantTrustProfile } from "@/lib/shopifixerMerchantTrust";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ShopiFixer Audit Result - Stafford Media Consulting",
  description:
    "ShopiFixer storefront audit summary with a scoped issue, confidence boundary, and next-step review.",
};

type PageProps = {
  searchParams?: Promise<{ store?: string }>;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function getFixAuditUrl(store: string) {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  const base = configured
    ? configured.includes("/api/")
      ? configured
      : `${configured.replace(/\/$/, "")}/api/fix-audit`
    : "https://app.abando.ai/api/fix-audit";

  return `${base}?store=${encodeURIComponent(store)}`;
}

async function fetchAuditPayload(store: string): Promise<AuditPayload> {
  const response = await fetch(getFixAuditUrl(store), {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const status = response.status;
    let errorCode = "AUDIT_ENGINE_UNAVAILABLE";

    try {
      const json = await response.json();
      errorCode = json?.error || errorCode;
    } catch {}

    if (status === 404 || errorCode === "audit_payload_not_found" || errorCode === "payload_not_found") {
      throw new Error("AUDIT_PAYLOAD_NOT_FOUND");
    }

    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  return assertValidPayload(json?.payload || json);
}

export default async function ShopifixerSummaryResultPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
        <SystemProgressRail currentStage="diagnose" stateLabel="Signal summary" className="px-0 pt-0" />
        <RuntimeContinuityStrip
          className="px-0"
          items={[
            { label: "Now", value: "Example signal summary." },
            { label: "Next", value: "Run your store audit." },
            { label: "Safe", value: "Example only." },
          ]}
        />
        <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
          <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Example Audit Summary</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              A small mobile CTA issue can quietly weaken purchase intent.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              A concise example of the kind of signal ShopiFixer surfaces.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-4 md:gap-4">
              <SummaryMetricCard label="Audit Type" value="Example" />
              <SummaryMetricCard label="Audit Score" value="62" />
              <SummaryMetricCard label="Estimated Upside" value="$2k-$6k/mo" />
              <SummaryMetricCard label="Generated" value="Demo only" />
            </div>

          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Signal summary</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Example issue</p>
                <p className="mt-3 text-xl font-semibold text-white">Mobile shoppers may not see the next step quickly enough.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Audit arrival</p>
                <p className="mt-3 text-xl font-semibold text-white">Your review shows where attention starts to drift.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
              <span className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
                Check Email to Continue Review
              </span>
              <Link
                href="/shopifixer"
                className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Run Your Store Audit
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  let payload;
  try {
    payload = await fetchAuditPayload(store);
  } catch {
    return (
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
          <SystemProgressRail currentStage="diagnose" stateLabel="Signal pending" className="px-0 pt-0" />
          <RuntimeContinuityStrip
            className="px-0"
          items={[
              { label: "Now", value: "Signal unavailable." },
              { label: "Next", value: "Refresh the audit." },
              { label: "Safe", value: "No fix starts yet." },
            ]}
          />
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">ShopiFixer Summary</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Your storefront summary is not available yet.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Refresh the audit, then reopen the summary when the storefront read is ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/shopifixer"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Run ShopiFixer
              </Link>
              <span className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white">
                Check Email to Continue Review
              </span>
            </div>
          </div>
        </main>
      );
  }

  const pricingHref = `/pricing?store=${encodeURIComponent(payload.store_domain)}`;
  const auditConfidence = buildAuditConfidence(payload, {
    structured_audit_signals: payload.issues,
  });
  const trustProfile = buildShopiFixerMerchantTrustProfile(payload);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="diagnose" stateLabel="Signal found" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Issue found." },
          { label: "Next", value: "Continue from your inbox." },
          { label: "Safe", value: "Pricing follows review." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Summary</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {trustProfile.resultHeadline}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            {trustProfile.resultSubcopy}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-4 md:gap-4">
            <SummaryMetricCard label="Store Domain" value={payload.store_domain} />
            <SummaryMetricCard label="Audit Score" value={String(payload.audit_score)} />
            <SummaryMetricCard label={auditConfidence.revenue_window_label} value={payload.estimated_revenue_loss} />
            <SummaryMetricCard label="Generated" value={payload.generated_at} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">How confident is this?</p>
              <p className="mt-2 text-lg font-semibold text-white">{trustProfile.confidenceLabel}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{trustProfile.confidenceDisclosure}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Full audit sent</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Continue review from the audit email.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Signal summary</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Strongest Signal</p>
              <p className="mt-3 text-xl font-semibold text-white">{trustProfile.issueTitle}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{trustProfile.proposedFixTitle}</p>
              <p className="mt-3 text-xl font-semibold text-white">{trustProfile.proposedFixSummary}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-900/30 bg-cyan-950/20 p-4 md:p-5">
            <p className="text-sm leading-7 text-slate-200">
              Your full storefront audit was sent to your inbox.
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {auditConfidence.confidence_reason}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
            <span className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
              Check Your Email for the Full Audit
            </span>
            <div className="flex flex-col gap-2">
              <a
                href={pricingHref}
                className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                See Pricing
              </a>
              <p className="pl-1 text-xs font-medium text-slate-400">Pricing is best reviewed after reading the audit email.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
