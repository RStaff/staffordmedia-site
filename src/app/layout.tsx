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
            <Image src="/logo-icon.png" alt="Stafford Media Consulting logo icon" width={40} height={40} priority />
          </div>
          <div className="flex-grow text-center">
            <span className="text-base font-semibold tracking-wide text-white whitespace-nowrap">
              Stafford Media Consulting<span className="text-xs align-super ml-1">™</span>
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

{/* Sticky Mobile CTA Bar */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center md:hidden z-50">
  <span className="text-sm font-medium text-[#1C2D4A]">Ready to recover your time?</span>
  <a href="/contact" className="bg-[#FFD700] text-[#1C2D4A] px-3 py-1.5 rounded font-semibold hover:bg-[#f5c400] transition">
    Book Call
  </a>
</div>
