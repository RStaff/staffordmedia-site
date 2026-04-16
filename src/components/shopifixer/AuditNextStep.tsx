import Link from "next/link";
import AbandoTitle from "@/components/AbandoTitle";

export default function AuditNextStep() {
  return (
    <div className="mt-10 premium-panel-soft p-6 md:p-8">
      <p className="eyebrow text-slate-400">What comes next</p>
      <div className="mt-5">
        <AbandoTitle />
      </div>
      <p className="body-md mt-5 max-w-3xl">
        Once the top issue is clear, Abando helps recover revenue automatically across the shoppers who still hesitate
        or leave.
      </p>
      <div className="mt-6">
        <Link href="/services" className="smc-button smc-button-secondary">
          See Recovery System
        </Link>
      </div>
    </div>
  );
}
