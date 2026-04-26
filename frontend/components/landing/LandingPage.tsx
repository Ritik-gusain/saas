"use client";

import { LandingStyles } from "./LandingStyles";
import { Navbar } from "./Navbar";
import { ScrollSequence } from "./ScrollSequence";
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

      {/* Inline keyframes needed by scroll components */}
      <style>{`
        @keyframes modelCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1);    }
          50%       { opacity: 0.3; transform: scaleY(0.6); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#101418", overflowX: "hidden" }}>
        <Navbar />

        {/* Cinematic scroll-driven hero — replaces static HeroSection */}
        <ScrollSequence />

        {/* Rest of page scrolls normally after the sequence unpins */}
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