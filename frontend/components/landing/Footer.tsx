"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ArrowUpRight } from "lucide-react";

const GithubIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 9.5c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

const TwitterIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LINKS = {
  Infrastructure: ["Nodes", "Security", "Uptime", "Regions"],
  Resources: ["Documentation", "API Reference", "Status", "Support"],
  Ecosystem: ["Agents", "Models", "Extensions", "Partners"],
  Legal: ["Privacy", "Terms", "Compliance"],
};

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--landing-bg)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 0 60px",
      }}
    >
      {/* Background Accents */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: 400,
        background: "radial-gradient(circle at bottom, rgba(0, 255, 170, 0.03) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 60,
            marginBottom: 80,
          }}
        >
          {/* Brand Block */}
          <div style={{ gridColumn: "span 2" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 24 }}>
              <Logo size={32} animated={false} />
              <span style={{
                fontFamily: "var(--font-header)",
                fontWeight: 700,
                fontSize: 22,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}>
                Luminescent
              </span>
            </Link>
            <p style={{
              fontSize: 15,
              color: "var(--landing-muted)",
              lineHeight: 1.6,
              maxWidth: 320,
              marginBottom: 32,
            }}>
              Engineering the substrate for the next generation of collaborative intelligence. Decentralized, private, and high-performance.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--landing-green)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0, 255, 170, 0.05)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <div className="mono-label" style={{ color: "#fff", marginBottom: 24, fontSize: 10 }}>
                {category}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontSize: 14,
                      color: "var(--landing-muted)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "var(--landing-muted)")}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: 40,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © 2026 Luminescent Protocol. Built for the future.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--landing-green)",
                boxShadow: "0 0 10px var(--landing-green)",
              }} />
              <span className="mono-label" style={{ fontSize: 9, opacity: 0.6 }}>Network Operational</span>
            </div>

            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}
            >
              System Status <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
