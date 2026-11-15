"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Header() {
  const pathname = usePathname();
  const productsRef = useRef<HTMLDetailsElement>(null);

  function closeProducts() {
    if (productsRef.current) productsRef.current.open = false;
  }

  useEffect(closeProducts, [pathname]);

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
          <Link href="/services" className="text-white/80 transition hover:text-white">
            Services
          </Link>
          <details
            ref={productsRef}
            className="relative text-white/80"
          >
            <summary className="cursor-pointer list-none transition hover:text-white">Products</summary>
            <div className="absolute right-0 top-8 z-10 grid min-w-44 gap-1 rounded-xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
              <Link onClick={closeProducts} href="/staffordnext" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">StaffordNext</Link>
              <Link onClick={closeProducts} href="/shopifixer" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">ShopiFixer</Link>
              <Link onClick={closeProducts} href="/abando" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">Abando.ai</Link>
            </div>
          </details>
          <Link href="/staffordos" className="hidden text-white/80 transition hover:text-white xl:inline">
            How We Work
          </Link>
          <Link href="/automate" className="smc-button smc-button-secondary !hidden md:!inline-flex">
            Automate My Business
          </Link>
        </nav>
      </div>
    </header>
  );
}
