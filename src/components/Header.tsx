"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/82 backdrop-blur-xl">
      <div
        className="site-shell flex items-center justify-between gap-6"
        style={{ minHeight: "var(--smc-header-height)" }}
      >
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/brand/smc-logo.inline.png"
            alt="Stafford Media Consulting logo"
            width={200}
            height={200}
            priority
            className="h-6 w-auto md:h-11"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-white">Stafford Media Consulting™</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Parent company</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm md:gap-6">
          <Link href="/" className="text-white/80 transition hover:text-white">
            Home
          </Link>
          <Link href="/shopifixer" className="text-white/80 transition hover:text-white">
            ShopiFixer
          </Link>
          <Link href="/abando" className="text-white/80 transition hover:text-white">
            Abando
          </Link>
          <Link href="/services" className="text-white/80 transition hover:text-white">
            Services
          </Link>
          <Link href="/contact" className="smc-button smc-button-secondary hidden md:inline-flex">
            Book Strategy Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
