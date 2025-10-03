import Link from "next/link";

export default function Nav() {
  return (
    <nav className="py-4">
      <ul className="flex items-center gap-4 text-sm">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/services">Services</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
      </ul>
    </nav>
  );
}
