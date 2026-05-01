"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import gsap from "gsap";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    const ctx = gsap.context(() => {
      // Entry Animation
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.2 }
      );

      // Magnetic Button
      const magBtn = navRef.current?.querySelector(".btn-magnetic");
      if (magBtn) {
        const move = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = (magBtn as HTMLElement).getBoundingClientRect();
          const x = (clientX - (left + width/2)) * 0.35;
          const y = (clientY - (top + height/2)) * 0.35;
          gsap.to(magBtn, { x, y, duration: 0.3, ease: "power2.out" });
        };
        const reset = () => gsap.to(magBtn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        magBtn.addEventListener("mousemove", move as any);
        magBtn.addEventListener("mouseleave", reset);
      }
      // Scroll Progress
      const updateProgress = () => {
        const scrolled = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / height) * 100;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progress}%`;
        }
      };
      window.addEventListener("scroll", updateProgress);
      updateProgress();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, []);

  return (
    <>

      <nav 
        ref={navRef} 
        style={{
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 100,
          padding: "0 60px", 
          height: scrolled ? 72 : 88,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          background: scrolled ? "rgba(10, 13, 18, 0.85)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", flexShrink: 0 }}>
          <Logo size={scrolled ? 32 : 36} />
          <span style={{
            fontFamily: "var(--font-header)", fontWeight: 700, fontSize: scrolled ? 18 : 20,
            color: "#FFF",
            letterSpacing: "-0.04em",
            transition: "all 0.4s ease"
          }}>
            Luminescent<span style={{ color: "#00FFAA" }}>.</span>
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="nav-desktop" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 32,
          background: scrolled ? "transparent" : "rgba(255, 255, 255, 0.03)",
          padding: scrolled ? "0" : "10px 32px",
          borderRadius: 100,
          border: scrolled ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: scrolled ? "none" : "blur(12px)",
          transition: "all 0.4s ease"
        }}>
          {["Features", "Agents", "About", "Pricing", "Docs"].map(item => {
            if (item === "Docs") {
              return (
                <Link key={item} href="/docs" className="nav-link" style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: 11, 
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.3s ease"
                }} onMouseEnter={e => e.currentTarget.style.color = "#FFF"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"}>
                  {item}
                </Link>
              );
            }
            return (
              <Link key={item} href={`/#${item === "About" ? "about" : item.toLowerCase()}`} className="nav-link" style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: 11, 
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                transition: "color 0.3s ease"
              }} onMouseEnter={e => e.currentTarget.style.color = "#FFF"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"}>
                {item}
              </Link>
            );
          })}
        </div>

        {/* Auth (Desktop) */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/login" style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: 11, 
            color: "rgba(255, 255, 255, 0.7)", 
            textDecoration: "none", 
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            transition: "color 0.3s ease"
          }} onMouseEnter={e => e.currentTarget.style.color = "#FFF"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"}>
            Login
          </Link>
          <Link href="/register" className="btn-launch btn-magnetic">
            Launch Console <ArrowRight size={14} />
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none",
          color: "rgba(248, 249, 250, 0.6)", cursor: "pointer",
          padding: 8
        }} className="mobile-toggle">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <style>{`
          @keyframes pulse-status {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @media (max-width: 1024px) {
            .mobile-toggle { display: flex !important; }
            .nav-desktop { display: none !important; }
          }
        `}</style>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: scrolled ? 72 : 88, left: 0, right: 0,
            background: "rgba(10, 13, 18, 0.98)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "32px", display: "flex", flexDirection: "column", gap: 24,
            animation: "fadeInDown 0.4s ease"
          }}>
            {["Features", "Agents", "About", "Pricing", "Docs"].map(item => (
              <Link key={item} href={item === "Docs" ? "/docs" : `/#${item === "About" ? "about" : item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ 
                  fontFamily: "var(--font-header)", 
                  fontSize: 18, 
                  color: "#FFF", 
                  textDecoration: "none", 
                  fontWeight: 600,
                  letterSpacing: "-0.02em"
                }}>
                {item}
              </Link>
            ))}
            <div style={{ height: 1, background: "rgba(255, 255, 255, 0.05)" }} />
            <Link href="/login" onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "rgba(255,255,255,0.7)", textDecoration: "none", textTransform: "uppercase" }}>
              Login
            </Link>
            <Link href="/register" className="btn-primary" style={{ justifyContent: "center", padding: "16px" }}>
              Get Started Free
            </Link>
          </div>
        )}
        {/* Scroll Progress Bar */}
        <div 
          ref={progressBarRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            background: "linear-gradient(90deg, var(--landing-green), var(--landing-cyan))",
            width: "0%",
            transition: "width 0.1s ease-out",
            opacity: scrolled ? 1 : 0
          }}
        />
      </nav>
    </>
  );
}
