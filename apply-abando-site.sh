#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf '%s\n' "$*"; }

mkdir -p "$CMP" "$PAGES/how-it-works" "$PAGES/services" "$PAGES/contact"

say "==> Write shared components"
# Navbar
cat > "$CMP/Navbar.tsx" <<'TS'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const nav = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Consulting" },
  { href: "/contact", label: "Contact" },
];
export default function Navbar(){
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-zinc-900">
          Stafford Media Consulting
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`hover:text-zinc-900 ${path === n.href ? "text-zinc-900" : "text-zinc-600"}`}
            >
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

# Footer
cat > "$CMP/Footer.tsx" <<'TS'
export default function Footer(){
  return (
    <footer className="border-t border-zinc-200 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p>© {new Date().getFullYear()} Stafford Media Consulting</p>
          <div className="flex gap-4">
            <a className="hover:text-zinc-900" href="/privacy">Privacy</a>
            <a className="hover:text-zinc-900" href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
TS

# Hero with multi-platform + “manual override” callout + A/B headline
cat > "$CMP/Hero.tsx" <<'TS'
import Link from "next/link";

type Variant = "roi" | "recover";
function headline(v: Variant){
  if (v === "roi") return "ROI Through Automation — Start Seeing Wins Fast";
  return "Recover More Revenue with Smart Automation";
}
function subhead(){
  return "Automated cart recovery on your schedule — and jump in live anytime for VIP carts.";
}

export default function Hero({ variant }: { variant: Variant }){
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Abando — Works with Shopify, WooCommerce, BigCommerce, Magento & more
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950">
            {headline(variant)}
          </h1>
          <p className="mt-4 text-zinc-600 max-w-xl">{subhead()}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-black">Get Started</Link>
            <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
          </div>

          <div className="mt-6 p-3 rounded-lg border text-xs text-zinc-600 bg-white/50">
            <strong className="text-zinc-900">Automate by timetable, jump in live anytime.</strong> Set outreach windows; step in manually for high-value carts across email/SMS/DM from your dashboard.
          </div>

          <div className="mt-4 text-xs text-zinc-500">
            A/B headline: <Link href="/?v=roi" className="underline">ROI</Link> · <Link href="/?v=recover" className="underline">Recover</Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="px-2 py-1 rounded-full border">Shopify</span>
            <span className="px-2 py-1 rounded-full border">WooCommerce</span>
            <span className="px-2 py-1 rounded-full border">BigCommerce</span>
            <span className="px-2 py-1 rounded-full border">Magento</span>
            <span className="px-2 py-1 rounded-full border">Custom via API</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="text-sm text-zinc-900 font-medium">Projected Revenue Recovered</div>
          <div className="mt-2 h-36 rounded-xl bg-zinc-50 border grid place-items-center text-zinc-400">Chart placeholder</div>
          <ul className="mt-4 text-sm text-zinc-600 space-y-1">
            <li>• Automated outreach windows</li>
            <li>• Manual override for VIP carts</li>
            <li>• Clear attribution & ROI</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
TS

# Value Props
cat > "$CMP/ValueProps.tsx" <<'TS'
export default function ValueProps(){
  const items = [
    { t: "Automate", d: "Schedule flows (T+30m, T+24h, etc.) that respect your brand and cadence." },
    { t: "Intervene", d: "Jump in live for high-value carts across email/SMS/DM — right from your dashboard." },
    { t: "Measure", d: "Attribution connects recovered revenue to each message and flow." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((i)=>(
          <div key={i.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{i.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
TS

# Consulting teaser (kept as add-on)
cat > "$CMP/ConsultingTeaser.tsx" <<'TS'
import Link from "next/link";
export default function ConsultingTeaser(){
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border p-8 bg-white">
        <div className="text-sm uppercase tracking-wider text-zinc-500">Optional Add-On</div>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">AI Automation Consulting</h2>
        <p className="mt-2 text-zinc-600 max-w-2xl">
          Strategy & implementation to integrate automation where it moves the needle most—
          audits, playbooks, and KPI plans to validate ROI quickly across any stack.
        </p>
        <div className="mt-5">
          <Link href="/services" className="rounded-xl border px-4 py-2 text-sm font-medium">Explore Consulting</Link>
        </div>
      </div>
    </section>
  );
}
TS

# FAQ
cat > "$CMP/FAQ.tsx" <<'TS'
const faqs = [
  { q: "Can I send manual messages?", a: "Yes. Automations run by default, and you can step in anytime for VIP carts to send live messages across channels." },
  { q: "Which platforms are supported?", a: "Shopify, WooCommerce, BigCommerce, Magento, and custom carts via API/webhooks." },
  { q: "How do you measure ROI?", a: "We attribute recovered revenue to flows and manual sends, so you see what works." },
];
export default function FAQ(){
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-zinc-950">Frequently asked questions</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{f.q}</div>
            <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
TS

say "==> Ensure layout wraps pages with Navbar/Footer"
# layout.tsx – wrap with Nav/Footer (create if missing)
cat > "$PAGES/layout.tsx" <<'TS'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "Abando — ROI through automation for Shopify, WooCommerce, BigCommerce, Magento & more.",
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

say "==> Write pages"

# Home page with A/B variant via ?v= or env NEXT_PUBLIC_HERO_VARIANT
cat > "$PAGES/page.tsx" <<'TS'
import Hero from "./components/Hero";
import ValueProps from "./components/ValueProps";
import ConsultingTeaser from "./components/ConsultingTeaser";
import FAQ from "./components/FAQ";

export default function Page({ searchParams }: { searchParams: { v?: string } }){
  const fromQuery = (searchParams?.v === "roi" || searchParams?.v === "recover") ? searchParams.v : null;
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

# How it works (Abando-focused)
cat > "$PAGES/how-it-works/page.tsx" <<'TS'
export default function HowItWorks(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">How Abando Works</h1>
      <ol className="mt-6 space-y-4 text-zinc-700">
        <li><strong>Connect your platform</strong> — Shopify, WooCommerce, BigCommerce, Magento or custom via API.</li>
        <li><strong>Pick timing windows</strong> — e.g., T+30m, T+24h, T+72h.</li>
        <li><strong>Go live</strong> — automations run; you can step in on VIP carts anytime.</li>
        <li><strong>Measure</strong> — attribution ties recovered revenue to messages.</li>
      </ol>
      <div className="mt-8">
        <a href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium">Get Started</a>
      </div>
    </div>
  );
}
TS

# Services (consulting framed as add-on)
cat > "$PAGES/services/page.tsx" <<'TS'
export default function Services(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">AI Automation Consulting</h1>
      <p className="mt-4 text-zinc-700 max-w-3xl">
        We help you identify the highest-leverage workflows, design sensible automations,
        and build KPI plans that validate ROI quickly. Perfect as an add-on to Abando.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          { t: "Kickstart (2–4 weeks)", d: "Audit, quick wins, playbooks, KPI plan." },
          { t: "Scale (Quarterly)", d: "Roadmap, experiments, team enablement." },
          { t: "Custom", d: "Tailored engagement for complex stacks." },
        ].map((p)=>(
          <div key={p.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{p.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">Book a consult</a>
      </div>
    </div>
  );
}
TS

# Contact placeholder
cat > "$PAGES/contact/page.tsx" <<'TS'
export default function Contact(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-zinc-700">Tell us about your store, current stack, and goals.</p>
      <form className="mt-6 grid gap-4 max-w-xl">
        <input name="name" placeholder="Name" className="border rounded-xl px-4 py-3" />
        <input name="email" placeholder="Email" className="border rounded-xl px-4 py-3" />
        <textarea name="msg" placeholder="What would you like to achieve?" className="border rounded-xl px-4 py-3 min-h-32" />
        <button className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium w-fit">Send</button>
      </form>
    </div>
  );
}
TS

say "==> Ensure globals.css has Tailwind (v4) directives"
mkdir -p "$APP/app"
if ! grep -q "@tailwind" "$APP/app/globals.css" 2>/dev/null; then
  cat > "$APP/app/globals.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
CSS
fi

say "==> Done."
