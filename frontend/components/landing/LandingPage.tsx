"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Logo } from "../shared/Logo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Users,
  MessageSquare,
  ArrowRight,
  Menu,
  X,
  Brain,
  TrendingUp,
  Workflow,
  Zap,
  Lock,
  ChevronRight,
  Check,
  Globe,
  Sparkles,
  Wind,
  Search,
  Cpu,
  Lightbulb,
  Shield,
  Rocket,
  BarChart3,
  Layers,
  Code2,
  Terminal,
  Bot,
  Eye,
  Star,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Design Tokens ────────────────────────────────────────────────
// Cyber Green:        #00FFAA
// Holographic Cyan:   #00D0FF
// Dark Slate/Obsidian:#101418
// Deep Teal:          #005C69
// Starlight White:    #F8F9FA

/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --green:   #00FFAA;
      --cyan:    #00D0FF;
      --bg:      #101418;
      --teal:    #005C69;
      --white:   #F8F9FA;
      --surface: #161B21;
      --surface2:#1C2329;
      --border:  rgba(255,255,255,0.06);
      --border2: rgba(0,255,170,0.15);
      --muted:   rgba(248,249,250,0.45);
      --dimmed:  rgba(248,249,250,0.22);
    }

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #101418; color: #F8F9FA; font-family: 'DM Sans', system-ui, sans-serif; }
    ::selection { background: rgba(0,255,170,0.15); color: #00FFAA; }

    /* Animations */
    @keyframes float      { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-14px)} }
    @keyframes pulseGlow  { 0%,100%{opacity:.4}                   50%{opacity:1} }
    @keyframes shimmer    { 0%{background-position:-200% center}  100%{background-position:200% center} }
    @keyframes borderFlow { 0%,100%{background-position:0% 50%}   50%{background-position:100% 50%} }
    @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes gridBreath { 0%,100%{opacity:.04}  50%{opacity:.09} }
    @keyframes ticker     { from{transform:translateX(0)}          to{transform:translateX(-50%)} }
    @keyframes orbFloat   { 0%,100%{transform:translate(0,0)}     50%{transform:translate(30px,-20px)} }
    @keyframes scanline   { 0%{transform:translateY(-100%)}        100%{transform:translateY(100vh)} }
    @keyframes spinLoader { to{transform:rotate(360deg)} }
    @keyframes runCycle   { 0%{transform:scaleX(1)} 50%{transform:scaleX(-1)} }
    @keyframes glowPulse  { 0%,100%{filter:drop-shadow(0 0 6px rgba(0,255,170,.6))} 50%{filter:drop-shadow(0 0 20px rgba(0,255,170,1))} }
    @keyframes headSpin   { 0%{transform:rotateY(0) rotateX(0)} 100%{transform:rotateY(360deg) rotateX(180deg)} }
    @keyframes floatOrb   { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-30px) scale(1.1)} 66%{transform:translate(-10px,15px) scale(0.9)} }

    .shimmer-text {
      background: linear-gradient(90deg, #F8F9FA 0%, #00FFAA 35%, #00D0FF 55%, #F8F9FA 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(0,255,170,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,170,.045) 1px, transparent 1px);
      background-size: 64px 64px;
      animation: gridBreath 8s ease-in-out infinite;
    }

    .cyber-card {
      background: #161B21;
      border: 1px solid rgba(255,255,255,.055);
      border-radius: 14px;
      transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
      position: relative;
      overflow: hidden;
    }
    .cyber-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0,255,170,.03), transparent);
      transition: left .6s;
    }
    .cyber-card:hover::before {
      left: 100%;
    }
    .cyber-card:hover {
      transform: translateY(-5px);
      border-color: rgba(0,255,170,.22);
      box-shadow: 0 20px 60px rgba(0,255,170,.07);
    }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 30px;
      background: linear-gradient(135deg, #00FFAA, #00D0FF);
      color: #101418;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700; font-size: 15px; letter-spacing: .02em;
      border: none; border-radius: 8px; cursor: pointer;
      position: relative; overflow: hidden;
      transition: transform .2s, box-shadow .2s;
      text-decoration: none; white-space: nowrap;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 48px rgba(0,255,170,.35); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 26px;
      background: transparent; color: #F8F9FA;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500; font-size: 14px; letter-spacing: .02em;
      border: 1px solid rgba(255,255,255,.12); border-radius: 8px; cursor: pointer;
      transition: border-color .25s, color .25s, background .25s;
      text-decoration: none; white-space: nowrap;
    }
    .btn-ghost:hover { border-color: rgba(0,255,170,.4); color: #00FFAA; background: rgba(0,255,170,.04); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px;
      border: 1px solid rgba(0,255,170,.25);
      background: rgba(0,255,170,.06);
      border-radius: 40px;
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500; letter-spacing: .1em;
      color: #00FFAA; text-transform: uppercase;
    }

    .nav-link {
      position: relative; font-size: 14px; font-weight: 500;
      color: rgba(248,249,250,.5); text-decoration: none; letter-spacing: .02em;
      transition: color .2s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
      height: 1px; background: #00FFAA;
      transform: scaleX(0); transition: transform .25s cubic-bezier(.16,1,.3,1);
    }
    .nav-link:hover { color: #F8F9FA; }
    .nav-link:hover::after { transform: scaleX(1); }

    .chat-enter { animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #101418; }
    ::-webkit-scrollbar-thumb { background: #005C69; border-radius: 3px; }

    /* Cinematic sequence responsive cards */
    @media (max-width: 768px) {
      .cinema-card { display: none !important; }
      .cinema-card:nth-child(-n+3) { display: block !important; }
    }

    @media (max-width: 900px) {
      .nav-desktop { display: none !important; }
      .hero-grid   { grid-template-columns: 1fr !important; }
      .hero-mockup { display: none !important; }
      .features-grid, .pricing-grid, .steps-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 560px) {
      .features-grid, .pricing-grid, .steps-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* SVG Animations */
    svg.wireframe-figure { animation: glowPulse 2.5s ease-in-out infinite; }
    svg.running-figure { animation: runCycle 1.2s ease-in-out infinite; }
    svg.head-3d { animation: headSpin 4s linear infinite; perspective: 1200px; }

    .logo-ticker-item {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .logo-ticker-item:hover {
      opacity: 1 !important;
      filter: drop-shadow(0 0 15px rgba(0,255,170,0.3)) !important;
      transform: scale(1.08) !important;
    }
  `}</style>
);

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    if (!navRef.current) return;
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.3 }
    );
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
        height: 34, background: "rgba(16, 20, 24, 0.8)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ 
            width: 8, height: 8, borderRadius: "50%", background: "#00FFAA", 
            animation: "pulseGlow 2s infinite", boxShadow: "0 0 10px rgba(0, 255, 170, 0.4)" 
          }} />
          <span style={{ 
            fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(248, 249, 250, 0.8)", 
            fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" 
          }}>
            V2.0 Cinematic Release
          </span>
          <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
          <Link href="/docs" style={{ 
            fontSize: 10, color: "#00FFAA", textDecoration: "none", 
            fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" 
          }}>
            Read Changelog
          </Link>
        </div>
      </div>

      <nav ref={navRef} style={{
        position: "fixed", top: 34, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background .3s, border-color .3s",
      background: scrolled ? "rgba(16,20,24,.85)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(0,255,170,.08)" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <Logo size={34} />
        <span style={{
          fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 18,
          background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Luminescent.io
        </span>
      </Link>

      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {["Features", "Agents", "Pricing", "Docs"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
        ))}
      </div>

      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/login" style={{ fontSize: 14, color: "rgba(248,249,250,.45)", textDecoration: "none", fontWeight: 500, transition: "color .2s" }}
          onMouseOver={e => (e.currentTarget.style.color = "#F8F9FA")}
          onMouseOut={e => (e.currentTarget.style.color = "rgba(248,249,250,.45)")}>
          Sign in
        </Link>
        <Link href="/register" className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
          Get Started Free <ArrowRight size={13} />
        </Link>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} style={{
        display: "none", background: "none", border: "none",
        color: "rgba(248,249,250,.6)", cursor: "pointer",
      }} className="mobile-toggle">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <style>{`
        @media (max-width: 900px) {
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      {menuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "rgba(16,20,24,.96)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,170,.1)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          {["Features", "Agents", "Pricing", "Docs"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 14, color: "rgba(248,249,250,.55)", textDecoration: "none", fontWeight: 500 }}>
              {item}
            </a>
          ))}
          <Link href="/register" className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
    </>
  );
}


/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
function HeroSection() {
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
          { scale: 1, opacity: 0.4, duration: 2.5, ease: "power2.out" }
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
            filter: "brightness(0.6) saturate(1.2)"
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
        <div className="tag" style={{ animation: "fadeUp 0.8s ease-out 0.2s both" }}>
          <Sparkles size={11} /> Now Supporting 40+ AI Models
        </div>

        <h1 style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(48px, 8vw, 92px)",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
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
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 18, color: "#00FFAA" }}>{stat.val}</div>
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

/* ═══════════════════════════════════════════
   LOGO TICKER — POPULAR OPENROUTER MODELS
   Updated with real OpenRouter April 2026 data
═══════════════════════════════════════════ */

// Official logo URLs from LobeHub CDN + official sources
const OPENROUTER_MODELS = [
  {
    name: "OpenAI",
    logo: "/ai logo/penailogo.svg",
    model: "GPT-5.4",
    invert: true,
  },
  {
    name: "Claude",
    logo: "/ai logo/Anthropic.svg",
    model: "Claude 3.5 Sonnet",
    invert: true,
  },
  {
    name: "Gemini",
    logo: "/ai logo/GoogleGemini.svg",
    model: "Gemini 1.5 Pro",
    invert: false,
  },
  {
    name: "DeepSeek",
    logo: "/ai logo/DeepSeek.png",
    model: "DeepSeek V3",
    invert: true,
  },
  {
    name: "Moonshot AI",
    logo: "/ai logo/moonshotai.png",
    model: "Kimi k1.5",
    invert: true,
  },
  {
    name: "xAI",
    logo: "/ai logo/xai.png",
    model: "Grok 3",
    invert: true,
  },
  {
    name: "Qwen",
    logo: "/ai logo/Qwen.png",
    model: "Qwen 2.5",
    invert: true,
  },
  {
    name: "Mistral AI",
    logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@latest/assets/mistral/logo.svg",
    model: "Large 2",
    invert: false,
  },
  {
    name: "Meta",
    logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@latest/assets/meta/logo.svg",
    model: "Llama 3.3",
    invert: false,
  },
  {
    name: "Perplexity",
    logo: "/ai logo/Perplexity.svg",
    model: "Sonar Pro",
    invert: true,
  },
  {
    name: "NVIDIA",
    logo: "/ai logo/nvidia.png",
    model: "Nemotron 3",
    invert: false,
  },
];

function LogoTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Double the array for a perfect infinite scroll loop with the -50% translateX animation
  const doubled = [...OPENROUTER_MODELS, ...OPENROUTER_MODELS];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 90%" } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      borderTop: "1px solid rgba(255,255,255,.05)", 
      borderBottom: "1px solid rgba(255,255,255,.05)",
      padding: "40px 0", 
      overflow: "hidden", 
      position: "relative",
      background: "linear-gradient(180deg, rgba(16,20,24,.4) 0%, rgba(0,92,105,.05) 50%, rgba(16,20,24,.4) 100%)",
    }}>
      {/* Section Label */}
      <div ref={titleRef} style={{ textAlign: "center", marginBottom: 28 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "rgba(248,249,250,0.3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          Powered by the models you already trust
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 60, 
        animation: "ticker 50s linear infinite", 
        width: "max-content",
        alignItems: "center"
      }}>
        {doubled.map((model, i) => {
          return (
            <div 
              key={`${model.name}-${i}`} 
              className="logo-ticker-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 24px",
                opacity: 0.75,
                cursor: "pointer",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                minWidth: "max-content",
              }}
            >
              <div style={{
                minWidth: 40,
                width: "auto",
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <img 
                  src={model.logo} 
                  alt={model.name} 
                  style={{ 
                    height: model.name === 'OpenAI' ? 18 : 26,
                    width: "auto",
                    objectFit: "contain",
                    filter: model.invert 
                      ? "invert(1) brightness(1.5) drop-shadow(0 0 8px rgba(0,255,170,0.15))" 
                      : "brightness(1.5) drop-shadow(0 0 8px rgba(0,255,170,0.15))",
                  }} 
                  onError={(e) => {
                    // Fallback to text if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 800, 
                  fontSize: 14,
                  color: "#FFFFFF", 
                  letterSpacing: ".03em",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}>
                  {model.name}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "rgba(0,255,170,0.5)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {model.model}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Fade edges */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, #101418 0%, transparent 12%, transparent 88%, #101418 100%)",
        pointerEvents: "none",
        zIndex: 2
      }} />
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════ */
const FEATURES = [
  { icon: MessageSquare, title: "Shared Chat History", accent: "#00FFAA", desc: "Your team's entire AI conversation history in one searchable place. Reference and build on each other's work." },
  { icon: Brain, title: "Custom AI Agents", accent: "#00D0FF", desc: "Deploy specialized agents trained on your SOPs. One focused agent per workflow — sales, support, growth." },
  { icon: Zap, title: "Smart Prompt Library", accent: "#00FFAA", desc: "Save, share, and version-control your best prompts. Stop re-engineering the same prompts every sprint." },
  { icon: Workflow, title: "Projects & Folders", accent: "#00D0FF", desc: "Organize AI work by client or sprint. Files, outputs, and conversations — all structured the way you think." },
  { icon: TrendingUp, title: "Token Efficiency", accent: "#00FFAA", desc: "Team-wide shared context means 60% fewer tokens spent. Less waste, significantly more output per rupee." },
  { icon: Lock, title: "Enterprise Security", accent: "#00D0FF", desc: "SSO, RBAC, and full audit logs. Your IP stays yours — never used to train any public models." },
];

function FeaturesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: headRef.current, start: "top 82%" } }
      );
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: .8, delay: i * .1, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" style={{ padding: "120px 0", background: "#101418", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,255,170,.15), transparent)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <Zap size={11} /> Capabilities
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16, marginBottom: 14,
          }}>
            Built for teams.<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>Not just you.</span>
          </h2>
          <p style={{ fontSize: 15.5, color: "rgba(248,249,250,.42)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Every feature designed around how teams actually work — together, async, across tools and timezones.
          </p>
        </div>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} ref={el => { cardsRef.current[i] = el; }} className="cyber-card" style={{ padding: "30px" }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${f.accent}44, transparent)`,
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 10, marginBottom: 20,
                  background: `${f.accent}0F`, border: `1px solid ${f.accent}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={19} color={f.accent} />
                </div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16.5, color: "#F8F9FA", marginBottom: 10, letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13.5, color: "rgba(248,249,250,.42)", lineHeight: 1.72, fontWeight: 300 }}>{f.desc}</p>
                <div style={{
                  position: "absolute", bottom: 14, right: 16,
                  fontFamily: "'DM Mono',monospace", fontSize: 10, color: `${f.accent}30`, letterSpacing: ".1em",
                }}>
                  0{i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════ */
const STEPS = [
  { num: "01", title: "Create Your Workspace", desc: "Sign up free and bring your own API key. No credit card. Your workspace is ready in 30 seconds.", icon: Globe },
  { num: "02", title: "Invite Your Team", desc: "Add teammates with one click. Roles, permissions, and shared context are set up automatically.", icon: Users },
  { num: "03", title: "Deploy AI Agents", desc: "Upload your SOPs. Configure specialized agents per workflow — sales, support, growth, research.", icon: Brain },
  { num: "04", title: "Collaborate & Scale", desc: "Every conversation, prompt, and output is searchable and shared across your team in real time.", icon: TrendingUp },
];

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      
      // Animate the connecting line
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power3.inOut", scrollTrigger: { trigger: ref.current, start: "top 75%" } }
        );
      }

      Array.from(ref.current.children).forEach((child, i) => {
        gsap.fromTo(child,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: .8, delay: i * .15, ease: "power3.out",
            scrollTrigger: { trigger: child, start: "top 88%" }
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="agents" style={{ padding: "120px 0", background: "linear-gradient(180deg, #101418, #0D1117)", position: "relative", overflow: "hidden" }}>
      {/* Decorative background elements */}
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,255,.03) 0%, transparent 70%)", filter: "blur(60px)" }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <ChevronRight size={11} /> How It Works
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16,
          }}>
            From zero to team AI<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>in four steps.</span>
          </h2>
        </div>

        {/* Connecting line (desktop only) */}
        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
          <div 
            ref={lineRef}
            style={{ 
              position: "absolute", 
              top: 60, 
              left: "12.5%", 
              right: "12.5%", 
              height: 2, 
              background: "linear-gradient(90deg, rgba(0,255,170,.1), rgba(0,208,255,.1), rgba(0,255,170,.1))",
              transformOrigin: "left center",
              display: "none",
            }} 
            className="connecting-line"
          />
          <style>{`
            @media (min-width: 900px) {
              .connecting-line { display: block !important; }
            }
          `}</style>
        </div>

        <div ref={ref} className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, position: "relative", zIndex: 2 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCyan = i % 2 === 1;
            const accent = isCyan ? "#00D0FF" : "#00FFAA";
            return (
              <div key={step.num} className="cyber-card" style={{
                background: isCyan ? "rgba(0,92,105,.1)" : "rgba(0,255,170,.03)",
                border: `1px solid ${isCyan ? "rgba(0,208,255,.1)" : "rgba(0,255,170,.08)"}`,
                padding: "32px 26px",
                textAlign: "center",
              }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 11,
                  color: accent, letterSpacing: ".15em", display: "block", marginBottom: 16,
                }}>
                  {step.num}
                </span>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                  background: `${accent}0D`, border: `1px solid ${accent}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                }}>
                  <Icon size={20} color={accent} />
                </div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15.5, color: "#F8F9FA", marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(248,249,250,.38)", lineHeight: 1.72, fontWeight: 300 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
═══════════════════════════════════════════ */
const PLANS = [
  {
    name: "Individual", price: "Free", period: "",
    desc: "Bring Your Own Key. Unrestricted personal use.",
    highlight: false, accent: "#00FFAA",
    features: ["Bring your own API key", "No subscription required", "All AI models supported", "Basic chat & local history"],
  },
  {
    name: "Starter", price: "₹999", period: "/mo",
    desc: "Small startups getting started with AI collaboration.",
    highlight: false, accent: "#00FFAA",
    features: ["BYOK", "Up to 3 team members", "Shared AI chatbot", "Shared history", "Email support"],
  },
  {
    name: "Growth", price: "₹2,499", period: "/mo",
    desc: "The sweet spot for teams scaling fast.",
    highlight: true, accent: "#00D0FF",
    features: ["BYOK", "Up to 7 members", "Projects & folders", "Team system prompts", "Usage analytics", "Priority support"],
  },
  {
    name: "Pro", price: "₹3,999", period: "/mo",
    desc: "Advanced capability for larger departments.",
    highlight: false, accent: "#00FFAA",
    features: ["BYOK", "Up to 12 members", "Custom AI agents", "API access", "Dedicated account manager", "24/7 priority support"],
  },
];

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      Array.from(ref.current.children).forEach((child, i) => {
        gsap.fromTo(child,
          { y: 60, opacity: 0, scale: .92 },
          {
            y: 0, opacity: 1, scale: 1, duration: .9, delay: i * .12, ease: "power3.out",
            scrollTrigger: { trigger: child, start: "top 80%" }
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" style={{ padding: "120px 0", background: "#101418", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,208,255,.12), transparent)",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <Zap size={11} /> Pricing
          </span>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 900,
            fontSize: "clamp(34px,4vw,54px)", letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#F8F9FA", marginTop: 16, marginBottom: 14,
          }}>
            Flat team pricing.<br />
            <span style={{ color: "rgba(248,249,250,.3)" }}>No per-seat surprises.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(248,249,250,.4)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            One subscription. Your whole company uses it. Stop doing math on headcount.
          </p>
        </div>

        <div ref={ref} className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? "rgba(0,92,105,.18)" : "#161B21",
              border: plan.highlight ? "1px solid rgba(0,208,255,.28)" : "1px solid rgba(255,255,255,.055)",
              borderRadius: 16, padding: "34px 26px",
              display: "flex", flexDirection: "column", gap: 22,
              position: "relative",
              boxShadow: plan.highlight ? "0 0 60px rgba(0,208,255,.07), inset 0 1px 0 rgba(0,208,255,.1)" : "none",
              transition: plan.highlight ? "none" : "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s",
            }}
              onMouseOver={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.2)"; } }}
              onMouseOut={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.055)"; } }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
                  color: "#101418", fontFamily: "'DM Mono',monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
                  padding: "5px 16px", borderRadius: 40, boxShadow: "0 4px 20px rgba(0,208,255,.3)",
                }}>
                  Most Popular
                </div>
              )}

              <div>
                <div style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 500,
                  color: plan.accent, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14,
                }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 40, color: "#F8F9FA", letterSpacing: "-0.04em" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(248,249,250,.28)" }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(248,249,250,.38)", lineHeight: 1.6, fontWeight: 300 }}>{plan.desc}</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,.05)" }} />

              <ul style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "rgba(248,249,250,.48)", fontWeight: 300 }}>
                    <div style={{
                      width: 15, height: 15, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      background: `${plan.accent}12`, border: `1px solid ${plan.accent}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={8} color={plan.accent} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                style={{
                  width: "100%", padding: "13px", borderRadius: 8,
                  background: plan.highlight ? "linear-gradient(135deg, #00FFAA, #00D0FF)" : "transparent",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,.1)",
                  color: plan.highlight ? "#101418" : "rgba(248,249,250,.5)",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: ".03em",
                  cursor: "pointer", transition: "all .25s",
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none"
                }}
                onMouseOver={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.35)"; (e.currentTarget as HTMLElement).style.color = "#00FFAA"; (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,.04)"; } }}
                onMouseOut={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.5)"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
              >
                {plan.price === "Free" ? "Start Free" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CTA BANNER
═══════════════════════════════════════════ */
function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } }
    );
  }, []);

  const corners = [
    { top: 0, left: 0, borderTop: "2px solid #00FFAA", borderLeft: "2px solid #00FFAA" },
    { top: 0, right: 0, borderTop: "2px solid #00D0FF", borderRight: "2px solid #00D0FF" },
    { bottom: 0, left: 0, borderBottom: "2px solid #00FFAA", borderLeft: "2px solid #00FFAA" },
    { bottom: 0, right: 0, borderBottom: "2px solid #00D0FF", borderRight: "2px solid #00D0FF" },
  ] as const;

  return (
    <section style={{ padding: "80px 40px", background: "#101418", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,255,170,.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      
      <div ref={ref} style={{
        maxWidth: 900, margin: "0 auto",
        background: "linear-gradient(135deg, rgba(0,92,105,.22) 0%, rgba(0,208,255,.04) 100%)",
        border: "1px solid rgba(0,208,255,.14)",
        borderRadius: 20, padding: "72px 60px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 1,
          background: "linear-gradient(90deg, transparent, #00FFAA66, #00D0FF66, transparent)",
        }} />

        {corners.map((c, i) => (
          <div key={i} style={{ position: "absolute", width: 22, height: 22, borderRadius: 2, ...c }} />
        ))}

        <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>
          <Zap size={11} /> Start Today
        </span>
        <h2 style={{
          fontFamily: "Montserrat, sans-serif", fontWeight: 900,
          fontSize: "clamp(32px,3.5vw,52px)", letterSpacing: "-0.04em", lineHeight: 1.1,
          color: "#F8F9FA", marginBottom: 14, marginTop: 16,
        }}>
          Your team deserves<br />better AI tooling.
        </h2>
        <p style={{
          fontSize: 15.5, color: "rgba(248,249,250,.42)", lineHeight: 1.7,
          fontWeight: 300, maxWidth: 420, margin: "0 auto 40px",
        }}>
          No per-seat pricing. No hidden fees. Bring your own key and collaborate at scale from day one.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "15px 34px" }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn-ghost">Explore Features</a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,.05)",
      background: "#0D1117", padding: "36px 40px",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={22} animated={false} />
          <span style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16,
            background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Luminescent.io
          </span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(248,249,250,.18)", fontFamily: "'DM Mono',monospace" }}>
          © 2026 Luminescent.io · All rights reserved
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {["Privacy", "Terms", "Docs", "GitHub"].map(link => (
            <a key={link} href="#" style={{ fontSize: 13, color: "rgba(248,249,250,.28)", textDecoration: "none", transition: "color .2s" }}
              onMouseOver={e => (e.currentTarget.style.color = "#00FFAA")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(248,249,250,.28)")}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "#101418", overflowX: "hidden" }}>
        <Navbar />
        <HeroSection />
        
        <LogoTicker />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTABanner />
        <Footer />
      </div>
    </>
  );
}