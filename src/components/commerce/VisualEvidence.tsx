import type { ReactNode } from "react";
import EvidenceImageFrame from "@/components/commerce/EvidenceImageFrame";

export type EvidenceState =
  | "Review pending"
  | "Reviewing"
  | "Needs evidence"
  | "Requires merchant confirmation"
  | "Scope approved"
  | "Proof attached"
  | "Reverted"
  | "Deferred"
  | "Recovery eligible"
  | "Recovery needs review";

type EvidenceCallout = {
  label: string;
  note: string;
  tone?: "amber" | "cyan" | "violet" | "slate";
};

const tagTone: Record<string, string> = {
  amber: "border-amber-400/30 bg-amber-950/20 text-amber-100",
  cyan: "border-cyan-400/30 bg-cyan-950/20 text-cyan-100",
  violet: "border-violet-400/30 bg-violet-950/20 text-violet-100",
  slate: "border-slate-700 bg-slate-900 text-slate-200",
};

export function EvidenceStateTag({ state, tone = "cyan" }: { state: EvidenceState; tone?: "amber" | "cyan" | "violet" | "slate" }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tagTone[tone]}`}>
      {state}
    </span>
  );
}

export function BrowserEvidenceFrame({
  title,
  subtitle,
  screenshotUrl,
  callouts,
  state = null,
}: {
  title: string;
  subtitle: string;
  screenshotUrl?: string | null;
  callouts: EvidenceCallout[];
  state?: EvidenceState | null;
}) {
  return (
    <section className="rounded-3xl border border-slate-800/75 bg-slate-900/45 p-5 shadow-lg shadow-black/5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Evidence</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>
        {state ? <EvidenceStateTag state={state} tone={state === "Needs evidence" ? "amber" : "cyan"} /> : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3">
          <span className="text-xs font-semibold text-slate-300">Storefront reference</span>
        </div>
        <div className="relative min-h-[260px] bg-slate-950">
          <EvidenceImageFrame
            imageUrl={screenshotUrl}
            ariaLabel="Current storefront evidence"
            className="relative min-h-[300px] w-full overflow-hidden bg-slate-950 opacity-90"
            fallbackTitle="Storefront screenshot is not available yet."
            fallbackCopy="The review remains available. Evidence will stay tied to this store when the screenshot is ready."
          >
              <p className="absolute bottom-4 right-4 max-w-xs rounded-full border border-slate-800 bg-slate-950/85 px-3 py-1.5 text-[11px] font-medium text-slate-400">
                Storefront evidence review.
              </p>
          </EvidenceImageFrame>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent" />
          {screenshotUrl ? (
            <div className="absolute left-4 top-4 max-w-[min(22rem,calc(100%-2rem))] rounded-2xl border border-amber-300/35 bg-slate-950/90 p-4 shadow-xl shadow-black/35 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">Observed surface</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Review hierarchy, primary action clarity, reassurance timing, and competing attention.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {callouts.map((callout) => (
          <div key={callout.label} className={`rounded-2xl border p-4 ${tagTone[callout.tone || "slate"]}`}>
            <p className="text-sm font-semibold text-white">{callout.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{callout.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ForensicReviewPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; observation: string; state: EvidenceState }>;
}) {
  return (
    <section className="rounded-3xl border border-slate-800/75 bg-slate-950/45 p-5 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Commerce read</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="grid gap-3 border-l border-cyan-400/25 pl-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.observation}</p>
            </div>
            <EvidenceStateTag state={item.state} tone={item.state.toLowerCase().includes("needs") ? "amber" : "slate"} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function EvidenceContinuityPanel({
  children,
  title,
  copy,
}: {
  title: string;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(2,6,23,0.94))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Evidence</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{copy}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function RecoveryJourneyPanel({ store }: { store?: string }) {
  const steps = [
    ["Exit moment", "A shopper leaves with purchase intent still active."],
    ["Recovery timing", "Abando reviews whether a return path is appropriate."],
    ["Return path", "Recovery messaging can invite the shopper back when eligibility is confirmed."],
  ];

  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-5 shadow-lg shadow-black/5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">Post-exit recovery review</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            What happens after a shopper still leaves.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            {store ? `${store} can be reviewed for recovery fit without claiming an outcome.` : "A store can be reviewed for recovery fit without claiming an outcome."}
          </p>
        </div>
        <EvidenceStateTag state="Recovery eligible" tone="violet" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map(([label, copy], index) => (
          <div key={label} className="rounded-2xl border border-violet-400/20 bg-slate-950/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
