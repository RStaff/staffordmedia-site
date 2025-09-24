import React from 'react';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/smc-logo.svg" alt="Stafford Media Consulting" className="h-8 w-auto"/>
          <span className="sr-only">Stafford Media Consulting</span>
        </div>
        <nav className="flex gap-6 text-white/90">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/abando">Abando</a>
          <a href="/book" className="btn-secondary">Book a Strategy Call</a>
        </nav>
      </header>

      <section className="mt-12 grid gap-10 lg:grid-cols-2 items-center min-h-hero">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
            Unlock 4× ROI in 4 days—<br/>no redesigns, no downtime.
          </h1>
          <p className="mt-4 text-lg text-white/80">Try Abando.ai free: cancel anytime.</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-5 w-5 rounded-sm bg-[#FFE169]" />
            <span className="text-xl font-semibold text-white">Abando.ai</span>
          </div>

          <div className="mt-8 flex gap-4">
            <a href="/start" className="btn-primary">Start Free Trial</a>
            <a href="/demo" className="btn-secondary">See Abando.ai In Action</a>
          </div>
        </div>

        <div className="justify-self-center">
          <img src="/hero-graphic.png" alt="Abando.ai" className="w-[520px] max-w-full"/>
        </div>
      </section>

      <section className="mt-14 flex flex-wrap items-center gap-10 opacity-80">
        <img src="/forbes.svg" alt="Featured in Forbes" className="h-8"/>
        <img src="/techcrunch.svg" alt="Featured in TechCrunch" className="h-8"/>
        <img src="/thetimes.svg" alt="Featured in The Times" className="h-8"/>
      </section>
    </div>
  );
}
