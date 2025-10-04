export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        AI Automation Consulting
      </h1>
      <p className="mt-4 text-zinc-700 max-w-3xl">
        We help you identify the highest-leverage workflows, design sensible
        automations, and build KPI plans that validate ROI quickly. Perfect as
        an add-on to Abando.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Kickstart (2–4 weeks)",
            d: "Audit, quick wins, playbooks, KPI plan.",
          },
          {
            t: "Scale (Quarterly)",
            d: "Roadmap, experiments, team enablement.",
          },
          { t: "Custom", d: "Tailored engagement for complex stacks." },
        ].map((p) => (
          <div key={p.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{p.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a
          href="/contact"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          Book a consult
        </a>
      </div>
    </div>
  );
}
