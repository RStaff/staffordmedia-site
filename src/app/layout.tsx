import React from "react";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadgeKiller from "@/components/HeroBadgeKiller";

export const metadata = {
  title: "Stafford Media Consulting™",
  description: "AI automation, business technology, and digital transformation from Stafford Media Consulting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeroBadgeKiller />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
