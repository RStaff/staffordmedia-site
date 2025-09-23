import Head from "next/head";
import Link from "next/link";
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Consulting & Intelligent Automation</title>
        <meta
          name="description"
          content="Built for results-driven founders who want to scale impact, recover time, and own their tech stack."
        />
      </Head>
      <main className="bg-white text-[#1C2D4A]">

        {/* Hero */}
        <section className="max-w-6xl mx-auto py-24 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            AI Consulting & Intelligent Automation
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            From bootstrapped startups to enterprise teams, we build CLI-native, conversion-first systems that scale impact, recover time, and put you in control.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/abanobi"
              className="bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition"
            >
              See Abanobi in Action
            </Link>
            <Link
              href="/contact"
              className="bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition"
            >
              Book a Strategy Call
            </Link>
          </div>
        </section>

        {/* Product Strip */}
        <section className="bg-gray-100 text-[#1C2D4A] py-6 text-center">
          <p className="text-sm">
            Built with Abanobi—CLI-native automation for layout, logic, and launch.
          </p>
        </section>

        {/* Features */}
        <section
          aria-label="Core Features"
          className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            {
              title: "Zero manual edits",
              desc: "Every deploy is CLI-native. No placeholders, no patching.",
            },
            {
              title: "Conversion-first layout",
              desc: "Each pixel signals premium positioning and trust.",
            },
            {
              title: "Modular and scalable",
              desc: "Frictionless architecture built for results and ownership.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-4">
              <div
                role="img"
                aria-label={title + " icon"}
                className="h-8 w-8 bg-[#FFD700] rounded-full"
              />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-gray-700">{desc}</p>
            </div>
          ))}
        </section>

        {/* Founder Voice */}
        <section className="bg-white text-[#1C2D4A] py-12 px-6 text-center">
          <p className="text-base max-w-2xl mx-auto italic">
            “I don’t sell templates. I build systems. Every deploy is CLI-native,
            frictionless, and built to convert.”
          </p>
        </section>

        {/* Proof */}
        <section className="bg-[#1C2D4A] text-white py-20 px-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Real Results</h2>
          <p className="text-base mb-6 max-w-xl mx-auto italic">
            “Abanobi recovered $159K+ in 4 days—no redesign, no downtime. Just automation.”
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition"
          >
            Book a Strategy Call
          </Link>
        </section>
      </main>
    </>
  );
}
