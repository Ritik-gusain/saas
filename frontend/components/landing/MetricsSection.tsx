"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const metrics = [
  { val: "140k+", label: "ACTIVE AGENTS", color: "var(--landing-green)" },
  { val: "8ms", label: "AVG LATENCY", color: "var(--landing-cyan)" },
  { val: "2.4B", label: "TOKENS / DAY", color: "var(--landing-purple)" },
  { val: "99.9%", label: "UPTIME", color: "var(--landing-orange)" }
];

export function MetricsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".metric-item");
      if (items) {
        gsap.fromTo(items, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section 
      style={{
        padding: "80px 24px",
        background: "rgba(0,0,0,0.2)",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
        zIndex: 1
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40
        }}
      >
        {metrics.map((m, i) => (
          <div key={i} className="metric-item" style={{ textAlign: "center" }}>
            <div style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(40px, 6vw, 64px)", 
              fontWeight: 900, 
              color: "#FFF",
              letterSpacing: "-0.04em",
              marginBottom: 8
            }}>
              {m.val}
            </div>
            <div style={{ 
              fontFamily: "var(--font-mono)", 
              fontSize: 12, 
              color: m.color, 
              letterSpacing: "0.2em" 
            }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
