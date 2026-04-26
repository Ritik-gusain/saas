"use client";

import { useEffect, useRef } from "react";
import { Globe, Users, Brain, TrendingUp, ChevronRight } from "lucide-react";
import gsap from "gsap";

const STEPS = [
  { num: "01", title: "Create Your Workspace", desc: "Sign up free and bring your own API key. No credit card. Your workspace is ready in 30 seconds.", icon: Globe },
  { num: "02", title: "Invite Your Team", desc: "Add teammates with one click. Roles, permissions, and shared context are set up automatically.", icon: Users },
  { num: "03", title: "Deploy AI Agents", desc: "Upload your SOPs. Configure specialized agents per workflow — sales, support, growth, research.", icon: Brain },
  { num: "04", title: "Collaborate & Scale", desc: "Every conversation, prompt, and output is searchable and shared across your team in real time.", icon: TrendingUp },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      
      // Animate the connecting line
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power3.inOut", scrollTrigger: { trigger: ref.current, start: "top 75%" } }
        );
      }

      Array.from(ref.current.children).forEach((child, i) => {
        gsap.fromTo(child,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: .8, delay: i * .15, ease: "power3.out",
            scrollTrigger: { trigger: child, start: "top 88%" }
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="agents" style={{ padding: "120px 0", background: "linear-gradient(180deg, #101418, #0D1117)", position: "relative", overflow: "hidden" }}>
      {/* Decorative background elements */}
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,255,.03) 0%, transparent 70%)", filter: "blur(60px)" }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <ChevronRight size={11} /> How It Works
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16,
          }}>
            From zero to team AI<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>in four steps.</span>
          </h2>
        </div>

        {/* Connecting line (desktop only) */}
        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
          <div 
            ref={lineRef}
            style={{ 
              position: "absolute", 
              top: 60, 
              left: "12.5%", 
              right: "12.5%", 
              height: 2, 
              background: "linear-gradient(90deg, rgba(0,255,170,.1), rgba(0,208,255,.1), rgba(0,255,170,.1))",
              transformOrigin: "left center",
              display: "none",
            }} 
            className="connecting-line"
          />
        </div>

        <div ref={ref} className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, position: "relative", zIndex: 2 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCyan = i % 2 === 1;
            const accent = isCyan ? "#00D0FF" : "#00FFAA";
            return (
              <div key={step.num} className="cyber-card" style={{
                background: isCyan ? "rgba(0,92,105,.1)" : "rgba(0,255,170,.03)",
                border: `1px solid ${isCyan ? "rgba(0,208,255,.1)" : "rgba(0,255,170,.08)"}`,
                padding: "32px 26px",
                textAlign: "center",
              }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 11,
                  color: accent, letterSpacing: ".15em", display: "block", marginBottom: 16,
                }}>
                  {step.num}
                </span>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                  background: `${accent}0D`, border: `1px solid ${accent}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                }}>
                  <Icon size={20} color={accent} />
                </div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15.5, color: "#F8F9FA", marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(248,249,250,.38)", lineHeight: 1.72, fontWeight: 300 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .connecting-line { display: block !important; }
        }
      `}</style>
    </section>
  );
}
