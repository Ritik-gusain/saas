"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Frame sequence config ──────────────────────────────────────
const TOTAL_FRAMES = 285;
// Files in /public/frames/ are named frame 1.jpg … frame 285.jpg
const FRAME_PATH = (i: number) =>
  `/frames/frame ${i + 1}.jpg`;

const PHASES = {
  intro: { start: 0,   end: 80  }, // 0-8 s : figures running
  zoom:  { start: 80,  end: 140 }, // 8-11 s: camera push → agents reveal
  heads: { start: 140, end: 285 }, // 11-19s: head rotation → model showcase
};

const MODELS = [
  {
    name: "OpenAI",      sub: "GPT-4o / o1-preview",
    accent: "#00FFAA", logo: "/ai logo/penailogo.svg",  invert: true,
    tags: ["Reasoning", "Vision", "Code"],
    metrics: { speed: 88, context: 90, reasoning: 97, efficiency: 82 },
  },
  {
    name: "Claude",      sub: "3.5 Sonnet / Opus",
    accent: "#00D0FF", logo: "/ai logo/Anthropic.svg",  invert: true,
    tags: ["Long-context", "Safety", "Analysis"],
    metrics: { speed: 80, context: 99, reasoning: 95, efficiency: 85 },
  },
  {
    name: "Gemini",      sub: "1.5 Pro / Flash",
    accent: "#4285F4", logo: "/ai logo/GoogleGemini.svg", invert: false,
    tags: ["Multimodal", "Speed", "Search"],
    metrics: { speed: 95, context: 98, reasoning: 89, efficiency: 91 },
  },
  {
    name: "DeepSeek",    sub: "DeepSeek-V3 / R1",
    accent: "#00D0FF", logo: "/ai logo/DeepSeek.png",  invert: false,
    tags: ["Math", "Coding", "Open-source"],
    metrics: { speed: 75, context: 92, reasoning: 96, efficiency: 97 },
  },
  {
    name: "Mistral AI",  sub: "Mistral Large 2",
    accent: "#E87D3E", logo: "/ai logo/Mistral.png",   invert: false,
    tags: ["European", "Efficient", "Multilingual"],
    metrics: { speed: 92, context: 78, reasoning: 85, efficiency: 94 },
  },
  {
    name: "Meta",        sub: "Llama 3.3 / 405B",
    accent: "#0082FB", logo: "/ai logo/Meta.png",      invert: false,
    tags: ["Open-weights", "Scale", "Versatile"],
    metrics: { speed: 85, context: 88, reasoning: 90, efficiency: 88 },
  },
  {
    name: "Qwen",        sub: "Qwen 2.5 / 72B",
    accent: "#7B61FF", logo: "/ai logo/Qwen.png",      invert: false,
    tags: ["Multilingual", "Code", "Math"],
    metrics: { speed: 87, context: 85, reasoning: 88, efficiency: 90 },
  },
  {
    name: "Nvidia",      sub: "Llama-3.1-Nemotron",
    accent: "#76B900", logo: "/ai logo/nvidia.png",    invert: false,
    tags: ["GPU-native", "HPC", "Fine-tuned"],
    metrics: { speed: 90, context: 80, reasoning: 86, efficiency: 93 },
  },
  {
    name: "Perplexity",  sub: "Sonar Pro / Llama 3",
    accent: "#20D4AC", logo: "/ai logo/Perplexity.svg", invert: true,
    tags: ["Web-search", "Citations", "Real-time"],
    metrics: { speed: 93, context: 70, reasoning: 82, efficiency: 88 },
  },
  {
    name: "Moonshot AI", sub: "Kimi k1.5",
    accent: "#00D0FF", logo: "/ai logo/moonshotai.png", invert: true,
    tags: ["Long-context", "Multimodal", "Research"],
    metrics: { speed: 78, context: 97, reasoning: 88, efficiency: 83 },
  },
  {
    name: "xAI",         sub: "Grok 3 (Beta)",
    accent: "#F8F9FA", logo: "/ai logo/xai.png",       invert: true,
    tags: ["Real-time", "Humor", "Unfiltered"],
    metrics: { speed: 86, context: 82, reasoning: 84, efficiency: 80 },
  },
];


// ───────────────────────────────────────────────────────────────
export function HeroSection() {
  // ── Existing refs ──────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const orbsRef      = useRef<HTMLDivElement>(null);

  // ── New refs / state ───────────────────────────────────────
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase]                   = useState<"intro" | "zoom" | "heads">("intro");
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  const [statusMsg, setStatusMsg]           = useState("Initializing systems...");
  const [showCanvas, setShowCanvas]         = useState(false);

  // ── EXISTING GSAP (unchanged) ──────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      if (!contentRef.current) return;

      tl.fromTo(
        contentRef.current.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, delay: 0.3 }
      );

      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        gsap.fromTo(
          videoRef.current,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 0.65, duration: 2.5, ease: "power2.out" }
        );
      }

      if (orbsRef.current) {
        Array.from(orbsRef.current.children).forEach((orb, i) => {
          gsap.to(orb, {
            x: `random(-50, 50)`,
            y: `random(-30, 30)`,
            duration: `random(4, 7)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Canvas auto-play intro + scroll scrub ──────────────────
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx2d = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
    if (!ctx2d) return;

    const getDpr = () => window.devicePixelRatio || 1;
    const images: (HTMLImageElement | undefined)[] = [];
    let animId: number | null = null;
    // Two targets: autoTarget drives intro playback, scrollTarget drives scroll
    let autoTarget  = 0;   // auto-advances during intro
    let scrollTarget = 0;  // set by ScrollTrigger
    let smoothFrame  = 0;
    let introRunning = true; // true while auto-playing frames 0→79
    let lastTick     = 0;
    const INTRO_FPS  = 22; // comfortable 22fps auto-play
    const MS_PER_F   = 1000 / INTRO_FPS;

    const preload = (center: number) => {
      for (let o = -8; o <= 30; o++) {
        const idx = center + o;
        if (idx < 0 || idx >= TOTAL_FRAMES || images[idx]) continue;
        const img = new Image(); img.decoding = "async";
        img.src = FRAME_PATH(idx); images[idx] = img;
      }
    };

    const resize = () => {
      const dpr = getDpr(), rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.imageSmoothingQuality = "high";
    };
    resize();
    window.addEventListener("resize", resize);

    const paint = (img: HTMLImageElement, extraScale = 1, isZooming = false) => {
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      const baseScale = Math.max(cw / iw, ch / ih);
      const s = baseScale * extraScale;

      ctx2d.save();
      
      // Dynamic sharpen/contrast for zoom phase
      if (isZooming) {
        ctx2d.filter = "contrast(1.1) brightness(1.04) saturate(1.05)";
      } else {
        ctx2d.filter = "none";
      }

      ctx2d.clearRect(0, 0, cw, ch);
      const x = (cw - iw * s) / 2;
      const y = (ch - ih * s) / 2;
      
      ctx2d.drawImage(img, x, y, iw * s, ih * s);

      // Add subtle noise/grain to hide pixelation
      if (extraScale > 1.01) {
        ctx2d.globalAlpha = 0.02;
        for (let i = 0; i < 5; i++) {
           ctx2d.fillStyle = i % 2 === 0 ? "#fff" : "#000";
           ctx2d.fillRect(Math.random() * cw, Math.random() * ch, 1.5, 1.5);
        }
        ctx2d.globalAlpha = 1.0;
      }

      ctx2d.restore();
    };

    const loop = (ts: number) => {
      // Auto-advance intro at INTRO_FPS
      if (introRunning) {
        if (ts - lastTick >= MS_PER_F) {
          autoTarget = Math.min(autoTarget + 1, PHASES.intro.end - 1);
          lastTick = ts;
          if (autoTarget >= PHASES.intro.end - 1) {
            introRunning = false;
            setStatusMsg("Scroll to explore");
          }
        }
      }

      // Blend: during intro use autoTarget, after intro use scrollTarget
      const target = introRunning ? autoTarget : scrollTarget;
      smoothFrame += (target - smoothFrame) * (introRunning ? 0.18 : 0.12);
      
      const idx = Math.round(smoothFrame);
      const img = images[idx];
      
      // Calculate dynamic over-zoom
      let extraScale = 1.0;
      let isZooming = false;
      
      if (idx >= PHASES.zoom.start && idx <= PHASES.zoom.end) {
        const p = (idx - PHASES.zoom.start) / (PHASES.zoom.end - PHASES.zoom.start);
        extraScale = 1.0 + (p * 0.02); // add 2% programmatic zoom (reduced from 12%)
        isZooming = true;
      } else if (idx > PHASES.zoom.end) {
        extraScale = 1.02; // maintain zoom for heads phase
      }

      if (img?.complete && img.naturalWidth) {
        paint(img, extraScale, isZooming);
      } else {
        for (let d = 1; d < 12; d++) {
          const fb = images[idx + d] ?? images[idx - d];
          if (fb?.complete && fb.naturalWidth) { 
            paint(fb, extraScale, isZooming); 
            break; 
          }
        }
      }
      animId = requestAnimationFrame(loop);
    };

    // Kick off immediately — canvas visible from frame 0
    preload(0);
    animId = requestAnimationFrame(loop);
    setTimeout(() => {
      setShowCanvas(true);
      setStatusMsg("Neural systems online");
    }, 1200);
    setTimeout(() => setStatusMsg("Scroll to explore"), introRunning ? 4000 : 2000);

    const onScrollUpdate = (self: ScrollTrigger) => {
      if (introRunning) return; // don't scrub during auto-play
      const p = self.progress;
      let frame: number;
      if (p < 0.2) {
        frame = PHASES.intro.end - 1; setPhase("intro");
      } else if (p < 0.5) {
        const z = (p - 0.2) / 0.3;
        frame = PHASES.zoom.start + z * (PHASES.zoom.end - PHASES.zoom.start);
        setPhase("zoom");
      } else {
        const h = (p - 0.5) / 0.5;
        frame = PHASES.heads.start + h * (PHASES.heads.end - PHASES.heads.start);
        setPhase("heads");
        setActiveModelIdx(Math.min(Math.floor(h * MODELS.length), MODELS.length - 1));
      }
      scrollTarget = Math.round(Math.min(Math.max(frame, 0), TOTAL_FRAMES - 1));
      preload(scrollTarget + 15);
    };

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${window.innerHeight * 3.5}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: onScrollUpdate,
    });

    return () => {
      st.kill();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────
  const activeModel = MODELS[activeModelIdx];

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#101418",
      }}
    >
      {/* ── Background video (fallback — hidden once canvas loads) ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0, overflow: "hidden",
          opacity: 0, pointerEvents: "none",
        }}
      >
        <video
          ref={videoRef}
          autoPlay loop muted playsInline preload="auto"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0, filter: "brightness(0.8) saturate(1.2)",
          }}
        >
          <source src="/video1.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "radial-gradient(circle at center, transparent 0%, #101418 100%), linear-gradient(to bottom, transparent 60%, #101418 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* ── Canvas frame sequence layer (NEW) ──────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 1,
          opacity: showCanvas ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
          filter: phase === "zoom" ? "contrast(1.05) brightness(1.05)" : "none",
        }}
      />

      {/* ── Vignette overlay to hide edge pixelation ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 2,
          pointerEvents: "none",
          background: "radial-gradient(circle, transparent 40%, rgba(11,14,20,0.4) 100%)",
          opacity: phase !== "intro" ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* ── Grid background (existing, unchanged) ──────────────── */}
      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
      />

      {/* ── Floating orbs (existing, unchanged) ────────────────── */}
      {/* ── Floating ambient orbs + particle nodes ─────────────── */}
      <div
        ref={orbsRef}
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          pointerEvents: "none", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "60%", right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,255,.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.04) 0%, transparent 70%)", filter: "blur(40px)" }} />

        {/* Floating particle data-nodes */}
        {[
          { top: "22%",  left: "7%",   delay: 0    },
          { top: "68%",  left: "5%",   delay: 1.1  },
          { top: "38%",  right: "6%",  delay: 0.6  },
          { top: "75%",  right: "8%",  delay: 1.8  },
          { top: "15%",  right: "18%", delay: 0.3  },
          { top: "82%",  left: "22%",  delay: 2.2  },
          { top: "50%",  left: "3%",   delay: 0.9  },
          { top: "30%",  right: "3%",  delay: 1.5  },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", ...p,
            width: 6, height: 6, borderRadius: "50%",
            background: i % 2 === 0 ? "#00FFAA" : "#00D0FF",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#00FFAA" : "#00D0FF"}`,
            animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0.55,
          }} />
        ))}
      </div>

      {/* ── Corner HUD brackets (always visible) ──────────────── */}
      {([
        { top: 16, left: 16,  borderTop: "2px solid", borderLeft: "2px solid"  },
        { top: 16, right: 16, borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: 16, left: 16,  borderBottom: "2px solid", borderLeft: "2px solid"  },
        { bottom: 16, right: 16, borderBottom: "2px solid", borderRight: "2px solid" },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{
          position: "absolute", ...s,
          width: 28, height: 28,
          borderColor: "rgba(0,255,170,0.3)",
          zIndex: 8, pointerEvents: "none",
        }} />
      ))}

      {/* ── Live status ticker ────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 22, left: 24,
        display: "flex", alignItems: "center", gap: 8,
        zIndex: 8, pointerEvents: "none",
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#00FFAA",
          boxShadow: "0 0 8px #00FFAA",
          animation: "pulseGlow 1.6s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9, color: "rgba(0,255,170,0.6)",
          letterSpacing: "0.18em", textTransform: "uppercase",
          transition: "opacity 0.4s",
        }}>
          {statusMsg}
        </span>
      </div>

      {/* ── Frame counter (top-right HUD readout) ─────────────── */}
      <div style={{
        position: "absolute", top: 22, right: 24,
        zIndex: 8, pointerEvents: "none",
        fontFamily: "'DM Mono', monospace",
        fontSize: 9, color: "rgba(255,255,255,0.15)",
        letterSpacing: "0.15em", textTransform: "uppercase",
      }}>
        SYS · LUMINESCENT v2.1
      </div>

      {/* ── Hero content (existing, unchanged) ─────────────────── */}
      <div
        ref={contentRef}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: 1000, width: "100%",
          padding: "120px 40px 0",
          textAlign: "center",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 32,
          // Fade out when canvas phases appear
          opacity: showCanvas && phase !== "intro" ? 0 : 1,
          transform: showCanvas && phase !== "intro" ? "translateY(-20px)" : "translateY(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: showCanvas && phase !== "intro" ? "none" : "auto",
        }}
      >
        <div className="tag">
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
            marginTop: 8,
          }}
        >
          Free for individuals.<br />
          <span className="shimmer-text">Powerful for teams.</span>
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 1.5vw, 20px)",
            color: "rgba(248, 249, 250, 0.6)",
            maxWidth: 600, lineHeight: 1.6,
            fontWeight: 300, marginBottom: 12,
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
        <div
          style={{
            display: "flex", gap: 48, marginTop: 40,
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
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#00FFAA" }}>
                {stat.val}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(248,249,250,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 2: AI Agents overlay (NEW) ───────────────────── */}
      {showCanvas && phase === "zoom" && (
        <div
          key="zoom-overlay"
          style={{
            position: "absolute", inset: 0, zIndex: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 24px",
            animation: "heroFadeIn 0.6s ease-out both",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "48px 72px",
              border: "1px solid rgba(0,255,170,0.2)",
              borderRadius: 24,
              background: "rgba(16,20,24,0.72)",
              backdropFilter: "blur(24px)",
              maxWidth: 620,
            }}
          >
            <div className="tag" style={{ marginBottom: 20 }}>
              <Sparkles size={11} /> AI Agents
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 4vw, 44px)",
                color: "#F8F9FA",
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              Deploy specialized agents<br />
              <span style={{ color: "#00FFAA" }}>trained on your SOPs</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(248,249,250,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
              One focused agent per workflow — sales, support, growth, research.
              They learn your patterns and execute autonomously.
            </p>
          </div>
        </div>
      )}

      {/* ── PHASE 3: Neural Command Center ─────────────────────── */}
      {showCanvas && phase === "heads" && (
        <div
          style={{
            position: "absolute", inset: 0,
            zIndex: 15, pointerEvents: "none",
            animation: "heroFadeIn 0.7s ease-out both",
          }}
        >
          {/* Ambient background glow in brand color */}
          <div
            key={`glow-${activeModel.name}`}
            style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 60% 55% at 50% 55%, ${activeModel.accent}12 0%, transparent 70%)`,
              transition: "background 1s ease",
            }}
          />

          {/* TOP CENTER — HUD label + arc progress */}
          <div style={{
            position: "absolute", top: 28, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.25em",
              color: activeModel.accent, textTransform: "uppercase",
            }}>
              ◈ Neural Link Active — {activeModelIdx + 1}/{MODELS.length}
            </span>

            {/* SVG arc progress bar */}
            <svg width="280" height="14" viewBox="0 0 280 14">
              <rect x="0" y="5" width="280" height="4" rx="2"
                fill="rgba(255,255,255,0.06)" />
              <rect x="0" y="5"
                width={Math.round(280 * ((activeModelIdx + 1) / MODELS.length))}
                height="4" rx="2"
                fill={activeModel.accent}
                style={{ transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }}
              />
              {/* tick marks */}
              {MODELS.map((_, i) => (
                <rect key={i}
                  x={Math.round(280 * (i / MODELS.length))} y="3"
                  width="1" height="8" rx="0.5"
                  fill="rgba(255,255,255,0.15)"
                />
              ))}
            </svg>
          </div>

          {/* LEFT PANEL — Identity */}
          <div
            key={`left-${activeModel.name}`}
            style={{
              position: "absolute", left: 32, top: "50%",
              transform: "translateY(-50%)",
              width: 240,
              background: "rgba(11,14,20,0.88)",
              backdropFilter: "blur(32px)",
              border: `1px solid ${activeModel.accent}30`,
              borderRadius: 16,
              padding: "28px 24px",
              animation: "hudSlideRight 0.5s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {/* Logo + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: 10,
                background: `${activeModel.accent}18`,
                border: `1px solid ${activeModel.accent}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <img
                  src={activeModel.logo}
                  alt={activeModel.name}
                  style={{
                    width: 22, height: 22, objectFit: "contain",
                    filter: activeModel.invert
                      ? "invert(1) brightness(2)"
                      : "brightness(1.1) contrast(1.1) saturate(1.1)",
                  }}
                />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: 17, color: "#F8F9FA", lineHeight: 1.1,
                }}>
                  {activeModel.name}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, color: "rgba(248,249,250,0.35)",
                  marginTop: 2, letterSpacing: "0.04em",
                }}>
                  {activeModel.sub}
                </div>
              </div>
            </div>

            {/* Capability tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {activeModel.tags.map((tag) => (
                <span key={tag} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: "0.08em",
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: `${activeModel.accent}15`,
                  border: `1px solid ${activeModel.accent}35`,
                  color: activeModel.accent,
                  textTransform: "uppercase",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Status line */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${activeModel.accent}0D`,
              border: `1px solid ${activeModel.accent}20`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: activeModel.accent,
                boxShadow: `0 0 8px ${activeModel.accent}`,
                animation: "pulseGlow 1.8s ease-in-out infinite",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9, color: activeModel.accent,
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                Provider Connected
              </span>
            </div>
          </div>

          {/* RIGHT PANEL — Metrics */}
          <div
            key={`right-${activeModel.name}`}
            style={{
              position: "absolute", right: 32, top: "50%",
              transform: "translateY(-50%)",
              width: 220,
              background: "rgba(11,14,20,0.88)",
              backdropFilter: "blur(32px)",
              border: `1px solid ${activeModel.accent}30`,
              borderRadius: 16,
              padding: "24px 20px",
              animation: "hudSlideLeft 0.5s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, color: activeModel.accent,
              letterSpacing: "0.2em", textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Capability Matrix
            </div>

            {([
              { key: "speed",      label: "Throughput"  },
              { key: "context",    label: "Context Win." },
              { key: "reasoning",  label: "Reasoning"   },
              { key: "efficiency", label: "Efficiency"  },
            ] as { key: keyof typeof activeModel.metrics; label: string }[]).map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: 5,
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, color: "rgba(248,249,250,0.4)",
                    letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, color: activeModel.accent,
                    fontWeight: 500,
                  }}>
                    {activeModel.metrics[key]}
                  </span>
                </div>
                {/* Track */}
                <div style={{
                  height: 3, borderRadius: 2,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}>
                  <div
                    key={`${activeModel.name}-${key}`}
                    style={{
                      height: "100%",
                      width: `${activeModel.metrics[key]}%`,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${activeModel.accent}88, ${activeModel.accent})`,
                      animation: "barGrow 0.8s cubic-bezier(0.16,1,0.3,1) both",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM STRIP — all 11 models as mini chips */}
          <div style={{
            position: "absolute", bottom: 28,
            left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            {MODELS.map((m, i) => (
              <div
                key={m.name}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: i === activeModelIdx ? "5px 12px" : "4px 8px",
                  borderRadius: 30,
                  background:
                    i === activeModelIdx
                      ? `${m.accent}22`
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    i === activeModelIdx ? `${m.accent}55` : "rgba(255,255,255,0.08)"
                  }`,
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <img
                  src={m.logo}
                  alt={m.name}
                  style={{
                    width: 12, height: 12, objectFit: "contain",
                    filter: m.invert
                      ? "invert(1) brightness(2)"
                      : "brightness(1.1)",
                    opacity: i === activeModelIdx ? 1 : 0.4,
                  }}
                />
                {i === activeModelIdx && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8, letterSpacing: "0.1em",
                    color: m.accent, textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>
                    {m.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CENTER — large ghost label behind head */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}>
            <div
              key={`center-${activeModel.name}`}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(56px,12vw,130px)",
                color: `${activeModel.accent}08`,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                userSelect: "none",
                animation: "heroFadeIn 0.6s ease both",
              }}
            >
              {activeModel.name.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* ── Decorative scanline (existing, unchanged) ───────────── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00FFAA, transparent)",
          opacity: 0.1,
          animation: "scanline 8s linear infinite",
          zIndex: 5, pointerEvents: "none",
        }}
      />
    </section>
  );
}
