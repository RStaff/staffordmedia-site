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
          Founded by Ross Stafford, we specialize in AI solutions — from concept to cost recovery.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a href="/ahaana" className="bg-blue-600 text-white px-5 py-2.5 rounded shadow hover:bg-blue-700 transition">
            See Ahaana in Action →
          </a>
          <a href="/contact" className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded hover:bg-blue-50 transition">
            Book a Strategy Call
          </a>
        </div>
      </section>
    </main>
  );
}
