"use client";

export const LandingStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@700;800;900&display=swap');

    :root {
      --landing-green:   #00FFAA;
      --landing-cyan:    #00D0FF;
      --landing-purple:  #7B61FF;
      --landing-orange:  #FF6B00;
      --landing-bg:      #0A0D12;
      --landing-bg2:     #0E1218;
      --landing-surface: #12171E;
      --landing-border:  rgba(255,255,255,0.06);
      --landing-white:   #F8F9FA;
      --landing-muted:   rgba(248,249,250,0.5);
      
      /* nvg8-inspired Palette */
      --nvg-beige: #F5F2EA;
      --nvg-orange: #FF5C00;
      --nvg-blue: #007AFF;
      
      /* Typography Tokens */
      --font-header:    'Space Grotesk', sans-serif;
      --font-body:      'Inter', sans-serif;
      --font-mono:      'JetBrains Mono', monospace;
      --font-display:   'Outfit', sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }

    body {
      font-family: var(--font-body);
      background: var(--landing-bg);
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(0, 255, 170, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(123, 97, 255, 0.05) 0%, transparent 50%);
      background-attachment: fixed;
      color: var(--landing-white);
      margin: 0;
      overflow-x: hidden;
      transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }


    /* ─── Typography Utils ─── */
    .display-h1 {
      font-family: var(--font-display);
      font-weight: 900;
      letter-spacing: -0.05em;
      line-height: 0.95;
    }

    .header-h2 {
      font-family: var(--font-header);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }

    .mono-label {
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 11px;
    }

    /* ─── nvg8 Step Number ─── */
    .step-number {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 500;
      color: var(--landing-green);
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .step-number::after {
      content: '';
      flex: 1;
      height: 1px;
      background: currentColor;
      opacity: 0.2;
    }

    /* ─── Scrollytelling Reveal ─── */
    .reveal-container {
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      perspective: 1000px;
      transform-style: preserve-3d;
    }

    .reveal-text {
      transform: translateY(100%);
      opacity: 0;
      display: inline-block;
    }

    /* ─── Premium Enhancements ─── */
    .scanline {
      width: 100%;
      height: 100px;
      z-index: 5;
      background: linear-gradient(0deg, rgba(0, 255, 170, 0) 0%, rgba(0, 255, 170, 0.05) 50%, rgba(0, 255, 170, 0) 100%);
      opacity: 0.2;
      position: absolute;
      top: -100px;
      left: 0;
      pointer-events: none;
      animation: scanline 8s linear infinite;
    }

    @keyframes scanline {
      0% { top: -100px; }
      100% { top: 100%; }
    }

    .glow-card {
      position: relative;
      overflow: hidden;
    }
    .glow-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.08) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .glow-card:hover::after {
      opacity: 1;
    }

    /* ─── Animations ─── */
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
    @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* ─── Shimmer & Glow Utils ─── */
    .shimmer-text {
      background: linear-gradient(90deg, #F8F9FA 0%, #00FFAA 30%, #00D0FF 55%, #7B61FF 75%, #F8F9FA 100%);
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 6s linear infinite;
    }

    .glow-text {
      text-shadow: 0 0 20px rgba(0, 255, 170, 0.3);
    }

    .sparkle-slow {
      animation: glow 4s ease-in-out infinite;
    }


    /* ─── Grid Background ─── */
    .grid-bg {
      background-image: 
        linear-gradient(rgba(0,255,170,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,170,.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    /* ─── Bento Grid & Cards ─── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 20px;
    }

    .cyber-card {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 40px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cyber-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--landing-green);
      transform: translateY(-5px);
    }
    
    .stat-bg {
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .cyber-card:hover .stat-bg {
      transform: scale(1.1) translate(-10px, -10px);
      opacity: 0.6 !important;
    }

    /* ─── nvg8 "Launch" Button Style ─── */
    .btn-launch {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--landing-green) 0%, var(--landing-cyan) 100%);
      color: #000;
      font-family: var(--font-header);
      font-weight: 700;
      border-radius: 100px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-size: 13px;
      box-shadow: 0 4px 15px rgba(0,255,170,0.2);
    }

    .btn-launch:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0,255,170,0.4);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 36px;
      background: linear-gradient(135deg, var(--landing-green) 0%, var(--landing-cyan) 100%);
      color: #000;
      font-family: var(--font-header);
      font-weight: 700;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 30px rgba(0,255,170,0.2);
    }

    .btn-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 50px rgba(0,255,170,0.4);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 15px 32px;
      background: rgba(255,255,255,0.03);
      color: var(--landing-white);
      border: 1px solid var(--landing-border);
      border-radius: 12px;
      text-decoration: none;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .btn-ghost:hover {
      background: rgba(255,255,255,0.06);
      border-color: var(--landing-cyan);
    }

    /* ─── Tag ─── */
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(0,255,170,0.08);
      border: 1px solid rgba(0,255,170,0.2);
      border-radius: 100px;
      color: var(--landing-green);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* ─── Responsive ─── */
    @media (max-width: 1024px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .bento-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);
