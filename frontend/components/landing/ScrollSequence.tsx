"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SequenceOverlay } from "./sequenceoverlay";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── CONFIGURATION ──────────────────────────────────────────────
// Frames are in /public/frames/ and named frame 1.jpg … frame 285.jpg
const CONFIG = {
  totalFrames: 285,
  // i is 0-based; files are 1-based
  framePath: (i: number) =>
    `/frames/frame ${i + 1}.jpg`,
  phaseBoundaries: {
    intro: { start: 0, end: 80 },   // Auto-play: 0-8 s (runners)
    zoom:  { start: 80, end: 140 }, // Scroll:    camera push → agents
    heads: { start: 140, end: 285 },// Scroll:    head rotation → models
  },
  preloadBatch: 20,
  canvasScale: 2, // cap DPR at 2
};

// ─── IMAGE SEQUENCE ENGINE (plain object, no hooks) ─────────────
function createImageSequence(
  canvas: HTMLCanvasElement,
  onFrameChange?: (frame: number, phase: string) => void,
  onPhaseChange?: (next: string, prev: string) => void
) {
  const ctx2d = canvas.getContext("2d", { alpha: false })!;
  const playhead = { frame: 0, phase: "intro" };
  let curFrame = -1;
  const images: HTMLImageElement[] = new Array(CONFIG.totalFrames);
  let loadedCount = 0;
  let isReady = false;

  const getPhase = (f: number) => {
    if (f < CONFIG.phaseBoundaries.intro.end) return "intro";
    if (f < CONFIG.phaseBoundaries.zoom.end) return "zoom";
    return "heads";
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.canvasScale);
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx2d.scale(dpr, dpr);
  };

  const drawFrame = () => {
    const f = Math.round(playhead.frame);
    if (f === curFrame) return;
    const img = images[f];
    if (!img?.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    const scale = Math.max(rect.width / img.width, rect.height / img.height);
    const w = img.width  * scale;
    const h = img.height * scale;
    const x = (rect.width  - w) / 2;
    const y = (rect.height - h) / 2;

    ctx2d.drawImage(img, x, y, w, h);
    curFrame = f;

    const newPhase = getPhase(f);
    if (newPhase !== playhead.phase) {
      onPhaseChange?.(newPhase, playhead.phase);
      playhead.phase = newPhase;
    }
    onFrameChange?.(f, playhead.phase);
  };

  const preloadFrames = (center: number) => {
    const targets = [
      center,
      ...Array.from({ length: CONFIG.preloadBatch }, (_, i) => center + i + 1),
      ...Array.from({ length: CONFIG.preloadBatch }, (_, i) => center - i - 1),
    ].filter(f => f >= 0 && f < CONFIG.totalFrames && !images[f]);

    for (const idx of targets) {
      if (images[idx]) continue;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loadedCount++;
        if (!isReady && loadedCount > 10) isReady = true;
      };
      img.onerror = () => { /* graceful degradation */ };
      img.src = CONFIG.framePath(idx);
      images[idx] = img;
    }
  };

  resize();
  window.addEventListener("resize", resize);
  preloadFrames(0); // kickstart intro frames

  return {
    playhead,
    drawFrame,
    preloadFrames,
    resize,
    get isReady() { return isReady; },
    cleanup: () => {
      window.removeEventListener("resize", resize);
    },
  };
}

// ─── SCROLL INDICATOR ───────────────────────────────────────────
function ScrollIndicator({ phase }: { phase: string }) {
  if (phase !== "intro") return null;
  return (
    <div style={{
      position: "absolute",
      bottom: 40,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      zIndex: 20,
      pointerEvents: "none",
      animation: "fadeIn 1s ease 3.5s both",
    }}>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
      }}>
        Scroll to explore
      </span>
      <div style={{
        width: 1,
        height: 40,
        background: "linear-gradient(180deg, rgba(0,255,170,0.6), transparent)",
        animation: "scrollPulse 2s ease-in-out infinite",
      }} />
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export function ScrollSequence() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase,    setPhase]    = useState("intro");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const seq = createImageSequence(
      canvas,
      (frame) => {
        setProgress(frame / CONFIG.totalFrames);
        seq.preloadFrames(frame);
      },
      (next) => setPhase(next)
    );

    // ── GSAP context scoped to container ──────────────────────
    const ctx = gsap.context(() => {
      // PHASE 1 ─ auto-play intro (frames 0 → 79)
      const introTl = gsap.timeline({
        onComplete: () => setupScroll(),
      });
      introTl.to(seq.playhead, {
        frame: CONFIG.phaseBoundaries.intro.end - 1,
        duration: 3,
        ease: "power2.out",
        onUpdate: seq.drawFrame,
      });

      // PHASE 2 & 3 ─ scroll-scrubbed (frames 80 → 284)
      function setupScroll() {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: `+=${window.innerHeight * 5}`,
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const dir     = self.direction;
              const current = Math.round(seq.playhead.frame);
              const ahead   = dir > 0 ? current + 25 : current - 25;
              seq.preloadFrames(Math.max(0, Math.min(CONFIG.totalFrames - 1, ahead)));
            },
          },
        });

        // Zoom phase
        scrollTl.to(seq.playhead, {
          frame: CONFIG.phaseBoundaries.zoom.end - 1,
          ease: "none",
          onUpdate: seq.drawFrame,
        });

        // Heads / models phase
        scrollTl.to(seq.playhead, {
          frame: CONFIG.totalFrames - 1,
          ease: "none",
          onUpdate: seq.drawFrame,
        });
      }
    }, container);

    return () => {
      ctx.revert();
      seq.cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-sequence"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#101418",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
        }}
      />

      {/* Phase-aware overlay */}
      <SequenceOverlay phase={phase} progress={progress} />

      {/* Scroll hint */}
      <ScrollIndicator phase={phase} />
    </div>
  );
}