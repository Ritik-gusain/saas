"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";

export function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    gsap.fromTo(".sound-toggle-container", 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 2 }
    );
  }, []);

  return (
    <div 
      className="sound-toggle-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      }}
    >
      {/* Label Tooltip */}
      <div style={{
        marginRight: 12,
        padding: "8px 16px",
        background: "rgba(10, 13, 18, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: 100,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(10px)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#FFF",
          whiteSpace: "nowrap",
        }}>
          Sound: <span style={{ color: isOn ? "var(--landing-green)" : "rgba(255,255,255,0.3)" }}>{isOn ? "On" : "Off"}</span>
        </span>
      </div>

      {/* Toggle Button Circle */}
      <div style={{
        width: 48,
        height: 48,
        background: isOn ? "var(--landing-purple)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isOn ? "0 0 20px rgba(123, 97, 255, 0.4)" : "none",
        color: isOn ? "#FFF" : "rgba(255,255,255,0.4)",
      }}>
        {isOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </div>
    </div>
  );
}
