"use client";

import { useEffect, useState } from "react";

/**
 * Minimal, SSR-safe theme toggle:
 * - No event params in handlers (fixes @typescript-eslint/no-unused-vars).
 * - Persists to localStorage.
 * - Updates <html data-theme="..."> for CSS/tokens.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
    }
    try {
      const t = localStorage.getItem("theme");
      if (t === "dark" || t === "light") return t;
    } catch {}
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center rounded-xl border px-3 py-2 text-xs font-medium"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
