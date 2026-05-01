
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Users, 
  Layout, 
  Zap, 
  CreditCard, 
  Shield, 
  BookOpen, 
  ChevronRight,
  Search,
  Menu,
  X,
  FileText,
  MessageSquare,
  Briefcase,
  Terminal,
  Globe,
  Database
} from 'lucide-react';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: <BookOpen className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-lg text-slate-300 leading-relaxed">
          Luminescent is an enterprise-grade AI orchestration platform engineered to unify fragmented intelligence workflows into a high-performance collaborative substrate.
        </p>
        <p className="text-slate-400">
          Our architecture consolidates disparate AI resources into a secure, centralized hub. By implementing shared persistent context and autonomous agent clusters, we enable teams to scale their intellectual output while maintaining full sovereignty over their data and API infrastructure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <h4 className="text-[var(--cyan)] font-bold mb-2">Resource Optimization</h4>
            <p className="text-sm text-slate-400">Eliminate redundant seat costs through centralized node management and optimized token allocation across the organization.</p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <h4 className="text-[var(--mint)] font-bold mb-2">Sovereign Intelligence</h4>
            <p className="text-sm text-slate-400">Deploy proprietary system prompts and project-specific knowledge bases that remain fully within your team's control.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Zap className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">1. Provisioning Your Account</h3>
          <p className="text-slate-400">Initialize your access via secure OAuth 2.0 or enterprise-grade email authentication. Upon entry, every node is configured for Solo operation with full Bring Your Own Key (BYOK) protocol support.</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">2. Orchestrating Your Team</h3>
          <p className="text-slate-400">Transition to a multi-seat configuration to unlock collaborative intelligence. Select from our scalable architecture tiers: Starter, Growth, or Pro.</p>
          <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
            <li>Access the <span className="text-[var(--cyan)]">Administrative Settings &gt; Infrastructure</span> dashboard.</li>
            <li>Identify the resource tier aligned with your organizational scale.</li>
            <li>Finalize the secure provisioning process.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">3. Deploying Collaborative Nodes</h3>
          <p className="text-slate-400">Invite specialized team members through secure, short-lived magic links to ensure the integrity of your workspace.</p>
        </div>
      </div>
    )
  },
  {
    id: 'ai-workspace',
    title: 'AI Chat Workspace',
    icon: <MessageSquare className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <p className="text-slate-400">The primary interface is optimized for low-latency interaction with a diverse array of Large Language Models (LLMs).</p>
        <div className="space-y-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-[var(--cyan)]" /> Real-time Synthesis
          </h4>
          <p className="text-sm text-slate-400">High-concurrency streaming allows for immediate validation of AI outputs. Monitor the synthesis process as the engine constructs responses in real-time.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--cyan)]" /> Model Interoperability
          </h4>
          <p className="text-sm text-slate-400">Switch between industry-leading models mid-stream to optimize for specific computational tasks, including logic-heavy reasoning or creative synthesis.</p>
        </div>
        <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-[var(--mint)] border border-[var(--border)]">
          // NAVIGATION_CMD: Use Ctrl+K (Global Search) to query persistent conversation history instantly.
        </div>
      </div>
    )
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    icon: <Users className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--bg-elevated)] to-transparent border border-[var(--border)]">
          <h3 className="text-lg font-bold text-white mb-4">Contextual Repositories</h3>
          <p className="text-slate-400 mb-4">Organize your collective output into compartmentalized folders for enhanced retrieval and focus.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              Persistent Output Pinning
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              Collaborative Annotations
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              Custom Protocol Instructions
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              Centralized Documentation Storage
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Global Protocol Standards</h3>
          <p className="text-slate-400">Define cross-organizational system prompts to maintain consistent operational standards, brand voice, and output quality across all collaborative nodes.</p>
        </div>
      </div>
    )
  },
  {
    id: 'ai-agents',
    title: 'Autonomous Agents',
    icon: <Zap className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <p className="text-slate-400">Autonomous Agents are specialized sub-processes capable of complex task planning and execution with minimal human oversight.</p>
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-[var(--surface)] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Agent Cluster</th>
                <th className="px-4 py-3">Functional Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="px-4 py-4 text-white font-medium">Research Agent</td>
                <td className="px-4 py-4">Deep-web synthesis, data extraction, and competitive market auditing.</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-white font-medium">Creative Agent</td>
                <td className="px-4 py-4">High-fidelity copy synthesis and multimodal asset generation.</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-white font-medium">Engineering Agent</td>
                <td className="px-4 py-4">Repository analysis, automated debugging, and architectural auditing.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    icon: <CreditCard className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Plan Architecture & Resource Allocation</h3>
          <p className="text-slate-400">Our resource tiers are designed to scale with your organization's computational needs. All plans are managed via a secure, high-integrity payment gateway with recurring allocation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-[var(--border)]">
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold">Starter</div>
            <div className="text-lg font-bold text-white">₹2,400<span className="text-xs text-slate-400">/mo</span></div>
            <div className="text-xs text-[var(--cyan)] mt-2">3 Dedicated Seats</div>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-[var(--border-strong)] relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-[var(--cyan)] text-black text-[10px] font-bold px-2 py-0.5">OPTIMIZED</div>
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold">Growth</div>
            <div className="text-lg font-bold text-white">₹4,900<span className="text-xs text-slate-400">/mo</span></div>
            <div className="text-xs text-[var(--cyan)] mt-2">7 Dedicated Seats</div>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-[var(--border)]">
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold">Pro</div>
            <div className="text-lg font-bold text-white">₹8,200<span className="text-xs text-slate-400">/mo</span></div>
            <div className="text-xs text-[var(--cyan)] mt-2">12 Dedicated Seats</div>
          </div>
        </div>
      </div>
    )
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white font-sans selection:bg-[var(--cyan)] selection:text-black">
      {/* HUD Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-[var(--border)] z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center p-1.5 shadow-[0_0_15px_var(--glow-cyan)]">
            <Bot className="w-full h-full text-black" />
          </div>
          <span className="font-['Montserrat'] font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-[var(--cyan)] transition-all duration-300">
            LUMINESCENT
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="bg-[var(--bg)] border border-[var(--border)] rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all w-64"
            />
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-[var(--cyan)] transition-colors">
            Go to App
          </Link>
        </div>

        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Navigation Sidebar */}
        <aside className={`
          fixed md:sticky top-16 h-[calc(100vh-64px)] w-72 border-r border-[var(--border)] bg-[var(--bg)] z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="p-6 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Documentation</div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${activeSection === section.id 
                    ? 'bg-[var(--surface)] text-[var(--cyan)] border border-[var(--border-strong)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <span className={`transition-colors ${activeSection === section.id ? 'text-[var(--cyan)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {section.icon}
                </span>
                {section.title}
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}

            <div className="pt-8 space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resources</div>
              <a href="#" className="flex items-center gap-3 px-4 text-sm text-slate-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4" /> API Reference
              </a>
              <a href="#" className="flex items-center gap-3 px-4 text-sm text-slate-400 hover:text-white transition-colors">
                <Shield className="w-4 h-4" /> Security Policy
              </a>
              <a href="#" className="flex items-center gap-3 px-4 text-sm text-slate-400 hover:text-white transition-colors">
                <Database className="w-4 h-4" /> Changelog
              </a>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-6 md:p-12 lg:p-16 max-w-4xl pt-24 md:pt-16">
          <div className="space-y-20 pb-20">
            {sections.map((section) => (
              <section 
                key={section.id} 
                id={section.id} 
                className="scroll-mt-24 animate-fade-in-up"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--cyan)]">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-['Montserrat'] font-bold tracking-tight text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-invert prose-cyan max-w-none">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="border-t border-[var(--border)] pt-10 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-slate-500 text-sm">
                © 2026 Luminescent. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">GitHub</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Discord</a>
              </div>
            </div>
          </footer>
        </main>

        {/* Table of Contents (Right Sidebar - Desktop only) */}
        <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-64px)] p-8">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">On this page</div>
           <div className="space-y-3">
             {sections.map((section) => (
               <button
                 key={section.id}
                 onClick={() => scrollToSection(section.id)}
                 className={`block text-xs transition-colors hover:text-white ${activeSection === section.id ? 'text-[var(--cyan)] border-l-2 border-[var(--cyan)] pl-3' : 'text-slate-500 pl-3 border-l-2 border-transparent'}`}
               >
                 {section.title}
               </button>
             ))}
           </div>
        </aside>
      </div>
    </div>
  );
}
