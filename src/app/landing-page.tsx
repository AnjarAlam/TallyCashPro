import { LandingPageSidebar } from "@/components/sidebarComps";
import {
  CtaSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  MainNav,
  TestimonialsSection,
} from "@/section";
import Component from "@/section/tallycash-download";
import WhyTallyCashFlow from "@/section/why-tallycash";

export default function LandingPage() {
  return (
    <div className="flex flex-col border">
      <LandingPageSidebar />
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <WhyTallyCashFlow />
        <FeaturesSection />
        <TestimonialsSection />
        <Component />
        <CtaSection />

      </main>
      <FooterSection />
    </div>
  );
}
