import Link from "next/link";
export default function Nav(){
  return (
    <header className="w-full border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
        <Link href="/" className="text-white font-semibold">StaffordMedia.ai</Link>
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/services" className="hover:text-white">Services</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
        </div>
      </nav>
    </header>
  );
}
