import Link from "next/link";
import SummaryIssuePills from "@/components/shopifixer/SummaryIssuePills";
import SummaryMetricCard from "@/components/shopifixer/SummaryMetricCard";
import type { AuditPayload } from "@/lib/auditPayload";
import { assertValidPayload } from "@/lib/auditPayload";
import { buildAuditConfidence } from "../../../../lib/buildAuditConfidence";
import { buildAnnotatedScreenshotSignals } from "../../../../lib/buildAnnotatedScreenshotSignals";
import { getStorefrontScreenshot } from "../../../../lib/storefrontScreenshot";

export const dynamic = "force-dynamic";

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
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-900/40 bg-red-950/30 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Missing store</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">No store was provided.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Open this page with <code>?store=your-store.com</code>.
          </p>
          <div className="mt-6">
            <Link href="/shopifixer" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
              Go to ShopiFixer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const payload = await fetchAuditPayload(store);

  const pricingHref = `/pricing?store=${encodeURIComponent(payload.store_domain)}`;
  const fullReviewHref = `/audit-result?store=${encodeURIComponent(payload.store_domain)}`;
  const screenshotUrl = getStorefrontScreenshot(payload.store_domain);
  const auditConfidence = buildAuditConfidence(payload, {
    structured_audit_signals: payload.issues,
    screenshot_url: screenshotUrl,
  });
  const supportSignals = buildAnnotatedScreenshotSignals(payload, screenshotUrl).annotations.slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Summary</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">You’re likely losing $3,375–$7,125/month from one fixable issue.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            We analyzed your storefront and found the clearest point where revenue is dropping after purchase intent is created. Review the diagnosis here, then move straight into the implementation path if you want this fixed for you.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <SummaryMetricCard label="Store Domain" value={payload.store_domain} />
            <SummaryMetricCard label="Audit Score" value={String(payload.audit_score)} />
            <SummaryMetricCard label={auditConfidence.revenue_window_label} value={payload.estimated_revenue_loss} />
            <SummaryMetricCard label="Generated" value={payload.generated_at} />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            At this rate, this issue continues to leak revenue every day it remains unfixed.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">How confident is this?</p>
              <p className="mt-2 text-lg font-semibold capitalize text-white">{auditConfidence.confidence_label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{auditConfidence.confidence_reason}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">What’s actually happening</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{auditConfidence.operator_read}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Top diagnosis</p>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Top Issue</p>
              <p className="mt-3 text-xl font-semibold text-white">{payload.top_issue}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended Action</p>
              <p className="mt-3 text-xl font-semibold text-white">{payload.recommended_action}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Issue signals</p>
            <div className="mt-4">
              <SummaryIssuePills issues={payload.issues} />
            </div>
          </div>

          {supportSignals.length > 0 ? (
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Supporting signals</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {supportSignals.map((signal) => (
                  <div key={signal.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">{signal.anchor}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{signal.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{signal.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-cyan-900/30 bg-cyan-950/20 p-5">
            <p className="text-sm leading-7 text-slate-200">
              Your full ShopiFixer review is ready with the same diagnosis, storefront proof, and first move preserved from this audit. If you want this fixed for you, the next step is the implementation page tied directly to this diagnosis.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">What happens when this is fixed</p>
            <div className="mt-4 grid gap-3">
              <p className="text-sm leading-7 text-slate-200">We apply the fix to your checkout experience.</p>
              <p className="text-sm leading-7 text-slate-200">Recovery flow is activated automatically.</p>
              <p className="text-sm leading-7 text-slate-200">You start capturing previously lost revenue.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <a
                href={pricingHref}
                className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                See Pricing & Checkout
              </a>
              <p className="pl-1 text-xs font-medium text-slate-400">Fix this before more revenue leaks.</p>
            </div>
            <a
              href={fullReviewHref}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open Full Review
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
