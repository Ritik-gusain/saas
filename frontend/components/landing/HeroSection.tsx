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
// Files in /public/frames/ are named ezgif-frame-001.jpg … ezgif-frame-285.jpg
const FRAME_PATH = (i: number) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

const PHASES = {
  intro: { start: 0,   end: 80  }, // 0-8 s : figures running
  zoom:  { start: 80,  end: 140 }, // 8-11 s: camera push → agents reveal
  heads: { start: 140, end: 285 }, // 11-19s: head rotation → model showcase
};

const MODELS = [
  { name: "OpenAI",      sub: "GPT-4o / o1-preview",    accent: "#00FFAA" },
  { name: "Claude",      sub: "3.5 Sonnet / Opus",       accent: "#00D0FF" },
  { name: "Gemini",      sub: "1.5 Pro / Flash",         accent: "#00FFAA" },
  { name: "DeepSeek",    sub: "DeepSeek-V3 / R1",        accent: "#00D0FF" },
  { name: "Mistral AI",  sub: "Mistral Large 2",         accent: "#E87D3E" },
  { name: "Meta",        sub: "Llama 3.3 / 405B",        accent: "#0082FB" },
  { name: "Qwen",        sub: "Qwen 2.5 / 72B",          accent: "#00D0FF" },
  { name: "Nvidia",      sub: "Llama-3.1-Nemotron",      accent: "#76B900" },
  { name: "Perplexity",  sub: "Sonar Pro / Llama 3",     accent: "#00FFAA" },
  { name: "Moonshot AI", sub: "Kimi k1.5",               accent: "#00D0FF" },
  { name: "xAI",         sub: "Grok 3 (Beta)",           accent: "#F8F9FA" },
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
  const [showCanvas, setShowCanvas]         = useState(false);
  const [phase, setPhase]                   = useState<"intro" | "zoom" | "heads">("intro");
  const [activeModelIdx, setActiveModelIdx] = useState(0);

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

  // ── NEW: Canvas frame sequence + ScrollTrigger ─────────────
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx2d = canvas.getContext("2d", { alpha: false });
    if (!ctx2d) return;

    // Image cache
    const images: (HTMLImageElement | undefined)[] = [];
    let animId: number | null = null;
    let targetFrame = 0;
    let renderedFrame = -1;

    // Preload a window of frames around `center`
    const preload = (center: number) => {
      for (let offset = -5; offset <= 20; offset++) {
        const idx = center + offset;
        if (idx < 0 || idx >= TOTAL_FRAMES || images[idx]) continue;
        const img = new Image();
        img.decoding = "async";
        img.src = FRAME_PATH(idx);
        images[idx] = img;
      }
    };

    // Resize canvas to match display size × DPR
    const resize = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Paint one frame, cover-crop to canvas
    const paint = (img: HTMLImageElement) => {
      const rect = canvas.getBoundingClientRect();
      const s = Math.max(rect.width / img.width, rect.height / img.height);
      ctx2d.drawImage(
        img,
        (rect.width  - img.width  * s) / 2,
        (rect.height - img.height * s) / 2,
        img.width  * s,
        img.height * s
      );
    };

    // rAF loop — smooth interpolation toward target
    let smoothFrame = 0;
    const loop = () => {
      smoothFrame += (targetFrame - smoothFrame) * 0.12;
      const idx = Math.round(smoothFrame);

      if (idx !== renderedFrame) {
        const img = images[idx];
        if (img?.complete && img.naturalWidth) {
          paint(img);
          renderedFrame = idx;
        } else {
          // Fallback: find nearest loaded frame
          for (let d = 1; d < 15; d++) {
            const fb = images[idx + d] ?? images[idx - d];
            if (fb?.complete && fb.naturalWidth) { paint(fb); break; }
          }
        }
      }
      animId = requestAnimationFrame(loop);
    };

    // Map global scroll progress → frame index + phase state
    const onScrollUpdate = (self: ScrollTrigger) => {
      const p = self.progress; // 0→1

      let frame: number;
      if (p < 0.2) {
        frame = PHASES.intro.end - 1;           // hold at last intro frame
        setPhase("intro");
      } else if (p < 0.5) {
        const z = (p - 0.2) / 0.3;
        frame = PHASES.zoom.start + z * (PHASES.zoom.end - PHASES.zoom.start);
        setPhase("zoom");
      } else {
        const h = (p - 0.5) / 0.5;
        frame = PHASES.heads.start + h * (PHASES.heads.end - PHASES.heads.start);
        setPhase("heads");
        setActiveModelIdx(
          Math.min(Math.floor(h * MODELS.length), MODELS.length - 1)
        );
      }

      targetFrame = Math.round(Math.min(Math.max(frame, 0), TOTAL_FRAMES - 1));
      preload(targetFrame + 12);
    };

    // Build ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${window.innerHeight * 3.5}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onEnter: () => {
        setShowCanvas(true);
        videoRef.current?.pause();
        preload(0);
        if (!animId) loop();
      },
      onLeaveBack: () => {
        setShowCanvas(false);
        videoRef.current?.play().catch(() => {});
      },
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
      {/* ── Background video (existing, unchanged) ─────────────── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0, overflow: "hidden",
          opacity: showCanvas ? 0 : 1,
          transition: "opacity 0.6s ease",
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
        }}
      />

      {/* ── Grid background (existing, unchanged) ──────────────── */}
      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
      />

      {/* ── Floating orbs (existing, unchanged) ────────────────── */}
      <div
        ref={orbsRef}
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          pointerEvents: "none", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "60%", right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,255,.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
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

      {/* ── PHASE 3: Model showcase overlay (NEW) ──────────────── */}
      {showCanvas && phase === "heads" && (
        <div
          style={{
            position: "absolute", bottom: "10%",
            left: "50%", transform: "translateX(-50%)",
            zIndex: 15, pointerEvents: "none",
            animation: "heroSlideUp 0.5s ease-out both",
          }}
        >
          <div
            key={activeModel.name} // re-mount → re-animate on model change
            style={{
              background: "rgba(16,20,24,0.82)",
              backdropFilter: "blur(28px)",
              border: `1px solid ${activeModel.accent}45`,
              borderRadius: 20,
              padding: "28px 52px",
              minWidth: 320,
              textAlign: "center",
              animation: "heroFadeIn 0.35s ease-out both",
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
                fontSize: 28,
                color: "#F8F9FA",
                marginBottom: 4,
              }}
            >
              {activeModel.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(248,249,250,0.38)", marginBottom: 18 }}>
              {activeModel.sub}
            </div>

            {/* Progress pill indicators */}
            <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
              {MODELS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 5,
                    width: i === activeModelIdx ? 20 : 5,
                    borderRadius: 3,
                    background: i === activeModelIdx ? activeModel.accent : "rgba(255,255,255,0.1)",
                    transition: "width 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
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
