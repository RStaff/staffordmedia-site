import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import Analytics from "./analytics/Analytics"
import Analytics from "./analytics/Analytics"

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description:
    "ROI through automation. Abando cart recovery + AI automation consulting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t = localStorage.getItem('theme');
              if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
              document.documentElement.setAttribute('data-theme', t);
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
      <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
import Nav from "@/components/Nav";
import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description:
    "ROI through automation. Abando cart recovery + AI automation consulting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1220] text-white">
        <Nav />
        {children}
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t = localStorage.getItem('theme');
              if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
              document.documentElement.setAttribute('data-theme', t);
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
