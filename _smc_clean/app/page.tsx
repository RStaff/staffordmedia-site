import Image from "next/image";
import Link from "next/link";
import HomeAbandoSection from "@/components/HomeAbandoSection";

export default function Page() {
  return (<>
  
    
<>
    
  
  
  <div className="mt-8">
        <div className="flex items-center gap-2 text-base text-brand-gray">
          <Image src="/abando-logo.png?v=assetv-png-20251011113708" alt="Abando" width={18} height={18} />
          <span>Abando</span>
        </div>
  
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
          Unlock 4× ROI in 4 days—
          <br />no redesigns, no downtime.
        </h1>
  
        <p className="mt-3 text-brand-gray">
          Try Abando.ai free; cancel anytime.
        </p>
  
        <div className="mt-5 flex gap-3">
          <Link href="/start" className="btn-primary">Start Free Trial</Link>
          <Link href="/demo" className="btn-ghost">See Abando.ai In Action</Link>
        </div>
  
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="card p-6">
            <h3 className="font-semibold mb-2">Who it’s for</h3>
            <ul className="list-disc ml-6 space-y-1 text-brand-gray">
              <li>Ecommerce teams on Shopify, WooCommerce, BigCommerce, or custom carts.</li>
              <li>Marketers who want higher conversion without redesigns or long projects.</li>
              <li>Founders who need measurable ROI fast (days, not months).</li>
            </ul>
          </section>
          <section className="card p-6">
            <h3 className="font-semibold mb-2">What it does</h3>
            <ul className="list-disc ml-6 space-y-1 text-brand-gray">
              <li>AI copilot that speaks in your brand’s voice — not a template.</li>
              <li>Engages via email, SMS, WhatsApp, push — wherever customers are.</li>
              <li>Handles objections in real time (price, shipping, trust).</li>
              <li>Installs with no redesigns, no downtime.</li>
              <li>Delivers measurable ROI in <strong>4 days</strong> — not weeks.</li>
            </ul>
          </section>
        </div>
      </div>
      </>
  
  </>);
}
