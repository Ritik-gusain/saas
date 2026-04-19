"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  Users,
  Zap,
  Shield,
  BarChart3,
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
  Check,
  Minus,
} from "lucide-react";

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080a14]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Luminescent<span className="text-violet-400">.io</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Agents", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0c0e1a]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 flex flex-col gap-4">
          {["Features", "Agents", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              {item}
            </a>
          ))}
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center"
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

  useEffect(() => {
    if (visibleCount < chatMessages.length) {
      const t = setTimeout(
        () => setVisibleCount((v) => v + 1),
        visibleCount === 0 ? 800 : 1600
      );
      return () => clearTimeout(t);
    }
  }, [visibleCount]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow halo */}
      <div className="absolute -inset-4 bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Window chrome */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#0f1120]/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Luminescent Chat — Growth Team
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-[260px]">
          {chatMessages.slice(0, visibleCount).map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in-up`}
            >
              {msg.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] text-xs leading-relaxed px-3 py-2 rounded-xl ${
                  msg.role === "user"
                    ? "bg-violet-600/80 text-white rounded-br-sm"
                    : "bg-white/[0.06] text-slate-300 rounded-bl-sm border border-white/[0.06]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {visibleCount < chatMessages.length && visibleCount % 2 === 1 && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.06] px-3 py-2.5 rounded-xl rounded-bl-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
            <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-500 flex-1">
              Ask your team AI anything...
            </span>
            <div className="w-6 h-6 rounded-md bg-violet-600/80 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -right-8 top-12 bg-[#1a1d2e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 shadow-xl flex items-center gap-2 animate-float">
        <Users className="w-4 h-4 text-violet-400" />
        <span>7 members active</span>
      </div>
      <div className="absolute -left-8 bottom-16 bg-[#1a1d2e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 shadow-xl flex items-center gap-2 animate-float [animation-delay:1s]">
        <BarChart3 className="w-4 h-4 text-green-400" />
        <span>89k tokens saved today</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[#080a14]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-violet-600/15 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-radial from-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: copy */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Team Collaboration
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            One AI subscription.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Your whole team.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
            Stop paying ₹1,600/month per employee for individual ChatGPT Plus
            seats. Luminescent gives your entire team unified AI for half the
            cost — with shared history, custom prompts, and AI agents built
            for teams.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              id="hero-cta-primary"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 group"
            >
              Start for Free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#pricing"
              id="hero-cta-pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.12] text-slate-300 font-semibold text-base hover:bg-white/[0.04] hover:text-white transition-all"
            >
              View Pricing
            </a>
          </div>

          {/* Social proof mini-bar */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {["bg-violet-500", "bg-indigo-500", "bg-cyan-500", "bg-pink-500", "bg-amber-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-[#080a14] flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-white font-semibold">200+ teams</span>{" "}
              already saving on AI costs
            </div>
          </div>
        </div>

        {/* Right: chat mockup */}
        <div className="flex justify-center lg:justify-end">
          <ChatMockup />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROBLEM / SOLUTION
───────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section className="relative py-24 bg-[#080a14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">The Old Way</h3>
            </div>
            <ul className="space-y-3">
              {[
                "₹1,600/user/month × 10 employees = ₹16,000/mo",
                "Everyone uses different AI versions",
                "No shared context or team history",
                "Brand voice inconsistency across outputs",
                "Zero visibility into team AI usage",
                "10 separate dashboards to manage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-400 text-sm">
                  <Minus className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">With Luminescent</h3>
            </div>
            <ul className="space-y-3">
              {[
                "₹4,900/mo for 7 seats — save ₹6,300/month",
                "Unified AI with the latest models for everyone",
                "Shared team history, projects & notes",
                "Company-wide system prompts & brand voice",
                "Usage analytics per member, per department",
                "One dashboard, total control",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
    color: "from-violet-500 to-indigo-600",
    glow: "shadow-violet-500/20",
    title: "Team Chat History",
    desc: "Every conversation is searchable, shareable, and organized. See what your team is using AI for and borrow their best prompts.",
  },
  {
    icon: Users,
    color: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    title: "Seat-Based Teams",
    desc: "Invite colleagues, assign roles (Owner, Admin, Member), enforce seat limits, and manage everyone from one clean admin panel.",
  },
  {
    icon: Globe,
    color: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
    title: "Team System Prompts",
    desc: "Set your company's brand voice, style guide, and context once. Every AI response your team gets will reflect your company identity.",
  },
  {
    icon: Brain,
    color: "from-cyan-500 to-teal-600",
    glow: "shadow-cyan-500/20",
    title: "AI Agents",
    desc: "Research, write, code, and automate — autonomously. Agents plan before they act, and you stay in control with approve/cancel flows.",
  },
  {
    icon: BarChart3,
    color: "from-teal-500 to-green-600",
    glow: "shadow-teal-500/20",
    title: "Usage Analytics",
    desc: "Track token usage per member and department. Understand your AI ROI and spot power users who drive the most value.",
  },
  {
    icon: Shield,
    color: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
    title: "Enterprise Security",
    desc: "Supabase JWT auth, Row-Level Security, full audit logs for every action. GDPR-ready with data export & deletion built-in.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-[#080a14]">
      {/* Subtle separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 font-medium">
            <Zap className="w-3.5 h-3.5" />
            Platform Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything your team needs
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built from the ground up for teams — not just individuals with shared passwords.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300 space-y-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   AGENTS SECTION
───────────────────────────────────────────── */
const agents = [
  {
    icon: Brain,
    name: "Research Agent",
    color: "from-violet-500 to-indigo-600",
    desc: "Multi-source web research, document reading, and structured comparison tables — fully autonomous.",
    tag: "Web Search · Summarizer",
  },
  {
    icon: FileText,
    name: "Content Agent",
    color: "from-indigo-500 to-blue-600",
    desc: "Long-form SEO articles, marketing copy, and ad-ready content written in your brand's voice.",
    tag: "Brand Voice · Image Gen",
  },
  {
    icon: Code2,
    name: "Code Agent",
    color: "from-blue-500 to-cyan-500",
    desc: "Read GitHub issues, write implementations, generate unit tests, and run code in a sandboxed interpreter.",
    tag: "GitHub · Code Exec",
  },
  {
    icon: TrendingUp,
    name: "Data Analysis Agent",
    color: "from-cyan-500 to-teal-500",
    desc: "Upload CSV/Excel files and get instant charts, trend summaries, and business insights.",
    tag: "Python · Chart Gen",
  },
  {
    icon: Workflow,
    name: "Workflow Agent",
    color: "from-teal-500 to-green-500",
    desc: "Connect Gmail, Slack, GSheets & your CRM — automate recurring tasks on a schedule.",
    tag: "Gmail · Slack · Sheets",
  },
  {
    icon: FileSearch,
    name: "Document Agent",
    color: "from-pink-500 to-rose-500",
    desc: "Ingest PDFs, Word docs, and contracts. Extract clauses, compare vendors, and flag risks.",
    tag: "PDF · OCR · Extractor",
  },
];

function AgentsSection() {
  return (
    <section id="agents" className="relative py-24 bg-[#080a14]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 font-medium">
            <Brain className="w-3.5 h-3.5" />
            AI Agents
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Agents that{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              plan, execute, deliver
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Not just chatbots. Autonomous agents with real tools that do the work — with your approval before every action.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.name}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300 space-y-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                  <span className="text-xs text-slate-500 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">
                    {agent.tag}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{agent.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Execution loop visual */}
        <div className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
          <p className="text-center text-xs text-slate-500 font-mono uppercase tracking-widest mb-6">
            Agent Execution Loop
          </p>
          <div className="flex flex-wrap justify-center gap-2 items-center">
            {["OBSERVE", "PLAN", "ACT", "REFLECT", "DELIVER"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 text-violet-300 text-sm font-bold">
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                )}
              </div>
            ))}
          </div>
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
    name: "Personal",
    seats: 1,
    priceINR: "Free",
    priceUSD: "$0",
    perUser: "Forever",
    highlight: false,
    features: [
      "1 personal workspace",
      "Basic AI models via Bytez",
      "Standard chat history",
      "Community support",
    ],
    noFeatures: ["Team system prompt", "AI Agents", "Usage analytics", "Audit logs"],
  },
  {
    name: "Starter Team",
    seats: 3,
    priceINR: "₹2,400",
    priceUSD: "$29",
    perUser: "₹800",
    highlight: false,
    features: [
      "Up to 3 team members",
      "All AI models via Bytez",
      "Shared chat history",
      "Team system prompt",
      "Basic usage analytics",
      "Email support",
    ],
    noFeatures: ["AI Agents", "Custom integrations", "Audit logs"],
  },
  {
    name: "Growth Team",
    seats: 7,
    priceINR: "₹4,900",
    priceUSD: "$59",
    perUser: "₹700",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 7 team members",
      "All AI models via Bytez",
      "Shared chat history & projects",
      "Team system prompt + overrides",
      "Full usage analytics",
      "AI Agents (Research + Content)",
      "Priority support",
    ],
    noFeatures: ["Custom integrations", "Audit logs"],
  },
  {
    name: "Pro Team",
    seats: 12,
    priceINR: "₹8,200",
    priceUSD: "$99",
    perUser: "₹683",
    highlight: false,
    features: [
      "Up to 12 team members",
      "All AI models via Bytez",
      "Shared chat history & projects",
      "Team system prompt + overrides",
      "Advanced usage analytics",
      "All 6 AI Agents",
      "GitHub, Slack, Drive integrations",
      "Full audit logs",
      "Dedicated support",
    ],
    noFeatures: [],
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 bg-[#080a14]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-300 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Save up to{" "}
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              60% vs individual seats
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            One flat monthly fee. No per-message billing. No surprise overage charges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col space-y-6 transition-all duration-300 ${
                plan.highlight
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/[0.08] to-indigo-500/[0.04] shadow-2xl shadow-violet-500/10 scale-105"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.04]"
              }`}
            >
              {plan.highlight && (
                <>
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 rounded-t-2xl" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-500/30">
                      {plan.badge}
                    </span>
                  </div>
                </>
              )}

              {/* Plan header */}
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{plan.priceINR}</span>
                  <span className="text-slate-500 text-sm font-medium">/month</span>
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  {plan.priceUSD}/mo · {plan.perUser}/seat
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.noFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Minus className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                id={`pricing-cta-${plan.name.replace(/\s+/g, "-").toLowerCase()}`}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2 transition-all group ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                    : "bg-white/[0.06] border border-white/[0.10] text-white hover:bg-white/[0.10]"
                }`}
              >
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          All plans include a 7-day free trial. No credit card required to start. Powered by{" "}
          <span className="text-slate-400 font-medium">Razorpay</span> — cancel anytime.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const testimonials = [
  {
    name: "Rohan Sharma",
    title: "Co-founder @ BuildFast",
    avatar: "RS",
    color: "from-violet-500 to-indigo-600",
    quote:
      "We cut our AI spend by 58% in the first month. The team system prompt alone saves us 2 hours of briefing per week.",
    stars: 5,
  },
  {
    name: "Ananya Krishnan",
    title: "Head of Marketing @ Kred Digital",
    avatar: "AK",
    color: "from-indigo-500 to-blue-600",
    quote:
      "Finally, our whole content team uses the same AI with the same brand voice. No more 'which AI did you use for this?' conversations.",
    stars: 5,
  },
  {
    name: "Vikram Nair",
    title: "CTO @ Nexus Labs",
    avatar: "VN",
    color: "from-cyan-500 to-teal-600",
    quote:
      "The Code Agent reads our GitHub issues and writes the first draft. Our devs now review and ship — not write from scratch.",
    stars: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-[#080a14]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loved by growing teams
          </h2>
          <p className="text-xl text-slate-400">
            Join 200+ Indian and global teams who've unified their AI stack
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4 hover:border-white/[0.10] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="relative py-24 bg-[#080a14]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Ready to unify your
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              team's AI?
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Start your 7-day free trial. No credit card needed. Setup takes 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              id="cta-final-primary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/[0.12] text-slate-300 font-semibold text-lg hover:bg-white/[0.04] hover:text-white transition-all"
            >
              Compare Plans
            </a>
          </div>
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
    <footer className="relative bg-[#080a14] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold">
                Luminescent<span className="text-violet-400">.io</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered team collaboration platform. One subscription for your whole team.
            </p>
            <div className="text-xs text-slate-600">
              © 2026 Luminescent.io. All rights reserved.
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Agents", "Pricing", "Changelog"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Refund Policy", "GDPR"],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            Powered by{" "}
            <span className="text-slate-500">Bytez AI</span> ·{" "}
            <span className="text-slate-500">Supabase</span> ·{" "}
            <span className="text-slate-500">Razorpay</span>
          </p>
          <p className="text-xs text-slate-600">
            Built with ❤️ for Indian teams and beyond
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT LANDING PAGE EXPORT
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-[#080a14]">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AgentsSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
