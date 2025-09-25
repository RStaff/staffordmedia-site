import React from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import MediaLogos from "@/components/MediaLogos";
import ProofBlock from "@/components/ProofBlock";
import FreeTrial from "@/components/FreeTrial";

export default function HomePage() {
  return (
    <main className="home-page">
      <MediaLogos />
      <Hero
        headline="Unlock 4× ROI in 4 days—no redesigns, no downtime."
        subhead="Try Abando.ai free; cancel anytime."
        primaryCta={{ label: "Start Free Trial", href: "/signup" }}
        secondaryCta={{ label: "See Abando.ai in Action", href: "#demo" }}
      />
      <section id="demo">
        <Image
          src="/media/abanobi-demo-thumbnail.png"
          alt="Abando.ai Demo"
          width={640}
          height={360}
        />
      </section>
      <ProofBlock
        icon="check-circle"
        title="Zero patching. Real results."
        items={[
          "Abando.ai recovered $159K+ in 4 days—no redesigns, no downtime.",
          "Clients report 5× productivity gains within the first week."
        ]}
      />
      <FreeTrial
        title="Try Abando.ai Today—for Free"
        features={[
          "Eliminate manual workflows in minutes",
          "Architecture & hosting neutral",
          "Data & workflows 100% yours"
        ]}
        cta={{ label: "Start Free Trial", href: "/signup" }}
        disclaimer="Cancel anytime—data & workflows 100% yours."
      />
    </main>
  );
}
