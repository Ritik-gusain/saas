"use client";

export const LandingStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Lora:wght@500;600&display=swap');

    :root {
      --landing-green:   #00FFAA;
      --landing-cyan:    #00D0FF;
      --landing-bg:      #101418;
      --landing-teal:    #005C69;
      --landing-white:   #F8F9FA;
      --landing-surface: #161B21;
      --landing-surface2:#1C2329;
      --landing-border:  rgba(255,255,255,0.06);
      --landing-border2: rgba(0,255,170,0.15);
      --landing-muted:   rgba(248,249,250,0.45);
      --landing-dimmed:  rgba(248,249,250,0.22);
    }

    /* Animations */
    @keyframes float      { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-14px)} }
    @keyframes pulseGlow  { 0%,100%{opacity:.4}                   50%{opacity:1} }
    @keyframes shimmer    { 0%{background-position:-200% center}  100%{background-position:200% center} }
    @keyframes borderFlow { 0%,100%{background-position:0% 50%}   50%{background-position:100% 50%} }
    @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes gridBreath { 0%,100%{opacity:.04}  50%{opacity:.09} }
    @keyframes ticker     { from{transform:translateX(0)}          to{transform:translateX(-50%)} }
    @keyframes scanline   { 0%{transform:translateY(-100%)}        100%{transform:translateY(100vh)} }
    @keyframes glowPulse  { 0%,100%{filter:drop-shadow(0 0 6px rgba(0,255,170,.6))} 50%{filter:drop-shadow(0 0 20px rgba(0,255,170,1))} }

    .shimmer-text {
      background: linear-gradient(90deg, #F8F9FA 0%, #00FFAA 35%, #00D0FF 55%, #F8F9FA 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(0,255,170,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,170,.045) 1px, transparent 1px);
      background-size: 64px 64px;
      animation: gridBreath 8s ease-in-out infinite;
    }

    .cyber-card {
      background: #161B21;
      border: 1px solid rgba(255,255,255,.055);
      border-radius: 14px;
      transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
      position: relative;
      overflow: hidden;
    }
    .cyber-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0,255,170,.03), transparent);
      transition: left .6s;
    }
    .cyber-card:hover::before {
      left: 100%;
    }
    .cyber-card:hover {
      transform: translateY(-5px);
      border-color: rgba(0,255,170,.22);
      box-shadow: 0 20px 60px rgba(0,255,170,.07);
    }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 30px;
      background: linear-gradient(135deg, #00FFAA, #00D0FF);
      color: #101418;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 15px; letter-spacing: .02em;
      border: none; border-radius: 8px; cursor: pointer;
      position: relative; overflow: hidden;
      transition: transform .2s, box-shadow .2s;
      text-decoration: none; white-space: nowrap;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 48px rgba(0,255,170,.35); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 26px;
      background: transparent; color: #F8F9FA;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 500; font-size: 14px; letter-spacing: .02em;
      border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; cursor: pointer;
      transition: border-color .25s, color .25s, background .25s;
      text-decoration: none; white-space: nowrap;
    }
    .btn-ghost:hover { border-color: rgba(0,255,170,.4); color: #00FFAA; background: rgba(0,255,170,.04); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px;
      border: 1px solid rgba(0,255,170,.25);
      background: rgba(0,255,170,.06);
      border-radius: 40px;
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500; letter-spacing: .1em;
      color: #00FFAA; text-transform: uppercase;
    }

    .nav-link {
      position: relative; font-size: 14px; font-weight: 500;
      color: rgba(248,249,250,.5); text-decoration: none; letter-spacing: .02em;
      transition: color .2s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
      height: 1px; background: #00FFAA;
      transform: scaleX(0); transition: transform .25s cubic-bezier(.16,1,.3,1);
    }
    .nav-link:hover { color: #F8F9FA; }
    .nav-link:hover::after { transform: scaleX(1); }

    .logo-ticker-item:hover {
      opacity: 1 !important;
      transform: translateY(-2px) !important;
    }

    @media (max-width: 900px) {
      .hero-grid   { grid-template-columns: 1fr !important; }
      .features-grid, .pricing-grid, .steps-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 560px) {
      .features-grid, .pricing-grid, .steps-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
);
