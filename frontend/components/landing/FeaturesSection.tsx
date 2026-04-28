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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating orb parallax
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Section header — stagger children
      if (headRef.current) {
        gsap.fromTo(
          Array.from(headRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: headRef.current, start: "top 82%" },
          }
        );
      }

      // Cards staggered grid reveal
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const col = i % 3;
        const row = Math.floor(i / 3);
        gsap.fromTo(card,
          {
            y: 50 + row * 10,
            x: col === 0 ? -20 : col === 2 ? 20 : 0,
            opacity: 0,
            scale: 0.93,
          },
          {
            y: 0, x: 0, opacity: 1, scale: 1,
            duration: 0.85,
            delay: col * 0.08 + row * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );

        // Hover: animated top-border glow
        const line = card.querySelector<HTMLDivElement>(".card-top-line");
        card.addEventListener("mouseenter", () => {
          if (line) gsap.to(line, { scaleX: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(card.querySelector<HTMLDivElement>(".card-icon-wrap"), {
            scale: 1.12, rotate: 6, duration: 0.4, ease: "back.out(1.7)",
          });
        });
        card.addEventListener("mouseleave", () => {
          if (line) gsap.to(line, { scaleX: 0, duration: 0.3, ease: "power2.in" });
          gsap.to(card.querySelector<HTMLDivElement>(".card-icon-wrap"), {
            scale: 1, rotate: 0, duration: 0.35, ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{ padding: "130px 0 110px", background: "var(--landing-bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background elements */}
      <div
        ref={orbRef}
        className="section-orb"
        style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(0,255,170,.04) 0%, transparent 70%)" }}
      />
      <div className="section-orb" style={{ top: "60%", right: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,208,255,.03) 0%, transparent 70%)" }} />

      {/* Top glow line */}
      <div className="glow-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        {/* Section header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 80 }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>
            <Zap size={11} /> Capabilities
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(34px, 5vw, 56px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#F8F9FA",
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            Built for teams that{" "}
            <span className="shimmer-text">move fast.</span>
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "rgba(248,249,250,.42)",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.72,
              fontWeight: 300,
            }}
          >
            Every feature designed around how teams actually work — together, async,
            across tools and timezones. No compromises.
          </p>
        </div>

        {/* Feature cards grid */}
        <div
          className="features-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="feature-card-glow"
                style={{ padding: "32px 28px 28px" }}
              >
                {/* Animated top border line */}
                <div
                  className="card-top-line"
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)`,
                    transformOrigin: "left",
                    transform: "scaleX(0)",
                  }}
                />

                {/* Subtle corner accent */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: 60, height: 60,
                  background: `radial-gradient(circle at 100% 0%, ${f.accent}10, transparent 70%)`,
                }} />

                {/* Icon */}
                <div
                  className="card-icon-wrap"
                  style={{
                    width: 48, height: 48,
                    borderRadius: 13,
                    marginBottom: 22,
                    background: `${f.accent}10`,
                    border: `1px solid ${f.accent}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1,
                    boxShadow: `0 0 20px ${f.accent}14`,
                  }}
                >
                  <Icon size={20} color={f.accent} strokeWidth={1.8} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 17,
                    color: "#F8F9FA", marginBottom: 12, letterSpacing: "-0.02em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "rgba(248,249,250,.4)",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    marginBottom: 22,
                  }}
                >
                  {f.desc}
                </p>

                {/* Stat chip */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    display: "inline-flex", flexDirection: "column", alignItems: "center",
                    padding: "6px 14px",
                    background: `${f.accent}0A`,
                    border: `1px solid ${f.accent}20`,
                    borderRadius: 8,
                  }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 18, color: f.accent, letterSpacing: "-0.03em" }}>
                      {f.stat}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: `${f.accent}60`, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>
                      {f.statLabel}
                    </span>
                  </div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${f.accent}15, transparent)` }} />
                </div>

                {/* Card index */}
                <div
                  style={{
                    position: "absolute", bottom: 16, right: 18,
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                    color: `${f.accent}20`, letterSpacing: ".1em",
                  }}
                >
                  0{i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
