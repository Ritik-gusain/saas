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
          <Link href="/login" style={{ fontSize: 14, color: "rgba(248,249,250,.45)", textDecoration: "none", fontWeight: 500, transition: "color .2s" }}>
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
            .nav-desktop { display: none !important; }
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
