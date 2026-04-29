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
        height: 32, background: "rgba(10, 13, 18, 0.9)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ 
            width: 6, height: 6, borderRadius: "50%", background: "#00FFAA", 
            boxShadow: "0 0 10px rgba(0, 255, 170, 0.5)" 
          }} />
          <span className="mono-label" style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
            SYSTEM STATUS: OPERATIONAL // V2.0
          </span>
          <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)" }} />
          <Link href="/docs" className="mono-label" style={{ 
            fontSize: 9, color: "#00FFAA", textDecoration: "none", 
          }}>
            CHANGELOG
          </Link>
        </div>
      </div>

      <nav ref={navRef} style={{
        position: "fixed", top: 32, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: scrolled ? "rgba(10,13,18,.8)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.05)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
          <Logo size={36} />
          <span style={{
            fontFamily: "var(--font-header)", fontWeight: 700, fontSize: 20,
            color: "#FFF",
            letterSpacing: "-0.04em"
          }}>
            Luminescent<span style={{ color: "#00FFAA" }}>.</span>
          </span>
        </Link>

        <div className="nav-desktop" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 40,
          background: "rgba(255,255,255,0.03)",
          padding: "8px 24px",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}>
          {["Features", "Agents", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ 
              fontFamily: "var(--font-mono)", 
              fontSize: 12, 
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)"
            }}>{item}</a>
          ))}
        </div>

        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/login" style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: 12, 
            color: "rgba(255,255,255,.5)", 
            textDecoration: "none", 
            textTransform: "uppercase" 
          }}>
            Log in
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "12px 24px", fontSize: 13 }}>
            Join Waitlist <ArrowRight size={14} />
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
            {["Features", "Agents", "Pricing"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ fontSize: 14, color: "rgba(248,249,250,.55)", textDecoration: "none", fontWeight: 500 }}>
                {item}
              </a>
            ))}
            <Link href="/docs" onClick={() => setMenuOpen(false)}
              style={{ fontSize: 14, color: "rgba(248,249,250,.55)", textDecoration: "none", fontWeight: 500 }}>
              Docs
            </Link>
            <Link href="/register" className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
              Get Started Free
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
