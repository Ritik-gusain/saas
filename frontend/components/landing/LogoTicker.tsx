"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


const OPENROUTER_MODELS = [
  {
    name: "OpenAI",
    logo: "/ai logo/penailogo.svg",
    model: "GPT-4o / o1-preview",
    invert: true,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 600,
    letterSpacing: "-0.01em",
  },
  {
    name: "Claude",
    logo: "/ai logo/Anthropic.svg",
    model: "3.5 Sonnet / Opus",
    invert: true,
    font: "'Lora', serif",
    weight: 500,
    letterSpacing: "0.01em",
  },
  {
    name: "Gemini",
    logo: "/ai logo/GoogleGemini.svg",
    model: "1.5 Pro / Flash",
    invert: false,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 500,
    letterSpacing: "-0.01em",
  },
  {
    name: "DeepSeek",
    logo: "/ai logo/DeepSeek.png",
    model: "DeepSeek-V3 / R1",
    invert: false,
    font: "'Inter', sans-serif",
    weight: 600,
    letterSpacing: "-0.02em",
  },
  {
    name: "Mistral AI",
    logo: "/ai logo/Mistral.png",
    model: "Mistral Large 2",
    invert: false,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 600,
    letterSpacing: "-0.01em",
  },
  {
    name: "Meta",
    logo: "/ai logo/Meta.png",
    model: "Llama 3.3 / 405B",
    invert: false,
    font: "'Inter', sans-serif",
    weight: 700,
    letterSpacing: "-0.02em",
  },
  {
    name: "Qwen",
    logo: "/ai logo/Qwen.png",
    model: "Qwen 2.5 / 72B",
    invert: false,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 600,
    letterSpacing: "-0.01em",
  },
  {
    name: "Nvidia",
    logo: "/ai logo/nvidia.png",
    model: "Llama-3.1-Nemotron",
    invert: false,
    font: "'Inter', sans-serif",
    weight: 700,
    letterSpacing: "-0.02em",
  },
  {
    name: "Perplexity",
    logo: "/ai logo/Perplexity.svg",
    model: "Sonar Pro / Llama 3",
    invert: true,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 500,
    letterSpacing: "-0.01em",
  },
  {
    name: "Moonshot AI",
    logo: "/ai logo/moonshotai.png",
    model: "Kimi k1.5",
    invert: true,
    font: "'Inter', sans-serif",
    weight: 500,
    letterSpacing: "-0.01em",
  },
  {
    name: "xAI",
    logo: "/ai logo/xai.png",
    model: "Grok 3 (Beta)",
    invert: true,
    font: "'Plus Jakarta Sans', sans-serif",
    weight: 700,
    letterSpacing: "0.05em",
  },
];

export function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Double the array for a perfect infinite scroll loop
  const doubled = [...OPENROUTER_MODELS, ...OPENROUTER_MODELS];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 90%" } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      borderTop: "1px solid rgba(255,255,255,.05)", 
      borderBottom: "1px solid rgba(255,255,255,.05)",
      padding: "40px 0", 
      overflow: "hidden", 
      position: "relative",
      background: "linear-gradient(180deg, rgba(16,20,24,.4) 0%, rgba(0,92,105,.05) 50%, rgba(16,20,24,.4) 100%)",
    }}>
      {/* Section Label */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 28 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "rgba(248,249,250,0.3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          Seamless Integration with Leading Models
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 60, 
        animation: "ticker 50s linear infinite", 
        width: "max-content",
        alignItems: "center"
      }}>
        {doubled.map((model, i) => (
          <div 
            key={`${model.name}-${i}`} 
            className="logo-ticker-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "8px 0",
              opacity: 0.6,
              transition: "all 0.3s ease",
              minWidth: "max-content",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.6";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <img 
                src={model.logo} 
                alt={model.name} 
                style={{ 
                  height: model.name === 'OpenAI' ? 14 : 22,
                  width: "auto",
                  objectFit: "contain",
                  filter: model.invert 
                    ? "invert(1) brightness(2) contrast(1.2)" 
                    : "brightness(1.1) contrast(1.1)",
                }} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <span style={{
                fontFamily: model.font || "'Plus Jakarta Sans', sans-serif", 
                fontWeight: model.weight || 600, 
                fontSize: 15,
                color: "#FFFFFF", 
                letterSpacing: model.letterSpacing || "normal",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}>
                {model.name}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9,
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.02em",
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
        background: "linear-gradient(90deg, #101418 0%, transparent 12%, transparent 88%, #101418 100%)",
        pointerEvents: "none",
        zIndex: 2
      }} />
    </section>
  );
}
