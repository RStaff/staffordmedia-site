export default function Home() {
  return (
    <main className="px-6 py-16">
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Stafford Media Consulting
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          AI Consulting & Intelligent Automation
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Built for results-driven founders who want to scale impact, recover time, and own their tech stack.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a href="/abando" className="bg-blue-600 text-white px-5 py-2.5 rounded shadow hover:bg-blue-700 transition">
            See Abando.ai in Action →
          </a>
          <a href="/contact" className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded hover:bg-blue-50 transition">
            Book a Strategy Call
          </a>
        </div>
      </section>

      <section className="mt-20 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900">Meet Abando.ai</h2>
        <p className="text-gray-600 mt-2">
          Your intelligent copilot for cart recovery — built to boost revenue and reduce churn.
        </p>
        <div className="mt-6 grid gap-4 text-left">
          <ul className="list-disc list-inside text-gray-700 mx-auto max-w-md">
            <li>Detects cart abandonment in real time</li>
            <li>Engages users with personalized recovery flows</li>
            <li>Integrates seamlessly with your stack</li>
            <li>Delivers measurable ROI within days</li>
          </ul>
        </div>
        <div className="mt-6">
          <a href="/abando" className="bg-blue-600 text-white px-5 py-2.5 rounded shadow hover:bg-blue-700 transition">
            Explore Abando.ai →
          </a>
        </div>
      </section>
    </main>
  );
}

      <section className="mt-24 bg-smc-gray py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-smc-purple">Trusted by results-driven teams</h2>
          <p className="text-sm text-gray-600 mt-2">
            Stafford Media Consulting has helped founders, operators, and product teams recover time and scale intelligently.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
          <div className="bg-white shadow rounded px-6 py-4 border border-smc-teal">
            <span className="text-smc-blue font-semibold">EcomPilot</span>
            <p className="text-sm text-gray-500 mt-1">Recovered $18K in abandoned carts</p>
          </div>
          <div className="bg-white shadow rounded px-6 py-4 border border-smc-gold">
            <span className="text-smc-purple font-semibold">OpsForge</span>
            <p className="text-sm text-gray-500 mt-1">Automated 12+ workflows in 3 weeks</p>
          </div>
          <div className="bg-white shadow rounded px-6 py-4 border border-smc-blue">
            <span className="text-smc-teal font-semibold">CartRevive</span>
            <p className="text-sm text-gray-500 mt-1">Boosted recovery rate by 42%</p>
          </div>
        </div>
      </section>
