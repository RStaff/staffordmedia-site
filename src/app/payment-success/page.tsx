import Link from "next/link";
import { lookupPacket, packetHref } from "@/lib/minimumStateContinuity";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export const metadata = {
  title: "Payment Received - Stafford Media Consulting",
  description: "ShopiFixer payment confirmation and next-step continuity.",
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

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const packetResult = await lookupPacket({ packetId: params.packet || "", store });
  const packet = packetResult.status === "found" ? packetResult.packet : null;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel="Authorization received" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Implementation authorized." },
          { label: "Next", value: "Confirm intake details." },
          { label: "Safe", value: "Every change is reviewed before launch." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
            ShopiFixer Payment
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Your fix request is open.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Next, we confirm the details needed before implementation work begins.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{packet?.store_url || store || "Store confirmation required"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Request</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{packet ? "Fix request open." : "Fix request unavailable."}</p>
            </div>
          </div>
        </section>

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Intake details
          </summary>
          <div className="mt-5 max-w-3xl">
            <p className="text-sm leading-7 text-slate-300">
              We confirm the store, approval contact, audit context, and access needs before work begins. Abando remains separate.
            </p>
            {packet ? <p className="mt-4 text-xs leading-5 text-slate-500">Payment received.</p> : null}
          </div>
        </details>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Continue</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Begin intake.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Confirm the basics before implementation work begins.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={packet ? packetHref("/fix-started", packet) : withStore("/fix-started", store)}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Begin Intake
            </Link>
            <Link
              href={withStore("/pricing", store)}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
