import Link from "next/link";
import AbandoProgressRail from "@/components/commerce/AbandoProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import { RecoveryJourneyPanel } from "@/components/commerce/VisualEvidence";
import EvidenceViewport from "@/components/commerce/EvidenceViewport";
import { buildPlaceholderEvidencePacket, primaryEvidenceSurface } from "@/lib/evidence/evidencePacket";

export const metadata = {
  title: "Abando Review - Stafford Media Consulting",
  description: "Separate Abando recovery review without collapsing ShopiFixer approval state.",
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

function withStore(path: string, store: string) {
  return store ? `${path}?store=${encodeURIComponent(store)}` : path;
}

export default async function AbandoReviewPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const evidencePacket = buildPlaceholderEvidencePacket({
    packetId: `recovery_review_${store || "pending"}`,
    store: store || "Store confirmation required",
    productBoundary: "abando",
    evidenceState: "deferred",
  });
  const mobileEvidence = primaryEvidenceSurface(evidencePacket, "mobile");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <AbandoProgressRail currentStage="review" stateLabel="Fit Review" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Recovery fit review." },
          { label: "Next", value: "Review Abando fit." },
          { label: "Safe", value: "Separate from ShopiFixer." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Abando Review</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Review recovery fit separately.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Abando is optional recovery for shoppers who still leave after the storefront path is clearer.
          </p>
        </section>

        <RecoveryJourneyPanel store={store} />

        {mobileEvidence ? (
          <EvidenceViewport
            packet={evidencePacket}
            surface={mobileEvidence}
            title="Review where shoppers may leave."
            copy="Abando remains a separate optional recovery layer."
            showState={false}
          />
        ) : null}

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Fit details
          </summary>
          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">When Abando is appropriate</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Standalone product or optional next layer after storefront clarity.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">When to wait</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Wait if the storefront fix is still unclear.
            </p>
          </div>
          </div>
        </details>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Separate path</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Ready to review recovery fit?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Review whether a separate recovery layer is useful.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/abando"
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Review Recovery Fit
            </Link>
            <Link
              href={withStore("/fix-complete", store)}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Fix Complete
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
