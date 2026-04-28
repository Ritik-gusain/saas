"use client";

export const LandingStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Lora:wght@500;600&display=swap');

    :root {
      --landing-green:   #00FFAA;
      --landing-cyan:    #00D0FF;
      --landing-purple:  #A78BFA;
      --landing-bg:      #0A0D12;
      --landing-bg2:     #0E1218;
      --landing-teal:    #005C69;
      --landing-white:   #F8F9FA;
      --landing-surface: #12171E;
      --landing-surface2:#181E27;
      --landing-border:  rgba(255,255,255,0.055);
      --landing-border2: rgba(0,255,170,0.18);
      --landing-muted:   rgba(248,249,250,0.45);
      --landing-dimmed:  rgba(248,249,250,0.22);
    }

    /* ─── Core Keyframes ─── */
    @keyframes float        { 0%,100%{transform:translateY(0)}          50%{transform:translateY(-14px)} }
    @keyframes floatX       { 0%,100%{transform:translateX(0)}          50%{transform:translateX(-10px)} }
    @keyframes pulseGlow    { 0%,100%{opacity:.35;transform:scale(1)}   50%{opacity:1;transform:scale(1.15)} }
    @keyframes shimmer      { 0%{background-position:-200% center}      100%{background-position:200% center} }
    @keyframes borderFlow   { 0%,100%{background-position:0% 50%}       50%{background-position:100% 50%} }
    @keyframes fadeUp       { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeDown     { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
    @keyframes gridBreath   { 0%,100%{opacity:.03}  50%{opacity:.08} }
    @keyframes ticker       { from{transform:translateX(0)}             to{transform:translateX(-50%)} }
    @keyframes ticker2      { from{transform:translateX(-50%)}          to{transform:translateX(0)} }
    @keyframes scanline     { 0%{transform:translateY(-100%)}           100%{transform:translateY(100vh)} }
    @keyframes glowPulse    { 0%,100%{filter:drop-shadow(0 0 6px rgba(0,255,170,.6))}  50%{filter:drop-shadow(0 0 22px rgba(0,255,170,1))} }
    @keyframes heroFadeIn   { from{opacity:0;transform:scale(0.96)}     to{opacity:1;transform:scale(1)} }
    @keyframes heroSlideUp  { from{opacity:0;transform:translateX(-50%) translateY(30px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes hudSlideRight{ from{opacity:0;transform:translateY(-50%) translateX(-28px)} to{opacity:1;transform:translateY(-50%) translateX(0)} }
    @keyframes hudSlideLeft { from{opacity:0;transform:translateY(-50%) translateX(28px)}  to{opacity:1;transform:translateY(-50%) translateX(0)} }
    @keyframes barGrow      { from{width:0} }
    @keyframes spin         { from{transform:rotate(0deg)}              to{transform:rotate(360deg)} }
    @keyframes spinReverse  { from{transform:rotate(360deg)}            to{transform:rotate(0deg)} }
    @keyframes morph        { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
    @keyframes typewriter   { from{width:0;opacity:0}                   to{width:100%;opacity:1} }
    @keyframes countUp      { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes neonFlicker  { 0%,100%{text-shadow:0 0 10px #00FFAA,0 0 30px #00FFAA55} 50%{text-shadow:0 0 20px #00FFAA,0 0 60px #00FFAA,0 0 80px #00D0FF55} }
    @keyframes particleDrift{ 0%{transform:translate(0,0) scale(1);opacity:.7} 100%{transform:translate(var(--dx,30px),var(--dy,-80px)) scale(0);opacity:0} }
    @keyframes orbitSlow    { from{transform:rotate(0deg) translateX(180px) rotate(0deg)} to{transform:rotate(360deg) translateX(180px) rotate(-360deg)} }
    @keyframes gradientShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes borderPulse  { 0%,100%{border-color:rgba(0,255,170,.12)} 50%{border-color:rgba(0,255,170,.4)} }
    @keyframes slideInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideInRight { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
    @keyframes scaleIn      { from{opacity:0;transform:scale(0.85)}        to{opacity:1;transform:scale(1)} }

    /* ─── Shimmer gradient text ─── */
    .shimmer-text {
      background: linear-gradient(90deg, #F8F9FA 0%, #00FFAA 30%, #00D0FF 55%, #A78BFA 75%, #F8F9FA 100%);
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 6s linear infinite;
    }

    .shimmer-text-cyan {
      background: linear-gradient(90deg, #00FFAA 0%, #00D0FF 50%, #00FFAA 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* ─── Grid background ─── */
    .grid-bg {
      background-image:
        linear-gradient(rgba(0,255,170,.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,170,.035) 1px, transparent 1px);
      background-size: 72px 72px;
      animation: gridBreath 10s ease-in-out infinite;
    }

    /* ─── Dot pattern ─── */
    .dot-pattern {
      background-image: radial-gradient(circle, rgba(0,255,170,.08) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    /* ─── Cards ─── */
    .cyber-card {
      background: var(--landing-surface);
      border: 1px solid var(--landing-border);
      border-radius: 16px;
      transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s;
      position: relative;
      overflow: hidden;
    }
    .cyber-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,170,.04), transparent);
      opacity: 0;
      transition: opacity .5s;
    }
    .cyber-card::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0,255,170,.04), transparent);
      transition: left .7s cubic-bezier(.16,1,.3,1);
    }
    .cyber-card:hover::before { opacity: 1; }
    .cyber-card:hover::after  { left: 100%; }
    .cyber-card:hover {
      transform: translateY(-6px) scale(1.005);
      border-color: rgba(0,255,170,.25);
      box-shadow: 0 24px 64px rgba(0,0,0,.4), 0 0 0 1px rgba(0,255,170,.08), 0 8px 32px rgba(0,255,170,.06);
    }

    /* Feature card with glow number */
    .feature-card-glow {
      background: linear-gradient(135deg, var(--landing-surface) 0%, rgba(0,255,170,.02) 100%);
      border: 1px solid var(--landing-border);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      transition: all .4s cubic-bezier(.16,1,.3,1);
    }
    .feature-card-glow:hover {
      border-color: rgba(0,255,170,.22);
      box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(0,255,170,.04);
      transform: translateY(-5px);
    }

    /* ─── Buttons ─── */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 32px;
      background: linear-gradient(135deg, #00FFAA 0%, #00D0FF 100%);
      color: #0A0D12;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 15px; letter-spacing: .01em;
      border: none; border-radius: 10px; cursor: pointer;
      position: relative; overflow: hidden;
      transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s;
      text-decoration: none; white-space: nowrap;
      background-size: 200% auto;
      animation: gradientShift 4s ease infinite;
    }
    .btn-primary::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #00D0FF, #00FFAA, #A78BFA, #00FFAA);
      background-size: 300% auto;
      opacity: 0;
      transition: opacity .4s;
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,255,170,.4), 0 4px 12px rgba(0,0,0,.3); }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:active { transform: translateY(-1px); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 28px;
      background: transparent; color: rgba(248,249,250,.65);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 600; font-size: 14px; letter-spacing: .02em;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; cursor: pointer;
      transition: all .3s cubic-bezier(.16,1,.3,1);
      text-decoration: none; white-space: nowrap;
      backdrop-filter: blur(8px);
    }
    .btn-ghost:hover { 
      border-color: rgba(0,255,170,.45); color: #00FFAA; 
      background: rgba(0,255,170,.05);
      box-shadow: 0 0 0 1px rgba(0,255,170,.15), 0 8px 24px rgba(0,255,170,.08);
    }

    /* ─── Tags / badges ─── */
    .tag {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 5px 15px;
      border: 1px solid rgba(0,255,170,.22);
      background: rgba(0,255,170,.06);
      border-radius: 40px;
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500; letter-spacing: .12em;
      color: #00FFAA; text-transform: uppercase;
      position: relative; overflow: hidden;
    }
    .tag::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(0,255,170,.08), transparent);
      animation: shimmer 3s linear infinite;
      background-size: 200% auto;
    }

    /* ─── Nav links ─── */
    .nav-link {
      position: relative; font-size: 14px; font-weight: 500;
      color: rgba(248,249,250,.45); text-decoration: none; letter-spacing: .02em;
      transition: color .25s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -5px; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, #00FFAA, #00D0FF);
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s cubic-bezier(.16,1,.3,1);
    }
    .nav-link:hover { color: #F8F9FA; }
    .nav-link:hover::after { transform: scaleX(1); }

    /* ─── Logo ticker ─── */
    .logo-ticker-item:hover {
      opacity: 1 !important;
      transform: translateY(-3px) scale(1.03) !important;
    }

    /* ─── Feature icon ring ─── */
    .icon-ring {
      position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-ring::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid rgba(0,255,170,.15);
      animation: spin 12s linear infinite;
    }

    /* ─── Glow divider ─── */
    .glow-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,255,170,.2), rgba(0,208,255,.2), transparent);
    }

    /* ─── Stats counter animation ─── */
    .stat-value {
      animation: countUp .8s ease-out both;
    }

    /* ─── Scroll reveal helpers (used with GSAP) ─── */
    .reveal-child { opacity: 0; }

    /* ─── Pricing card ─── */
    .pricing-card {
      border-radius: 20px;
      display: flex; flex-direction: column;
      position: relative; overflow: hidden;
      transition: all .4s cubic-bezier(.16,1,.3,1);
    }
    .pricing-card:not(.pricing-featured):hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(0,0,0,.4);
    }
    .pricing-featured {
      background: linear-gradient(145deg, rgba(0,92,105,.22) 0%, rgba(0,208,255,.06) 100%);
    }

    /* ─── Section glow orb ─── */
    .section-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    /* ─── Animated border gradient ─── */
    .animated-border {
      position: relative;
    }
    .animated-border::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(var(--angle,0deg), #00FFAA, #00D0FF, #A78BFA, #00FFAA);
      background-size: 300% 300%;
      animation: gradientShift 4s ease infinite;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 1100px) {
      .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 900px) {
      .hero-grid    { grid-template-columns: 1fr !important; }
      .features-grid, .steps-grid { grid-template-columns: 1fr 1fr !important; }
      .pricing-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 560px) {
      .features-grid, .pricing-grid, .steps-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);
