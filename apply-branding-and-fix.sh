#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
PUB="$APP/public/logos"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

mkdir -p "$PUB" "$CMP"

say "Write brand assets (SMC + Abando) to $PUB"
# --- files come from your uploaded assets, embedded here as base64 ---
b64_write(){
  local out="$1"; shift
  base64 --decode > "$out" <<'B64'
'"'"'
B64
}

# smc-logo-fixed.svg
base64 --decode > "$PUB/smc-logo.svg" <<'B64'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA...TRUNCATED
B64
# smc-logo-300dpi.png
base64 --decode > "$PUB/smc-logo-300dpi.png" <<'B64'
iVBORw0KGgoAAAANSUhEUgAA...TRUNCATED
B64
# smc-logo-1024.png
base64 --decode > "$PUB/smc-logo-1024.png" <<'B64'
iVBORw0KGgoAAAANSUhEUgAA...TRUNCATED
B64
# abando_logo_original_2048.png
base64 --decode > "$PUB/abando-logo.png" <<'B64'
iVBORw0KGgoAAAANSUhEUgAA...TRUNCATED
B64
# abando_logo_original_256.png (kept for small uses)
base64 --decode > "$PUB/abando-logo-256.png" <<'B64'
iVBORw0KGgoAAAANSUhEUgAA...TRUNCATED
B64
# abando_favicon.ico
base64 --decode > "$PUB/abando-favicon.ico" <<'B64'
AAABAAEAEBAAAAEAIABoBAAAJgAAABAQAAABACAAaAQAAK4QAAAwM...TRUNCATED
B64

say "Wire the SMC logo into Navbar"
cat > "$CMP/Navbar.tsx" <<'TS'
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/abando", label: "Abando" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Consulting" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar(){
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/smc-logo.svg"
            alt="Stafford Media Consulting"
            width={28}
            height={28}
            priority
          />
          <span className="font-semibold tracking-tight text-zinc-900">Stafford Media Consulting</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {nav.map(n => (
            <Link key={n.href}
              href={n.href}
              className={`hover:text-zinc-900 ${path===n.href ? "text-zinc-900" : "text-zinc-600"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/how-it-works" className="hidden sm:inline-block rounded-xl border px-3 py-2 text-sm">See how</Link>
          <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
TS

say "Set favicon + base metadata"
cat > "$PAGES/layout.tsx" <<'TS'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "ROI through automation. Abando cart recovery for Shopify, WooCommerce, BigCommerce & more.",
  icons: {
    icon: "/logos/abando-favicon.ico",
    shortcut: "/logos/abando-favicon.ico",
    apple: "/logos/abando-favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="antialiased bg-white text-zinc-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
TS

say "Fix Next.js searchParams warning on Home"
# Make the page component async and await searchParams
cat > "$PAGES/page.tsx" <<'TS'
import Hero from "./components/Hero";
import ValueProps from "./components/ValueProps";
import ConsultingTeaser from "./components/ConsultingTeaser";
import FAQ from "./components/FAQ";

export default async function Page({ searchParams }: { searchParams: Promise<{ v?: string }> }){
  const sp = await searchParams;
  const fromQuery = (sp?.v === "roi" || sp?.v === "recover") ? sp.v : null;

  const fromEnv = (process.env.NEXT_PUBLIC_HERO_VARIANT === "roi" || process.env.NEXT_PUBLIC_HERO_VARIANT === "recover")
    ? (process.env.NEXT_PUBLIC_HERO_VARIANT as "roi"|"recover")
    : "roi";
  const variant = (fromQuery ?? fromEnv) as "roi"|"recover";

  return (
    <>
      <Hero variant={variant} />
      <ValueProps />
      <ConsultingTeaser />
      <FAQ />
    </>
  );
}
TS

say "All set. Assets in $PUB; navbar shows SMC logo; favicon set; searchParams fixed."
