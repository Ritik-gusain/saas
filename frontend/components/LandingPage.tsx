"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Users,
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
  Star,
  Menu,
  X,
  Brain,
  Code2,
  FileSearch,
  TrendingUp,
  Workflow,
  FileText,
  Shield,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.5 }
    );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0B0E14]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-2xl shadow-black/30"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={36} />
          <span className="text-white font-bold text-lg tracking-tight font-[Syne] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
            Luminescent.io
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Agents", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[var(--soft)] hover:text-[var(--cyan)] transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--soft)] hover:text-white font-medium transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-5 py-2 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] hover:opacity-90 transition-all shadow-lg shadow-[var(--cyan)]/20"
          >
            Get Started Free
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[var(--soft)] hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0B0E14]/95 backdrop-blur-xl border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4">
          {["Features", "Agents", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[var(--soft)] hover:text-[var(--cyan)] transition-colors font-medium"
            >
              {item}
            </a>
          ))}
          <Link
            href="/register"
            className="text-sm font-bold px-4 py-2.5 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] text-center"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED CHAT MOCKUP
───────────────────────────────────────────── */
const chatMessages = [
  {
    role: "user",
    text: "Summarize our Q1 sales report and highlight key trends",
  },
  {
    role: "ai",
    text: "📊 Q1 Summary: Revenue up 34% YoY. Top performing region: South India (+52%). Customer acquisition cost dropped 18%. Recommend doubling down on Mumbai & Bangalore expansion...",
  },
  { role: "user", text: "Generate a follow-up email for the top 3 clients" },
  {
    role: "ai",
    text: "✉️ Drafting personalized emails for Infosys, Wipro & TCS with your brand voice. Attaching to Projects folder...",
  },
];

function ChatMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const mockupRef = useRef(null);

  useEffect(() => {
    if (visibleCount < chatMessages.length) {
      const t = setTimeout(
        () => setVisibleCount((v) => v + 1),
        visibleCount === 0 ? 800 : 1600
      );
      return () => clearTimeout(t);
    }
  }, [visibleCount]);

  useEffect(() => {
    gsap.to(mockupRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div ref={mockupRef} className="relative w-full max-w-lg mx-auto">
      <div className="relative rounded-2xl border border-[var(--border-strong)] bg-[#0B0E14]/85 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--hud)]/20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="text-[10px] text-[var(--soft)] font-medium opacity-70 uppercase tracking-widest">
            Luminescent Chat — Growth Team
          </div>
          <div className="flex items-center gap-1.5 bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 rounded-full px-2 py-0.5 text-[9px] text-[var(--cyan)]">
            <Users className="w-2.5 h-2.5" />
            7 Active
          </div>
        </div>

        <div className="p-4 space-y-4 min-h-[300px]">
          {chatMessages.slice(0, visibleCount).map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } animate-fade-in-up`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai'
                  ? 'bg-transparent border border-[var(--cyan)]/20'
                  : 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-bold text-[10px]'
                }`}>
                {msg.role === "ai" ? <Logo size={18} animated={false} /> : "RG"}
              </div>
              <div
                className={`max-w-[75%] text-[13px] leading-relaxed px-4 py-2.5 rounded-xl ${msg.role === "user"
                    ? "bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 text-white rounded-tr-sm"
                    : "bg-[var(--hud)]/40 border border-[var(--cyan)]/15 text-[#e8f4f8] rounded-tl-sm"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-[var(--hud)]/30 border border-[var(--border)] rounded-xl px-3 py-2">
            <input
              readOnly
              placeholder="Ask your team AI anything..."
              className="bg-transparent border-none text-[13px] text-[var(--soft)] flex-1 outline-none"
            />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center text-[var(--bg)]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 -bottom-4 bg-[var(--mint)]/10 border border-[var(--mint)]/20 rounded-full px-3 py-1 text-[10px] text-[var(--mint)] shadow-xl flex items-center gap-2">
        <TrendingUp className="w-3 h-3" />
        <span>89k tokens saved today</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(badgeRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 })
      .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.4")
      .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo(statsRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.4");
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-texture opacity-100 pointer-events-none" />
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-radial-gradient from-[var(--cyan)]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div className="space-y-8">
          <div ref={badgeRef} className="inline-flex items-center gap-2 bg-[var(--cyan)]/5 border border-[var(--border-strong)] rounded-full px-4 py-1.5 text-[13px] text-[var(--cyan)] font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
            AI-Powered Team Collaboration
          </div>

          <h1 ref={titleRef} className="text-[clamp(44px,5.5vw,72px)] font-black text-white leading-[1.08] tracking-[-0.04em] font-[Syne]">
            Free for individuals.<br />
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
              Powerful for teams.
            </span>
          </h1>

          <p ref={subtitleRef} className="text-[17px] text-[var(--soft)] leading-relaxed max-w-lg font-light">
            Free forever for solo developers with your own API keys. For teams, upgrade for a unified workspace with shared history, custom prompts, and AI agents without the per-seat markup.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-[var(--cyan)]/25 hover:-translate-y-0.5"
            >
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-strong)] text-[var(--soft)] font-medium text-base hover:bg-[var(--cyan)]/5 hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
            >
              View Pricing
            </a>
          </div>

          <div ref={statsRef} className="flex items-center gap-12 pt-8 border-t border-[var(--border)]">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne]">89k</div>
              <div className="text-[13px] text-[var(--soft)]">Tokens saved daily</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne]">50%</div>
              <div className="text-[13px] text-[var(--soft)]">Cost vs seats</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne]">∞</div>
              <div className="text-[13px] text-[var(--soft)]">Team members</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ChatMockup />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES SECTION
───────────────────────────────────────────── */
const features = [
  {
    icon: MessageSquare,
    title: "Shared Chat History",
    desc: "Your team's entire AI conversation history in one place. Search, reference, and build on each other's work.",
  },
  {
    icon: Brain,
    title: "Custom AI Agents",
    desc: "Deploy specialized agents trained on your SOPs and internal docs. One agent per workflow — sales, support, growth.",
  },
  {
    icon: Star,
    title: "Smart Prompt Library",
    desc: "Save, share, and version-control your best prompts. Stop re-engineering the same prompts every day.",
  },
  {
    icon: Workflow,
    title: "Projects & Folders",
    desc: "Organize AI work by client or sprint. Files, outputs, and conversations all structured correctly.",
  },
  {
    icon: TrendingUp,
    title: "Token Efficiency",
    desc: "Team-wide shared context windows mean you use 60% fewer tokens. Less waste, more output.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SSO, RBAC, and audit logs. Your IP stays yours — never used to train public models.",
  },
];

function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(cardsRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  return (
    <section id="features" className="relative py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={sectionRef} className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 text-[12px] font-bold text-[var(--cyan)] uppercase tracking-[0.2em]">
            ⚡ Capabilities
            <div className="h-px w-20 bg-gradient-to-r from-[var(--border-strong)] to-transparent" />
          </div>
          <h2 className="text-[clamp(32px,4vw,52px)] font-black text-white tracking-tight leading-none font-[Syne]">
            Built for teams.<br />Not just you.
          </h2>
          <p className="text-base text-[var(--soft)] max-w-xl mx-auto font-light">
            Every feature designed around how teams actually work — together, async, across tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                ref={el => cardsRef.current[i] = el}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 hover:bg-[var(--surface)]/1.5 hover:border-[var(--border-strong)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[var(--cyan)]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-[Syne]">{f.title}</h3>
                <p className="text-[var(--soft)] text-sm leading-relaxed font-light">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────── */
const plans = [
  {
    name: "Individual",
    price: "Free",
    desc: "Bring Your Own Key (BYOK). Unrestricted personal access.",
    features: [
      "Bring your own API key",
      "No subscription required",
      "All AI models supported",
      "Basic chat & local history",
    ],
    highlight: false,
  },
  {
    name: "Starter Team",
    price: "₹999",
    desc: "For small startups getting started with AI collaboration.",
    features: [
      "Bring your own API key",
      "Up to 3 team members",
      "Shared AI chatbot",
      "Basic chat features",
      "Shared history",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Growth Team",
    price: "₹2,499",
    desc: "The sweet spot for mid-sized teams scaling fast.",
    features: [
      "Bring your own API key",
      "Up to 7 team members",
      "Projects & collaboration",
      "Team system prompts",
      "Usage analytics",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Pro Team",
    price: "₹3,999",
    desc: "For larger departments needing advanced capability.",
    features: [
      "Bring your own API key",
      "Up to 12 team members",
      "Custom AI agents",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    highlight: false,
  },
];

function PricingSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current.children,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  return (
    <section id="pricing" className="relative py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 text-[12px] font-bold text-[var(--cyan)] uppercase tracking-[0.2em]">
            💸 Pricing
            <div className="h-px w-20 bg-gradient-to-r from-[var(--border-strong)] to-transparent" />
          </div>
          <h2 className="text-[clamp(32px,4vw,52px)] font-black text-white tracking-tight leading-none font-[Syne]">
            Flat team pricing.<br />No per-seat surprises.
          </h2>
          <p className="text-base text-[var(--soft)] max-w-xl mx-auto font-light">
            One subscription. Your whole company uses it. Stop doing math on headcount.
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-10 flex flex-col space-y-8 transition-all duration-300 hover:-translate-y-1 ${plan.highlight
                  ? "border-[var(--cyan)] bg-[#2A4B54]/30 shadow-2xl shadow-[var(--cyan)]/10"
                  : "border-[var(--border)] bg-[var(--surface)]"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] text-[10px] font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-[13px] font-bold text-[var(--soft)] uppercase tracking-widest mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white font-[Syne]">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-[var(--soft)]">/mo</span>}
                </div>
                <p className="text-[13px] text-[var(--soft)] mt-4 font-light leading-relaxed">{plan.desc}</p>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <ul className="space-y-4 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[13.5px] text-[var(--soft)] font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.highlight
                    ? "bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] shadow-lg shadow-[var(--cyan)]/25"
                    : "border border-[var(--border-strong)] text-[var(--soft)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/5"
                  }`}
              >
                {plan.price === "Custom" ? "Talk to Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Logo size={24} animated={false} />
          <span className="font-bold text-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne]">
            Luminescent.io
          </span>
        </div>

        <div className="text-[13px] text-[var(--soft)] opacity-40">
          © 2026 Luminescent.io. All rights reserved.
        </div>

        <div className="flex gap-8 text-[13px]">
          {["Privacy", "Terms", "Docs", "GitHub"].map((link) => (
            <a key={link} href="#" className="text-[var(--soft)] opacity-60 hover:opacity-100 transition-opacity">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT LANDING PAGE
───────────────────────────────────────────── */
export default function LandingPageRedesign() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] font-['DM_Sans']">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
