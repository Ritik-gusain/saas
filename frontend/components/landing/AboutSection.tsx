"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const reveals = textRef.current.querySelectorAll(".reveal-text");
        gsap.fromTo(reveals, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.15,
            ease: "expo.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
            }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="scrolly-section"
      data-bg="#0E1218"
      data-text="#FFFFFF"
      style={{
        padding: "160px 24px",
        position: "relative",
        background: "var(--landing-bg2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden"
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.1 }} />
      
      {/* Corner Markers to fill space */}
      <div className="corner-marker corner-tl" />
      <div className="corner-marker corner-tr" />
      <div className="corner-marker corner-bl" />
      <div className="corner-marker corner-br" />
      
      <div ref={textRef} style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
        <div className="mono-label reveal-text" style={{ color: "var(--landing-purple)", marginBottom: 32 }}>
          THE MISSION // 02
        </div>
        
        <h2 className="display-h1 reveal-text" style={{ fontSize: "clamp(32px, 5vw, 56px)", marginBottom: 40, lineHeight: 1.1 }}>
          Reclaiming the <span className="shimmer-text">Neural Workspace.</span>
        </h2>
        
        <p className="reveal-text" style={{ 
          fontSize: "clamp(18px, 2vw, 24px)", 
          color: "rgba(255, 255, 255, 0.95)", 
          lineHeight: 1.6,
          fontWeight: 400,
          marginBottom: 32
        }}>
          Luminescent was built on a simple premise: AI should amplify team intelligence without sacrificing privacy or performance. 
        </p>
        
        <p className="reveal-text" style={{ 
          fontSize: 18, 
          color: "var(--landing-muted)", 
          lineHeight: 1.8,
          maxWidth: 640,
          margin: "0 auto"
        }}>
          We provide the orchestration layer that allows organizations to securely deploy, manage, and scale AI models across their entire workflow. From private nodes to collaborative agents, we're building the substrate for the next generation of knowledge work.
        </p>

        {/* Technical Callouts to fill space */}
        <div className="reveal-text" style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 40, 
          marginTop: 60,
          padding: "30px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          {[
            { label: "LATENCY", value: "< 24ms", color: "var(--landing-green)" },
            { label: "ENCRYPTION", value: "AES-256-GCM", color: "var(--landing-cyan)" },
            { label: "RELIABILITY", value: "99.99%", color: "var(--landing-purple)" }
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: "left" }}>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontFamily: "var(--font-mono)", color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "-10%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-5%",
        width: 500,
        height: 500,
        background: "radial-gradient(circle, rgba(0,255,170,0.05) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />
    </section>
  );
}
