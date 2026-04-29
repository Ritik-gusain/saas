"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Brain, Zap, Workflow, TrendingUp, Lock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Shared Chat History",
    accent: "#00FFAA",
    desc: "Your team's entire AI conversation history in one searchable place. Reference and build on each other's work seamlessly across time zones.",
    stat: "100%", statLabel: "Searchable",
  },
  {
    icon: Brain,
    title: "Custom AI Agents",
    accent: "#00D0FF",
    desc: "Deploy specialized agents trained on your SOPs. One focused agent per workflow — sales, support, growth. They learn and execute autonomously.",
    stat: "40+", statLabel: "AI Models",
  },
  {
    icon: Zap,
    title: "Smart Prompt Library",
    accent: "#00FFAA",
    desc: "Save, share, and version-control your best prompts. Stop re-engineering the same prompts every sprint — build institutional AI knowledge.",
    stat: "10x", statLabel: "Faster",
  },
  {
    icon: Workflow,
    title: "Projects & Folders",
    accent: "#00D0FF",
    desc: "Organize AI work by client or sprint. Files, outputs, and conversations — all structured exactly the way your team thinks and works.",
    stat: "∞", statLabel: "Projects",
  },
  {
    icon: TrendingUp,
    title: "Token Efficiency",
    accent: "#00FFAA",
    desc: "Team-wide shared context means 60% fewer tokens spent. Less waste, significantly more output per rupee. Your API budget goes further.",
    stat: "60%", statLabel: "Cost Cut",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    accent: "#00D0FF",
    desc: "SSO, RBAC, and full audit logs. Your IP stays yours — never used to train any public models. Compliance-ready from day one.",
    stat: "SOC2", statLabel: "Certified",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headRef.current) {
        gsap.fromTo(headRef.current.children, 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Bento cards reveal
      if (gridRef.current) {
        gsap.fromTo(gridRef.current.children, 
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{ padding: "140px 24px", background: "#0A0D12", position: "relative" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 80 }}>

          <h2 className="display-h1" style={{ fontSize: "clamp(32px, 5vw, 64px)", marginBottom: 24 }}>
            Built for teams that <span className="shimmer-text">move at lightspeed.</span>
          </h2>
          <p style={{ 
            fontFamily: "var(--font-body)", 
            color: "rgba(255,255,255,0.4)", 
            maxWidth: 600, 
            margin: "0 auto",
            fontSize: 18,
            lineHeight: 1.6
          }}>
            Luminescent provides the infrastructure for high-performance AI collaboration.
            No lag. No complexity. Just pure execution.
          </p>
        </div>

        {/* Bento Grid */}
        <div 
          ref={gridRef}
          className="bento-grid"
          style={{ gridTemplateRows: "repeat(2, 320px)" }}
        >
          {/* Feature 1: Large */}
          <div className="cyber-card" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ color: "#00FFAA", marginBottom: 24 }}><MessageSquare size={32} /></div>
              <h3 style={{ fontFamily: "var(--font-header)", fontSize: 24, color: "#FFF", marginBottom: 12 }}>Shared Chat History</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: "80%" }}>
                Your team&apos;s entire AI conversation history in one searchable place. 
                Reference and build on each other&apos;s work seamlessly.
              </p>
            </div>
            <div style={{ 
              position: "absolute", bottom: -20, right: -20, 
              fontSize: 120, fontWeight: 900, color: "rgba(0,255,170,0.03)",
              fontFamily: "var(--font-header)"
            }}>100%</div>
          </div>

          {/* Feature 2: Tall/Medium */}
          <div className="cyber-card" style={{ gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#00D0FF", marginBottom: 24 }}><Brain size={32} /></div>
              <h3 style={{ fontFamily: "var(--font-header)", fontSize: 24, color: "#FFF", marginBottom: 12 }}>Custom AI Agents</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Deploy specialized agents trained on your SOPs. 
                One focused agent per workflow.
              </p>
            </div>
            <div style={{ marginTop: 40 }}>
              <div className="mono-label" style={{ color: "#00D0FF", opacity: 0.5, marginBottom: 8 }}>MODELS DEPLOYED</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: "#FFF", fontFamily: "var(--font-header)" }}>40+</div>
            </div>
          </div>

          {/* Feature 3: Small */}
          <div className="cyber-card">
            <div style={{ color: "#7B61FF", marginBottom: 20 }}><Zap size={24} /></div>
            <h3 style={{ fontFamily: "var(--font-header)", fontSize: 20, color: "#FFF", marginBottom: 8 }}>Smart Prompt Library</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.5 }}>
              Save and version-control your best prompts. Stop re-engineering.
            </p>
          </div>

          {/* Feature 4: Small */}
          <div className="cyber-card">
            <div style={{ color: "#00FFAA", marginBottom: 20 }}><Lock size={24} /></div>
            <h3 style={{ fontFamily: "var(--font-header)", fontSize: 20, color: "#FFF", marginBottom: 8 }}>Enterprise Security</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.5 }}>
              SSO, RBAC, and full audit logs. Compliance-ready from day one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
