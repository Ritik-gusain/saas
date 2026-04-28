"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ArrowUpRight } from "lucide-react";

// Github icon was removed from lucide-react — inline SVG replacement
const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// Twitter/X icon — removed from lucide-react
const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L2.1 2.25h6.923l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

// LinkedIn icon — removed from lucide-react
const LinkedinIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export function Footer() {
  return (
    <footer
      style={{
        background: "#080B10",
        borderTop: "1px solid rgba(255,255,255,.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,255,170,.12), rgba(0,208,255,.12), transparent)",
      }} />

      {/* Ambient orb */}
      <div
        className="section-orb"
        style={{ bottom: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(0,255,170,.025) 0%, transparent 70%)" }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px 40px", position: "relative" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 20 }}>
              <Logo size={28} animated={false} />
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: 18,
                background: "linear-gradient(135deg, #00FFAA, #00D0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}>
                Luminescent.io
              </span>
            </Link>
            <p style={{
              fontSize: 13.5, color: "rgba(248,249,250,.32)",
              lineHeight: 1.72, fontWeight: 300, maxWidth: 260, marginBottom: 28,
            }}>
              The world's most advanced AI collaboration platform. Bring your own keys. Own your data.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: GithubIcon, href: "#" },
                { icon: TwitterIcon, href: "#" },
                { icon: LinkedinIcon, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 34, height: 34,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,.07)",
                    background: "rgba(255,255,255,.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(248,249,250,.35)",
                    transition: "all .25s",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,.3)";
                    (e.currentTarget as HTMLElement).style.color = "#00FFAA";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,.06)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.35)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: "rgba(248,249,250,.3)",
                letterSpacing: ".18em", textTransform: "uppercase",
                marginBottom: 20,
              }}>
                {category}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontSize: 13.5, color: "rgba(248,249,250,.35)",
                      textDecoration: "none", fontWeight: 400,
                      transition: "color .2s",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#00FFAA";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.35)";
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,.04)", marginBottom: 28 }} />

        {/* Bottom row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <span style={{
            fontSize: 12, color: "rgba(248,249,250,.18)",
            fontFamily: "'DM Mono', monospace", letterSpacing: ".04em",
          }}>
            © 2026 Luminescent.io · All rights reserved
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#00FFAA",
              boxShadow: "0 0 8px #00FFAA",
              animation: "pulseGlow 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: "rgba(248,249,250,.22)",
              letterSpacing: ".1em",
            }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          <a
            href="#"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, color: "rgba(248,249,250,.22)",
              textDecoration: "none",
              fontFamily: "'DM Mono', monospace", letterSpacing: ".04em",
              transition: "color .2s",
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "#00FFAA"; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(248,249,250,.22)"; }}
          >
            Status Page <ArrowUpRight size={11} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
