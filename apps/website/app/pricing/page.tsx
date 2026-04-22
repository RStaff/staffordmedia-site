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
    </main>
  );
}
