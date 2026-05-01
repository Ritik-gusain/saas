"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote: "The speed of deployment is unmatched. We went from zero to a fully managed AI node system in under an hour.",
    author: "Sarah Chen",
    role: "VP Engineering, CloudFlow",
    avatar: "SC"
  },
  {
    quote: "Finally, an AI platform that takes security as seriously as performance. Our enterprise data stays ours.",
    author: "Marcus Thorne",
    role: "CTO, Vanguard Systems",
    avatar: "MT"
  },
  {
    quote: "Luminescent has completely transformed how our research teams collaborate with large language models.",
    author: "Elena Rodriguez",
    role: "AI Lead, Quantum Research",
    avatar: "ER"
  }
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".testimonial-card");
        gsap.fromTo(cards, 
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
            }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{
        padding: "120px 24px",
        background: "var(--landing-bg)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className="mono-label" style={{ color: "var(--landing-green)", marginBottom: 16 }}>
            TRUSTED BY THE BEST // 04
          </div>
          <h2 className="header-h2" style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>
            Voices from the <span className="shimmer-text">Network.</span>
          </h2>
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: 32 
          }}
        >
          {testimonials.map((item, i) => (
            <div 
              key={i} 
              className="testimonial-card"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 24,
                padding: 40,
                position: "relative",
                transition: "transform 0.3s ease, background 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.transform = "translateY(-10px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Quote size={40} style={{ color: "var(--landing-green)", opacity: 0.2, marginBottom: 24 }} />
              <p style={{ 
                fontSize: 18, 
                lineHeight: 1.6, 
                color: "rgba(255,255,255,0.9)", 
                marginBottom: 32,
                fontStyle: "italic"
              }}>
                "{item.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: "50%", 
                  background: "linear-gradient(45deg, var(--landing-purple), var(--landing-cyan))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)"
                }}>
                  {item.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{item.author}</div>
                  <div style={{ fontSize: 13, color: "var(--landing-muted)" }}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative architectural lines to fill space */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "-5%",
        width: "30%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05))",
        transform: "rotate(-15deg)"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "-5%",
        width: "30%",
        height: "1px",
        background: "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)",
        transform: "rotate(15deg)"
      }} />
    </section>
  );
}
