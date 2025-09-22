import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "AI consulting, automation strategy, and product development by Ross Stafford.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 bg-[#1C2D4A] text-white px-6 py-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Stafford Media Consulting logo" width={160} height={60} priority />
            <span className="text-xs font-semibold relative -top-1">™</span>
          </div>
          <a href="/contact" className="bg-[#FFD700] text-[#1C2D4A] px-4 py-2 rounded font-semibold hover:bg-[#f5c400] transition">
            Book a Strategy Call
          </a>
        </header>
        {children}
        <footer className="bg-[#1C2D4A] text-white text-center py-6 mt-24">
          <p className="text-sm">© 2025 Stafford Media Consulting. Built for results.</p>
        </footer>
      </body>
    </html>
  );
}
