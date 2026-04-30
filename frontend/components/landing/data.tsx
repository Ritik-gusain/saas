"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Inline Icons ─── */
const InlineMusic = () => (
  <span className="inline-icon-wrap" style={{ background: "#8B5CF6" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: "70%", height: "70%" }}>
      <path d="M9 17V7l8-3v10" stroke="#0A0D12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="17" r="2.5" fill="#0A0D12"/>
      <circle cx="15" cy="14" r="2.5" fill="#0A0D12"/>
    </svg>
  </span>
);

const InlineMovie = () => (
  <span className="inline-icon-wrap" style={{ background: "#22C55E" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: "70%", height: "70%" }}>
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#0A0D12"/>
      <path d="M8 9l4 3-4 3V9z" fill="#22C55E"/>
    </svg>
  </span>
);

const InlineGhost = () => (
  <span className="inline-icon-wrap" style={{ background: "#F97316", clipPath: "polygon(10% 0, 90% 0, 100% 30%, 100% 90%, 85% 100%, 70% 90%, 55% 100%, 40% 90%, 25% 100%, 10% 90%, 0 90%, 0 30%)" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: "60%", height: "60%" }}>
      <path d="M12 2C7 2 3 6 3 11v9l3-2 3 2 3-2 3 2 3-2 3 2v-9c0-5-4-9-9-9z" fill="#0A0D12"/>
      <circle cx="9" cy="10" r="1.5" fill="#F97316"/>
      <circle cx="15" cy="10" r="1.5" fill="#F97316"/>
    </svg>
  </span>
);

const InlineLock = () => (
  <span className="inline-icon-wrap" style={{ background: "#EAB308" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: "60%", height: "60%" }}>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="#0A0D12"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke="#0A0D12" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  </span>
);

const InlineShirt = () => (
  <span className="inline-icon-wrap" style={{ background: "#3B82F6" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: "60%", height: "60%" }}>
      <path d="M7 4h3l3.5 4L17 4h3v5h-4v11H11V9H7V4z" fill="#0A0D12"/>
    </svg>
  </span>
);

export function DataValueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Light section entrance */
      if (lightRef.current) {
        gsap.fromTo(lightRef.current.querySelectorAll(".reveal-line"),
          { y: 60, opacity: 0, rotateX: 20 },
          {
            y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: lightRef.current, start: "top 75%" }
          }
        );
      }

      /* Wave transition */
      if (waveRef.current) {
        const waves = waveRef.current.querySelectorAll<HTMLElement>(".color-blob");
        gsap.fromTo(waves,
          { x: "-100vw", scale: 0.8, borderRadius: "0%" },
          {
            x: "100vw", scale: 1.2, borderRadius: "50%",
            duration: 2.5, stagger: 0.15, ease: "power3.inOut",
            scrollTrigger: { trigger: waveRef.current, start: "top 90%", scrub: 1 }
          }
        );
      }

      /* Dark manifesto text reveal */
      if (darkRef.current) {
        const words = darkRef.current.querySelectorAll<HTMLElement>(".manifesto-word");
        gsap.fromTo(words,
          { opacity: 0, filter: "blur(12px)", y: 20 },
          {
            opacity: 1, filter: "blur(0px)", y: 0,
            duration: 0.8, stagger: 0.03, ease: "power2.out",
            scrollTrigger: { trigger: darkRef.current, start: "top 70%" }
          }
        );

        const pills = darkRef.current.querySelectorAll<HTMLElement>(".highlight-pill");
        gsap.fromTo(pills,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)",
            scrollTrigger: { trigger: darkRef.current, start: "top 65%" }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative" }}>
      {/* ─── 1. Light Inline-Icon Section ─── */}
      <div ref={lightRef} style={{
        background: "#F3EFE6", color: "#0A0D12", padding: "160px 24px",
        position: "relative", overflow: "hidden", perspective: 1000,
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p className="reveal-line" style={{
            fontFamily: "var(--font-body)", fontSize: 14,
            color: "rgba(10,13,18,0.5)", marginBottom: 40, textAlign: "center"
          }}>
            Here&apos;s a fun fact:<br />Today, you are the product
          </p>

          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(32px, 5.5vw, 72px)", lineHeight: 1.15,
            letterSpacing: "-0.04em", textAlign: "center",
          }}>
            <span className="reveal-line" style={{ display: "block" }}>
              Your favorite <InlineMusic /> songs.
            </span>
            <span className="reveal-line" style={{ display: "block" }}>
              That <InlineMovie /> must-see movie.
            </span>
            <span className="reveal-line" style={{ display: "block" }}>
              Your top <InlineGhost /> interests and
            </span>
            <span className="reveal-line" style={{ display: "block" }}>
              all your shopping <InlineLock /> <InlineShirt /> habits.
            </span>
          </h2>
        </div>
      </div>

      {/* ─── 2. Color Wave Transition ─── */}
      <div ref={waveRef} style={{
        position: "relative", height: 400, overflow: "hidden",
        background: "#0A0D12", marginTop: -2,
      }}>
        <div className="color-blob" style={{
          position: "absolute", top: "10%", left: "-20%",
          width: "140%", height: 120, background: "#BEF264", borderRadius: 60,
        }} />
        <div className="color-blob" style={{
          position: "absolute", top: "30%", left: "-20%",
          width: "140%", height: 140, background: "#8B5CF6", borderRadius: 80,
        }} />
        <div className="color-blob" style={{
          position: "absolute", top: "50%", left: "-20%",
          width: "140%", height: 100, background: "#FDE047", borderRadius: 50,
        }} />
        <div className="color-blob" style={{
          position: "absolute", top: "65%", left: "-20%",
          width: "140%", height: 130, background: "#BFDBFE", borderRadius: 70,
        }} />
        <div className="color-blob" style={{
          position: "absolute", top: "80%", left: "-20%",
          width: "140%", height: 110, background: "#FCA5A5", borderRadius: 60,
        }} />
      </div>

      {/* ─── 3. Dark Manifesto Section ─── */}
      <div ref={darkRef} style={{
        background: "#0A0D12", padding: "160px 24px", position: "relative",
      }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(24px, 3.5vw, 42px)", lineHeight: 1.25,
            color: "#F8F9FA", letterSpacing: "-0.03em", marginBottom: 60,
          }}>
            <span className="manifesto-word" style={{ position: "relative", display: "inline-block" }}>
              <span className="highlight-pill" style={{
                position: "absolute", inset: "-4px -12px", background: "#8B5CF6",
                borderRadius: 8, zIndex: 0, opacity: 0.9,
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>Your data</span>
            </span>
            {" "}
            <span className="manifesto-word">is</span>{" "}
            <span className="manifesto-word">taken</span>{" "}
            <span className="manifesto-word">by</span>{" "}
            <span className="manifesto-word">companies</span>{" "}
            <span className="manifesto-word">and</span>{" "}
            <span className="manifesto-word">used</span>{" "}
            <span className="manifesto-word">to</span>{" "}
            <span className="manifesto-word">train</span>{" "}
            <span className="manifesto-word">the</span>{" "}
            <span className="manifesto-word">next</span>{" "}
            <span className="manifesto-word">wave</span>{" "}
            <span className="manifesto-word">of</span>{" "}
            <span className="manifesto-word">AI</span>{" "}
            <span className="manifesto-word">models</span>{" "}
            <span className="manifesto-word">and</span>{" "}
            <span className="manifesto-word">build</span>{" "}
            <span className="manifesto-word">the</span>{" "}
            <span className="manifesto-word">world&apos;s</span>{" "}
            <span className="manifesto-word">top</span>{" "}
            <span className="manifesto-word">products</span>{" "}
            <span className="manifesto-word">and</span>{" "}
            <span className="manifesto-word">services.</span>{" "}
            <span className="manifesto-word">Yet</span>{" "}
            <span className="manifesto-word">it</span>{" "}
            <span className="manifesto-word">often</span>{" "}
            <span className="manifesto-word">happens</span>{" "}
            <span className="manifesto-word">without</span>{" "}
            <span className="manifesto-word">any</span>{" "}
            <span className="manifesto-word">earnings</span>{" "}
            <span className="manifesto-word">being</span>{" "}
            <span className="manifesto-word">distributed</span>{" "}
            <span className="manifesto-word">back</span>{" "}
            <span className="manifesto-word">to</span>{" "}
            <span className="manifesto-word">you.</span>
          </p>

          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(24px, 3.5vw, 42px)", lineHeight: 1.25,
            color: "#F8F9FA", letterSpacing: "-0.03em",
          }}>
            <span className="manifesto-word">It&apos;s</span>{" "}
            <span className="manifesto-word">time</span>{" "}
            <span className="manifesto-word">for</span>{" "}
            <span className="manifesto-word">a</span>{" "}
            <span className="manifesto-word">change.</span>
            <br />
            <span className="manifesto-word">With</span>{" "}
            <span className="manifesto-word" style={{ position: "relative", display: "inline-block" }}>
              <span className="highlight-pill" style={{
                position: "absolute", inset: "-4px -12px", background: "#F97316",
                borderRadius: 8, zIndex: 0, opacity: 0.9,
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>Luminescent</span>
            </span>
            {" "}
            <span className="manifesto-word">you</span>{" "}
            <span className="manifesto-word">join</span>{" "}
            <span className="manifesto-word">a</span>{" "}
            <span className="manifesto-word">decentralized</span>{" "}
            <span className="manifesto-word">intelligence</span>{" "}
            <span className="manifesto-word">platform</span>{" "}
            <span className="manifesto-word">that</span>{" "}
            <span className="manifesto-word">puts</span>{" "}
            <span className="manifesto-word">the</span>{" "}
            <span className="manifesto-word">power</span>{" "}
            <span className="manifesto-word">back</span>{" "}
            <span className="manifesto-word">in</span>{" "}
            <span className="manifesto-word">your</span>{" "}
            <span className="manifesto-word">hands</span>{" "}
            <span className="manifesto-word">and</span>{" "}
            <span className="manifesto-word">rewards</span>{" "}
            <span className="manifesto-word">you</span>{" "}
            <span className="manifesto-word">for</span>{" "}
            <span className="manifesto-word">the</span>{" "}
            <span className="manifesto-word">data</span>{" "}
            <span className="manifesto-word">you</span>{" "}
            <span className="manifesto-word">contribute.</span>
          </p>
        </div>
      </div>
    </section>
  );
}