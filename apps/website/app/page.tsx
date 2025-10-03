// apps/website/app/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Stafford Media – AI Marketing & Automation",
  description:
    "Pragmatic AI + lifecycle messaging that turns traffic into revenue. No redesigns, no downtime.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="space-y-6">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
          A.I. Marketing & Automation Solutions
        </h1>
        <p className="text-lg text-zinc-300 max-w-2xl">
          Convert more without redesigns. We install Abando™, tune your
          lifecycle messaging, and ship outcomes—fast.
        </p>
        <div className="flex gap-3">
          <Link
            href="/services"
            className="rounded-xl px-5 py-3 border border-zinc-600 hover:border-zinc-400"
          >
            See Services
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl px-5 py-3 bg-white text-black hover:opacity-90"
          >
            Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
