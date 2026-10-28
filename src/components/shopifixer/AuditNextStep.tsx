import Link from "next/link";
import AbandoTitle from "@/components/AbandoTitle";

export default function AuditNextStep() {
  return (
    <div className="mt-8 premium-panel-soft p-5 md:mt-10 md:p-6">
      <p className="eyebrow text-slate-400">Optional next layer</p>
      <div className="mt-4">
        <AbandoTitle />
      </div>
      <p className="body-md mt-4 max-w-3xl">Optional recovery after the storefront path is clearer.</p>
      <div className="mt-6">
        <Link href="/services" className="smc-button smc-button-secondary">
          See Recovery System
        </Link>
      </div>
    </div>
  );
}
