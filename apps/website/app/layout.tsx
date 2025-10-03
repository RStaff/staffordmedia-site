import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "StaffordMedia.ai",
  description: "Pragmatic AI for marketing: convert more, faster, with less lift.",
};

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B1220] text-white">
        <Nav />
        {children}
      </body>
    </html>
  );
}
