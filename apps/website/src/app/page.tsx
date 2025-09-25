"use client";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-hero flex items-center py-12 lg:py-16">
      <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left column */}
        <div>
          <h1 className="text-white font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl">
            Unlock 4× ROI in 4 days—<br />no redesigns, no downtime.
          </h1>
          <p className="text-white/80 mt-6">Try Abando.ai free: cancel anytime.</p>
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <Image src="/abando-icon.svg" alt="Abando.ai Logo" width={24} height={24} className="h-6 w-6" />
              <span className="text-white font-semibold">
                Abando.ai<span className="align-super text-xs ml-1">™</span>
              </span>
            </div>
            <p className="text-white/80 text-sm mt-3 max-w-lg">
              The AI copilot that recovers carts in your brand’s voice—across email, SMS, WhatsApp &amp; more.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/start" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold" style={{ background: "#FFE169", color: "#0A0F2A" }}>
              Start Free Trial
            </Link>
            <Link href="/demo" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-white/90 text-white hover:bg-white/5">
              See Abando.ai In Action
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="justify-self-center w-full max-w-xl rounded-2xl p-6"
             style={{background:"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                     border:"1px solid rgba(255,255,255,0.06)", boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}>
          <Image src="/hero-abando.svg" alt="Cart with AI ring" width={840} height={560} priority className="w-full h-auto rounded-xl" />
        </div>
      </div>
    </main>
  );
}
