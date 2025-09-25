import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Services — Stafford Media Consulting™' };

export default function Services() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white">Services</h1>
      <p className="mt-4 text-white/80 max-w-2xl">
        Rapid, measurable growth without redesigns. We implement Abando.ai and complementary automation that
        lifts conversion and LTV in days, not months.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {t:'Abando.ai Implementation', d:'Install, brand voice tuning, channel setup (email/SMS/WhatsApp/push)', c:'4–10 days'},
          {t:'Checkout Objection Playbooks', d:'Price, shipping, trust; real-time responses & testing', c:'3–7 days'},
          {t:'Lifecycle Automation', d:'Browse/cart/checkout flows + post-purchase up-sell', c:'1–2 weeks'},
          {t:'Attribution & Reporting', d:'Credible lift measurement (holdouts, incrementality)', c:'1 week'},
          {t:'Creative & Copy', d:'On-brand prompts, tone libraries, and message variants', c:'ongoing'},
          {t:'Team Enablement', d:'Playbooks, SOPs, and dashboards your team can own', c:'ongoing'},
        ].map((s,i)=>(
          <div key={i} className="rounded-2xl bg-white/5 px-6 py-6">
            <h3 className="text-white font-semibold">{s.t}</h3>
            <p className="text-white/80 mt-2">{s.d}</p>
            <p className="text-white/60 mt-3 text-sm">Typical timeline: {s.c}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/contact" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-white/90 text-white hover:bg-white/5">
          Book a Strategy Call
        </Link>
      </div>
    </main>
  );
}
