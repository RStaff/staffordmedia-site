import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ValueSection from '@/components/ValueSection';
import ServicesSection from '@/components/ServicesSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ValueSection />
      <ServicesSection />
      <CallToAction />
      <Footer />
    </main>
  );
}
