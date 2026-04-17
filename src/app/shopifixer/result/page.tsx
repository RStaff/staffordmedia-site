import Link from "next/link";
import SummaryIssuePills from "@/components/shopifixer/SummaryIssuePills";
import SummaryMetricCard from "@/components/shopifixer/SummaryMetricCard";
import { AuditPayload, assertValidPayload } from "@/lib/auditPayload";

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

  const requestFixesHref =
    `mailto:support@staffordmedia.ai` +
    `?subject=${encodeURIComponent(`ShopiFixer review for ${payload.store_domain}`)}` +
    `&body=${encodeURIComponent(
      `Store: ${payload.store_domain}\nAudit score: ${payload.audit_score}\nTop issue: ${payload.top_issue}\nRecommended action: ${payload.recommended_action}\n\nI want the prioritized first fixes for this store.`
    )}`;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Summary</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your ShopiFixer summary is ready.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            We found the strongest issue most likely affecting conversion. Your full review is available by email and below.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <SummaryMetricCard label="Store Domain" value={payload.store_domain} />
            <SummaryMetricCard label="Audit Score" value={String(payload.audit_score)} />
            <SummaryMetricCard label="Revenue Loss" value={payload.estimated_revenue_loss} />
            <SummaryMetricCard label="Generated" value={payload.generated_at} />
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

          <div className="mt-8 rounded-2xl border border-cyan-900/30 bg-cyan-950/20 p-5">
            <p className="text-sm leading-7 text-slate-200">
              We emailed your full ShopiFixer review with the richer proof surface and next-step context.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/audit-result?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open Full Review
            </Link>
            <a
              href={requestFixesHref}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Request My First Fixes
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
