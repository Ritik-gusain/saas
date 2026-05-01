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
            { scale: 1, opacity: 0.8, duration: 2.5, ease: "power2.out" }
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
          const reveals = contentRef.current.querySelectorAll(".reveal-text");
          tl.fromTo(
            reveals,
            { y: "100%", opacity: 0, rotateX: 20, scale: 0.95 },
            { 
              y: "0%", 
              opacity: 1, 
              rotateX: 0, 
              scale: 1, 
              duration: 1.5, 
              stagger: 0.12, 
              ease: "expo.out" 
            },
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

        // 5. Magnetic Buttons
        const magBtns = sectionRef.current?.querySelectorAll(".btn-magnetic");
        magBtns?.forEach(btn => {
          const move = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = (btn as HTMLElement).getBoundingClientRect();
            const x = (clientX - (left + width/2)) * 0.25;
            const y = (clientY - (top + height/2)) * 0.25;
            gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
          };
          const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
          btn.addEventListener("mousemove", move as any);
          btn.addEventListener("mouseleave", reset);
        });

        // 6. Cursor Spotlight
        const spotlight = sectionRef.current?.querySelector(".hero-spotlight") as HTMLElement;
        const onMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top } = sectionRef.current!.getBoundingClientRect();
          gsap.to(spotlight, {
            left: clientX - left,
            top: clientY - top,
            duration: 0.8,
            ease: "power2.out"
          });
        };
        sectionRef.current?.addEventListener("mousemove", onMouseMove);

        // 7. Stats Glow
        const statsBar = sectionRef.current?.querySelector(".stats-bar") as HTMLElement;
        if (statsBar) {
          const onStatsMove = (e: MouseEvent) => {
            const { left, top, width, height } = statsBar.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            statsBar.style.setProperty("--x", `${x}%`);
            statsBar.style.setProperty("--y", `${y}%`);
          };
          statsBar.addEventListener("mousemove", onStatsMove);
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
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
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
            opacity: 0.8,
            filter: "brightness(0.9) contrast(1.05)",
            transform: "scale(1.06)", // Slight over-scale to hide corner watermarks (Veo)
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Grid bg Overlay ── */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.15 }} />

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
        opacity: 0.45, zIndex: 3, pointerEvents: "none",
      }} />

      {/* ── Cursor Spotlight ── */}
      <div className="hero-spotlight" style={{
        position: "absolute", width: 800, height: 800,
        background: "radial-gradient(circle, rgba(0,255,170,0.05) 0%, transparent 60%)",
        borderRadius: "50%", transform: "translate(-50%, -50%)",
        pointerEvents: "none", zIndex: 2, filter: "blur(40px)",
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



      {/* ── Eyebrow badge ── */}
      <div ref={badgeRef} style={{ position: "relative", zIndex: 10, marginBottom: 12 }}>
        <div className="step-number" style={{ width: "fit-content", minWidth: 400 }}>
          01 → INTRODUCTION
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
          fontSize: "clamp(54px, 8vw, 96px)",
          color: "#FFFFFF",
          margin: 0,
          textAlign: "center",
          textShadow: "0 0 80px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.9)",
          letterSpacing: "-0.06em",
          fontWeight: 900,
        }}>
          <div className="reveal-container">
            <span className="reveal-text">Infrastructure for the</span>
          </div>
          <br />
          <div className="reveal-container">
            <span className="reveal-text shimmer-text" style={{ fontStyle: "italic", paddingRight: "0.1em" }}>next intelligence.</span>
          </div>
        </h1>

        {/* Subheadline */}
        <div className="reveal-container">
          <p className="reveal-text" style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 1.6vw, 18px)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: 620, lineHeight: 1.7,
            fontWeight: 400, margin: "20px auto 0",
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}>
            Luminescent is a high-performance orchestration layer for team-based AI. 
            Bring your own models, own your context, and engineer at the speed of thought.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="reveal-container" style={{ marginTop: 15 }}>
          <div className="reveal-text" style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/register" className="btn-primary btn-magnetic">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <a href="#features" className="btn-ghost btn-magnetic">
              <Zap size={16} /> Explore Features
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div 
          className="stats-bar glow-card"
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(30px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginTop: 40,
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          }}
        >
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
