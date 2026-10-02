import Link from "next/link";
import { getShopifixerProof } from "@/lib/shopifixerProof";

type EngineAuditPayload = {
  store_domain?: string;
  audit_score?: number;
  estimated_revenue_leak?: string;
  confidence?: string;
  top_issue?: string;
  recommended_action?: string;
  evidence_summary?: string;
  screenshot_url?: string | null;
  benchmark_summary?: string;
  updated_at?: string;
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

function normalizeEnginePayload(store: string, raw: EngineAuditPayload | null) {
  if (!raw) return null;

  const cleanStore = cleanStoreDomain(raw.store_domain || store);

  return {
    store_domain: cleanStore,
    audit_score: Number(raw.audit_score ?? 0),
    estimated_revenue_leak:
      String(raw.estimated_revenue_leak || "").trim() ||
      "Estimated opportunity not available",
    confidence: String(raw.confidence || "Moderate confidence"),
    top_issue: String(raw.top_issue || "Top issue not available"),
    recommended_action:
      String(raw.recommended_action || "").trim() ||
      "Recommended action not available",
    evidence_summary:
      String(raw.evidence_summary || "").trim() ||
      "No performance evidence captured yet.",
    screenshot_url:
      raw.screenshot_url === null || raw.screenshot_url === undefined || raw.screenshot_url === ""
        ? undefined
        : String(raw.screenshot_url),
    benchmark_summary:
      String(
        raw.benchmark_summary ||
          "This store may be underperforming relative to similar Shopify stores on checkout completion and recovery readiness."
      ),
    updated_at: String(raw.updated_at || new Date().toISOString()),
  };
}

async function fetchEngineAudit(store: string) {
  const cleanStore = cleanStoreDomain(store);
  if (!cleanStore) return null;

  const candidates = [
    process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL,
    "https://app.abando.ai/api/audit/result?store=" + encodeURIComponent(cleanStore),
    "https://app.abando.ai/api/audit/start?store=" + encodeURIComponent(cleanStore),
  ].filter(Boolean) as string[];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) continue;

      const json = (await res.json()) as any;
      const payload =
        json?.audit ||
        json?.result ||
        json?.data ||
        json;

      const normalized = normalizeEnginePayload(cleanStore, payload);
      if (normalized && normalized.store_domain) {
        return normalized;
      }
    } catch (_err) {
      // swallow and continue to next candidate
    }
  }

  return null;
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

  const engineAudit = await fetchEngineAudit(store);
  const fallbackAudit = getShopifixerProof(store);
  const audit = engineAudit || fallbackAudit;

  if (!audit) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Audit Result</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">This page could not be found</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            No audit result is available yet for <strong>{store}</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`/shopifixer?store=${encodeURIComponent(store)}`}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Run ShopiFixer Again
            </Link>
            <Link
              href="/shopifixer"
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Go to ShopiFixer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const supportEmail = "support@staffordmedia.ai";
  const requestFixesHref =
    `mailto:${supportEmail}` +
    `?subject=${encodeURIComponent(`ShopiFixer review for ${audit.store_domain}`)}` +
    `&body=${encodeURIComponent(
      `Store: ${audit.store_domain}
Audit score: ${audit.audit_score}
Top issue: ${audit.top_issue}
Recommended action: ${audit.recommended_action}

I want the prioritized first fixes for this store.`
    )}`;

  const sourceLabel = engineAudit ? "Live engine result" : "Fallback proof result";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Audit Result</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your Store Review</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            ShopiFixer found a likely conversion leak pattern in your store and identified the strongest next fix to test.
          </p>
          <div className="mt-4 inline-flex rounded-full border border-cyan-900/60 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-200">
            Source: {sourceLabel}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <MetaCard label="Store Domain" value={audit.store_domain} />
            <MetaCard label="Audit Score" value={String(audit.audit_score)} />
            <MetaCard label="Updated" value={audit.updated_at || "Unknown"} />
            <MetaCard label="Confidence" value={audit.confidence} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            label="Estimated Upside"
            value={audit.estimated_revenue_leak}
            subcopy="Estimated conversion opportunity currently at risk based on observed storefront and performance signals."
          />
          <InsightCard
            label="Top Issue"
            value={audit.top_issue}
            subcopy="Highest-confidence friction point surfaced in this store review."
          />
          <InsightCard
            label="Recommended Action"
            value={audit.recommended_action}
            subcopy="The first fix worth testing before broader redesign work."
          />
          <InsightCard
            label="Benchmark Context"
            value={audit.benchmark_summary || "Benchmark summary unavailable"}
            subcopy="How this store appears to compare with similar Shopify storefronts."
          />
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Evidence</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{audit.evidence_summary}</p>

          {audit.screenshot_url ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="mb-4 text-sm font-medium text-slate-200">Screenshot-backed proof</p>
              <img
                src={audit.screenshot_url}
                alt={`Screenshot-backed proof for ${audit.store_domain}`}
                className="w-full rounded-2xl border border-slate-800"
              />
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.55),rgba(15,23,42,0.95))] p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Next Step</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              href={requestFixesHref}
            >
              Request My First Fixes
            </a>
            <Link
              href={`/shopifixer?store=${encodeURIComponent(audit.store_domain)}`}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              View Audit Again
            </Link>
            <Link
              href="/shopifixer"
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Go to ShopiFixer
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
