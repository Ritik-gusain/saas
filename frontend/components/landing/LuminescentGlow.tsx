"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export const LuminescentGlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate glow blobs
      gsap.to(".glow-blob", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 5,
          from: "random",
        },
      });

      // Animate sparkles
      gsap.to(".sparkle", {
        opacity: "random(0.1, 0.8)",
        scale: "random(0.5, 1.2)",
        duration: "random(1, 3)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 10,
          from: "random",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Moving Glow Blobs */}
      <div className="glow-blob absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: "var(--landing-green)" }} />
      <div className="glow-blob absolute bottom-[20%] right-[10%] w-[700px] h-[700px] rounded-full opacity-[0.03] blur-[140px]" style={{ background: "var(--landing-purple)" }} />
      <div className="glow-blob absolute top-[50%] left-[40%] w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px]" style={{ background: "var(--landing-cyan)" }} />

      {/* Sparkles */}
      {[...Array(150)].map((_, i) => {
        const size = Math.random() * 1.5 + 0.5;
        const color = i % 5 === 0 ? "var(--landing-green)" : i % 7 === 0 ? "var(--landing-cyan)" : "#FFFFFF";
        return (
          <div
            key={i}
            className="sparkle absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 4}px ${size/2}px ${color === "#FFFFFF" ? "rgba(255, 255, 255, 0.4)" : color + "66"}`,
            }}
          />
        );
      })}

      {/* Neural Lines Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" style={{ pointerEvents: "none" }}>
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M${Math.random() * 100}% ${Math.random() * 100}% L${Math.random() * 100}% ${Math.random() * 100}%`}
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            style={{ opacity: Math.random() * 0.5 + 0.2 }}
          />
        ))}
      </svg>

      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
