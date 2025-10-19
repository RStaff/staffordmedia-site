import Link from "next/link";

const raw = (name: string, def: string) =>
  (process.env[name] ?? def).toString().trim();

const SHOW_ENV = raw("NEXT_PUBLIC_SHOW_ABANDO", "1") !== "0";
const ABANDO_URL = raw("NEXT_PUBLIC_ABANDO_URL", "/abando");

const HEADLINE = raw("NEXT_PUBLIC_ABANDO_HEADLINE", "Abando — see it in action");
const SUBHEAD  = raw(
  "NEXT_PUBLIC_ABANDO_SUBHEAD",
  "Rapid message tests, quick UX wins, and measurable lift. We iterate weekly so you see results fast."
);
const BULLETS  = raw(
  "NEXT_PUBLIC_ABANDO_BULLETS",
  "Find message–market fit faster,Fix leaks in your funnel,Ship changes every week"
)
  .split(",")
  .map(s => s.trim())
  .filter(Boolean)
  .slice(0, 5);

const PRIMARY_LABEL   = raw("NEXT_PUBLIC_ABANDO_PRIMARY_LABEL", "See Abando in action");
const SECONDARY_LABEL = raw("NEXT_PUBLIC_ABANDO_SECONDARY_LABEL", "Talk to us");

/** Tailwind presence heuristic — if Tailwind didn't compile, fall back to inline styles. */
function hasTailwind() {
  // Next/TW adds __next_css__ link and classnames; heuristic check:
  if (typeof document === "undefined") return true; // SSR: assume yes, we still render semantic HTML
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  return links.some(l => (l as HTMLLinkElement).href.includes("/_next/static/css/"));
}

export default function HomeAbandoSection() {
  // URL flag to hide without redeploy
  const urlHide =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("hide_abando") === "1";

  if (!SHOW_ENV || urlHide) return null;

  const noTw = typeof window !== "undefined" && !hasTailwind();

  const boxStyle: React.CSSProperties = noTw
    ? {
        marginTop: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: 16,
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        background: "#fff",
      }
    : {};

  const chipStyle: React.CSSProperties = noTw
    ? { border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px", fontSize: 14 }
    : {};

  const ctaStylePrimary: React.CSSProperties = noTw
    ? { background: "#000", color: "#fff", borderRadius: 8, padding: "10px 16px", display: "inline-block", textDecoration: "none" }
    : {};
  const ctaStyleSecondary: React.CSSProperties = noTw
    ? { border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", display: "inline-block", textDecoration: "none", color: "#111" }
    : {};

  return (
    <section
      aria-labelledby="abando-heading"
      data-section="abando-teaser"
      style={boxStyle}
      className={noTw ? undefined : "mt-16 rounded-2xl border p-6 shadow-card bg-white"}
    >
      <div className={noTw ? undefined : "flex items-center gap-3"}>
        <picture>
          <source srcSet="/logos/abando.png" type="image/png" />
          <img
            src="/logos/abando.svg"
            alt="Abando"
            className={noTw ? undefined : "h-8 w-auto"}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <h2 id="abando-heading" className={noTw ? undefined : "text-2xl font-semibold"}>
          {HEADLINE}
        </h2>
      </div>

      <p className={noTw ? undefined : "mt-2 text-gray-600"}>
        {SUBHEAD}
      </p>

      <ul className={noTw ? undefined : "mt-4 grid gap-3 sm:grid-cols-3"} aria-label="Highlights">
        {BULLETS.map((b, i) => (
          <li key={i} className={noTw ? undefined : "rounded-lg border p-3 text-sm"} style={noTw ? chipStyle : undefined}>
            {b}
          </li>
        ))}
      </ul>

      <div className={noTw ? undefined : "mt-5 flex flex-wrap gap-3"} style={noTw ? { marginTop: 16 } : undefined}>
        <Link
          href={ABANDO_URL}
          className={noTw ? undefined : "rounded bg-black px-4 py-2 text-white hover:opacity-90"}
          aria-label={PRIMARY_LABEL}
          data-cta="see-abando"
          style={ctaStylePrimary}
        >
          {PRIMARY_LABEL}
        </Link>
        <Link
          href="/contact"
          className={noTw ? undefined : "rounded border px-4 py-2 hover:bg-gray-50"}
          aria-label={SECONDARY_LABEL}
          data-cta="talk-to-us"
          style={ctaStyleSecondary}
        >
          {SECONDARY_LABEL}
        </Link>
      </div>

      {/* No-JS fallback to the primary CTA */}
      <noscript>
        <div style={{ marginTop: 8 }}>
          <a href={ABANDO_URL} style={{ textDecoration: "underline" }}>{PRIMARY_LABEL}</a>
        </div>
      </noscript>
    </section>
  );
}
