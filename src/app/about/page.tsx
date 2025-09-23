import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
export const revalidate = 60;

export default function About() {
  return (
    <>
      <Head>
        <title>About Ross Stafford</title>
        <meta
          name="description"
          content="Ross Stafford, founder of Stafford Media Consulting™. Architect of automation-first, conversion-driven ecosystems."
        />
      </Head>
      <main className="bg-white text-[#1C2D4A] px-6 py-20 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Image
            src="/ross-profile.jpg"
            alt="Ross Stafford"
            width={240}
            height={240}
            className="rounded-full border-4 border-[#FFD700]"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold mb-4">Ross Stafford</h1>
            <p className="text-base text-gray-700 leading-relaxed">
              I build automation-first ecosystems for organizations of all sizes—from nimble startups to Fortune 500s—that demand results.
              Every deploy is CLI-native, modular, and frictionless—no placeholders,
              no manual edits. As the founder of Stafford Media Consulting™, I
              architect scalable tech solutions that convert. Whether it’s
              brand-first layout rhythm or zero-drift deployment pipelines, I
              engineer credibility pixel by pixel.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition"
          >
            Book a Strategy Call
          </Link>
        </div>
      </main>
    </>
  );
}
