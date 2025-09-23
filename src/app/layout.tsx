import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Stafford Media Consulting™</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="AI Consulting & Intelligent Automation for results-driven founders."
        />
        <meta property="og:title" content="Stafford Media Consulting™" />
        <meta property="og:description" content="Scale impact, recover time, own your tech stack." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://staffordmedia-site.onrender.com" />
        <meta property="og:image" content="https://staffordmedia-site.onrender.com/smc-grid-logo.svg" />
      </Head>
      <html lang="en">
        <body>
          <ErrorBoundary>
            <header className="bg-[#1C2D4A] text-white py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/smc-grid-logo.svg"
                  alt="Stafford Media Consulting Logo"
                  width={48}
                  height={48}
                  priority
                />
                <span className="text-lg font-semibold">
                  Stafford Media Consulting™
                </span>
              </div>
              <nav className="flex items-center gap-6">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/abanobi" className="hover:underline">Abanobi</Link>
                <Link
                  href="/contact"
                  className="bg-[#FFD700] text-[#1C2D4A] px-5 py-2 rounded font-semibold hover:bg-[#f5c400] transition"
                >
                  Book a Strategy Call
                </Link>
              </nav>
            </header>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </>
  );
}
