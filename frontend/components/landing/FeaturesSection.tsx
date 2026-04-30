"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Zap, Shield, Search, Globe, Layout, Brain, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURES = [
  {
    title: "Shared Intelligence",
    desc: "A collaborative workspace where team context is preserved across all AI conversations.",
    icon: MessageSquare,
  },
  {
    title: "Deploy Anywhere",
    desc: "Scale your AI operations globally with private node deployment and zero-config setup.",
    icon: Globe,
  },
  {
    title: "BYOK Protocol",
    desc: "Bring Your Own Keys. Full control over model usage and per-token expenses.",
    icon: Key,
  },
  {
    title: "Enterprise Shield",
    desc: "Bank-grade security for your organizational prompts and sensitive company data.",
    icon: Shield,
  },
  {
    title: "Neural Search",
    desc: "Instantly surface insights from thousands of team conversations with semantic lookup.",
    icon: Search,
  },
  {
    title: "Custom Agents",
    desc: "Create specialized agents for coding, research, or support in under 60 seconds.",
    icon: Brain,
  }
];

import { Key } from "lucide-react";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;
      
      const cards = gridRef.current.children;
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="features"
      ref={sectionRef}
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{
        padding: "160px 24px",
        position: "relative",
        background: "transparent"
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.1 }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 80, maxWidth: 640 }}>
          <div className="mono-label" style={{ color: "var(--landing-green)", marginBottom: 16 }}>
            02 → CORE CAPABILITIES
          </div>
          <h2 
            className="glow-text"
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(32px, 5vw, 48px)", 
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.02em"
            }}
          >
            The Operating System for <span className="shimmer-text">AI-First Teams.</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--landing-muted)", lineHeight: 1.6 }}>
            Everything you need to orchestrate large language models at scale across your entire organization.
          </p>
        </div>

        {/* Features Grid */}
        <div 
          ref={gridRef}
          style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}
        >
          {FEATURES.map((f, i) => (
            <div 
              key={i}
              className="feature-card"
              style={{
                padding: "40px 32px",
                borderRadius: 24,
                border: "1px solid rgba(255, 255, 255, 0.06)",
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                cursor: "default",
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--landing-green)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <f.icon size={24} strokeWidth={1.5} />
              </div>
              
              <div>
                <h3 style={{ 
                  fontFamily: "var(--font-display)", 
                  fontSize: 22, 
                  fontWeight: 700, 
                  color: "#FFF",
                  marginBottom: 12,
                  letterSpacing: "-0.01em"
                }}>
                  {f.title}
                </h3>
                <p style={{ 
                  color: "var(--landing-muted)", 
                  lineHeight: 1.6,
                  fontSize: 15,
                }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
