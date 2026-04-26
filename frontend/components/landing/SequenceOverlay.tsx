"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Brain, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  phase: string;
  progress: number;
}

// ─── PHASE 1: HERO CONTENT ─────────────────────────────────────
function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.5 }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        padding: "0 24px",
        paddingTop: 80,
        textAlign: "center",
      }}
    >
      <div className="tag" style={{ marginBottom: 20 }}>
        <Sparkles size={11} /> Now Supporting 40+ AI Models
      </div>

      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(42px, 8vw, 84px)",
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          color: "#F8F9FA",
          textShadow: "0 20px 40px rgba(0,0,0,0.5)",
          marginBottom: 24,
        }}
      >
        Free for individuals.
        <br />
        <span className="shimmer-text">Powerful for teams.</span>
      </h1>

      <p
        style={{
          fontSize: "clamp(16px, 1.5vw, 20px)",
          color: "rgba(248, 249, 250, 0.6)",
          maxWidth: 600,
          lineHeight: 1.6,
          fontWeight: 300,
          marginBottom: 32,
        }}
      >
        The world&apos;s most advanced AI collaboration platform.
        Bring your own keys. Own your data. Collaborate at lightspeed.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/register" className="btn-primary" style={{ padding: "16px 40px", fontSize: 16 }}>
          Initialize Workspace <ArrowRight size={18} />
        </Link>
        <a href="#features" className="btn-ghost" style={{ padding: "16px 40px", fontSize: 16 }}>
          Explore Core Systems
        </a>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 48,
          marginTop: 40,
          padding: "24px 48px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          { label: "Active Nodes", val: "14.2k+" },
          { label: "Sync Speed",   val: "8ms"    },
          { label: "Uptime",       val: "99.99%" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#00FFAA",
              }}
            >
              {stat.val}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "rgba(248,249,250,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHASE 2: AI AGENTS REVEAL ─────────────────────────────────
function AgentsOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.85, opacity: 0, filter: "blur(20px)" },
        {
          scale: 1, opacity: 1, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          background: "rgba(16, 20, 24, 0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0, 255, 170, 0.15)",
          borderRadius: 24,
          padding: "60px 80px",
          maxWidth: 700,
          textAlign: "center",
        }}
      >
        <span className="tag" style={{ marginBottom: 16 }}>
          <Brain size={11} /> AI Agents
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#F8F9FA",
            marginBottom: 16,
          }}
        >
          Deploy specialized agents
          <br />
          <span style={{ color: "#00FFAA" }}>trained on your SOPs</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(248, 249, 250, 0.5)",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          One focused agent per workflow — sales, support, growth, research.
          They learn your patterns and execute autonomously.
        </p>
      </div>
    </div>
  );
}

// ─── PHASE 3: MODEL SHOWCASE (synced with head rotation) ───────
const MODELS = [
  { name: "OpenAI",      model: "GPT-4o / o1-preview",    accent: "#00FFAA" },
  { name: "Claude",      model: "3.5 Sonnet / Opus",       accent: "#00D0FF" },
  { name: "Gemini",      model: "1.5 Pro / Flash",         accent: "#00FFAA" },
  { name: "DeepSeek",    model: "DeepSeek-V3 / R1",        accent: "#00D0FF" },
  { name: "Mistral AI",  model: "Mistral Large 2",         accent: "#00FFAA" },
  { name: "Meta",        model: "Llama 3.3 / 405B",        accent: "#00D0FF" },
  { name: "Qwen",        model: "Qwen 2.5 / 72B",          accent: "#00FFAA" },
  { name: "Nvidia",      model: "Llama-3.1-Nemotron",      accent: "#76B900" },
  { name: "Perplexity",  model: "Sonar Pro / Llama 3",     accent: "#00FFAA" },
  { name: "Moonshot AI", model: "Kimi k1.5",               accent: "#00D0FF" },
  { name: "xAI",         model: "Grok 3 (Beta)",           accent: "#00FFAA" },
];

function ModelsOverlay({ progress }: { progress: number }) {
  // progress here is global (0-1); heads phase is 0.49-1.0
  const headsProgress = Math.max(0, (progress - 0.49) / 0.51);
  const activeIndex   = Math.min(
    Math.floor(headsProgress * MODELS.length),
    MODELS.length - 1
  );
  const activeModel = MODELS[activeIndex];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        zIndex: 10,
        paddingBottom: "12vh",
        pointerEvents: "none",
      }}
    >
      <div
        key={activeModel.name}           // forces re-mount on change → triggers CSS animation
        style={{
          background: "rgba(16, 20, 24, 0.82)",
          backdropFilter: "blur(30px)",
          border: `1px solid ${activeModel.accent}40`,
          borderRadius: 20,
          padding: "32px 56px",
          minWidth: 320,
          textAlign: "center",
          animation: "modelCardIn 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: activeModel.accent,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Seamless Integration
        </div>

        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 30,
            color: "#F8F9FA",
            marginBottom: 6,
          }}
        >
          {activeModel.name}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "rgba(248, 249, 250, 0.4)",
            marginBottom: 20,
          }}
        >
          {activeModel.model}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {MODELS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIndex ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === activeIndex
                    ? activeModel.accent
                    : "rgba(255,255,255,0.12)",
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────
export function SequenceOverlay({ phase, progress }: Props) {
  return (
    <>
      {phase === "intro" && <HeroOverlay />}
      {phase === "zoom"  && <AgentsOverlay />}
      {phase === "heads" && <ModelsOverlay progress={progress} />}
    </>
  );
}