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

  return (
    <section
      ref={sectionRef}
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 0",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        background: "transparent",
      }}
    >
      {/* Flowing stream */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
            width: "max-content",
            animation: "ticker 60s linear infinite",
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
                gap: 40,
                opacity: 0.6,
                filter: "none",
                transition: "all 0.4s ease",
                cursor: "default",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.opacity = "0.6";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <img
                src={m.logo}
                alt={m.name}
                style={{
                  height: 40,
                  width: "auto",
                  maxWidth: 160,
                  objectFit: "contain",
                  filter: m.invert ? "invert(1) brightness(1.5)" : "none",
                }}
              />
              
              {/* Separator Dot */}
              <div style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
              }} />
            </div>
          ))}
        </div>

        {/* Cinematic Edge Fades */}
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background: "linear-gradient(90deg, #0A0D12 0%, transparent 15%, transparent 85%, #0A0D12 100%)",
        }} />
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
