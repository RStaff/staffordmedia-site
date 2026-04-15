"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(5,10,18,0.82)]">
      <div className="site-shell py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <Image src="/smc-logo.png" alt="Stafford Media Consulting" width={160} height={48} className="h-10 w-auto" />
              <div>
                <p className="text-sm font-semibold text-white">Stafford Media Consulting™</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Parent company</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Stafford Media Consulting helps ecommerce brands diagnose the clearest issue first, then scale recovery with the right system.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/shopifixer" className="smc-button smc-button-primary">
              Run ShopiFixer Audit
            </Link>
            <Link href="/contact" className="smc-button smc-button-secondary">
              Book Strategy Call
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
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
