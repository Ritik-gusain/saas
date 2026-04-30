"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";

export function SoundToggle() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    gsap.fromTo(".sound-toggle-btn", 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 1.5 }
    );
  }, []);

  return (
    <div 
      className="sound-toggle-btn"
      onClick={() => setIsOn(!isOn)}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "6px 6px 6px 16px",
        borderRadius: 100,
        cursor: "pointer",
        transition: "all 0.4s ease",
      }}
    >
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.5)",
      }}>Sound: <span style={{ color: isOn ? "var(--landing-green)" : "#FFF" }}>{isOn ? "On" : "Off"}</span></span>
      
      <div style={{
        width: 44,
        height: 24,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 100,
        position: "relative",
        transition: "all 0.4s ease",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          position: "absolute",
          top: 3,
          left: isOn ? 23 : 3,
          width: 16,
          height: 16,
          background: isOn ? "var(--landing-green)" : "rgba(255,255,255,0.4)",
          borderRadius: "50%",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: isOn ? "0 0 10px var(--landing-green)" : "none",
        }} />
      </div>
    </div>
  );
}
