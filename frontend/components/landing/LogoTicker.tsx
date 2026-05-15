"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MODELS = [
  { name: "OpenAI",      logo: "/ai-logos/penailogo.svg",      invert: true  },
  { name: "Claude",      logo: "/ai-logos/Anthropic.svg",      invert: true  },
  { name: "Gemini",      logo: "/ai-logos/GoogleGemini.svg",   invert: false },
  { name: "DeepSeek",    logo: "/ai-logos/DeepSeek.png",       invert: false },
  { name: "Mistral AI",  logo: "/ai-logos/Mistral.png",        invert: false },
  { name: "Meta",        logo: "/ai-logos/Meta.png",           invert: false },
  { name: "Qwen",        logo: "/ai-logos/Qwen.png",           invert: false },
  { name: "Nvidia",      logo: "/ai-logos/nvidia.png",         invert: false },
  { name: "Perplexity",  logo: "/ai-logos/Perplexity.svg",     invert: true  },
  { name: "Moonshot AI", logo: "/ai-logos/moonshotai.png",     invert: true  },
  { name: "xAI",         logo: "/ai-logos/xai.png",            invert: true  },
];

// Duplicate for seamless infinite loop
const STREAM = [...MODELS, ...MODELS, ...MODELS];

export function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!tickerRef.current || !mounted) return;
    
    // Stabilized GSAP animation - linear and constant for "stability"
    const loop = gsap.to(tickerRef.current, {
      xPercent: -33.33,
      duration: 40, // Slightly faster for energy but steady
      ease: "none",
      repeat: -1,
      force3D: true,
    });

    return () => {
      loop.kill();
    };
  }, [mounted]);

  if (!mounted) return <div style={{ height: 260 }} />; // Maintain height during hydration

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
      <div className="step-number">INTELLIGENCE NETWORK FEED</div>


      {/* Flowing stream */}
      <div style={{ position: "relative" }}>
        <div
          ref={tickerRef}
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {STREAM.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 220, // Fixed width for absolute stability
                opacity: 0.7, // Increased visibility
                transition: "opacity 0.4s ease",
                cursor: "default",
                flexShrink: 0,
                padding: "0 20px",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
            >
              <img
                src={m.logo}
                alt={m.name}
                style={{
                  height: 34,
                  width: "auto",
                  maxWidth: 160,
                  objectFit: "contain",
                  // Reverting to more color but professional
                  filter: m.invert ? "invert(1) brightness(1.5)" : "brightness(1.2)",
                }}
              />
              
              {/* Discrete separator inside the fixed container to maintain rhythm */}
              <div style={{
                position: "absolute",
                right: 0,
                width: 1,
                height: 24,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
              }} />
            </div>
          ))}
        </div>

        {/* Cinematic Edge Fades - slightly sharper for focus */}
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background: "linear-gradient(90deg, #0A0D12 0%, transparent 15%, transparent 85%, #0A0D12 100%)",
        }} />
      </div>
    </section>
  );
}
