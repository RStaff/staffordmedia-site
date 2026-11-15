import Link from "next/link";

export default function AuditFormCard({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="premium-panel-soft p-6">
      <p className="eyebrow text-slate-400">Run the audit</p>
      <form action={action} className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Store URL</span>
          <input type="text" name="storeUrl" required placeholder="your-store.com" className="smc-field" />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Email</span>
          <input type="email" name="email" required placeholder="you@store.com" className="smc-field" />
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
          <button type="submit" className="smc-button smc-button-primary">
            Run ShopiFixer Audit
          </button>
          <Link href="/shopifixer/result?store=elkeyecoffee.com" className="smc-button smc-button-secondary">
            View Example Audit
          </Link>
        </div>
      </form>
    </div>
  );
}
