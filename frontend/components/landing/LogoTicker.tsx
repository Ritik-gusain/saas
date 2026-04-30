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
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;
    
    // Smooth GSAP animation for organic control
    const loop = gsap.to(tickerRef.current, {
      xPercent: -33.33,
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    // Suble speed variation for "human" feel
    gsap.to(loop, {
      timeScale: 1.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => loop.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scrolly-section"
      data-bg="#0A0D12"
      data-text="#FFFFFF"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 0",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="mono-label" style={{ opacity: 0.3, fontSize: 10 }}>
          01 // INTELLIGENCE_NETWORK_FEED
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div className="mono-label" style={{ color: "var(--landing-green)", fontSize: 10 }}>
            ● STATUS: OPERATIONAL
          </div>
          <div className="mono-label" style={{ opacity: 0.3, fontSize: 10 }}>
            THROUGHPUT: 12.4K TOKENS/S
          </div>
        </div>
      </div>

      {/* Flowing stream */}
      <div style={{ position: "relative" }}>
        <div
          ref={tickerRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 100,
            width: "max-content",
            willChange: "transform",
          }}
          onMouseEnter={() => gsap.to(tickerRef.current, { opacity: 0.8 })}
          onMouseLeave={() => gsap.to(tickerRef.current, { opacity: 1 })}
        >
          {STREAM.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                opacity: 0.5,
                transition: "all 0.4s ease",
                cursor: "default",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.opacity = "0.5";
              }}
            >
              <img
                src={m.logo}
                alt={m.name}
                style={{
                  height: 32,
                  width: "auto",
                  maxWidth: 140,
                  objectFit: "contain",
                  filter: m.invert ? "invert(1) grayscale(1) brightness(2)" : "grayscale(1) brightness(1.5)",
                }}
              />
              
              <div style={{
                width: 1,
                height: 20,
                background: "rgba(255,255,255,0.05)",
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
          background: "linear-gradient(90deg, #0A0D12 0%, transparent 20%, transparent 80%, #0A0D12 100%)",
        }} />
      </div>
    </section>
  );
}
