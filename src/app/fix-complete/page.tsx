import Link from "next/link";
import { lookupPacket, packetHref } from "@/lib/minimumStateContinuity";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export const metadata = {
  title: "Fix Complete - Stafford Media Consulting",
  description: "ShopiFixer completion and closeout continuity.",
};

type PageProps = {
  searchParams?: Promise<{ store?: string; packet?: string }>;
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

export default async function FixCompletePage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const packetResult = await lookupPacket({ packetId: params.packet || "", store });
  const packet = packetResult.status === "found" ? packetResult.packet : null;
  const complete = packet?.current_lifecycle_state === "complete";
  const storeLabel = packet?.store_url || store || "Store confirmation required";
  const completionLabel = packet?.completion_state.replace(/_/g, " ") || "Confirmation available after review.";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="complete" stateLabel={complete ? "Complete" : "Closeout"} className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: complete ? "Operational review closed." : "Closeout review available." },
          { label: "Next", value: "Confirm completion." },
          { label: "Safe", value: "Remaining notes stay visible." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Fix Completion</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {complete ? "Confirm operational closeout." : "Fix review completed."}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            The scoped work, final status, and remaining notes are summarized here.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-5 shadow-lg shadow-black/5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Completion Summary</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            The ShopiFixer work is ready for final confirmation.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Issue diagnosis and changed-state evidence remain in the earlier review surfaces. This page only closes the operational loop.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Store", storeLabel],
            ["Status", packet ? (complete ? "Complete" : "Closeout review") : "Closeout summary unavailable."],
            ["Confirmation", completionLabel],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{copy}</p>
            </div>
          ))}
        </section>

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Remaining notes
          </summary>
          <div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Revision, access, and clarification notes remain visible until handled. Any changed-state evidence stays in proof review.
            </p>
          </div>
        </details>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">After ShopiFixer</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Add recovery after the buying path is clearer.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Optional next layer for shoppers who still leave.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={packet ? packetHref("/abando-review", packet) : withStore("/abando-review", store)}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Review Recovery Fit
            </Link>
            <Link
              href={packet ? packetHref("/fix-proof", packet) : withStore("/fix-proof", store)}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Proof
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
