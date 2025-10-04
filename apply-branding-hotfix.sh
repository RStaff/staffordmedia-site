#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

mkdir -p "$CMP" "$PAGES"

# 1) Brand marks (inline SVG React components)
say "Write Brand.tsx (SMC + Abando inline SVG marks)"
cat > "$CMP/Brand.tsx" <<'TS'
import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export function SMCMark({ size=24, ...rest }: Props){
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" {...rest}>
      {/* 2x2 grid mark: purple, navy, gold + light grey */}
      <rect x="6" y="6" width="36" height="36" rx="4" fill="#B0B6BF"/>
      <rect x="54" y="6" width="36" height="36" rx="4" fill="#8E32C6"/>
      <rect x="6" y="54" width="36" height="18" rx="4" fill="#0E2B57"/>
      <rect x="54" y="48" width="36" height="36" rx="4" fill="#B0B6BF"/>
      <rect x="6" y="78" width="36" height="12" rx="4" fill="#F2C23A"/>
    </svg>
  );
}

export function AbandoMark({ size=18, ...rest }: Props){
  // cart + swirl "a" mark
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" {...rest}>
      <g fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22h28" stroke="#1D67E0"/>
        <path d="M22 22l10 36h42" stroke="#1D67E0"/>
        <circle cx="38" cy="78" r="6" fill="#1D67E0"/>
        <circle cx="70" cy="78" r="6" fill="#1D67E0"/>
        <path d="M66 44c0 8.836-7.164 16-16 16s-16-7.164-16-16 7.164-16 16-16" stroke="#1AA581"/>
        <circle cx="52" cy="44" r="6" fill="#1AA581"/>
        <circle cx="72" cy="36" r="6" fill="#1AA581"/>
      </g>
    </svg>
  );
}
TS

# 2) Navbar: use SMCMark at a consistent size; keep text brand
say "Patch Navbar.tsx to use SMCMark and correct sizing"
cat > "$CMP/Navbar.tsx" <<'TS'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SMCMark } from "./Brand";

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
          <SMCMark size={20} />
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

# 3) Lock home hero copy to ROI (remove A/B + fix "await searchParams" warning)
say "Update Home page: lock ROI variant, no searchParams usage"
cat > "$PAGES/page.tsx" <<'TS'
import Hero from "./components/Hero";
import ValueProps from "./components/ValueProps";
import ConsultingTeaser from "./components/ConsultingTeaser";
import FAQ from "./components/FAQ";

export const dynamic = "force-static";

export default function Page(){
  return (
    <>
      <Hero variant="roi" />
      <ValueProps />
      <ConsultingTeaser />
      <FAQ />
    </>
  );
}
TS

# 4) Eyebrow: add Abando logo before "ABANDO — works with …" on both Home Hero and /abando
say "Patch Hero.tsx to show AbandoMark in the eyebrow"
cat > "$CMP/Hero.tsx" <<'TS'
import Link from "next/link";
import { AbandoMark } from "./Brand";

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
            <AbandoMark size={14} />
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

# 5) Abando page eyebrow also gets the logo
ABP="$PAGES/abando/page.tsx"
if [ -f "$ABP" ]; then
  say "Patch /abando eyebrow to include AbandoMark"
  cat > "$ABP" <<'TS'
import Link from "next/link";
import { AbandoMark } from "../../components/Brand";

export default function AbandoPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
        <AbandoMark size={14} />
        <span>Abando — cart recovery</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">Unlock ROI Through Automation</h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Abando helps ecommerce teams recover revenue without redesigns or downtime. Set the
        schedule that fits your brand, then jump in live on high-value carts.
      </p>

      <ul className="mt-6 text-sm text-zinc-600 space-y-2">
        <li>• Automated recovery flows on your timetable</li>
        <li>• Jump in live for VIP carts (email/SMS/DM)</li>
        <li>• Proven playbooks: T+30m, T+24h, T+72h</li>
        <li>• Attribution: tie revenue to messages & discounts</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium">Start Free Trial</Link>
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
            <div className="text-xs text-zinc-600 mt-3">Need another platform? <strong>We support custom carts via API/webhooks.</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
TS
else
  say "Skip /abando (file not found) — continuing"
fi

say "Done."
