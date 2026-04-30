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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
            },
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
      data-bg="#0D0D0D"
      data-text="#FFFFFF"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "60px 0",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      {/* Label */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 40 }}>

      </div>

      {/* Flowing stream */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
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
                gap: 12,
                opacity: 0.3,
                filter: "grayscale(100%) brightness(1.5)",
                transition: "all 0.4s ease",
                cursor: "default",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.filter = "grayscale(0%) brightness(1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.opacity = "0.3";
                (e.currentTarget as HTMLElement).style.filter = "grayscale(100%) brightness(1.5)";
              }}
            >
              <img
                src={m.logo}
                alt={m.name}
                style={{
                  height: 20,
                  width: "auto",
                  objectFit: "contain",
                  filter: m.invert ? "invert(1)" : "none",
                }}
              />
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
                color: "#fff",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}>
                {m.name}
              </span>

              <div style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                marginLeft: 10,
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
          background: "linear-gradient(90deg, var(--landing-bg) 0%, transparent 15%, transparent 85%, var(--landing-bg) 100%)",
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
