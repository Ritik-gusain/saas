"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Users, MessageSquare, ArrowRight, Star, Menu, X, Brain, Code2,
  FileSearch, TrendingUp, Workflow, FileText, Shield, Sparkles,
  Zap, Lock, BarChart3, CheckCircle2, ChevronRight
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────────────────────────────── NAVBAR */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.3 }
    );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-panel shadow-2xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--cyan)] blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
            <Logo size={40} />
          </div>
          <span className="text-white font-black text-xl tracking-tight font-[Syne] bg-gradient-to-r from-[var(--cyan)] via-[var(--mint)] to-[var(--purple)] bg-clip-text text-transparent">
            Luminescent
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {["Features", "Agents", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[var(--muted)] hover:text-white transition-all font-medium relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-[var(--soft)] hover:text-white font-semibold transition-colors px-5 py-2.5"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="relative group text-sm font-bold px-6 py-3 rounded-xl bg-gradient-to-br from-[var(--cyan)] via-[var(--mint)] to-[var(--purple)] text-[var(--bg)] overflow-hidden"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[var(--soft)] hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-panel border-t px-6 py-6 flex flex-col gap-5 animate-slide-in-right">
          {["Features", "Agents", "Pricing"].map((item) => (
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
            className="text-sm font-bold px-5 py-3 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] text-center"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────────────────────────── HERO */
function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(titleRef.current.children, 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }
    )
    .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
    .fromTo(ctaRef.current.children, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 }, "-=0.6")
    .fromTo(statsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.4")
    .fromTo(mockupRef.current, { opacity: 0, scale: 0.9, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2 }, "-=1");

    gsap.to(mockupRef.current, {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-texture opacity-100" />
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[var(--cyan)] opacity-[0.08] blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--mint)] opacity-[0.06] blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="text-center max-w-5xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2.5 glass-panel rounded-full px-5 py-2 text-sm text-[var(--cyan)] font-semibold shadow-lg">
            <Sparkles className="w-4 h-4" />
            AI-Powered Team Collaboration Platform
          </div>

          <h1 ref={titleRef} className="text-[clamp(48px,7vw,92px)] font-black text-white leading-[1.05] tracking-[-0.045em] font-[Syne]">
            <div>One AI subscription.</div>
            <div className="bg-gradient-to-r from-[var(--cyan)] via-[var(--mint)] to-[var(--purple)] bg-clip-text text-transparent">
              Your entire team.
            </div>
          </h1>

          <p ref={subtitleRef} className="text-[19px] text-[var(--muted)] leading-relaxed max-w-3xl mx-auto font-light">
            Stop paying ₹1,600/month per employee for individual ChatGPT Plus seats. 
            Luminescent gives your entire team unified AI for <span className="text-white font-semibold">half the cost</span> — 
            with shared history, custom prompts, and specialized AI agents.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-br from-[var(--cyan)] via-[var(--mint)] to-[var(--purple)] text-[var(--bg)] font-bold text-lg overflow-hidden shadow-2xl shadow-[var(--cyan)]/30 hover:shadow-[var(--cyan)]/50 transition-all hover:scale-105"
            >
              <span className="relative z-10">Start for Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl glass-panel text-white font-semibold text-lg hover:border-[var(--cyan)] hover:bg-[var(--cyan)]/5 transition-all"
            >
              View Pricing
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <div ref={statsRef} className="flex items-center justify-center gap-16 pt-12">
            {[
              { value: "89k", label: "Tokens saved daily" },
              { value: "50%", label: "Cost vs individual seats" },
              { value: "∞", label: "Team scalability" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={mockupRef} className="mt-24 max-w-5xl mx-auto">
          <div className="relative glass-panel rounded-3xl overflow-hidden shadow-2xl border-2">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider">
                Luminescent Chat — Growth Team
              </div>
              <div className="flex items-center gap-2 glass-panel rounded-full px-3 py-1 text-xs text-[var(--cyan)]">
                <Users className="w-3 h-3" />
                7 Active
              </div>
            </div>
            <div className="p-8 space-y-6 min-h-[400px] bg-gradient-to-b from-[var(--bg)] to-[var(--bg-elevated)]">
              {[
                { role: "user", text: "Summarize our Q1 sales report and highlight key trends" },
                { role: "ai", text: "📊 Q1 Summary: Revenue up 34% YoY. Top performing region: South India (+52%). Customer acquisition cost dropped 18%. Recommend doubling down on Mumbai & Bangalore expansion..." }
              ].map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai" ? "glass-panel" : "bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)]"
                  }`}>
                    {msg.role === "ai" ? <Logo size={20} animated={false} /> : <span className="text-xs font-black text-[var(--bg)]">ME</span>}
                  </div>
                  <div className={`max-w-[70%] text-sm leading-relaxed px-5 py-4 rounded-2xl ${
                    msg.role === "user"
                      ? "glass-panel text-white rounded-tr-sm"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--soft)] rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────── FEATURES */
const features = [
  { icon: MessageSquare, title: "Shared Chat History", desc: "Your team's entire AI conversation history in one place. Search, reference, and build on each other's work." },
  { icon: Brain, title: "Custom AI Agents", desc: "Deploy specialized agents trained on your SOPs and internal docs. One agent per workflow." },
  { icon: Star, title: "Smart Prompt Library", desc: "Save, share, and version-control your best prompts. Stop re-engineering the same prompts every day." },
  { icon: Workflow, title: "Projects & Folders", desc: "Organize AI work by client or sprint. Files, outputs, and conversations all structured correctly." },
  { icon: TrendingUp, title: "Token Efficiency", desc: "Team-wide shared context windows mean you use 60% fewer tokens. Less waste, more output." },
  { icon: Shield, title: "Enterprise Security", desc: "SSO, RBAC, and audit logs. Your IP stays yours — never used to train public models." },
];

function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
      }
    );
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-32 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-5">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[var(--cyan)] uppercase tracking-[0.25em]">
            <Zap className="w-4 h-4" />
            Capabilities
          </div>
          <h2 className="text-[clamp(36px,5vw,64px)] font-black text-white tracking-tight leading-none font-[Syne]">
            Built for teams.<br />Not just you.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto font-light">
            Every feature designed around how teams actually work — together, async, across tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                ref={el => { cardsRef.current[i] = el; }}
                className="group glass-panel-hover glass-panel rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <Icon className="w-7 h-7 text-[var(--cyan)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-[Syne]">{f.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────── PRICING */
const plans = [
  {
    name: "Starter", price: "₹999", desc: "For small teams getting started with AI collaboration.",
    features: ["Up to 5 team members", "Shared chat history", "3 custom agents", "Basic prompt library", "Email support"],
    highlight: false,
  },
  {
    name: "Growth", price: "₹2,499", desc: "The sweet spot for growing teams shipping fast.",
    features: ["Up to 25 team members", "Full shared workspace", "Unlimited agents", "Advanced prompt library", "Projects & folders", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", desc: "For large orgs with compliance, SSO, and scale needs.",
    features: ["Unlimited members", "SSO & SAML Auth", "RBAC & Audit logs", "Data residency options", "Dedicated account manager", "Custom contracts"],
    highlight: false,
  },
];

function PricingSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
      }
    );
  }, []);

  return (
    <section id="pricing" className="relative py-32 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-5">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[var(--cyan)] uppercase tracking-[0.25em]">
            <BarChart3 className="w-4 h-4" />
            Pricing
          </div>
          <h2 className="text-[clamp(36px,5vw,64px)] font-black text-white tracking-tight leading-none font-[Syne]">
            Flat team pricing.<br />No per-seat surprises.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto font-light">
            One subscription. Your whole company uses it. Stop doing math on headcount.
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-10 flex flex-col space-y-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight
                  ? "glass-panel border-2 border-[var(--cyan)] shadow-2xl shadow-[var(--cyan)]/20"
                  : "glass-panel"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] text-xs font-bold px-5 py-1.5 rounded-full tracking-wider uppercase">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-5">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white font-[Syne]">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-[var(--muted)] text-lg">/mo</span>}
                </div>
                <p className="text-sm text-[var(--muted)] mt-5 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <ul className="space-y-4 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--soft)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--mint)] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] shadow-lg shadow-[var(--cyan)]/30 hover:shadow-[var(--cyan)]/50"
                    : "glass-panel hover:border-[var(--cyan)] hover:bg-[var(--cyan)]/5"
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

/* ───────────────────────────────────────────── FOOTER */
function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)] py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Logo size={28} animated={false} />
          <span className="font-black text-xl bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent font-[Syne]">
            Luminescent
          </span>
        </div>
        
        <div className="text-sm text-[var(--muted)]">
          © 2026 Luminescent.io. All rights reserved.
        </div>

        <div className="flex gap-8 text-sm">
          {["Privacy", "Terms", "Docs", "GitHub"].map((link) => (
            <a key={link} href="#" className="text-[var(--muted)] hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────────────────────────── ROOT */
export default function LandingPageRedesign() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] font-['Inter']">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
