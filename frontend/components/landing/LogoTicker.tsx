"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const OPENROUTER_MODELS = [
  { name: "OpenAI",      logo: "/ai logo/penailogo.svg",      model: "GPT-4o / o1-preview",     invert: true  },
  { name: "Claude",      logo: "/ai logo/Anthropic.svg",      model: "3.5 Sonnet / Opus",        invert: true  },
  { name: "Gemini",      logo: "/ai logo/GoogleGemini.svg",   model: "1.5 Pro / Flash",          invert: false },
  { name: "DeepSeek",    logo: "/ai logo/DeepSeek.png",       model: "DeepSeek-V3 / R1",         invert: false },
  { name: "Mistral AI",  logo: "/ai logo/Mistral.png",        model: "Mistral Large 2",          invert: false },
  { name: "Meta",        logo: "/ai logo/Meta.png",           model: "Llama 3.3 / 405B",         invert: false },
  { name: "Qwen",        logo: "/ai logo/Qwen.png",           model: "Qwen 2.5 / 72B",           invert: false },
  { name: "Nvidia",      logo: "/ai logo/nvidia.png",         model: "Llama-3.1-Nemotron",       invert: false },
  { name: "Perplexity",  logo: "/ai logo/Perplexity.svg",     model: "Sonar Pro / Llama 3",      invert: true  },
  { name: "Moonshot AI", logo: "/ai logo/moonshotai.png",     model: "Kimi k1.5",                invert: true  },
  { name: "xAI",         logo: "/ai logo/xai.png",            model: "Grok 3 (Beta)",            invert: true  },
];

export function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);

  // Triple the array for seamless infinite scroll
  const tripled = [...OPENROUTER_MODELS, ...OPENROUTER_MODELS, ...OPENROUTER_MODELS];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 88%" },
          }
        );
      }

      // Pause on hover
      const row = row1Ref.current;
      if (!row) return;
      row.addEventListener("mouseenter", () => {
        gsap.to(row, { animationPlayState: "paused" });
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
        borderTop: "1px solid rgba(255,255,255,.05)",
        borderBottom: "1px solid rgba(255,255,255,.05)",
        padding: "48px 0",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, rgba(14,18,24,.5) 0%, rgba(0,92,105,.04) 50%, rgba(14,18,24,.5) 100%)",
      }}
    >
      {/* Subtle glow orb */}
      <div
        className="section-orb"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 200, background: "radial-gradient(ellipse, rgba(0,255,170,.03) 0%, transparent 70%)" }}
      />

      {/* Title */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 32 }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10.5,
            color: "rgba(248,249,250,.28)",
            letterSpacing: ".22em",
            textTransform: "uppercase",
          }}
        >
          ◈ &nbsp; Seamless Integration with 40+ Leading AI Models &nbsp; ◈
        </span>
      </div>

      {/* Ticker row */}
      <div style={{ position: "relative" }}>
        <div
          ref={row1Ref}
          style={{
            display: "flex",
            gap: 52,
            animation: "ticker 55s linear infinite",
            width: "max-content",
            alignItems: "center",
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
                gap: 14,
                padding: "8px 0",
                opacity: 0.52,
                transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
                minWidth: "max-content",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.52";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              {/* Logo */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, flexShrink: 0,
              }}>
                <img
                  src={model.logo}
                  alt={model.name}
                  style={{
                    height: model.name === "OpenAI" ? 16 : 24,
                    width: "auto",
                    objectFit: "contain",
                    filter: model.invert
                      ? "invert(1) brightness(2) contrast(1.2)"
                      : "brightness(1.1) contrast(1.1) saturate(1.05)",
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                  }}
                >
                  {model.name}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', sans-serif",
                    fontSize: 8.5,
                    fontWeight: 500,
                    color: "rgba(255,255,255,.3)",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    marginTop: 3,
                  }}
                >
                  {model.model}
                </span>
              </div>

              {/* Separator dot */}
              {i < tripled.length - 1 && (
                <div style={{
                  width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(255,255,255,.1)",
                  marginLeft: 20,
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, var(--landing-bg) 0%, transparent 10%, transparent 90%, var(--landing-bg) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    </section>
  );
}
