#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf '%s\n' "$*"; }

mkdir -p "$CMP" "$PAGES/how-it-works" "$PAGES/services" "$PAGES/contact" "$PAGES/abando" "$PAGES/signup" "$PAGES/thanks"

# -------------------------------------------------------------------
# 1) Shared components (Navbar updated to include Abando)
# -------------------------------------------------------------------
say "==> (1/6) Write/overwrite shared components"

# Navbar
cat > "$CMP/Navbar.tsx" <<'TS'
"use client";
import Link from "next/link";
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
        <Link href="/" className="font-semibold tracking-tight text-zinc-900">Stafford Media Consulting</Link>
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

# Hero (tweaked: platform tags + clearer ROI message; still supports A/B headline)
cat > "$CMP/Hero.tsx" <<'TS'
import Link from "next/link";

type Variant = "roi" | "recover";
function headline(v: Variant){
  if (v === "roi") return "ROI Through Automation — Start Seeing Wins Fast";
  return "Recover More Revenue. ROI Through Automation.";
}
function subhead(){
  return "Automated cart recovery on your schedule — and jump in live anytime for VIP carts.";
}

const platforms = ["Shopify","WooCommerce","BigCommerce","Magento","Custom via API"];

export default function Hero({ variant }: { variant: Variant }){
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Abando — Works with {["Shopify","WooCommerce","BigCommerce","Magento"].join(", ")} & more
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

          <div className="mt-4 flex flex-wrap gap-2">
            {platforms.map(p => (
              <span key={p} className="text-xs rounded-full border px-2.5 py-1 text-zinc-600 bg-white">{p}</span>
            ))}
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
    { t: "Automate", d: "Scheduled flows that respect your brand and timing windows." },
    { t: "Intervene", d: "Jump in live when a high-value cart appears—right from your dashboard." },
    { t: "Measure", d: "Clear attribution ties revenue to messages and discounts." },
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

# Consulting teaser
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
          audits, playbooks, and KPI plans to validate ROI quickly.
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

# -------------------------------------------------------------------
# 2) Layout
# -------------------------------------------------------------------
say "==> (2/6) Ensure layout wraps pages with Navbar/Footer"
cat > "$PAGES/layout.tsx" <<'TS'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "ROI through automation. Abando cart recovery for Shopify, WooCommerce, BigCommerce, Magento & more — plus optional consulting.",
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

# -------------------------------------------------------------------
# 3) Home page
# -------------------------------------------------------------------
say "==> (3/6) Home page"
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

# -------------------------------------------------------------------
# 4) Abando product landing page
# -------------------------------------------------------------------
say "==> (4/6) Abando landing page"
cat > "$PAGES/abando/page.tsx" <<'TS'
import Link from "next/link";

export default function Abando(){
  const bullets = [
    "Automated recovery flows on your timetable",
    "Jump in live for VIP carts (email/SMS/DM)",
    "Proven playbooks: T+30m, T+24h, T+72h",
    "Attribution: tie revenue to messages & discounts",
  ];
  const features = [
    {t:"Shopify",d:"One-click app install"},
    {t:"WooCommerce",d:"Plugin + API"},
    {t:"BigCommerce",d:"Storefront API"},
    {t:"Magento",d:"Events + webhooks"},
    {t:"Custom carts",d:"REST/GraphQL via webhooks"},
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Abando — Cart Recovery</div>
          <h1 className="text-4xl font-semibold tracking-tight">Unlock ROI Through Automation</h1>
          <p className="mt-4 text-zinc-700 max-w-2xl">
            Abando helps ecommerce teams recover revenue without redesigns or downtime.
            Set the schedule that fits your brand, then jump in live on high-value carts.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-700">
            {bullets.map((b)=> <li key={b}>• {b}</li>)}
          </ul>
          <div className="mt-8 flex gap-3">
            <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-black">Start Free Trial</Link>
            <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f)=>(
              <div key={f.t} className="rounded-xl border p-4">
                <div className="font-medium text-zinc-900">{f.t}</div>
                <div className="text-sm text-zinc-600">{f.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-zinc-50 border text-sm text-zinc-700">
            Need another platform? <span className="font-medium text-zinc-900">We support custom carts via API/webhooks.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
TS

# -------------------------------------------------------------------
# 5) Signup flow (server action + thanks page)
# -------------------------------------------------------------------
say "==> (5/6) Signup form (server action) + Thanks page"

# Signup page with a lightweight server action redirect
cat > "$PAGES/signup/page.tsx" <<'TS'
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Signup(){
  async function action(formData: FormData){
    "use server";
    // Minimal server-side capture (replace with your email/DB/integration later)
    const payload = {
      name: (formData.get("name") || "").toString(),
      email: (formData.get("email") || "").toString(),
      platform: (formData.get("platform") || "").toString(),
      store: (formData.get("store") || "").toString(),
    };
    console.log("ABANDO_SIGNUP", payload);
    // Pretend to process, then redirect
    redirect("/thanks");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Start Free Trial</h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Tell us a bit about your store so we can set up Abando and enable your recovery flows.
      </p>

      <form action={action} className="mt-8 grid gap-4 max-w-xl">
        <input name="name" required placeholder="Full name" className="border rounded-xl px-4 py-3" />
        <input name="email" required type="email" placeholder="Work email" className="border rounded-xl px-4 py-3" />
        <input name="store" placeholder="Store URL (optional)" className="border rounded-xl px-4 py-3" />
        <select name="platform" className="border rounded-xl px-4 py-3">
          <option value="">Platform</option>
          <option>Shopify</option>
          <option>WooCommerce</option>
          <option>BigCommerce</option>
          <option>Magento</option>
          <option>Custom / Other</option>
        </select>
        <button className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium w-fit">Create my trial</button>
      </form>

      <p className="mt-4 text-xs text-zinc-500">
        No long-term commitment. We’ll email onboarding steps.
      </p>
    </div>
  );
}
TS

# Thank-you page
cat > "$PAGES/thanks/page.tsx" <<'TS'
import Link from "next/link";

export default function Thanks(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">You’re on the list 🎉</h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Thanks for your interest in Abando. We’ll reach out shortly with onboarding steps and a link to activate your flows.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
        <Link href="/abando" className="rounded-xl border px-5 py-3 text-sm font-medium">Back to Abando</Link>
      </div>
    </div>
  );
}
TS

# -------------------------------------------------------------------
# 6) Ensure globals.css has Tailwind (v4) directives
# -------------------------------------------------------------------
say "==> (6/6) Ensure globals.css contains Tailwind directives"
mkdir -p "$APP/app"
if ! grep -q "@tailwind" "$APP/app/globals.css" 2>/dev/null; then
  cat > "$APP/app/globals.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
CSS
fi

say "==> Done. Pages added: /abando, /signup, /thanks (plus updated Home)."
