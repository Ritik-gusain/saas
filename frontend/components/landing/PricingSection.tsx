"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Zap, ArrowRight, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PLANS = [
  {
    name: "Individual",
    price: "Free",
    period: "",
    desc: "Bring Your Own Key. Full personal use, zero limits.",
    highlight: false,
    accent: "#00FFAA",
    features: [
      "Bring your own API key",
      "No subscription required",
      "All 40+ AI models",
      "Basic chat & local history",
    ],
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/mo",
    desc: "Small startups getting started with AI collaboration.",
    highlight: false,
    accent: "#00FFAA",
    features: [
      "BYOK — bring your own key",
      "Up to 3 team members",
      "Shared AI chatbot",
      "Shared history & search",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "₹2,499",
    period: "/mo",
    desc: "The sweet spot for teams scaling fast with AI.",
    highlight: true,
    accent: "#00D0FF",
    features: [
      "BYOK — bring your own key",
      "Up to 7 team members",
      "Projects & folders",
      "Team system prompts",
      "Usage analytics",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    price: "₹3,999",
    period: "/mo",
    desc: "Advanced capability for larger departments.",
    highlight: false,
    accent: "#00FFAA",
    features: [
      "BYOK — bring your own key",
      "Up to 12 members",
      "Custom AI agents",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
];

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headRef.current) {
        const reveals = headRef.current.querySelectorAll(".reveal-text");
        gsap.fromTo(reveals, 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headRef.current,
              start: "top 85%",
            },
          }
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            delay: i * 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{ padding: "160px 24px", position: "relative" }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.1 }} />
      <div className="grid-bg-fine" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05 }} />

      <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headRef} style={{ marginBottom: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 40 }}>
          <div style={{ maxWidth: 540 }}>
            <div className="mono-label reveal-text" style={{ color: "var(--landing-green)", marginBottom: 20 }}>
              04 → PROTOCOL ECONOMICS
            </div>
            <h2 className="display-h1 reveal-text" style={{ fontSize: "clamp(32px, 5vw, 64px)", marginBottom: 0 }}>
              Scalable power. <span className="shimmer-text">Predictable cost.</span>
            </h2>
          </div>
          <div className="reveal-text" style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 100, border: "1px solid rgba(255,255,255,0.06)" }}>
            <button style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: "var(--landing-green)", color: "#000", fontWeight: 600, fontSize: 13 }}>Monthly</button>
            <button style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: "transparent", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 13 }}>Yearly (-20%)</button>
          </div>
        </div>

        {/* Pricing Architecture */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24 }}>
          {/* Individual Plan (Aside) */}
          <div 
            ref={(el) => { cardsRef.current[0] = el; }}
            style={{ gridColumn: "span 3" }}
          >
            <div className="cyber-card" style={{ height: "100%", padding: "40px", borderStyle: "dashed" }}>
              <div className="mono-label" style={{ opacity: 0.4, marginBottom: 32 }}>CORE_NODE // v1.0</div>
              <h3 style={{ fontFamily: "var(--font-header)", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Individual</h3>
              <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 24 }}>Free</div>
              <p style={{ fontSize: 14, color: "var(--landing-muted)", marginBottom: 40, lineHeight: 1.6 }}>The baseline protocol. For individual engineers owning their own intelligence stack.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: 16 }}>
                {["Full BYOK Access", "Local Chat History", "All 40+ Models"].map(f => (
                  <li key={f} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", display: "flex", gap: 10 }}><Check size={14} color="var(--landing-green)" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>Initialize Solo</Link>
            </div>
          </div>

          {/* Team Plans (Primary) */}
          <div style={{ gridColumn: "span 9", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PLANS.slice(1).map((plan, i) => (
              <div 
                key={plan.name}
                ref={(el) => { cardsRef.current[i+1] = el; }}
                className="cyber-card glow-card"
                style={{ 
                  padding: "48px 40px",
                  background: plan.highlight ? "rgba(255,255,255,0.03)" : "rgba(10,13,18,0.4)",
                  borderColor: plan.highlight ? "rgba(0,255,170,0.2)" : "rgba(255,255,255,0.05)",
                  transform: plan.highlight ? "scale(1.02)" : "none",
                  zIndex: plan.highlight ? 2 : 1,
                } as any}
              >
                {plan.highlight && (
                   <div style={{ position: "absolute", top: 24, right: 24 }}><Star size={16} color="var(--landing-green)" fill="var(--landing-green)" /></div>
                )}
                <div className="mono-label" style={{ color: plan.accent, marginBottom: 24 }}>L-NODE // {plan.name.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 44, fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ fontSize: 14, opacity: 0.3 }}>/mo</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 40, minHeight: 44 }}>{plan.desc}</p>
                
                <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 32 }} />
                
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: 18 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", display: "flex", gap: 12 }}>
                      <Check size={16} color={plan.accent} style={{ flexShrink: 0 }} /> 
                      {f}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/register" 
                  className={plan.highlight ? "btn-primary" : "btn-ghost"}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Deploy Node
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Footer */}
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 40, opacity: 0.2 }}>
           {["ISO 27001", "SOC2 TYPE II", "GDPR COMPLIANT", "256-BIT ENCRYPTION"].map(s => (
             <div key={s} className="mono-label" style={{ fontSize: 8 }}>{s}</div>
           ))}
        </div>
      </div>
    </section>
  );
}
