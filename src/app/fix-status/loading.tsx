import { getFixStatusCopy } from "@/lib/fixStatusPacketAuthority";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export default function FixStatusLoading() {
  const copy = getFixStatusCopy("LOADING");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel={copy.label} className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: copy.label },
          { label: "Next", value: "Wait for status verification." },
          { label: "Safe", value: "No status is shown before verification." },
        ]}
      />
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[28px] border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Fix Status</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {copy.headline}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{copy.body}</p>
        </section>
      </div>
    </main>
  );
}
