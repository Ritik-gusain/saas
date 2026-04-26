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
    model: "GPT-5.4",
    invert: true,
  },
  {
    name: "Claude",
    logo: "/ai logo/Anthropic.svg",
    model: "Claude 3.5 Sonnet",
    invert: true,
  },
  {
    name: "Gemini",
    logo: "/ai logo/GoogleGemini.svg",
    model: "Gemini 1.5 Pro",
    invert: false,
  },
  {
    name: "DeepSeek",
    logo: "/ai logo/DeepSeek.png",
    model: "DeepSeek V3",
    invert: true,
  },
  {
    name: "Moonshot AI",
    logo: "/ai logo/moonshotai.png",
    model: "Kimi k1.5",
    invert: true,
  },
  {
    name: "xAI",
    logo: "/ai logo/xai.png",
    model: "Grok 3",
    invert: true,
  },
  {
    name: "Qwen",
    logo: "/ai logo/Qwen.png",
    model: "Qwen 2.5",
    invert: true,
  },
  {
    name: "Mistral AI",
    logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@latest/assets/mistral/logo.svg",
    model: "Large 2",
    invert: false,
  },
  {
    name: "Meta",
    logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@latest/assets/meta/logo.svg",
    model: "Llama 3.3",
    invert: false,
  },
  {
    name: "Perplexity",
    logo: "/ai logo/Perplexity.svg",
    model: "Sonar Pro",
    invert: true,
  },
  {
    name: "NVIDIA",
    logo: "/ai logo/nvidia.png",
    model: "Nemotron 3",
    invert: false,
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
          Powered by the models you already trust
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
              gap: 14,
              padding: "10px 24px",
              opacity: 0.75,
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              minWidth: "max-content",
            }}
          >
            <div style={{
              minWidth: 40,
              width: "auto",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <img 
                src={model.logo} 
                alt={model.name} 
                style={{ 
                  height: model.name === 'OpenAI' ? 18 : 26,
                  width: "auto",
                  objectFit: "contain",
                  filter: model.invert 
                    ? "invert(1) brightness(1.5) drop-shadow(0 0 8px rgba(0,255,170,0.15))" 
                    : "brightness(1.5) drop-shadow(0 0 8px rgba(0,255,170,0.15))",
                }} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{
                fontFamily: "Montserrat, sans-serif", 
                fontWeight: 800, 
                fontSize: 14,
                color: "#FFFFFF", 
                letterSpacing: ".03em",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}>
                {model.name}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "rgba(0,255,170,0.5)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
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
