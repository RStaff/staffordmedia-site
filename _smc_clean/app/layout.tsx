import "./globals.css";
import Link from "next/link";
export const metadata = { title: "Stafford Media Consulting", description: "SMC website" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang="en">
 <head>
 <meta name="theme-color" content="#0B1220" />
 <style>{`:root{--brand-bg:#0B1220;--brand-fg:#E8ECF1;--brand-card:#111A2C;--brand-border:#273245;--brand-accent:#F2C24B;--brand-gray:#A8B0BD}html,body{background:var(--brand-bg);color:var(--brand-fg);}`}</style>
 
<meta name="description" content="SMC helps ecommerce teams unlock 4× ROI in days—no redesigns, no downtime." />

<meta property="og:title" content="Stafford Media Consulting" />

<meta property="og:description" content="Unlock 4× ROI in days with Abando.ai and SMC." />

<meta property="og:type" content="website" />

<meta property="og:url" content="https://www.staffordmedia.ai/" />

<meta property="og:image" content="https://www.staffordmedia.ai/smc-logo.v2.png" />

<meta name="twitter:card" content="summary_large_image" />
</head>
 <body className="brand-v1" data-brand-version="brandv-20251010172040">
 <header className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
 
 <Link href="/" className="flex items-center gap-2">
 <img src="/smc-logo.v2.png" alt="SMC" width="28" height="28" className="smc-logo" />
 <div className="font-semibold text-white">Stafford Media Consulting™</div>
 </Link>
 
 <nav className="ml-auto flex items-center gap-6 text-sm text-brand-gray">
 <Link href="/">Home</Link>
 <Link href="/about">About</Link>
 <Link href="/abando" className="flex items-center gap-1"><img src="/abando-logo.png" width={18} height={18} className="h-5 w-5 align-\[-2px\]" alt="Abando" /><span>Abando</span></Link>
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
