import Image from "next/image";
import Link from "next/link";

export default function AbandoPage() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 text-sm text-brand-gray">
        <Image src="/abando-logo.png" alt="Abando" width={22} height={22} />
        <span>Abando™</span>
      </div>

      <h1 className="mt-3 text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
        Recover more checkouts with your <span className="text-brand-accent">AI Shopping Copilot</span>.
      </h1>

      <p className="mt-4 text-lg text-brand-gray max-w-2xl">
        Abando answers questions, handles objections, and guides buyers through checkout—
        so abandonment turns into orders.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/start" className="btn-primary">Start Free Trial</Link>
        <Link href="/demo" className="btn-ghost">Try the Demo</Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <h3 className="font-semibold mb-2">Why it converts</h3>
          <ul className="list-disc ml-6 space-y-1 text-brand-gray">
            <li>Answers that convert (shipping, sizing, returns).</li>
            <li>Guided checkout with minimal friction.</li>
            <li>Proven playbooks (discount, urgency, FAQ).</li>
            <li>Analytics that show recovered revenue.</li>
          </ul>
        </section>
        <section className="card p-6">
          <h3 className="font-semibold mb-2">Channels</h3>
          <ul className="list-disc ml-6 space-y-1 text-brand-gray">
            <li>Email, SMS, WhatsApp, push — wherever customers are.</li>
            <li>Installs with no redesigns, no downtime.</li>
            <li>Measurable ROI in <strong>4 days</strong>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
