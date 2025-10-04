#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

# -----------------------------------------------------------------------------
# 0) Sanity checks (files/folders we will touch should exist)
# -----------------------------------------------------------------------------
[ -d "$APP" ] || { echo "❌ $APP not found. Run from repo root."; exit 1; }
[ -d "$CMP" ] || mkdir -p "$CMP"
[ -d "$PAGES" ] || mkdir -p "$PAGES"

# -----------------------------------------------------------------------------
# 1) Fix Next 15 'searchParams should be awaited' error on Home page
# -----------------------------------------------------------------------------
say "Fix Home page searchParams (await)"
HP="$PAGES/page.tsx"
if [ -f "$HP" ]; then
  cp "$HP" "$HP.bak.$(date +%Y%m%d-%H%M%S)"
  cat > "$HP" <<'TS'
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
else
  echo "ℹ️  Home page not found at $HP—skipping."
fi

# -----------------------------------------------------------------------------
# 2) Navbar: add SMC logo at left, keep name
# -----------------------------------------------------------------------------
say "Update Navbar with SMC logo"
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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/smc-logo.svg"
            alt="Stafford Media Consulting"
            width={20}
            height={20}
            priority
          />
          <span className="font-semibold tracking-tight text-zinc-900">Stafford Media Consulting</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {nav.map(n => (
            <Link
              key={n.href}
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

# -----------------------------------------------------------------------------
# 3) Hero: add tiny Abando logo in the eyebrow next to “Abando — works with…”
# -----------------------------------------------------------------------------
say "Update Hero to show small Abando logo in eyebrow"
cat > "$CMP/Hero.tsx" <<'TS'
import Link from "next/link";
import Image from "next/image";

type Variant = "roi" | "recover";
function headline(v: Variant){
  if (v === "roi") return "4× ROI in 4 Weeks — Automated";
  return "Recover More Revenue. ROI Through Automation.";
}
function subhead(){
  return "Automated cart recovery on your schedule — with the option to jump in live anytime.";
}

export default function Hero({ variant }: { variant: Variant }){
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
            <Image
              src="/logos/abando-logo.png"
              alt="Abando"
              width={16}
              height={16}
              className="rounded-sm"
              priority
            />
            <span>Abando — works with Shopify, WooCommerce, BigCommerce, Magento & more</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950">
            {headline(variant)}
          </h1>
          <p className="mt-4 text-zinc-600 max-w-xl">{subhead()}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-black">Get Started</Link>
            <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
          </div>

          <div className="mt-6 p-3 rounded-lg border text-xs text-zinc-600">
            <strong className="text-zinc-900">Manual messages, anytime.</strong> Automations do the heavy lifting; step in live on high-value carts across email/SMS/DM right from your dashboard.
          </div>

          <div className="mt-4 text-xs text-zinc-500">
            A/B headline: <Link href="/?v=roi" className="underline">ROI</Link> · <Link href="/?v=recover" className="underline">Recover</Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="text-sm text-zinc-900 font-medium">Projected Revenue Recovered</div>
          <div className="mt-2 h-36 rounded-xl bg-zinc-50 border grid place-items-center text-zinc-400">Chart placeholder</div>
          <ul className="mt-4 text-sm text-zinc-600 space-y-1">
            <li>• Automated outreach windows</li>
            <li>• Manual override on VIP carts</li>
            <li>• Clear attribution & ROI</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
TS

# -----------------------------------------------------------------------------
# 4) Abando landing page: add logo above headline (small) for consistency
# -----------------------------------------------------------------------------
say "Update /abando page to include the logo in eyebrow"
AB="$PAGES/abando/page.tsx"
if [ -f "$AB" ]; then
  cp "$AB" "$AB.bak.$(date +%Y%m%d-%H%M%S)"
  cat > "$AB" <<'TS'
import Link from "next/link";
import Image from "next/image";

export default function Abando(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
        <Image src="/logos/abando-logo.png" alt="Abando" width={16} height={16} className="rounded-sm" priority />
        <span>Abando — Cart Recovery</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Unlock ROI Through Automation</h1>
      <p className="mt-4 text-zinc-700 max-w-2xl">
        Abando helps ecommerce teams recover revenue without redesigns or downtime. Set the schedule that fits your brand, then jump in live on high-value carts.
      </p>

      <ul className="mt-6 text-sm text-zinc-700 space-y-2">
        <li>• Automated recovery flows on your timetable</li>
        <li>• Jump in live for VIP carts (email/SMS/DM)</li>
        <li>• Proven playbooks: T+30m, T+24h, T+72h</li>
        <li>• Attribution: tie revenue to messages & discounts</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-black">Start Free Trial</Link>
        <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
      </div>

      <div className="mt-10 rounded-2xl border p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4">
            <div className="font-medium">Shopify</div>
            <div className="text-xs text-zinc-500">One-click app install</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">WooCommerce</div>
            <div className="text-xs text-zinc-500">Plugin + API</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">BigCommerce</div>
            <div className="text-xs text-zinc-500">Storefront API</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">Magento</div>
            <div className="text-xs text-zinc-500">Events + webhooks</div>
          </div>
          <div className="md:col-span-2 rounded-xl border p-4">
            <div className="font-medium">Custom carts</div>
            <div className="text-xs text-zinc-500">REST/GraphQL via webhooks</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-zinc-600">
          Need another platform? <span className="font-medium text-zinc-900">We support custom carts via API/webhooks.</span>
        </div>
      </div>
    </div>
  );
}
TS
else
  echo "ℹ️  /abando page not found at $AB—skipping."
fi

# -----------------------------------------------------------------------------
# 5) Layout metadata: wire favicon (optional; safe if file exists)
# -----------------------------------------------------------------------------
say "Ensure favicon metadata points to /logos/abando-favicon.ico (if present)"
LAY="$PAGES/layout.tsx"
if [ -f "$LAY" ]; then
  cp "$LAY" "$LAY.bak.$(date +%Y%m%d-%H%M%S)"
  # rewrite whole file to safely include icons and keep wrapper
  cat > "$LAY" <<'TS'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "ROI through automation. Abando cart recovery + AI consulting add-ons.",
  icons: [{ rel: "icon", url: "/logos/abando-favicon.ico" }],
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
else
  echo "ℹ️  layout not found at $LAY—skipping."
fi

say "All done. Restart your dev server if it was running."
