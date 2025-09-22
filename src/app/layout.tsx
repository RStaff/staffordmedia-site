import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "AI consulting, product strategy, and scalable tech solutions by Ross Stafford.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="p-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Stafford Media Consulting logo" width={160} height={60} />
              <span className="text-xs font-semibold relative -top-1">™</span>
            </div>
            <h1 className="text-xl font-bold mt-2">Stafford Media Consulting</h1>
            <p className="text-sm text-gray-600">AI Consulting & Intelligent Automation</p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
// redeploy trigger
