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

      // Card cascade
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: i * 0.1,
            ease: "expo.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
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
      style={{ padding: "140px 24px", background: "#0A0D12", position: "relative" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 80 }}>

          <h2 className="display-h1" style={{ fontSize: "clamp(32px, 5vw, 64px)", marginBottom: 24 }}>
            Flat team pricing. <span className="shimmer-text">No surprises.</span>
          </h2>
          <p style={{ 
            fontFamily: "var(--font-body)", 
            color: "rgba(255,255,255,0.4)", 
            maxWidth: 500, 
            margin: "0 auto",
            fontSize: 18,
            lineHeight: 1.6
          }}>
            One subscription for your entire organization. 
            Bring your own keys, own your costs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="cyber-card"
              style={{
                padding: "48px 32px",
                display: "flex",
                flexDirection: "column",
                border: plan.highlight ? "1px solid rgba(0,255,170,0.2)" : "1px solid rgba(255,255,255,0.05)",
                background: plan.highlight ? "rgba(0,255,170,0.02)" : "rgba(255,255,255,0.01)",
                position: "relative",
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(0,255,170,0.1)",
                  color: "#00FFAA",
                  padding: "4px 12px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}>
                  MOST POPULAR
                </div>
              )}

              <div className="mono-label" style={{ color: plan.accent, marginBottom: 20, fontSize: 10 }}>
                {plan.name.toUpperCase()}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-header)", fontSize: 48, fontWeight: 700, color: "#FFF" }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>{plan.period}</span>
              </div>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 32 }}>
                {plan.desc}
              </p>

              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 32 }} />

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                    <Check size={16} color={plan.accent} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register" 
                className={plan.highlight ? "btn-primary" : "btn-ghost"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {plan.price === "Free" ? "Start Free" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mono-label" style={{ textAlign: "center", marginTop: 48, opacity: 0.3, fontSize: 10 }}>
          ALL PLANS INCLUDE BYOK // NO PER-SEAT PRICING // CANCEL ANYTIME
        </div>
      </div>
    </section>
  );
}
