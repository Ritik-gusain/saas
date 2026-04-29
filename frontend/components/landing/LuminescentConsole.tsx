"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Terminal, Cpu, ShieldCheck, Zap, Bot } from "lucide-react";

const STEPS = [
  { icon: Cpu, text: "Initializing Core Neural Engine...", color: "#00FFAA" },
  { icon: Zap, text: "Connecting to 40+ LLM Nodes...", color: "#00D0FF" },
  { icon: ShieldCheck, text: "Verifying Team Permissions & RBAC...", color: "#7B61FF" },
  { icon: Bot, text: "Agent 'Nexus' is now online.", color: "#00FFAA" },
  { icon: Terminal, text: "> nexus run analytics_sprint_v2", color: "#F8F9FA" },
];

export function LuminescentConsole() {
  const [activeStep, setActiveStep] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startSequence = () => {
      let current = 0;
      interval = setInterval(() => {
        if (current < STEPS.length) {
          setActiveStep(current);
          current++;
        } else {
          // Reset after a pause
          setTimeout(() => {
            setActiveStep(-1);
            current = 0;
          }, 3000);
        }
      }, 1500);
    };

    startSequence();
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: "80px 24px", position: "relative", zIndex: 10 }}>
      <div 
        ref={containerRef}
        className="cyber-card"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 0,
          background: "rgba(10,13,18,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,170,0.05)",
        }}
      >
        {/* Terminal Header */}
        <div style={{
          padding: "14px 24px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
          </div>
          <div className="mono-label" style={{ opacity: 0.4, fontSize: 9 }}>
            LUMINESCENT_OS // AGENT_DEMO
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: "32px", minHeight: 340 }}>
          {STEPS.map((step, i) => (
            <div 
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
                opacity: activeStep >= i ? 1 : 0,
                transform: activeStep >= i ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{ color: step.color, display: "flex" }}>
                <step.icon size={16} />
              </div>
              <div style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: 14, 
                color: activeStep === i ? "#FFF" : "rgba(255,255,255,0.4)",
                textShadow: activeStep === i ? `0 0 10px ${step.color}44` : "none",
              }}>
                {step.text}
              </div>
              {activeStep === i && (
                <div style={{
                  width: 8, height: 18,
                  background: step.color,
                  animation: "glow 1s infinite",
                }} />
              )}
            </div>
          ))}

          {/* Result Block */}
          {activeStep === STEPS.length - 1 && (
            <div style={{
              marginTop: 32,
              padding: "24px",
              background: "rgba(0,255,170,0.03)",
              border: "1px solid rgba(0,255,170,0.1)",
              borderRadius: 12,
              animation: "fadeIn 1s both",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span className="mono-label" style={{ color: "#00FFAA" }}>Deployment Status</span>
                <span className="mono-label" style={{ opacity: 0.5 }}>Syncing...</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", 
                  width: "84%", 
                  background: "linear-gradient(90deg, #00FFAA, #00D0FF)",
                  boxShadow: "0 0 10px #00FFAA"
                }} />
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
                Agent <span style={{ color: "#FFF" }}>Nexus</span> is successfully managing <span style={{ color: "#FFF" }}>14 nodes</span> with an average latency of <span style={{ color: "#00FFAA" }}>8ms</span>.
              </div>
            </div>
          )}
        </div>

        {/* Ambient Glow */}
        <div style={{
          position: "absolute",
          bottom: -50,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: 100,
          background: "radial-gradient(ellipse, rgba(0,255,170,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }} />
      </div>
    </section>
  );
}
