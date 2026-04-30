"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";

export function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    gsap.fromTo(".sound-toggle-container", 
      { scale: 0, opacity: 0, rotate: -45 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: "expo.out", delay: 2 }
    );
  }, []);

  return (
    <div 
      className="sound-toggle-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => setIsOn(!isOn)}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        pointerEvents: "auto",
        transition: "transform 0.1s ease",
        transform: pressed ? "scale(0.92)" : "scale(1)",
      }}
    >
      {/* Label Tooltip */}
      <div style={{
        marginRight: 16,
        padding: "10px 20px",
        background: "rgba(10, 13, 18, 0.98)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 4,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(20px)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "none",
        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          opacity: 0.4,
          marginBottom: 4,
          letterSpacing: "0.2em",
        }}>SYS_MODULE // RESONANCE</div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#FFF",
          whiteSpace: "nowrap",
        }}>
          {isOn ? "Broadcasting" : "Silenced"}
        </span>
      </div>

      {/* Toggle Button - Rectangular/Mechanical */}
      <div style={{
        width: 54,
        height: 54,
        background: isOn ? "var(--landing-green)" : "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isOn ? "0 0 30px rgba(0, 255, 170, 0.3)" : "none",
        color: isOn ? "#000" : "rgba(255,255,255,0.3)",
        position: "relative",
      }}>
        {isOn ? <Volume2 size={20} strokeWidth={2.5} /> : <VolumeX size={20} strokeWidth={2} />}
        
        {/* Mechanical Notch */}
        <div style={{
          position: "absolute",
          top: 6,
          left: 6,
          width: 4,
          height: 4,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 1
        }} />
      </div>
    </div>
  );
}
