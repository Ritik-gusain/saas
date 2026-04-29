"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context> | null = null;
    
    // Slight delay to ensure hydration and assets are ready
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // 1. Initial Entrance
        if (bgImageRef.current) {
          gsap.fromTo(bgImageRef.current,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 0.4, duration: 2.5, ease: "power2.out" }
          );
        }

        if (badgeRef.current) {
          tl.fromTo(badgeRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.5
          );
        }

        if (contentRef.current) {
          tl.fromTo(
            Array.from(contentRef.current.children),
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
            "-=0.7"
          );
        }

        // 2. Parallax Effect on Scroll
        if (bgImageRef.current && sectionRef.current) {
          gsap.to(bgImageRef.current, {
            y: "20%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
          });
        }

        // 3. Floating Content Animation
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            y: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }

        // 4. Floating Orbs
        if (sectionRef.current) {
          const orbs = sectionRef.current.querySelectorAll<HTMLElement>(".hero-orb");
          orbs.forEach((orb, i) => {
            gsap.to(orb, {
              y: i % 2 === 0 ? -30 : 25,
              x: i % 2 === 0 ? 15 : -20,
              duration: 6 + i,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.5,
            });
          });
        }
      }, sectionRef);
    }, 100);

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
      {/* ── Background Video Layer ── */}
      <div 
        ref={bgImageRef}
        style={{
          position: "absolute",
          inset: "-10% 0", // Overlap for parallax movement
          zIndex: 0,
          overflow: "hidden", // Ensure watermark crop stays hidden
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/landing-bg.png"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            filter: "brightness(0.7) contrast(1.1)",
            transform: "scale(1.06)", // Slight over-scale to hide corner watermarks (Veo)
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Grid bg Overlay ── */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.3 }} />

      {/* ── Ambient orbs ── */}
      <div className="hero-orb" style={{
        position: "absolute", top: "10%", left: "5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,170,.12) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 2,
      }} />
      <div className="hero-orb" style={{
        position: "absolute", bottom: "10%", right: "5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(123,97,255,.1) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 2,
      }} />

      {/* ── Vignette / Dark Gradient Overlays ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, transparent 0%, #0A0D12 100%)",
        opacity: 0.6, zIndex: 3, pointerEvents: "none",
      }} />

      {/* ── Corner HUD brackets ── */}
      {([
        { top: 40, left: 40,   borderTop: "1.5px solid", borderLeft: "1.5px solid"   },
        { top: 40, right: 40,  borderTop: "1.5px solid", borderRight: "1.5px solid"  },
        { bottom: 40, left: 40,  borderBottom: "1.5px solid", borderLeft: "1.5px solid"  },
        { bottom: 40, right: 40, borderBottom: "1.5px solid", borderRight: "1.5px solid" },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{
          position: "absolute", ...s,
          width: 30, height: 30,
          borderColor: "rgba(0,255,170,0.3)",
          zIndex: 4, pointerEvents: "none",
        }} />
      ))}

      {/* ── SYS badge ── */}
      <div style={{
        position: "absolute", top: 32, right: 40, zIndex: 4,
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.2em", pointerEvents: "none",
      }}>
        LUMINESCENT // CORE_OS v2.5
      </div>

      {/* ── Eyebrow badge ── */}
      <div ref={badgeRef} style={{ position: "relative", zIndex: 10, marginBottom: 32 }}>
        <div className="tag" style={{ backdropFilter: "blur(12px)", background: "rgba(0,255,170,0.08)" }}>
          <Sparkles size={11} /> Now Supporting 40+ AI Models
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          gap: 28, maxWidth: 900, width: "100%",
        }}
      >
        {/* Headline */}
        <h1 className="display-h1" style={{
          fontSize: "clamp(54px, 9vw, 104px)",
          color: "#F8F9FA",
          margin: 0,
          textShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}>
          Free for individuals.<br />
          <span className="shimmer-text">Powerful for teams.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(17px, 1.7vw, 20px)",
          color: "rgba(248,249,250,0.6)",
          maxWidth: 620, lineHeight: 1.6,
          fontWeight: 400, margin: "10px 0 0",
        }}>
          The world&apos;s most advanced AI collaboration platform.
          Bring your own keys. Own your data. Collaborate at lightspeed.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginTop: 15 }}>
          <Link href="/register" className="btn-primary">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn-ghost">
            <Zap size={16} /> Explore Features
          </a>
        </div>

        {/* Stats strip */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(30px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginTop: 40,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}>
          {[
            { label: "Active Teams", val: "14.2k+", accent: "#00FFAA" },
            { label: "AI Models",    val: "40+",    accent: "#00D0FF" },
            { label: "Sync Speed",   val: "8ms",    accent: "#00FFAA" },
            { label: "Uptime",       val: "99.99%", accent: "#00D0FF" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              padding: "24px 48px", textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-header)",
                fontWeight: 700, fontSize: 28,
                color: s.accent, letterSpacing: "-0.04em",
              }}>{s.val}</div>
              <div className="mono-label" style={{ 
                fontSize: 10, color: "rgba(248,249,250,0.4)", 
                marginTop: 6 
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ── Bottom fade ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
        background: "linear-gradient(to bottom, transparent, #0A0D12)",
        zIndex: 15, pointerEvents: "none",
      }} />
    </section>
  );
}
