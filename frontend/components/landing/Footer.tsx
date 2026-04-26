"use client";

import { Logo } from "@/components/shared/Logo";

export function Footer() {
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
