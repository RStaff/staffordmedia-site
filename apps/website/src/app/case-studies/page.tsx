import Link from "next/link";

export const metadata = { title: "Case Studies — Stafford Media Consulting™" };

const cases = [
  {
    slug: "abando-lift",
    title: "DTC skincare — +28% recovered carts in 4 days",
    summary:
      "Installed Abando.ai with brand voice tuning and multi-channel follow-ups (email, SMS, WhatsApp). No redesigns. ROI checkpoint day 4.",
    metrics: ["+28% recovered carts", "−19% time-to-checkout", "0 downtime"],
  }
];

export default function CaseStudies() {
  return (
    <div className="container-max py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">Case Studies</h1>
        <p className="text-white/70 max-w-2xl">
          Fast wins, then compounding gains. Here are a few representative outcomes.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {cases.map(cs => (
          <Link key={cs.slug} href={`/case-studies/${cs.slug}`}
                className="rounded-2xl p-6 bg-white/5 ring-1 ring-white/10 hover:bg-white/[.07] transition">
            <h2 className="text-xl font-bold text-white mb-2">{cs.title}</h2>
            <p className="text-white/80">{cs.summary}</p>
            <ul className="mt-3 text-white/70 space-y-1 list-disc pl-5">
              {cs.metrics.map(m => <li key={m}>{m}</li>)}
            </ul>
            <span className="inline-block mt-4 text-sm text-white/80 underline">Read the breakdown →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
