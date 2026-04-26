"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Brain, Zap, Workflow, TrendingUp, Lock } from "lucide-react";
import gsap from "gsap";

const FEATURES = [
  { icon: MessageSquare, title: "Shared Chat History", accent: "#00FFAA", desc: "Your team's entire AI conversation history in one searchable place. Reference and build on each other's work." },
  { icon: Brain, title: "Custom AI Agents", accent: "#00D0FF", desc: "Deploy specialized agents trained on your SOPs. One focused agent per workflow — sales, support, growth." },
  { icon: Zap, title: "Smart Prompt Library", accent: "#00FFAA", desc: "Save, share, and version-control your best prompts. Stop re-engineering the same prompts every sprint." },
  { icon: Workflow, title: "Projects & Folders", accent: "#00D0FF", desc: "Organize AI work by client or sprint. Files, outputs, and conversations — all structured the way you think." },
  { icon: TrendingUp, title: "Token Efficiency", accent: "#00FFAA", desc: "Team-wide shared context means 60% fewer tokens spent. Less waste, significantly more output per rupee." },
  { icon: Lock, title: "Enterprise Security", accent: "#00D0FF", desc: "SSO, RBAC, and full audit logs. Your IP stays yours — never used to train any public models." },
];

export function FeaturesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: headRef.current, start: "top 82%" } }
      );
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: .8, delay: i * .1, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" style={{ padding: "120px 0", background: "#101418", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,255,170,.15), transparent)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <Zap size={11} /> Capabilities
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16, marginBottom: 14,
          }}>
            Built for teams.<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>Not just you.</span>
          </h2>
          <p style={{ fontSize: 15.5, color: "rgba(248,249,250,.42)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Every feature designed around how teams actually work — together, async, across tools and timezones.
          </p>
        </div>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} ref={el => { cardsRef.current[i] = el; }} className="cyber-card" style={{ padding: "30px" }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${f.accent}44, transparent)`,
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 10, marginBottom: 20,
                  background: `${f.accent}0F`, border: `1px solid ${f.accent}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={19} color={f.accent} />
                </div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16.5, color: "#F8F9FA", marginBottom: 10, letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13.5, color: "rgba(248,249,250,.42)", lineHeight: 1.72, fontWeight: 300 }}>{f.desc}</p>
                <div style={{
                  position: "absolute", bottom: 14, right: 16,
                  fontFamily: "'DM Mono',monospace", fontSize: 10, color: `${f.accent}30`, letterSpacing: ".1em",
                }}>
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
