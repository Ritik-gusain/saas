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
        gsap.fromTo(
          Array.from(headRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headRef.current, start: "top 82%" },
          }
        );
      }

      // Card cascade
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const isHighlight = PLANS[i]?.highlight;
        gsap.fromTo(card,
          { y: 70, opacity: 0, scale: isHighlight ? 0.9 : 0.93 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          }
        );

        // Animate feature list items
        const items = Array.from(card.querySelectorAll<HTMLElement>(".plan-feature-item"));
        gsap.fromTo(items,
          { x: -12, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: i * 0.1 + 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
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
      style={{ padding: "130px 0 120px", background: "var(--landing-bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background orb */}
      <div
        className="section-orb"
        style={{ top: "30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, background: "radial-gradient(ellipse, rgba(0,208,255,.03) 0%, transparent 65%)" }}
      />

      <div className="glow-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 80 }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>
            <Zap size={11} /> Pricing
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
            Flat team pricing.{" "}
            <span style={{ color: "rgba(248,249,250,.28)" }}>No per-seat surprises.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(248,249,250,.4)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            One subscription. Your whole company uses it. Stop doing math on headcount.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={(el) => {
            if (el) {
              Array.from(el.children).forEach((child, i) => {
                cardsRef.current[i] = child as HTMLDivElement;
              });
            }
          }}
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.highlight ? "pricing-featured" : "cyber-card"}`}
              style={{
                padding: "36px 28px 32px",
                background: plan.highlight
                  ? "linear-gradient(145deg, rgba(0,92,105,.25) 0%, rgba(0,208,255,.07) 100%)"
                  : "var(--landing-surface)",
                border: plan.highlight
                  ? "1px solid rgba(0,208,255,.3)"
                  : "1px solid var(--landing-border)",
                boxShadow: plan.highlight
                  ? "0 0 80px rgba(0,208,255,.08), 0 40px 80px rgba(0,0,0,.4), inset 0 1px 0 rgba(0,208,255,.12)"
                  : "none",
                marginTop: plan.highlight ? "-12px" : 0,
                paddingTop: plan.highlight ? "48px" : "36px",
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
                    color: "#0A0D12",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase",
                    padding: "5px 18px", borderRadius: 40,
                    boxShadow: "0 4px 24px rgba(0,208,255,.35)",
                    display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                  }}
                >
                  <Star size={9} fill="#0A0D12" /> Most Popular
                </div>
              )}

              {/* Animated top-line on featured */}
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, #00FFAA, #00D0FF, #00FFAA)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 3s linear infinite",
                }} />
              )}

              {/* Plan name */}
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                color: plan.accent, letterSpacing: ".18em", textTransform: "uppercase",
                marginBottom: 16,
              }}>
                {plan.name}
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900, fontSize: 42,
                  color: "#F8F9FA", letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 13, color: "rgba(248,249,250,.3)", fontFamily: "'DM Mono', monospace" }}>
                  {plan.period}
                </span>
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(248,249,250,.38)", lineHeight: 1.65, fontWeight: 300, marginBottom: 22 }}>
                {plan.desc}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: plan.highlight ? "rgba(0,208,255,.12)" : "rgba(255,255,255,.05)", marginBottom: 22 }} />

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="plan-feature-item"
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(248,249,250,.5)", fontWeight: 300 }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      background: `${plan.accent}12`,
                      border: `1px solid ${plan.accent}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={8} color={plan.accent} strokeWidth={2.5} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  background: plan.highlight
                    ? "linear-gradient(135deg, #00FFAA, #00D0FF)"
                    : "transparent",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,.1)",
                  color: plan.highlight ? "#0A0D12" : "rgba(248,249,250,.45)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: 13.5, letterSpacing: ".02em",
                  cursor: "pointer",
                  transition: "all .3s cubic-bezier(.16,1,.3,1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  boxShadow: plan.highlight ? "0 8px 32px rgba(0,208,255,.25)" : "none",
                }}
                onMouseOver={(e) => {
                  if (!plan.highlight) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.4)";
                    (e.currentTarget as HTMLElement).style.color = "#00FFAA";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,.05)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  } else {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,208,255,.35)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!plan.highlight) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.45)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  } else {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,208,255,.25)";
                  }
                }}
              >
                {plan.price === "Free" ? "Start Free" : "Get Started"}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center", marginTop: 36,
          fontSize: 12.5, color: "rgba(248,249,250,.2)",
          fontFamily: "'DM Mono', monospace", letterSpacing: ".06em",
        }}>
          All plans include BYOK · No per-seat pricing · Cancel anytime
        </p>
      </div>
    </section>
  );
}
