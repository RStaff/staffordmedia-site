import Link from "next/link";
import { lookupPacket, packetHref } from "@/lib/minimumStateContinuity";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export const metadata = {
  title: "Fix Me Started - Stafford Media Consulting",
  description: "What happens after starting a ShopiFixer Fix Me request.",
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

export default async function FixStartedPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const packetResult = await lookupPacket({ packetId: params.packet || "", store });
  const packet = packetResult.status === "found" ? packetResult.packet : null;
  const pricingHref = store ? `/pricing?store=${encodeURIComponent(store)}` : "/pricing";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel="Intake open" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Intake open." },
          { label: "Next", value: "Confirm scope and access." },
          { label: "Safe", value: "Every change is reviewed before launch." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Fix Me</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Your scoped fix intake is open.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            We confirm the store, scope, and access before anything launches.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{packet?.store_url || store || "We will confirm this during intake."}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Current status</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {packet ? "Intake open" : "Scope confirmation is next."}
              </p>
            </div>
          </div>
        </section>

        <section className="px-1 py-2 md:px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Next</p>
          <div className="mt-6 grid gap-x-8 gap-y-5 border-y border-slate-800/70 py-5 md:grid-cols-3">
            {[
              packet?.merchant_next_action || "Confirm store and scope",
              "Confirm approval contact",
              "Approve before launch",
            ].map((step, index) => (
              <div key={step}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Safeguards
          </summary>
          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">What we may need</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Shopify collaborator access, theme access, or approval contact confirmation if needed.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Review before launch</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Visible changes are reviewed before launch. The original state stays protected.
            </p>
          </div>
          </div>
        </details>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Next</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Check fix status.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            See where your storefront review stands.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={packet ? packetHref("/fix-status", packet) : "/shopifixer"}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {packet ? "View Status" : "Back to ShopiFixer"}
            </Link>
            <Link
              href={pricingHref}
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
