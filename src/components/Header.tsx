import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full py-6">
      <div className="container-max flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3">
            <Image src="/smc-new-logo.png" alt="Stafford Media Consulting" width={40} height={40} />
            <span className="text-white font-bold text-lg">Stafford Media Consulting™</span>
          </a>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="/" className="text-smc-text hover:underline">Home</a>
          <a href="/about" className="text-smc-text hover:underline">About</a>
          <a href="/abanobi" className="text-smc-text hover:underline">Abando</a>
          <a href="/strategy-call" className="text-smc-text font-semibold px-3 py-2 rounded-md hover:bg-white/5">
            Book a Strategy Call
          </a>
        </nav>
      </div>
    </header>
  );
}
