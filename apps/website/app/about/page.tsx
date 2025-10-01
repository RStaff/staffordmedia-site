import Section from "@/components/Section";

export const metadata = {
  title: "About – Stafford Media",
  description: "From hands-on, face-to-face campaigns to AI products that convert.",
};

export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Section eyebrow="Our story" title="From face-to-face marketing to pragmatic AI that drives revenue">
        <p>
          Stafford Media began with Ross Stafford working directly with business owners — in person — to plan, launch,
          and optimize digital ads and campaigns that actually moved revenue. Project after project, the same pain points
          kept showing up at the moment of purchase: brands struggled to speak in their own voice, adapt messaging quickly,
          and answer objections <em>right when</em> customers were about to bounce.
        </p>
        <p>
          Instead of throwing bigger budgets at the problem, we built product. <strong>Abando™</strong> is a conversion agent
          that works in your brand voice across email, SMS, chat, and more — guiding buyers through checkout and recovering
          revenue without redesigns, re-platforming, or downtime.
        </p>
        <p>
          Today, Stafford Media builds pragmatic AI for teams of all sizes — small business, mid-market, and enterprise.
          Same focus, new leverage: ship outcomes faster with less lift.
        </p>
      </Section>
    </main>
  );
}
