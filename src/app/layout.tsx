import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "AI consulting, automation strategy, and product development by Ross Stafford.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Stafford Media Consulting",
    description: "AI consulting and automation strategy for results-driven founders.",
    url: "https://staffordmedia-site.onrender.com",
    siteName: "Stafford Media Consulting",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Stafford Media Consulting banner",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 bg-[#1C2D4A] text-white px-6 py-2 flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <Image src="/logo-grid.png" alt="Stafford Media Consulting logo" width={48} height={48} priority />
            <span className="text-xs text-white align-super">™</span>
          </div>
          <div className="flex-grow text-center">
            <span className="text-base font-semibold tracking-wide text-white whitespace-nowrap">
              Stafford Media Consulting
            </span>
          </div>
          <div>
            <a href="/contact" className="bg-[#FFD700] text-[#1C2D4A] px-4 py-2 rounded font-semibold hover:bg-[#f5c400] transition">
              Book a Strategy Call
            </a>
          </div>
        </header>
        {children}
        <footer className="bg-[#1C2D4A] text-white text-center py-6 mt-24">
          <p className="text-sm">© 2025 Stafford Media Consulting. Built for results.</p>
        </footer>
      </body>
    </html>
  );
}
