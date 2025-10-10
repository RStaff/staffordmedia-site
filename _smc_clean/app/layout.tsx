import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Stafford Media Consulting", description: "SMC website" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta name="theme-color" content="#0B1220" />
        <style>{`:root{--brand-bg:#0B1220;--brand-fg:#E8ECF1;--brand-card:#111A2C;--brand-border:#273245;--brand-accent:#F2C24B;--brand-gray:#A8B0BD}html,body{background:var(--brand-bg);color:var(--brand-fg);}`}</style>
      </head>
      <body className="brand-v1" data-brand-version="brandv-20251010160541">
        <header className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/smc-logo.png?v=brandv-20251010160541"} alt="SMC" width={28} height={28} priority />
            <div className="font-semibold text-white">Stafford Media Consulting™</div>
          </Link>
          <nav className="ml-auto flex items-center gap-6 text-sm text-brand-gray">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/abando" className="flex items-center gap-1">
              <Image src={"/abando-logo.png?v=brandv-20251010160541"} alt="Abando" width={18} height={18} />
              <span>Abando</span>
            </Link>
            <Link href="/contact" className="font-semibold">Book a Strategy Call</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-6 pb-16">{children}</main>
        <footer className="max-w-6xl mx-auto px-6 pb-10 text-sm text-brand-gray">
          © {new Date().getFullYear()} Stafford Media Consulting
          <span className="ml-2 inline-block px-2 py-1 rounded border border-[color:var(--brand-border)]" style={{background:"#111A2C"}}>BRAND APPLIED • brandv-20251010160541</span>
        </footer>
      </body>
    </html>
  );
}
