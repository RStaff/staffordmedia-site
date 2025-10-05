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

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <a
          href="https://staffordmedia.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900"
        >
          <SMCMark className="h-5 w-5" />
          <span>Stafford Media Consulting</span>
        </a>
        <nav className="hidden md:flex gap-6 text-sm ml-auto">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`hover:text-zinc-900 ${path === n.href ? "text-zinc-900" : "text-zinc-600"}`}
            >
              {n.label}
            </Link>
          ))}
          <a className="text-sm text-zinc-600 hover:underline" href="https://getabando.com" target="_blank" rel="noreferrer">Abando</a>
</nav>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/how-it-works"
            className="rounded-xl border px-3 py-2 text-sm"
          >
            See how
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
