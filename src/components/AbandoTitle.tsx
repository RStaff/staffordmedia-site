"use client";
import Image from "next/image";

export default function AbandoTitle() {
  return (
    <div data-testid="abando-title" className="flex items-center gap-3">
      <Image src="/abando-logo.png?v=assetv-png-20251011113708" alt="Abando" width={28} height={28} priority />
      <span className="text-white font-semibold text-xl">Abando</span>
    </div>
  );
}
