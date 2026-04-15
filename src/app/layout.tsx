import React from "react";
import "./globals.css";
import Header from "../components/Header";
import HeroBadgeKiller from "@/components/HeroBadgeKiller";

export const metadata = {
  title: "Stafford Media Consulting™",
  description: "Unlock 4× ROI in 4 days — Abando.ai",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeroBadgeKiller />
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
