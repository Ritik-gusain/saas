"use client";

import { useEffect, useRef } from "react";
import { Globe, Users, Brain, TrendingUp, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    title: "Create Workspace",
    desc: "Deploy your private node. Bring your own API keys. Own your data from the first second.",
    icon: Globe,
    accent: "#00FFAA",
  },
  {
    num: "02",
    title: "Invite Your Team",
    desc: "Scale horizontally. Add teammates with granular permissions and shared persistent context.",
    icon: Users,
    accent: "#00D0FF",
  },
  {
    num: "03",
    title: "Deploy AI Agents",
    desc: "Initialize specialized agents for research, coding, or support with zero-config deployment.",
    icon: Brain,
    accent: "#7B61FF",
  },
  {
    num: "04",
    title: "Collaborate & Scale",
    desc: "Infinite history, real-time sync, and collaborative prompt engineering for high-perf teams.",
    icon: TrendingUp,
    accent: "#00FFAA",
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
              start: "top 80%",
            },
          }
        );
      }

      // Progress Line Animation
      if (lineRef.current && progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }

      // Step cards reveal
      stepsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );

        // Icon pulse on hover
        const icon = card.querySelector(".step-icon");
        card.addEventListener("mouseenter", () => {
          gsap.to(icon, { scale: 1.1, rotate: 5, duration: 0.4, ease: "back.out(2)" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4, ease: "power2.out" });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        padding: "160px 0",
        background: "var(--landing-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Grid */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.15 }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 100 }}>

          <h2 className="display-h1" style={{ fontSize: "clamp(32px, 5vw, 64px)", marginBottom: 24 }}>
            Deploy in <span className="shimmer-text">Seconds.</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--landing-muted)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            The streamlined architecture designed for rapid deployment and seamless team integration.
          </p>
        </div>

        {/* Progress Line */}
        <div
          ref={lineRef}
          style={{
            position: "relative",
            height: 2,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 2,
            marginBottom: 60,
            maxWidth: 1000,
            margin: "0 auto 80px",
          }}
        >
          <div
            ref={progressRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, var(--landing-green), var(--landing-cyan))",
              transformOrigin: "left",
              transform: "scaleX(0)",
              boxShadow: "0 0 20px var(--landing-green)",
            }}
          />
        </div>

        {/* Steps Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="cyber-card"
                style={{ padding: "40px 32px" }}
              >
                <div
                  className="step-icon"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${step.accent}10`,
                    border: `1px solid ${step.accent}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                    color: step.accent,
                  }}
                >
                  <Icon size={24} />
                </div>

                <div className="mono-label" style={{ fontSize: 10, color: step.accent, marginBottom: 12 }}>
                  Step {step.num}
                </div>
                
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 16,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.title}
                </h3>
                
                <p style={{ color: "var(--landing-muted)", lineHeight: 1.7, fontSize: 15 }}>
                  {step.desc}
                </p>

                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, color: step.accent, fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
                  Initialize <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
