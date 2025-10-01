export const metadata = {
  title: "About – Stafford Media Consulting",
  description: "From hands-on marketing to AI products that convert—our story and the principles behind Abando.",
};
import Section from "@/components/Section";
export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Section eyebrow="Our story" title="From face-to-face campaigns to AI products that convert">
        <p>
          Stafford Media Consulting started with Ross Stafford working directly with business owners—face-to-face—planning,
          launching, and optimizing digital campaigns to grow revenue. Project after project revealed the same friction:
          brands struggled to personalize at the moment of purchase and to adapt their voice quickly enough to save would-be customers.
        </p>
        <p>
          Rather than throw bigger budgets at the problem, we built product. Abando™ merges customer-journey strategy with
          recovery-channel action—email, SMS, chat—so teams can answer objections in-flow, guide buyers through checkout,
          and recover revenue without redesigns or downtime.
        </p>
        <p>
          Today, SMC builds pragmatic AI for marketing—tools that serve small, mid-market, and enterprise teams alike.
          Same focus, new leverage: ship revenue outcomes faster, with less lift.
        </p>
      </Section>
    </main>
  );
}
