'use client';

import Link from "next/link";

const ABANDO_URL  = process.env.NEXT_PUBLIC_ABANDO_URL || "/abando";
const HEADLINE    = process.env.NEXT_PUBLIC_ABANDO_HEADLINE || "Abando — see it in action";
const SUBHEAD     = process.env.NEXT_PUBLIC_ABANDO_SUBHEAD || "Rapid message tests, quick UX wins, measurable lift.";
const BULLETS_RAW = process.env.NEXT_PUBLIC_ABANDO_BULLETS || "Find message–market fit faster,Fix leaks in your funnel,Ship changes every week";
const PRIMARY     = process.env.NEXT_PUBLIC_ABANDO_PRIMARY_LABEL || "See Abando in Action";
const SECONDARY   = process.env.NEXT_PUBLIC_ABANDO_SECONDARY_LABEL || "Book a Strategy Call";
const LOGO_URL    = process.env.NEXT_PUBLIC_ABANDO_LOGO || ""; // no wrong fallback
const SHOW_ENV    = process.env.NEXT_PUBLIC_SHOW_ABANDO || "1";

export default function HomeAbandoSection() {
  // allow ?hide_abando=1 to hide per-request
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const hide = params?.get("hide_abando") === "1";
  const show = !hide && SHOW_ENV !== "0";

  if (!show) return null;

  const BULLETS = BULLETS_RAW.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <section aria-labelledby="abando-heading" className="mt-16 rounded-2xl border p-6 shadow-card bg-white">
      <div className="flex items-center gap-3">
        {LOGO_URL ? (
          <img
            src={LOGO_URL}
            alt="Abando"
            className="h-8 w-auto"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : null}
        <h2 id="abando-heading" className="text-2xl font-semibold">{HEADLINE}</h2>
      </div>

      <p className="mt-2 text-gray-600">{SUBHEAD}</p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Highlights">
        {BULLETS.map((b, i) => (
          <li key={i} className="rounded-lg border p-3 text-sm">{b}</li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={ABANDO_URL} className="rounded bg-black px-4 py-2 text-white hover:opacity-90" aria-label={PRIMARY} data-cta="see-abando">
          {PRIMARY}
        </Link>
        <Link href="/contact" className="rounded border px-4 py-2 hover:bg-gray-50" aria-label={SECONDARY} data-cta="talk-to-us">
          {SECONDARY}
        </Link>
      </div>

      <noscript>
        <div style={{ marginTop: 8 }}>
          <a href={ABANDO_URL} style={{ textDecoration: "underline" }}>{PRIMARY}</a>
        </div>
      </noscript>
    </section>
  );
}
