"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      if (!contentRef.current) return;

      tl.fromTo(contentRef.current.children, 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, delay: 0.3 }
      );

      if (videoRef.current) {
        videoRef.current.play().catch(() => console.log("Video autoplay prevented"));
        gsap.fromTo(videoRef.current, 
          { scale: 1.1, opacity: 0 }, 
          { scale: 1, opacity: 0.65, duration: 2.5, ease: "power2.out" }
        );
      }

      // Animate floating orbs
      if (orbsRef.current) {
        const orbs = orbsRef.current.children;
        Array.from(orbs).forEach((orb, i) => {
          gsap.to(orb, {
            x: `random(-50, 50)`,
            y: `random(-30, 30)`,
            duration: `random(4, 7)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} style={{ 
      position: "relative", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      overflow: "hidden",
      background: "#101418"
    }}>
      {/* Background Video */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden"
      }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            filter: "brightness(0.8) saturate(1.2)"
          }}
        >
          <source src="/video1.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradient */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 0%, #101418 100%), linear-gradient(to bottom, transparent 60%, #101418 100%)",
          zIndex: 1
        }} />
      </div>

      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />

      {/* Floating Orbs */}
      <div ref={orbsRef} style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "60%", right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,255,.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      {/* Content Container */}
      <div ref={contentRef} style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 1000,
        width: "100%",
        padding: "120px 40px 0",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32
      }}>
        <div className="tag">
          <Sparkles size={11} /> Now Supporting 40+ AI Models
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(42px, 8vw, 84px)",
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          color: "#F8F9FA",
          textShadow: "0 20px 40px rgba(0,0,0,0.5)",
          marginTop: 8
        }}>
          Free for individuals.<br />
          <span className="shimmer-text">Powerful for teams.</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 1.5vw, 20px)",
          color: "rgba(248, 249, 250, 0.6)",
          maxWidth: 600,
          lineHeight: 1.6,
          fontWeight: 300,
          marginBottom: 12
        }}>
          The world's most advanced AI collaboration platform. 
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

        {/* Hero Stats */}
        <div style={{ 
          display: "flex", 
          gap: 48, 
          marginTop: 40, 
          padding: "24px 48px", 
          background: "rgba(255,255,255,0.03)", 
          backdropFilter: "blur(12px)",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          {[
            { label: "Active Nodes", val: "14.2k+" },
            { label: "Sync Speed", val: "8ms" },
            { label: "Uptime", val: "99.99%" }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#00FFAA" }}>{stat.val}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(248,249,250,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Scanline */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #00FFAA, transparent)",
        opacity: 0.1,
        animation: "scanline 8s linear infinite",
        zIndex: 5,
        pointerEvents: "none"
      }} />
    </section>
  );
}
