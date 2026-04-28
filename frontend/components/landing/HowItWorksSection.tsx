"use client";

import { useEffect, useRef } from "react";
import { Globe, Users, Brain, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    title: "Create Workspace",
    desc: "Sign up free and bring your own API key. No credit card. Your workspace is ready in 30 seconds.",
    icon: Globe,
    accent: "#00FFAA",
  },
  {
    num: "02",
    title: "Invite Your Team",
    desc: "Add teammates with one click. Roles, permissions, and shared context are set up automatically.",
    icon: Users,
    accent: "#00D0FF",
  },
  {
    num: "03",
    title: "Deploy AI Agents",
    desc: "Upload your SOPs. Configure specialized agents per workflow — sales, support, growth, research.",
    icon: Brain,
    accent: "#00FFAA",
  },
  {
    num: "04",
    title: "Collaborate & Scale",
    desc: "Every conversation, prompt, and output is searchable and shared across your team in real time.",
    icon: TrendingUp,
    accent: "#00D0FF",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      if (headRef.current) {
        gsap.fromTo(
          Array.from(headRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headRef.current, start: "top 82%" },
          }
        );
      }

      // Animated progress line
      if (lineRef.current && progressRef.current) {
        gsap.fromTo(progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.8, ease: "power2.inOut",
            scrollTrigger: { trigger: lineRef.current, start: "top 70%" },
          }
        );
      }

      // Step cards — cascade in
      stepsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.88 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );

        // Number count-up effect
        const numEl = card.querySelector<HTMLElement>(".step-num");
        if (numEl) {
          gsap.fromTo(numEl,
            { y: 10, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5,
              delay: i * 0.15 + 0.3,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            }
          );
        }

        // Icon bounce on hover
        const iconBox = card.querySelector<HTMLElement>(".step-icon");
        card.addEventListener("mouseenter", () => {
          gsap.to(iconBox, { scale: 1.15, rotate: 8, duration: 0.35, ease: "back.out(1.7)" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(iconBox, { scale: 1, rotate: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="agents"
      ref={sectionRef}
      style={{
        padding: "130px 0 120px",
        background: "linear-gradient(180deg, var(--landing-bg) 0%, #0C1018 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="section-orb"
        style={{ top: "20%", right: "-8%", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,208,255,.03) 0%, transparent 70%)" }}
      />
      <div
        className="section-orb"
        style={{ bottom: "15%", left: "-5%", width: 350, height: 350, background: "radial-gradient(circle, rgba(0,255,170,.025) 0%, transparent 70%)" }}
      />

      {/* Top glow divider */}
      <div className="glow-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 90 }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>
            <Brain size={11} /> How It Works
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(34px, 5vw, 56px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#F8F9FA",
              marginTop: 18, marginBottom: 18,
            }}
          >
            From zero to team AI{" "}
            <br />
            <span className="shimmer-text-cyan">in four steps.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(248,249,250,.38)", maxWidth: 450, margin: "0 auto", lineHeight: 1.72, fontWeight: 300 }}>
            No complex onboarding. No IT tickets. Just a workspace your team will actually use.
          </p>
        </div>

        {/* Connecting progress line (desktop) */}
        <div
          ref={lineRef}
          style={{ position: "relative", maxWidth: 1000, margin: "0 auto -20px", display: "none" }}
          className="hiw-line-wrap"
        >
          <div style={{ position: "absolute", top: 56, left: "12.5%", right: "12.5%", height: 2, background: "rgba(255,255,255,.05)", borderRadius: 2 }} />
          <div
            ref={progressRef}
            style={{
              position: "absolute", top: 56, left: "12.5%", right: "12.5%", height: 2,
              background: "linear-gradient(90deg, #00FFAA, #00D0FF, #00FFAA)",
              borderRadius: 2, transformOrigin: "left",
              boxShadow: "0 0 8px rgba(0,255,170,.4)",
            }}
          />
        </div>

        {/* Step cards */}
        <div
          className="steps-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative", zIndex: 2 }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="cyber-card"
                style={{ padding: "36px 26px 30px", textAlign: "center", cursor: "default" }}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${step.accent}55, transparent)`,
                }} />

                {/* Step number */}
                <span
                  className="step-num"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10, letterSpacing: ".2em",
                    color: step.accent, display: "block", marginBottom: 20,
                    textTransform: "uppercase",
                  }}
                >
                  STEP {step.num}
                </span>

                {/* Icon */}
                <div
                  className="step-icon"
                  style={{
                    width: 52, height: 52, borderRadius: 15,
                    background: `${step.accent}0D`,
                    border: `1px solid ${step.accent}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 22px",
                    boxShadow: `0 0 24px ${step.accent}12`,
                  }}
                >
                  <Icon size={22} color={step.accent} strokeWidth={1.8} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 16,
                    color: "#F8F9FA", marginBottom: 12, letterSpacing: "-0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(248,249,250,.38)", lineHeight: 1.75, fontWeight: 300 }}>
                  {step.desc}
                </p>

                {/* Connector dot (desktop) */}
                <div style={{
                  position: "absolute", top: 57, left: "50%", transform: "translateX(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: step.accent,
                  boxShadow: `0 0 12px ${step.accent}`,
                  display: "none",
                }} className="step-dot" />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hiw-line-wrap { display: block !important; }
          .step-dot { display: block !important; }
        }
      `}</style>
    </section>
  );
}
