"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


const PLANS = [
  {
    name: "Individual", price: "Free", period: "",
    desc: "Bring Your Own Key. Unrestricted personal use.",
    highlight: false, accent: "#00FFAA",
    features: ["Bring your own API key", "No subscription required", "All AI models supported", "Basic chat & local history"],
  },
  {
    name: "Starter", price: "₹999", period: "/mo",
    desc: "Small startups getting started with AI collaboration.",
    highlight: false, accent: "#00FFAA",
    features: ["BYOK", "Up to 3 team members", "Shared AI chatbot", "Shared history", "Email support"],
  },
  {
    name: "Growth", price: "₹2,499", period: "/mo",
    desc: "The sweet spot for teams scaling fast.",
    highlight: true, accent: "#00D0FF",
    features: ["BYOK", "Up to 7 members", "Projects & folders", "Team system prompts", "Usage analytics", "Priority support"],
  },
  {
    name: "Pro", price: "₹3,999", period: "/mo",
    desc: "Advanced capability for larger departments.",
    highlight: false, accent: "#00FFAA",
    features: ["BYOK", "Up to 12 members", "Custom AI agents", "API access", "Dedicated account manager", "24/7 priority support"],
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      Array.from(ref.current.children).forEach((child, i) => {
        gsap.fromTo(child,
          { y: 60, opacity: 0, scale: .92 },
          {
            y: 0, opacity: 1, scale: 1, duration: .9, delay: i * .12, ease: "power3.out",
            scrollTrigger: { trigger: child, start: "top 80%" }
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" style={{ padding: "120px 0", background: "#101418", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,208,255,.12), transparent)",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <Zap size={11} /> Pricing
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16, marginBottom: 14,
          }}>
            Flat team pricing.<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>No per-seat surprises.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(248,249,250,.4)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            One subscription. Your whole company uses it. Stop doing math on headcount.
          </p>
        </div>

        <div ref={ref} className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? "rgba(0,92,105,.18)" : "#161B21",
              border: plan.highlight ? "1px solid rgba(0,208,255,.28)" : "1px solid rgba(255,255,255,.055)",
              borderRadius: 16, padding: "34px 26px",
              display: "flex", flexDirection: "column", gap: 22,
              position: "relative",
              boxShadow: plan.highlight ? "0 0 60px rgba(0,208,255,.07), inset 0 1px 0 rgba(0,208,255,.1)" : "none",
              transition: plan.highlight ? "none" : "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s",
            }}
              onMouseOver={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.2)"; } }}
              onMouseOut={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.055)"; } }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
                  color: "#101418", fontFamily: "'DM Mono',monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
                  padding: "5px 16px", borderRadius: 40, boxShadow: "0 4px 20px rgba(0,208,255,.3)",
                }}>
                  Most Popular
                </div>
              )}

              <div>
                <div style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 500,
                  color: plan.accent, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14,
                }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 40, color: "#F8F9FA", letterSpacing: "-0.04em" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(248,249,250,.28)" }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(248,249,250,.38)", lineHeight: 1.6, fontWeight: 300 }}>{plan.desc}</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,.05)" }} />

              <ul style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "rgba(248,249,250,.48)", fontWeight: 300 }}>
                    <div style={{
                      width: 15, height: 15, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      background: `${plan.accent}12`, border: `1px solid ${plan.accent}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={8} color={plan.accent} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                style={{
                  width: "100%", padding: "13px", borderRadius: 8,
                  background: plan.highlight ? "linear-gradient(135deg, #00FFAA, #00D0FF)" : "transparent",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,.1)",
                  color: plan.highlight ? "#101418" : "rgba(248,249,250,.5)",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: ".03em",
                  cursor: "pointer", transition: "all .25s",
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none"
                }}
                onMouseOver={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.35)"; (e.currentTarget as HTMLElement).style.color = "#00FFAA"; (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,.04)"; } }}
                onMouseOut={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.5)"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
              >
                {plan.price === "Free" ? "Start Free" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
