"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MODELS = [
  { name: "OpenAI",      logo: "/ai logo/penailogo.svg",      invert: true  },
  { name: "Claude",      logo: "/ai logo/Anthropic.svg",      invert: true  },
  { name: "Gemini",      logo: "/ai logo/GoogleGemini.svg",   invert: false },
  { name: "DeepSeek",    logo: "/ai logo/DeepSeek.png",       invert: false },
  { name: "Mistral AI",  logo: "/ai logo/Mistral.png",        invert: false },
  { name: "Meta",        logo: "/ai logo/Meta.png",           invert: false },
  { name: "Qwen",        logo: "/ai logo/Qwen.png",           invert: false },
  { name: "Nvidia",      logo: "/ai logo/nvidia.png",         invert: false },
  { name: "Perplexity",  logo: "/ai logo/Perplexity.svg",     invert: true  },
  { name: "Moonshot AI", logo: "/ai logo/moonshotai.png",     invert: true  },
  { name: "xAI",         logo: "/ai logo/xai.png",            invert: true  },
];

// Duplicate for seamless infinite loop
const STREAM = [...MODELS, ...MODELS, ...MODELS];

export function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 88%" } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "52px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "transparent",
      }}
    >
      {/* Label */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9.5,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
        }}>
          ◈ &nbsp; Seamless integration with 40+ leading AI models &nbsp; ◈
        </span>
      </div>

      {/* Flowing stream */}
      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            width: "max-content",
            animation: "ticker 50s linear infinite",
            willChange: "transform",
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
        >
          {STREAM.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: 0.45,
                transition: "opacity 0.3s ease",
                cursor: "default",
                flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0.45"}
            >
              <img
                src={m.logo}
                alt={m.name}
                style={{
                  height: m.name === "OpenAI" ? 15 : 22,
                  width: "auto",
                  objectFit: "contain",
                  filter: m.invert ? "invert(1) brightness(1.8)" : "brightness(1.1) saturate(1.1)",
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#F8F9FA",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}>
                {m.name}
              </span>

              {/* Subtle dot separator */}
              <span style={{
                width: 3, height: 3, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                display: "inline-block",
                marginLeft: 8,
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>

        {/* Edge fades */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "linear-gradient(90deg, var(--landing-bg) 0%, transparent 12%, transparent 88%, var(--landing-bg) 100%)",
        }} />
      </div>
    </div>
  );
}
