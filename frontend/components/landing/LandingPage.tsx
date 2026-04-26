"use client";

import { LandingStyles } from "./LandingStyles";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { LogoTicker } from "./LogoTicker";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PricingSection } from "./PricingSection";
import { CTABanner } from "./CTABanner";
import { Footer } from "./Footer";

export default function LandingPage() {
  return (
    <>
      <LandingStyles />
      <div style={{ minHeight: "100vh", background: "#101418", overflowX: "hidden" }}>
        <Navbar />
        <HeroSection />
        <div style={{ position: "relative", zIndex: 20, background: "#101418" }}>
          <LogoTicker />
          <FeaturesSection />
          <HowItWorksSection />
          <PricingSection />
          <CTABanner />
          <Footer />
        </div>
      </div>
    </>
  );
}