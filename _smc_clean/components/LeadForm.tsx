"use client";
import { useState } from "react";

type Props = {
  variant?: "compact" | "full";
  successText?: string;
  hidden?: Record<string,string>;
};

export default function LeadForm({ variant="full", successText="Thanks — we’ll be in touch shortly.", hidden }: Props) {
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")||"").trim(),
      email: String(fd.get("email")||"").trim(),
      phone: String(fd.get("phone")||"").trim(),
      company: String(fd.get("company")||"").trim(),
      message: String(fd.get("message")||"").trim(),
      source: String(fd.get("source")||"website"),
      utm: Object.fromEntries(Array.from(fd.entries()).filter(([k])=>k.startsWith("utm_"))) as Record<string,string>,
    };
    try {
      const r = await fetch("/api/lead", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Failed");
      setOk(true);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e:any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (ok) return <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm">{successText}</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {(hidden && Object.keys(hidden).length>0) && Object.entries(hidden).map(([k,v])=>
        <input key={k} type="hidden" name={k} value={v} />
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required name="name" placeholder="Your name" className="border p-2 rounded w-full" />
        <input required type="email" name="email" placeholder="Email" className="border p-2 rounded w-full" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="phone" placeholder="Phone (optional)" className="border p-2 rounded w-full" />
        <input name="company" placeholder="Company (optional)" className="border p-2 rounded w-full" />
      </div>
      <textarea name="message" placeholder="What do you need?" rows={4} className="border p-2 rounded w-full" />
      <input type="hidden" name="source" value="website" />
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button disabled={busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
        {busy ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
