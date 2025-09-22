export default function HomePage() {
  return (
    <main className="px-6 py-16 bg-[#F8F9FA] text-[#1C2D4A]">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          AI Consulting & Intelligent Automation
        </h1>
        <p className="text-lg font-medium text-[#5B2A8C]">
          Built for results-driven founders who want to scale impact, recover time, and own their tech stack.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <a href="/abando" className="bg-[#00B2A9] text-white px-5 py-3 rounded font-semibold hover:bg-[#00929b] transition text-sm">
            See Abando.ai in Action →
          </a>
          <a href="/contact" className="bg-[#FFD700] text-[#1C2D4A] px-5 py-3 rounded font-semibold hover:bg-[#f5c400] transition text-sm">
            Book a Strategy Call
          </a>
        </div>
      </section>
    </main>
  );
}
