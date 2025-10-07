import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Signup() {
  async function action(formData: FormData) {
    "use server";
    // Minimal server-side capture (replace with your email/DB/integration later)
    const payload = {
      name: (formData.get("name") || "").toString(),
      email: (formData.get("email") || "").toString(),
      platform: (formData.get("platform") || "").toString(),
      store: (formData.get("store") || "").toString(),
    };
    console.warn("ABANDO_SIGNUP", payload);
    // Pretend to process, then redirect
    redirect("/thanks");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Start Free Trial
      </h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Tell us a bit about your store so we can set up Abando and enable your
        recovery flows.
      </p>

      <form action={action} className="mt-8 grid gap-4 max-w-xl">
        <input
          name="name"
          required
          placeholder="Full name"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="email"
          required
          type="email"
          placeholder="Work email"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="store"
          placeholder="Store URL (optional)"
          className="border rounded-xl px-4 py-3"
        />
        <select name="platform" className="border rounded-xl px-4 py-3">
          <option value="">Platform</option>
          <option>Shopify</option>
          <option>WooCommerce</option>
          <option>BigCommerce</option>
          <option>Magento</option>
          <option>Custom / Other</option>
        </select>
        <button className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium w-fit">
          Create my trial
        </button>
      </form>

      <p className="mt-4 text-xs text-zinc-500">
        No long-term commitment. We’ll email onboarding steps.
      </p>
    </div>
  );
}
