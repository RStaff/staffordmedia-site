<<<<<<< HEAD
import Section from "@/components/Section";

/** App Router build flags must be at module top-level (not inside the component) */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <Section eyebrow="Pricing" title="Simple, usage-based plans">
        <p>
          Pay for value, not promises. Abando installs with no redesigns or downtime,
          and you can cancel anytime.
        </p>
      </Section>
=======
export const metadata = {
  title: "Pricing – Stafford Media Consulting",
  description: "Simple plans that pay for themselves after a single recovered cart.",
};
import Pricing from "@/components/Pricing";
export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Pricing />
>>>>>>> f751bc5 (feat(site): About + Services + Pricing pages (drop-in))
    </main>
  );
}
