"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card reveal with subtle parallax
      if (cardRef.current) {
        gsap.fromTo(cardRef.current, 
          { scale: 0.95, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Content stagger
      if (contentRef.current) {
        const reveals = contentRef.current.querySelectorAll(".reveal-text");
        gsap.fromTo(reveals, 
          { y: "100%", opacity: 0, rotateX: 20, scale: 0.95 },
          {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.5,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Magnetic Button Effect
      if (magneticBtnRef.current) {
        const btn = magneticBtnRef.current;
        const moveBtn = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = btn.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          
          gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const resetBtn = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        };

        btn.addEventListener("mousemove", moveBtn);
        btn.addEventListener("mouseleave", resetBtn);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scrolly-section"
      data-bg="var(--nvg-blue)"
      data-text="white"
      style={{
        padding: "120px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={cardRef}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "rgba(13, 16, 24, 0.4)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 40,
          padding: "100px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Gradients */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle at center, rgba(0, 255, 170, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <div ref={contentRef} style={{ position: "relative", zIndex: 2 }}>
          <div className="reveal-container">
            <div className="mono-label reveal-text" style={{ marginBottom: 24, display: "block" }}>
              05 → GET STARTED
            </div>
          </div>

          <h2 className="display-h1" style={{ fontSize: "clamp(32px, 5vw, 72px)", marginBottom: 32 }}>
            <div className="reveal-container">
              <span className="reveal-text">The future of team AI is</span>
            </div>
            <br />
            <div className="reveal-container">
              <span className="reveal-text shimmer-text">Luminescent.</span>
            </div>
          </h2>

          <div className="reveal-container">
            <p className="reveal-text" style={{
              fontSize: 19,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 500,
              margin: "0 auto 48px",
              lineHeight: 1.6
            }}>
              Join 14,000+ teams engineering the next generation of collaborative intelligence.
            </p>
          </div>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <Link 
              href="/register" 
              ref={magneticBtnRef}
              className="btn-primary" 
              style={{ padding: "18px 48px", fontSize: 17 }}
            >
              Start Building Free <ArrowRight size={18} />
            </Link>
            
            <a href="#docs" className="btn-ghost" style={{ padding: "18px 40px", fontSize: 16 }}>
              <Globe size={18} /> View Documentation
            </a>
          </div>

          {/* Trust Badges */}
          <div style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "center",
            gap: 60,
            opacity: 0.6,
          }}>
            {[
              { val: "14.2k", label: "Active Nodes" },
              { val: "99.9%", label: "System Uptime" },
              { val: "Enterprise", label: "Security Ready" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 4 }}>
                  {stat.val}
                </div>
                <div className="mono-label" style={{ fontSize: 9 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
