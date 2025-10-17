"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        {/* Brand (logo + wordmark) */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/smc-logo.png"
            alt="Stafford Media Consulting logo"
            className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
            priority
           width={200} height={200} />
          <span className="text-white font-semibold tracking-tight">
            Stafford Media Consulting™
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/" className="text-white/90 hover:underline">Home</Link>
          <Link href="/about" className="text-white/90 hover:underline">About</Link>
          <Link href="/abando" className="text-white/90 hover:underline">Abando</Link>
          <Link
            href="/contact"
            className="text-white font-semibold px-3 py-2 rounded-md hover:bg-white/5"
          >
            Book a Strategy Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
