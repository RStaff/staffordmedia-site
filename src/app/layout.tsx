import React from "react";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadgeKiller from "@/components/HeroBadgeKiller";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

export const metadata = {
  title: "Stafford Media Consulting™",
  description: "AI automation, business technology, and digital transformation from Stafford Media Consulting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <HeroBadgeKiller />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
