import Image from "next/image";
import Link from "next/link";

export default function AbandoPage() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 text-base text-brand-gray">
        <Image src="/abando-logo.png" alt="Abando" width={24} height={24} />
        <span>Abando™</span>
      </div>

      <h1 className="mt-3 text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
        Recover more checkouts with your <span className="text-brand-accent">AI Shopping Copilot</span>.
      </h1>

      <p className="mt-4 text-lg text-brand-gray max-w-2xl">
        Abando answers questions, handles objections, and guides buyers through checkout—
        so abandonment turns into orders.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/start" className="btn-primary">Start Free Trial</Link>
        <Link href="/demo" className="btn-ghost">Try the Demo</Link>
      </div>
    </div>
  );
}
