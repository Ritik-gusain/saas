"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const OPENROUTER_MODELS = [
  { name: "OpenAI",      logo: "/ai logo/penailogo.svg",      model: "GPT-4o / o1-preview",     invert: true,  accent: "#10A37F" },
  { name: "Claude",      logo: "/ai logo/Anthropic.svg",      model: "3.5 Sonnet / Opus",        invert: true,  accent: "#D97706" },
  { name: "Gemini",      logo: "/ai logo/GoogleGemini.svg",   model: "1.5 Pro / Flash",          invert: false, accent: "#4285F4" },
  { name: "DeepSeek",    logo: "/ai logo/DeepSeek.png",       model: "DeepSeek-V3 / R1",         invert: false, accent: "#00BFFF" },
  { name: "Mistral AI",  logo: "/ai logo/Mistral.png",        model: "Mistral Large 2",          invert: false, accent: "#FF7000" },
  { name: "Meta",        logo: "/ai logo/Meta.png",           model: "Llama 3.3 / 405B",         invert: false, accent: "#0081FB" },
  { name: "Qwen",        logo: "/ai logo/Qwen.png",           model: "Qwen 2.5 / 72B",           invert: false, accent: "#7B5EA7" },
  { name: "Nvidia",      logo: "/ai logo/nvidia.png",         model: "Llama-3.1-Nemotron",       invert: false, accent: "#76B900" },
  { name: "Perplexity",  logo: "/ai logo/Perplexity.svg",     model: "Sonar Pro / Llama 3",      invert: true,  accent: "#20B2AA" },
  { name: "Moonshot AI", logo: "/ai logo/moonshotai.png",     model: "Kimi k1.5",                invert: true,  accent: "#6366F1" },
  { name: "xAI",         logo: "/ai logo/xai.png",            model: "Grok 3 (Beta)",            invert: true,  accent: "#FFFFFF" },
];

export function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const row1Ref    = useRef<HTMLDivElement>(null);

  const tripled = [...OPENROUTER_MODELS, ...OPENROUTER_MODELS, ...OPENROUTER_MODELS];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 88%" } }
        );
      }

      const row = row1Ref.current;
      if (!row) return;
      row.addEventListener("mouseenter", () => {
        (row as HTMLElement).style.animationPlayState = "paused";
      });
      row.addEventListener("mouseleave", () => {
        (row as HTMLElement).style.animationPlayState = "running";
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "60px 0",
        background: "linear-gradient(180deg, rgba(10,13,18,0) 0%, rgba(0,92,105,0.06) 50%, rgba(10,13,18,0) 100%)",
        borderTop: "1px solid rgba(0,255,170,0.07)",
        borderBottom: "1px solid rgba(0,208,255,0.07)",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700, height: 200, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,255,170,0.05) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Title */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 36, position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,255,170,0.5))" }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "rgba(0,255,170,0.55)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(0,255,170,0.3)",
          }}>
            Seamless Integration with 40+ Leading AI Models
          </span>
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, rgba(0,255,170,0.5), transparent)" }} />
        </div>
      </div>

      {/* Ticker */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          ref={row1Ref}
          style={{
            display: "flex",
            gap: 16,
            animation: "ticker 60s linear infinite",
            width: "max-content",
            alignItems: "stretch",
            willChange: "transform",
          }}
        >
          {tripled.map((model, i) => (
            <div
              key={`${model.name}-${i}`}
              className="logo-ticker-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                opacity: 0.7,
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
                minWidth: "max-content",
                cursor: "default",
                backdropFilter: "blur(8px)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.opacity = "1";
                el.style.transform = "translateY(-4px)";
                el.style.background = `rgba(${hexToRgb(model.accent)}, 0.06)`;
                el.style.borderColor = `rgba(${hexToRgb(model.accent)}, 0.3)`;
                el.style.boxShadow = `0 8px 32px rgba(${hexToRgb(model.accent)}, 0.12), 0 0 0 1px rgba(${hexToRgb(model.accent)}, 0.08)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.opacity = "0.7";
                el.style.transform = "translateY(0)";
                el.style.background = "rgba(255,255,255,0.03)";
                el.style.borderColor = "rgba(255,255,255,0.06)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Logo */}
              <div style={{
                width: 34, height: 34, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <img
                  src={model.logo}
                  alt={model.name}
                  style={{
                    height: model.name === "OpenAI" ? 16 : 22,
                    width: "auto",
                    objectFit: "contain",
                    filter: model.invert
                      ? "invert(1) brightness(2)"
                      : "brightness(1.1) saturate(1.1)",
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#F8F9FA",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}>
                  {model.name}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  color: "rgba(248,249,250,0.28)",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}>
                  {model.model}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #0A0D12 0%, transparent 8%, transparent 92%, #0A0D12 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }} />
      </div>
    </section>
  );
}

// Helper to convert hex to r,g,b for rgba
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return `${r},${g},${b}`;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
