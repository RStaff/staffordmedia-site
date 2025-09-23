import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white text-[#1C2D4A]">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-24 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Consulting & Intelligent Automation</h1>
        <p className="text-base text-gray-700 max-w-2xl mx-auto">
          Built for results-driven founders who want to scale impact, recover time, and own their tech stack.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/abanobi"
            className="bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition"
          >
            See Abanobi in Action
          </a>
          <a
            href="/contact"
            className="bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition"
          >
            Book a Strategy Call
          </a>
        </div>
      </section>

      {/* Feature Block */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-start gap-4">
          <div className="h-8 w-8 bg-[#FFD700] rounded-full" />
          <h3 className="text-lg font-bold">Zero manual edits</h3>
          <p className="text-sm text-gray-700">
            Every deploy is CLI-native. No placeholders, no patching.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="h-8 w-8 bg-[#FFD700] rounded-full" />
          <h3 className="text-lg font-bold">Conversion-first layout</h3>
          <p className="text-sm text-gray-700">
            Each pixel signals premium positioning and trust.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="h-8 w-8 bg-[#FFD700] rounded-full" />
          <h3 className="text-lg font-bold">Modular and scalable</h3>
          <p className="text-sm text-gray-700">
            Frictionless architecture built for results and ownership.
          </p>
        </div>
      </section>

      {/* Proof Block */}
      <section className="bg-[#1C2D4A] text-white py-20 px-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Trusted by results-driven teams</h2>
        <p className="text-base mb-6 max-w-xl mx-auto italic">
          “Abanobi & co. recovered $159K+ in 4 days — without touching our site.”
        </p>
        <a
          href="/contact"
          className="inline-block bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition"
        >
          Book a Strategy Call
        </a>
      </section>
    </main>
  );
}
