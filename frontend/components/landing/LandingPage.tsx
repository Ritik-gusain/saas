"use client";

import { useEffect, useRef, useState } from "react";
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
import { SoundToggle } from "./SoundToggle";
import { LuminescentGlow } from "./LuminescentGlow";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      // ── Background Color Shifts ──
      // Target elements with .scrolly-section class
      const sections = containerRef.current?.querySelectorAll(".scrolly-section");
      
      sections?.forEach((section) => {
        const bg = section.getAttribute("data-bg") || "#0A0D12";
        const color = section.getAttribute("data-text") || "#FFFFFF";
        
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => {
            gsap.to(document.body, { backgroundColor: bg, color: color, duration: 1.2, ease: "power2.inOut" });
          },
          onEnterBack: () => {
            gsap.to(document.body, { backgroundColor: bg, color: color, duration: 1.2, ease: "power2.inOut" });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!mounted) return null;

  return (
    <>
      <SmoothScroll />
      <LandingStyles />
      <LuminescentGlow />
      <SoundToggle />

      <div 
        ref={containerRef}
        style={{ minHeight: "100vh", overflowX: "hidden" }}
      >
        <Navbar />
        <HeroSection />
        <LogoTicker />
        <LuminescentConsole />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTABanner />
        <Footer />
      </div>
    </>
  );
}