import Link from "next/link";
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Audit Result</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your Store Review</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            ShopiFixer found the strongest current issue surfaced by the engine for your store.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetaCard label="Store Domain" value={payload.store_domain} />
            <MetaCard label="Audit Score" value={String(payload.audit_score)} />
            <MetaCard label="Generated" value={payload.generated_at} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            label="Estimated Revenue Loss"
            value={payload.estimated_revenue_loss}
            subcopy="Exact value supplied by the audit engine for this result."
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
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              href={requestFixesHref}
            >
              Request My First Fixes
            </a>
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
