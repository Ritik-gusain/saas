"use client";

import { LandingStyles } from "./LandingStyles";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { LogoTicker } from "./LogoTicker";
import { LuminescentConsole } from "./LuminescentConsole";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PricingSection } from "./PricingSection";
import { CTABanner } from "./CTABanner";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";

export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <LandingStyles />
      <div style={{ minHeight: "100vh", background: "#0A0D12", overflowX: "hidden" }}>
        <Navbar />
        <HeroSection />
        <div style={{ position: "relative", zIndex: 20, background: "#0A0D12" }}>
          <LogoTicker />
          <LuminescentConsole />
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