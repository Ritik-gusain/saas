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

        {/* Bento Grid */}
        <div 
          ref={gridRef}
          style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(240px, auto)",
            gap: "24px"
          }}
          onMouseMove={(e) => {
            const cards = gridRef.current?.querySelectorAll(".feature-card");
            cards?.forEach((card: any) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              card.style.setProperty("--x", `${x}px`);
              card.style.setProperty("--y", `${y}px`);
            });
          }}
        >
          {FEATURES.map((f, i) => {
            // Asymmetric spans for bento feel
            const spans = [
              "span 3", "span 3", // Row 1
              "span 2", "span 4", // Row 2
              "span 4", "span 2", // Row 3
            ][i] || "span 3";

            return (
              <div 
                key={i}
                className="feature-card glow-card"
                style={{
                  gridColumn: spans,
                  padding: "48px",
                  borderRadius: 32,
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  background: "rgba(15, 20, 28, 0.3)",
                  backdropFilter: "blur(20px)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  position: "relative",
                  overflow: "hidden",
                } as any}
              >
                {/* Local Spot Light */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(0, 255, 170, 0.08) 0%, transparent 50%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(0,255,170,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--landing-green)",
                    border: "1px solid rgba(0,255,170,0.1)",
                    marginBottom: 32,
                  }}>
                    <f.icon size={22} strokeWidth={1.5} />
                  </div>
                  
                  <h3 style={{ 
                    fontFamily: "var(--font-display)", 
                    fontSize: 26, 
                    fontWeight: 700, 
                    color: "#FFF",
                    marginBottom: 16,
                    letterSpacing: "-0.02em"
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ 
                    color: "rgba(248,249,250,0.5)", 
                    lineHeight: 1.7,
                    fontSize: 16,
                    maxWidth: 380,
                  }}>
                    {f.desc}
                  </p>
                </div>

                {/* Subtle Detail */}
                <div style={{ 
                  marginTop: "auto", 
                  paddingTop: 24, 
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                   <div className="mono-label" style={{ fontSize: 8, opacity: 0.3 }}>{f.title.toUpperCase()} // SYSTEM_READY</div>
                   <div style={{ width: 40, height: 2, background: "rgba(0,255,170,0.1)", borderRadius: 1 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
