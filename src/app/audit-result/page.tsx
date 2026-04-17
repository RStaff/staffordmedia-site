import Image from "next/image";
import Link from "next/link";
import { AuditPayload, assertValidPayload } from "@/lib/auditPayload";
import { getStorefrontScreenshot } from "../../../lib/storefrontScreenshot";

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
    ? (configured.includes("/api/") ? configured : `${configured.replace(/\/$/, "")}/api/fix-audit`)
    : "https://app.abando.ai/api/fix-audit";

  return `${base}?store=${encodeURIComponent(store)}`;
}

function getDebugPayloadUrl(store: string) {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  const base = configured
    ? configured.replace(/\/api\/fix-audit.*$/, "").replace(/\/$/, "")
    : "https://app.abando.ai";

  return `${base}/api/debug-last-payload?store=${encodeURIComponent(store)}`;
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

async function verifyPayloadParity(store: string, payload: AuditPayload) {
  try {
    const response = await fetch(getDebugPayloadUrl(store), {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return;
    }

    const json = await response.json();
    const debugPayload = assertValidPayload(json?.payload || json);

    if (JSON.stringify(debugPayload) !== JSON.stringify(payload)) {
      console.error("❌ PAYLOAD DRIFT DETECTED", {
        store,
        uiPayload: payload,
        emailPayload: debugPayload,
      });
    }
  } catch (error) {
    console.error("❌ PAYLOAD DRIFT DETECTED", {
      store,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}

function InsightCard({ label, value, subcopy }: { label: string; value: string; subcopy: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-4 text-xl font-semibold leading-tight text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{subcopy}</p>
    </div>
  );
}

function getScoreBand(score: number) {
  if (score <= 39) {
    return "Critical";
  }

  if (score <= 59) {
    return "Weak";
  }

  if (score <= 79) {
    return "Fair";
  }

  return "Strong";
}

function getConfidenceLabel(issueCount: number) {
  if (issueCount >= 3) {
    return "High confidence";
  }

  if (issueCount >= 2) {
    return "Medium confidence";
  }

  return "Directional read";
}

function buildWhyThisMatters(topIssue: string, recommendedAction: string) {
  const normalized = topIssue.toLowerCase();
  let explanation =
    "The clearest friction point is likely suppressing conversion and deserves focused testing first.";

  if (normalized.includes("cart recovery")) {
    explanation =
      "Purchase intent is leaving without a recovery path, so revenue is likely leaking after interest is already created.";
  } else if (normalized.includes("checkout")) {
    explanation = "Friction is interrupting purchase intent near the decision stage, where buyers should already be closing.";
  }

  return {
    explanation,
    nextMove: `The fastest next move is to test: ${recommendedAction}`,
  };
}

function getScoreBandClasses(label: string) {
  if (label === "Critical") return "border-rose-500/25 bg-rose-950/30 text-rose-200";
  if (label === "Weak") return "border-amber-500/25 bg-amber-950/30 text-amber-200";
  if (label === "Fair") return "border-cyan-500/25 bg-cyan-950/30 text-cyan-200";
  return "border-emerald-500/25 bg-emerald-950/30 text-emerald-200";
}

export default async function AuditResultPage({ searchParams }: PageProps) {
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
  await verifyPayloadParity(store, payload);

  const requestFixesHref =
    `mailto:support@staffordmedia.ai` +
    `?subject=${encodeURIComponent(`ShopiFixer review for ${payload.store_domain}`)}` +
    `&body=${encodeURIComponent(
      `Store: ${payload.store_domain}\nAudit score: ${payload.audit_score}\nTop issue: ${payload.top_issue}\nRecommended action: ${payload.recommended_action}\n\nI want the prioritized first fixes for this store.`
    )}`;
  const screenshotUrl = getStorefrontScreenshot(payload.store_domain);
  const scoreBand = getScoreBand(payload.audit_score);
  const confidenceLabel = getConfidenceLabel(payload.issues.length);
  const whyThisMatters = buildWhyThisMatters(payload.top_issue, payload.recommended_action);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Full Review</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your Full Store Review</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            This result reflects the strongest issue surfaced by the ShopiFixer engine for your store, with the first
            recommended move preserved from the same canonical payload used across the audit flow.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)]">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 md:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Audit score</p>
              <p className="mt-3 text-5xl font-semibold tracking-tight text-white">{payload.audit_score}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Score band</p>
              <p className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getScoreBandClasses(scoreBand)}`}>
                {scoreBand}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">This band is derived directly from the current audit score.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Confidence</p>
              <p className="mt-2 text-lg font-semibold text-white">{confidenceLabel}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Based on {payload.issues.length} surfaced issue signal{payload.issues.length === 1 ? "" : "s"} in this review.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Estimated 30-day opportunity</p>
              <p className="mt-2 text-2xl font-semibold text-white">{payload.estimated_revenue_loss}</p>
            </div>
          </div>
          <div className="mt-5 inline-flex w-fit max-w-full items-center gap-2.5 rounded-xl border border-white/12 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_24px_rgba(0,0,0,0.22)]">
            <Image
              src="/brand/shopify_partner-logo-white.png"
              alt="Official Shopify Partner"
              width={220}
              height={48}
              className="h-6 w-auto shrink-0"
            />
            <span className="whitespace-nowrap text-sm font-medium text-slate-200">Official Shopify Partner</span>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Storefront proof</p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50 shadow-2xl shadow-black/20">
            <img
              src={screenshotUrl}
              alt={`Full-page storefront screenshot for ${payload.store_domain}`}
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetaCard label="Store Domain" value={payload.store_domain} />
            <MetaCard label="Audit Score" value={String(payload.audit_score)} />
            <MetaCard label="Generated" value={payload.generated_at} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            label="Estimated 30-day opportunity"
            value={payload.estimated_revenue_loss}
            subcopy="Time-boxed from the current audit payload as a 30-day opportunity estimate."
          />
          <InsightCard
            label="Top Issue"
            value={payload.top_issue}
            subcopy="Highest-priority issue surfaced from the same engine payload used for email."
          />
          <InsightCard
            label="Recommended Action"
            value={payload.recommended_action}
            subcopy="The first recommended action from the same canonical payload."
          />
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Why this matters</p>
          <div className="mt-4 max-w-4xl space-y-4">
            <p className="text-base leading-8 text-slate-200">{whyThisMatters.explanation}</p>
            <p className="text-sm leading-7 text-slate-300">{whyThisMatters.nextMove}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Proof and confidence</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Same audit result, expanded into full review.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                This page reflects the same canonical ShopiFixer payload used to generate the audit email. The goal is
                to make the strongest issue clear, preserve the recommended next move, and give operators a cleaner path to action.
              </p>
              <div className="mt-4 inline-flex w-fit max-w-full items-center gap-2.5 rounded-xl border border-white/12 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_24px_rgba(0,0,0,0.22)]">
                <Image
                  src="/brand/shopify_partner-logo-white.png"
                  alt="Official Shopify Partner"
                  width={220}
                  height={48}
                  className="h-5 w-auto shrink-0"
                />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-200">Official Shopify Partner</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm font-medium text-slate-200">
                Canonical payload shared across email and page
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm font-medium text-slate-200">
                Top issue shown from the same engine response
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm font-medium text-slate-200">
                Recommended action preserved without reinterpretation
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Issues</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {payload.issues.map((issue) => (
              <div key={issue} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">
                {issue}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.55),rgba(15,23,42,0.95))] p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Next Step</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Take the first fix forward.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Use the audit result to request the prioritized first fixes for this store, or rerun the audit flow if you
            want a fresh submission tied to the same destination page.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href={`/fix?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Fix This for Me
            </Link>
            <p className="mt-3 text-sm text-slate-300">Fixed in 3–5 days. No retainer.</p>
            <Link
              href={`/shopifixer?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Run ShopiFixer Again
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
