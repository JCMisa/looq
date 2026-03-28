import CTASection from "@/components/custom/landing-page/CTASection";
import FeaturesSection from "@/components/custom/landing-page/FeaturesSection";
import Footer from "@/components/custom/landing-page/Footer";
import HeroSection from "@/components/custom/landing-page/HeroSection";
import HowItWorksSection from "@/components/custom/landing-page/HowItWorksSection";
import Navbar from "@/components/custom/landing-page/Navbar";
import PricingSection from "@/components/custom/landing-page/PricingSection";
import StatsSection from "@/components/custom/landing-page/StatsSection";
import TestimonialsSection from "@/components/custom/landing-page/TestimonialsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
