"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(5,10,18,0.72)]">
      <div className="site-shell py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <Image
                src="/brand/smc-logo.inline.png"
                alt="Stafford Media Consulting"
                width={160}
                height={48}
                className="h-9 w-auto opacity-90"
              />
              <div>
                <p className="text-sm font-semibold text-white">Stafford Media Consulting™</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Parent company</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Stafford Media Consulting helps ecommerce brands diagnose the clearest issue first, then scale recovery with the right system.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/shopifixer" className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/15">
              Run ShopiFixer Audit
            </Link>
            <Link href="/contact" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:text-white">
              Book Strategy Call
            </Link>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/8 pt-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Stafford Media Consulting. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/services" className="transition hover:text-white">
              Services
            </Link>
            <Link href="/shopifixer" className="transition hover:text-white">
              ShopiFixer
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
