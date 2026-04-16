import FinalCta from "@/components/site/FinalCta";
import HomeHero from "@/components/site/HomeHero";
import HowItWorks from "@/components/site/HowItWorks";
import PainSection from "@/components/site/PainSection";
import ProductSplit from "@/components/site/ProductSplit";
import ProofSection from "@/components/site/ProofSection";
import SystemFlow from "@/components/site/SystemFlow";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <PainSection />
      <SystemFlow />
      <HowItWorks />
      <ProofSection />
      <ProductSplit />
      <FinalCta />
    </main>
  );
}
