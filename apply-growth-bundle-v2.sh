#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

[ -d "$APP" ] || { echo "❌ Run this from the repo root (apps/website not found)"; exit 1; }

mkdir -p "$CMP" "$PAGES/install/shopify" "$PAGES/install/woocommerce" "$PAGES/install/bigcommerce" "$PAGES/install/magento" "$PAGES/install/custom" "$PAGES/thanks"

# ------------------------------------------------------------------------------
# 0) Brand marks (inline SVG) — guarantees imports never 404
# ------------------------------------------------------------------------------
say "Write components/Brand.tsx (inline SMC + Abando marks)"
cat > "$CMP/Brand.tsx" <<'TS'
export function AbandoMark({ className = "h-5 w-5" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 18h32l6 18H16z"/>
        <circle cx="24" cy="52" r="4" fill="currentColor"/>
        <circle cx="42" cy="52" r="4" fill="currentColor"/>
      </g>
      <circle cx="40" cy="26" r="10" fill="#23A094"/>
      <circle cx="40" cy="26" r="4" fill="#fff"/>
    </svg>
  );
}
export function SMCMark({ className = "h-5 w-5" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" role="img">
      <rect x="6"  y="6"  width="22" height="22" fill="#B0B6BE"/>
      <rect x="36" y="6"  width="22" height="22" fill="#8E2DE2"/>
      <rect x="6"  y="36" width="22" height="10" fill="#0D2A57"/>
      <rect x="36" y="30" width="22" height="22" fill="#B0B6BE"/>
      <rect x="6"  y="50" width="22" height="8"  fill="#F3C23C"/>
    </svg>
  );
}
TS

# ------------------------------------------------------------------------------
# 1) Tiny tracking helper + dataLayer bootstrap
# ------------------------------------------------------------------------------
say "Add lightweight CTA tracking helper"
cat > "$CMP/Track.tsx" <<'TS'
"use client";
export function track(event: string, detail: Record<string, any> = {}){
  try{
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event, ...detail, ts: Date.now() });
    if (process.env.NODE_ENV !== "production") console.log("[track]", event, detail);
  }catch(e){ console.log("[track:fail]", event, detail, e); }
}
TS

LAYOUT="$PAGES/layout.tsx"
if [ -f "$LAYOUT" ]; then
  say "Patch layout: OG/Twitter metadata + dataLayer bootstrap"
  cp "$LAYOUT" "$LAYOUT.bak.$(date +%Y%m%d-%H%M%S)"

  # Ensure metadata exists + sensible defaults (idempotent)
  perl -0777 -pe '
    if (/export const metadata/s){
      s/export const metadata[\s\S]*?=\s*\{[\s\S]*?\};/export const metadata = {
  title: "Stafford Media Consulting",
  description: "ROI through automation. Abando helps ecommerce teams recover revenue fast.",
  openGraph: { title: "Stafford Media Consulting — ROI through automation", description: "Abando cart recovery + AI automation consulting.", url: "https:\/\/staffordmedia.ai", siteName: "Stafford Media Consulting", type: "website" },
  twitter:   { card: "summary_large_image", title: "Stafford Media Consulting — ROI through automation", description: "Abando cart recovery + AI automation consulting." },
  icons: { shortcut: "/favicon.ico" }
};/s;
    } else {
      $_ = "export const metadata = {\n  title: \\"Stafford Media Consulting\\",\n  description: \\"ROI through automation. Abando helps ecommerce teams recover revenue fast.\\"\n};\n\n$_";
    }
  ' -i "$LAYOUT"

  # Inject dataLayer bootstrap after <body> (only once)
  perl -0777 -pe '
    s/<body([^>]*)>/(<body$1>\n  <script dangerouslySetInnerHTML={{__html: "(function(){window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:\\x27boot\\x27, ts: Date.now()});})();"}} \/>)/s unless $_ =~ /window\.dataLayer/;
  ' -i "$LAYOUT"
fi

# ------------------------------------------------------------------------------
# 2) Install pages (/install/*) — each routes to /signup?platform=…
# ------------------------------------------------------------------------------
say "Create /install/* pages"
create_install_page () {
  local DIR="$PAGES/install/$1"
  local NAME="$2"
  local SUB="$3"
  local QS="$4"
  cat > "$DIR/page.tsx" <<TS
import Link from "next/link";
import { track } from "../../components/Track";

export default function Page(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Install on ${NAME}</h1>
      <p className="mt-3 text-zinc-700 max-w-3xl">${SUB}</p>
      <ol className="mt-8 space-y-3 text-zinc-700">
        <li><strong>1)</strong> Start your free trial.</li>
        <li><strong>2)</strong> Connect ${NAME} and authorize.</li>
        <li><strong>3)</strong> Pick timing windows (T+30m, T+24h, T+72h), go live.</li>
      </ol>
      <div className="mt-8 flex gap-3">
        <Link
          href={"/signup?platform=${QS}"}
          onClick={() => track("cta", { target: "install_start_trial", platform: "${QS}" })}
          className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium"
        >
          Start Free Trial on ${NAME}
        </Link>
        <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">
          See How It Works
        </Link>
      </div>
    </div>
  );
}
TS
}
create_install_page "shopify" "Shopify" "One-click app install; no redesigns." "shopify"
create_install_page "woocommerce" "WooCommerce" "Install the plugin and connect your store." "woocommerce"
create_install_page "bigcommerce" "BigCommerce" "Use the Storefront API to enable recovery flows." "bigcommerce"
create_install_page "magento" "Magento" "Connect via events + webhooks for recovery + attribution." "magento"
create_install_page "custom" "Custom carts" "We support REST/GraphQL via webhooks + API." "custom"

# ------------------------------------------------------------------------------
# 3) /signup — FIX: preserve platform even if user doesn’t touch the select
# ------------------------------------------------------------------------------
say "Write /signup with platform-safe form handling"
mkdir -p "$PAGES/signup"
cat > "$PAGES/signup/page.tsx" <<'TS'
import { redirect } from "next/navigation";

export default function SignupPage({ searchParams }: { searchParams?: { platform?: string } }){
  async function action(formData: FormData){
    "use server";
    const payload = {
      name: (formData.get("name") || "").toString(),
      email: (formData.get("email") || "").toString(),
      store: (formData.get("store") || "").toString(),
      platform: (formData.get("platform") || "").toString(),
    };
    console.log("ABANDO_SIGNUP", payload);
    redirect("/thanks");
  }

  const platform = (searchParams?.platform || "").toString();
  const hasLockedPlatform = !!platform;

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

        {hasLockedPlatform ? (
          <>
            <input type="hidden" name="platform" value={platform} />
            <input disabled value={platform} className="border rounded-xl px-4 py-3 text-zinc-600" />
          </>
        ) : (
          <select name="platform" className="border rounded-xl px-4 py-3" defaultValue="">
            <option value="">Platform</option>
            <option>Shopify</option>
            <option>WooCommerce</option>
            <option>BigCommerce</option>
            <option>Magento</option>
            <option>Custom / Other</option>
          </select>
        )}

        <button className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium w-fit">Create my trial</button>
      </form>

      <p className="mt-4 text-xs text-zinc-500">No long-term commitment. We’ll email onboarding steps.</p>
    </div>
  );
}
TS

# ------------------------------------------------------------------------------
# 4) /thanks — simple confirmation with nav back to Abando
# ------------------------------------------------------------------------------
say "Create /thanks"
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

# ------------------------------------------------------------------------------
# 5) /abando — quick-install buttons + eyebrow logo (correct Brand import depth)
# ------------------------------------------------------------------------------
say "Write /abando with quick-install buttons and eyebrow logo"
mkdir -p "$PAGES/abando"
cat > "$PAGES/abando/page.tsx" <<'TS'
import Link from "next/link";
import { track } from "../components/Track";
import { AbandoMark } from "../components/Brand";

export default function AbandoPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
        <AbandoMark className="h-4 w-4" />
        <span>Abando — Works with Shopify, WooCommerce, BigCommerce, Magento & more</span>
      </div>

      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Unlock ROI Through Automation</h1>
      <p className="mt-3 text-zinc-700 max-w-3xl">
        Abando helps ecommerce teams recover revenue without redesigns or downtime.
        Set the schedule that fits your brand, then jump in live on high-value carts.
      </p>

      <ul className="mt-6 text-zinc-700 space-y-2">
        <li>• Automated recovery flows on your timetable</li>
        <li>• Jump in live for VIP carts (email/SMS/DM)</li>
        <li>• Proven playbooks: T+30m, T+24h, T+72h</li>
        <li>• Attribution: tie revenue to messages & discounts</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <Link
          href="/signup"
          onClick={() => track("cta", { target: "start_free_trial", source: "abando_hero" })}
          className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium"
        >
          Start Free Trial
        </Link>
        <Link href="/how-it-works" className="rounded-xl border px-5 py-3 text-sm font-medium">See How It Works</Link>
      </div>

      <div className="mt-10 rounded-2xl border p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "Shopify", sub: "One-click app install", href: "/install/shopify", key: "shopify" },
            { name: "WooCommerce", sub: "Plugin + API", href: "/install/woocommerce", key: "woocommerce" },
            { name: "BigCommerce", sub: "Storefront API", href: "/install/bigcommerce", key: "bigcommerce" },
            { name: "Magento", sub: "Events + webhooks", href: "/install/magento", key: "magento" },
          ].map(i => (
            <Link key={i.key} href={i.href}
              onClick={() => track("cta", { target: "install_card", platform: i.key })}
              className="rounded-xl border p-4 hover:bg-zinc-50 transition-colors">
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-zinc-500">{i.sub}</div>
            </Link>
          ))}
          <Link href="/install/custom"
            onClick={() => track("cta", { target: "install_card", platform: "custom" })}
            className="md:col-span-2 rounded-xl border p-4 hover:bg-zinc-50 transition-colors">
            <div className="font-medium">Custom carts</div>
            <div className="text-xs text-zinc-500">REST/GraphQL via webhooks</div>
            <div className="text-xs text-zinc-600 mt-3">
              Need another platform? <strong>We support custom carts via API/webhooks.</strong>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
TS

# ------------------------------------------------------------------------------
# 6) Basic SEO: robots.txt + sitemap.xml routes
# ------------------------------------------------------------------------------
say "Add robots.txt and sitemap.xml"
mkdir -p "$PAGES/(robots.txt)"
cat > "$PAGES/(robots.txt)/route.ts" <<'TS'
import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET(){
  const body = `User-agent: *
Allow: /

Sitemap: https://staffordmedia.ai/sitemap.xml
`;
  return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
}
TS

mkdir -p "$PAGES/sitemap.xml"
cat > "$PAGES/sitemap.xml/route.ts" <<'TS'
import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET(){
  const base = "https://staffordmedia.ai";
  const urls = ["","abando","how-it-works","services","contact","install/shopify","install/woocommerce","install/bigcommerce","install/magento","install/custom"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(p=>`<url><loc>${base}/${p}</loc></url>`).join("")}
</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
TS

# ------------------------------------------------------------------------------
# 7) Navbar — ensure SMC mark + external brand link
# ------------------------------------------------------------------------------
NAV="$CMP/Navbar.tsx"
if [ -f "$NAV" ]; then
  say "Normalize Navbar brand (icon + external link)"
  cp "$NAV" "$NAV.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe '
    s/import Link from "next\/link";/import Link from "next\/link";\nimport { SMCMark } from ".\/Brand";/s if /import Link/;
    s/<Link href="\/"[^>]*>[\s\S]*?<\/Link>/<Link href="https:\/\/staffordmedia.ai" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900" target="_blank" rel="noopener noreferrer"><SMCMark className="h-5 w-5" \/><span>Stafford Media Consulting<\/span><\/Link>/s;
  ' -i "$NAV"
fi

# ------------------------------------------------------------------------------
# 8) Home page — remove sync searchParams usage (Next 15 warning) and lock variant
# ------------------------------------------------------------------------------
HOME="$PAGES/page.tsx"
if [ -f "$HOME" ]; then
  say "Ensure Home page doesn’t use sync dynamic APIs"
  cp "$HOME" "$HOME.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe '
    s/export default function Page\(\{\s*searchParams[^}]*\}:[^)]*\)\s*\{/export default function Page(){/s;
    s/const\s+fromQuery[^;]*;//s;
    s/const\s+variant\s*=\s*[^;]*;/const variant = "roi";/s;
  ' -i "$HOME"
fi

say "Done. Restart your dev server."
