"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } }
    );
  }, []);

  const corners = [
    { top: 0, left: 0, borderTop: "2px solid #00FFAA", borderLeft: "2px solid #00FFAA" },
    { top: 0, right: 0, borderTop: "2px solid #00D0FF", borderRight: "2px solid #00D0FF" },
    { bottom: 0, left: 0, borderBottom: "2px solid #00FFAA", borderLeft: "2px solid #00FFAA" },
    { bottom: 0, right: 0, borderBottom: "2px solid #00D0FF", borderRight: "2px solid #00D0FF" },
  ] as const;

  return (
    <section style={{ padding: "80px 40px", background: "#101418", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,255,170,.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      
      <div ref={ref} style={{
        maxWidth: 900, margin: "0 auto",
        background: "linear-gradient(135deg, rgba(0,92,105,.22) 0%, rgba(0,208,255,.04) 100%)",
        border: "1px solid rgba(0,208,255,.14)",
        borderRadius: 20, padding: "72px 60px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 1,
          background: "linear-gradient(90deg, transparent, #00FFAA66, #00D0FF66, transparent)",
        }} />

        {corners.map((c, i) => (
          <div key={i} style={{ position: "absolute", width: 22, height: 22, borderRadius: 2, ...c }} />
        ))}

        <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>
          <Zap size={11} /> Start Today
        </span>
        <h2 style={{
          fontFamily: "Montserrat, sans-serif", fontWeight: 900,
          fontSize: "clamp(32px,3.5vw,52px)", letterSpacing: "-0.04em", lineHeight: 1.1,
          color: "#F8F9FA", marginBottom: 14, marginTop: 16,
        }}>
          Your team deserves<br />better AI tooling.
        </h2>
        <p style={{
          fontSize: 15.5, color: "rgba(248,249,250,.42)", lineHeight: 1.7,
          fontWeight: 300, maxWidth: 420, margin: "0 auto 40px",
        }}>
          No per-seat pricing. No hidden fees. Bring your own key and collaborate at scale from day one.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "15px 34px" }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn-ghost">Explore Features</a>
        </div>
      </div>
    </section>
  );
}
