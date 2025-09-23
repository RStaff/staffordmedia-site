import AbandoFeatures from "@/components/AbandoFeatures";

export default function Home() {
  return (
    <main className="bg-white text-[#1C2D4A]">
      {/* Hero already handled in layout.tsx */}

      {/* Feature Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <AbandoFeatures />
      </section>

      {/* CTA Section */}
      <section className="bg-[#1C2D4A] text-white py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to automate your edge?</h2>
        <p className="text-sm mb-6">Every deploy should convert. Let’s make yours frictionless.</p>
        <a href="/contact" className="inline-block bg-[#FFD700] text-[#1C2D4A] px-6 py-3 rounded font-semibold hover:bg-[#f5c400] transition">
          Book a Strategy Call
        </a>
      </section>
    </main>
  );
}
