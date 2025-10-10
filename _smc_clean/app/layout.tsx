import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Stafford Media Consulting",
  description: "SMC website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <Image src="/smc-logo.svg" alt="SMC" width={28} height={28} />
          <div className="font-semibold text-white">Stafford Media Consulting™</div>
          <nav className="ml-auto flex items-center gap-6 text-sm text-brand-gray">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/abando">Abando</Link>
            <Link href="/contact" className="font-semibold">Book a Strategy Call</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-6 pb-16">{children}</main>
        <footer className="max-w-6xl mx-auto px-6 pb-10 text-sm text-brand-gray">
          © {new Date().getFullYear()} Stafford Media Consulting
        </footer>
      </body>
    </html>
  );
}
