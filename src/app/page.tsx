export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#F5F7FA] py-20 text-center px-6">
        <h1 className="text-5xl font-extrabold text-[#1C2D4A]">Stafford Media Consulting</h1>
        <p className="text-lg text-gray-600 mt-3">AI Consulting & Intelligent Automation</p>
        <p className="text-sm text-gray-500 mt-4 max-w-xl mx-auto">
          Built for results-driven founders who want to scale impact, recover time, and own their tech stack.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a href="/abando" className="bg-[#00C2B2] text-white px-5 py-2.5 rounded shadow hover:bg-[#009a8f] transition">
            See Abando.ai in Action →
          </a>
          <a href="/contact" className="border border-[#FFD700] text-[#FFD700] px-5 py-2.5 rounded hover:bg-[#fff8e1] transition">
            Book a Strategy Call
          </a>
        </div>
      </section>

      <section className="bg-white py-20 text-center px-6">
        <h2 className="text-2xl font-bold text-[#5B2A8C]">Meet Abando.ai</h2>
        <p className="text-gray-600 mt-2">Your intelligent copilot for cart recovery — built to boost revenue and reduce churn.</p>
        <ul className="list-disc list-inside text-left text-gray-700 max-w-md mx-auto mt-6">
          <li>Detects cart abandonment in real time</li>
          <li>Engages users with personalized recovery flows</li>
          <li>Integrates seamlessly with your stack</li>
          <li>Delivers measurable ROI within days</li>
        </ul>
        <div className="mt-6">
          <a href="/abando" className="bg-[#00C2B2] text-white px-5 py-2.5 rounded shadow hover:bg-[#009a8f] transition">
            Explore Abando.ai →
          </a>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-20 px-6">
        <h2 className="text-2xl font-bold text-[#5B2A8C] text-center">Trusted by results-driven teams</h2>
        <p className="text-sm text-gray-600 text-center mt-2 max-w-xl mx-auto">
          Stafford Media Consulting has helped founders, operators, and product teams recover time and scale intelligently.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow rounded px-6 py-4 border border-[#00C2B2]">
            <span className="text-[#1C2D4A] font-semibold">EcomPilot</span>
            <p className="text-sm text-gray-500 mt-1">Recovered $18K in abandoned carts</p>
          </div>
          <div className="bg-white shadow rounded px-6 py-4 border border-[#FFD700]">
            <span className="text-[#5B2A8C] font-semibold">OpsForge</span>
            <p className="text-sm text-gray-500 mt-1">Automated 12+ workflows in 3 weeks</p>
          </div>
          <div className="bg-white shadow rounded px-6 py-4 border border-[#1C2D4A]">
            <span className="text-[#00C2B2] font-semibold">CartRevive</span>
            <p className="text-sm text-gray-500 mt-1">Boosted recovery rate by 42%</p>
          </div>
        </div>
      </section>
    </main>
  );
}
