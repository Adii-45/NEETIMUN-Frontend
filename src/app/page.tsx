import { Hero } from "@/components/sections/home/Hero";
import { StatsBar } from "@/components/sections/home/StatsBar";
import { Pillars } from "@/components/sections/home/Pillars";
import { PortfoliosPreview } from "@/components/sections/home/PortfoliosPreview";
import { OnboardingTeaser } from "@/components/sections/home/OnboardingTeaser";
import { Roadmap } from "@/components/sections/home/Roadmap";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { FAQSection } from "@/components/sections/home/FAQSection";
import { CTABanner } from "@/components/ui/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Pillars />
      <PortfoliosPreview />
      <OnboardingTeaser />
      <Roadmap />
      <Testimonials />
      <FAQSection />
      <CTABanner
        eyebrow="Registration"
        title="Ready to Represent Your Nation?"
        subtitle="Registration for the 2026 Summit is now open. Seats are limited and allocated on a rolling basis."
        primaryCta={{ label: "Begin Registration", href: "/registration" }}
        secondaryCta={{ label: "Download Prospectus (PDF)", href: "/registration" }}
      />
    </>
  );
}
