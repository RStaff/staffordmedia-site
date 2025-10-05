import Link from "next/link";
export default function ConsultingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border p-8 bg-white">
        <div className="text-sm uppercase tracking-wider text-zinc-500">
          Optional Add-On
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
          AI Automation Consulting
        </h2>
        <p className="mt-2 text-zinc-600 max-w-2xl">
          Strategy & implementation to integrate automation where it moves the
          needle most— audits, playbooks, and KPI plans to validate ROI quickly.
        </p>
        <div className="mt-5">
          <Link
            href="/services"
            className="rounded-xl border px-4 py-2 text-sm font-medium"
          >
            Explore Consulting
          </Link>
        </div>
      </div>
    </section>
  );
}
