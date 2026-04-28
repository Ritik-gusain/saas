"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import gsap from "gsap";


export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard against React 18 Strict Mode double-invoke (prevents removeChild crash)
    let ctx: ReturnType<typeof gsap.context> | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        if (badgeRef.current) {
          tl.fromTo(badgeRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
          );
        }
        if (contentRef.current) {
          tl.fromTo(
            Array.from(contentRef.current.children),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
            "-=0.4"
          );
        }


        // Floating orbs — target by ref, not class selector, to avoid cross-component conflicts
        if (sectionRef.current) {
          const orbs = sectionRef.current.querySelectorAll<HTMLElement>(".hero-orb");
          orbs.forEach((orb, i) => {
            gsap.to(orb, {
              y: i % 2 === 0 ? -22 : 18,
              x: i % 2 === 0 ? 10 : -14,
              duration: 5 + i * 0.8,
              repeat: -1, yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.9,
            });
          });
        }
      }, sectionRef);
    }, 0);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0A0D12",
        padding: "120px 24px 80px",
      }}
    >
      {/* ── Grid bg ── */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* ── Ambient orbs ── */}
      <div className="hero-orb" style={{
        position: "absolute", top: "8%", left: "12%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,170,.08) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div className="hero-orb" style={{
        position: "absolute", top: "20%", right: "10%",
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,208,255,.07) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div className="hero-orb" style={{
        position: "absolute", bottom: "15%", left: "35%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(123,97,255,.05) 0%, transparent 70%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      {/* ── Corner HUD brackets ── */}
      {([
        { top: 20, left: 20,   borderTop: "1.5px solid", borderLeft: "1.5px solid"   },
        { top: 20, right: 20,  borderTop: "1.5px solid", borderRight: "1.5px solid"  },
        { bottom: 20, left: 20,  borderBottom: "1.5px solid", borderLeft: "1.5px solid"  },
        { bottom: 20, right: 20, borderBottom: "1.5px solid", borderRight: "1.5px solid" },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{
          position: "absolute", ...s,
          width: 22, height: 22,
          borderColor: "rgba(0,255,170,0.2)",
          zIndex: 2, pointerEvents: "none",
        }} />
      ))}

      {/* ── SYS badge ── */}
      <div style={{
        position: "absolute", top: 22, right: 28, zIndex: 2,
        fontFamily: "'DM Mono', monospace",
        fontSize: 9, color: "rgba(255,255,255,0.14)",
        letterSpacing: "0.15em", pointerEvents: "none",
      }}>
        SYS · LUMINESCENT v2.1
      </div>

      {/* ── Eyebrow badge ── */}
      <div ref={badgeRef} style={{ position: "relative", zIndex: 5, marginBottom: 28 }}>
        <div className="tag">
          <Sparkles size={11} /> Now Supporting 40+ AI Models
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        style={{
          position: "relative", zIndex: 5,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          gap: 24, maxWidth: 860, width: "100%",
        }}
      >
        {/* Headline */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(42px, 7.5vw, 88px)",
          lineHeight: 0.96,
          letterSpacing: "-0.045em",
          color: "#F8F9FA",
          margin: 0,
        }}>
          Free for individuals.<br />
          <span className="shimmer-text">Powerful for teams.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(15px, 1.5vw, 18px)",
          color: "rgba(248,249,250,0.46)",
          maxWidth: 520, lineHeight: 1.72,
          fontWeight: 300, margin: 0,
        }}>
          The world&apos;s most advanced AI collaboration platform.
          Bring your own keys. Own your data. Collaborate at lightspeed.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/register" className="btn-primary" style={{ padding: "16px 40px", fontSize: 15 }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn-ghost" style={{ padding: "15px 28px", fontSize: 15 }}>
            <Zap size={14} /> Explore Features
          </a>
        </div>

        {/* Stats strip */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(20px)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          marginTop: 8,
        }}>
          {[
            { label: "Active Teams", val: "14.2k+", accent: "#00FFAA" },
            { label: "AI Models",    val: "40+",    accent: "#00D0FF" },
            { label: "Sync Speed",   val: "8ms",    accent: "#00FFAA" },
            { label: "Uptime",       val: "99.99%", accent: "#00D0FF" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              padding: "18px 32px", textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: 21,
                color: s.accent, letterSpacing: "-0.03em",
              }}>{s.val}</div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9, color: "rgba(248,249,250,0.25)",
                textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ── Bottom fade ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to bottom, transparent, #0A0D12)",
        zIndex: 4, pointerEvents: "none",
      }} />
    </section>
  );
}
