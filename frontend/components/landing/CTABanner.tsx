"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Particle = { top: string; left: string; size: number; color: string; opacity: number };

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  // Empty on server — populated client-side to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on the client so Math.random() never runs on the server
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        top: `${10 + Math.random() * 80}%`,
        left: `${5 + Math.random() * 90}%`,
        size: Math.random() * 3 + 2,
        color: i % 3 === 0 ? "#00FFAA" : i % 3 === 1 ? "#00D0FF" : "#A78BFA",
        opacity: 0.2 + Math.random() * 0.25,
      }))
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card reveal with scale + glow
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { y: 60, opacity: 0, scale: 0.93 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: cardRef.current, start: "top 80%" },
          }
        );
      }

      // Content children stagger
      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: contentRef.current, start: "top 78%", delay: 0.2 },
          }
        );
      }

      // Floating particles
      if (particlesRef.current) {
        Array.from(particlesRef.current.children).forEach((p) => {
          gsap.to(p, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            duration: `random(3, 6)`,
            repeat: -1, yoyo: true,
            ease: "sine.inOut",
            delay: `random(0, 2)`,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);



  return (
    <section
      ref={sectionRef}
      style={{ padding: "100px 40px", background: "var(--landing-bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        className="section-orb"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, background: "radial-gradient(ellipse, rgba(0,255,170,.04) 0%, transparent 65%)" }}
      />

      {/* CTA card */}
      <div
        ref={cardRef}
        style={{
          maxWidth: 950, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(0,92,105,.28) 0%, rgba(0,208,255,.06) 50%, rgba(10,13,18,.8) 100%)",
          border: "1px solid rgba(0,208,255,.18)",
          borderRadius: 28, padding: "88px 60px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 120px rgba(0,208,255,.05), 0 60px 120px rgba(0,0,0,.5), inset 0 1px 0 rgba(0,208,255,.12)",
        }}
      >
        {/* Animated top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #00FFAA88, #00D0FF88, transparent)",
          backgroundSize: "200% auto",
          animation: "shimmer 4s linear infinite",
        }} />

        {/* Corner brackets */}
        {[
          { top: 18, left: 18, borderTop: "2px solid", borderLeft: "2px solid" },
          { top: 18, right: 18, borderTop: "2px solid", borderRight: "2px solid" },
          { bottom: 18, left: 18, borderBottom: "2px solid", borderLeft: "2px solid" },
          { bottom: 18, right: 18, borderBottom: "2px solid", borderRight: "2px solid" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 24, height: 24, borderRadius: 2,
            borderColor: "rgba(0,255,170,.3)",
            ...s,
          }} />
        ))}

        {/* Floating particles */}
        <div ref={particlesRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top, left: p.left,
                width: p.size, height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Background grid on card */}
        <div
          className="dot-pattern"
          style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}
        />

        {/* Content */}
        <div ref={contentRef} style={{ position: "relative", zIndex: 2 }}>
          <span className="tag" style={{ marginBottom: 24, display: "inline-flex" }}>
            <Sparkles size={11} /> Start Today
          </span>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(32px, 4.5vw, 58px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#F8F9FA",
              marginBottom: 18, marginTop: 16,
            }}
          >
            Your team deserves{" "}
            <span className="shimmer-text">better AI tooling.</span>
          </h2>

          <p
            style={{
              fontSize: 16.5, color: "rgba(248,249,250,.42)",
              lineHeight: 1.72, fontWeight: 300,
              maxWidth: 440, margin: "0 auto 44px",
            }}
          >
            No per-seat pricing. No hidden fees. Bring your own key and
            collaborate at scale from day one.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15.5, padding: "16px 38px" }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-ghost" style={{ fontSize: 15, padding: "15px 30px" }}>
              <Zap size={14} /> Explore Features
            </a>
          </div>

          {/* Social proof row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 24, marginTop: 48,
          }}>
            {[
              { val: "14.2k+", label: "Active teams" },
              { val: "40+", label: "AI models" },
              { val: "99.99%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: 22,
                  color: "#00FFAA",
                  letterSpacing: "-0.03em",
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, color: "rgba(248,249,250,.25)",
                  textTransform: "uppercase", letterSpacing: ".12em", marginTop: 3,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
