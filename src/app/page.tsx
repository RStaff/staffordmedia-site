import FinalCta from "@/components/site/FinalCta";
import HomeHero from "@/components/site/HomeHero";
import HowItWorks from "@/components/site/HowItWorks";
import PainSection from "@/components/site/PainSection";
import ProductSplit from "@/components/site/ProductSplit";
import ProofSection from "@/components/site/ProofSection";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export default function HomePage() {
  return (
    <main>
      <RuntimeContinuityStrip
        items={[
          { label: "Focus", value: "Improve the workflows that slow your business down." },
          { label: "Approach", value: "Start with the clearest business problem." },
          { label: "Boundary", value: "Products remain distinct and complementary." },
        ]}
      />
      <HomeHero />
      <PainSection />
      <HowItWorks />
      <ProofSection />
      <ProductSplit />
      <FinalCta />
    </main>
  );
}
