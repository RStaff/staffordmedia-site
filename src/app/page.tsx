import FinalCta from "@/components/site/FinalCta";
import HomeHero from "@/components/site/HomeHero";
import HowItWorks from "@/components/site/HowItWorks";
import PainSection from "@/components/site/PainSection";
import ProductSplit from "@/components/site/ProductSplit";
import ProofSection from "@/components/site/ProofSection";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export default function HomePage() {
  return (
    <main>
      <SystemProgressRail currentStage="diagnose" stateLabel="System orientation" />
      <RuntimeContinuityStrip
        items={[
          { label: "Current", value: "Stafford Media frames the operating system." },
          { label: "Next", value: "Run ShopiFixer to diagnose the clearest blocker." },
          { label: "Boundary", value: "Abando remains independent and complementary." },
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
