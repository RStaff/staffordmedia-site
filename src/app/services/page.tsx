import React from "react";
import Link from "next/link";

export const metadata = { title: "Services - Stafford Media Consulting" };

export default function Services() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Stafford Media Consulting</p>
      <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">AI automation and business technology</h1>
      <p className="mt-4 max-w-2xl text-white/80">
        We help businesses understand where work gets stuck, then decide what is worth improving with software, AI, and better systems.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white">What are you trying to improve?</h2>
        <p className="mt-2 max-w-2xl text-white/70">Start with the business problem. The right next step depends on how your work is actually done today.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Home Services", "Professional Services", "Automotive / Field Services", "E-commerce", "Other"].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200">{item}</div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {t:"AI & Workflow Automation", d:"Explore repeatable work, follow-up, and handoffs that may be improved with appropriate automation."},
          {t:"Systems Integration", d:"Clarify how disconnected tools and processes affect the way information moves through the business."},
          {t:"Custom Business Applications", d:"Discuss a focused application or internal workflow when an off-the-shelf path is not enough."},
          {t:"Business Analytics & Reporting", d:"Make recurring reporting easier to understand and less dependent on manual preparation."},
          {t:"E-commerce Automation", d:"Apply the same problem-first approach to storefront, customer, and commerce workflows."},
          {t:"Human Review and Planning", d:"Define the problem, scope the work, and decide on a practical next step before implementation."},
        ].map((s,i)=>(
          <div key={i} className="rounded-2xl bg-white/5 px-6 py-6">
            <h3 className="text-white font-semibold">{s.t}</h3>
            <p className="text-white/80 mt-2">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/contact" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-white/90 text-white hover:bg-white/5">
          Automate My Business
        </Link>
      </div>
    </main>
  );
}
