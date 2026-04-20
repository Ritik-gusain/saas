import React from 'react';

export const Logo: React.FC<{ size?: number; animated?: boolean }> = ({ size = 36, animated = true }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "animate-logo-glow" : ""}
      style={{
        filter: animated ? undefined : "drop-shadow(0 0 6px #4DE8FF)"
      }}
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="40%" stopColor="#4DE8FF" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4DE8FF" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <linearGradient id="topSwirl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6BFFB8"/>
          <stop offset="100%" stopColor="#4DE8FF"/>
        </linearGradient>
        <linearGradient id="botSwirl" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4DE8FF"/>
          <stop offset="100%" stopColor="#6BFFB8"/>
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="40" cy="40" r="36" stroke="rgba(77,232,255,0.2)" strokeWidth="1"/>
      <circle cx="40" cy="40" r="28" stroke="rgba(107,255,184,0.15)" strokeWidth="0.5"/>

      {/* Top swirl */}
      <path d="M 22 28 C 22 18, 36 14, 40 20 C 44 26, 56 22, 58 32 C 60 40, 52 44, 46 40 C 40 36, 28 40, 24 50" 
            stroke="url(#topSwirl)" strokeWidth="6" strokeLinecap="round" fill="none"
            filter="url(#blur1)" opacity="0.7"/>
      <path d="M 22 28 C 22 18, 36 14, 40 20 C 44 26, 56 22, 58 32 C 60 40, 52 44, 46 40 C 40 36, 28 40, 24 50" 
            stroke="url(#topSwirl)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Bottom swirl */}
      <path d="M 58 52 C 58 62, 44 66, 40 60 C 36 54, 24 58, 22 48 C 20 40, 28 36, 34 40 C 40 44, 52 40, 56 30" 
            stroke="url(#botSwirl)" strokeWidth="6" strokeLinecap="round" fill="none"
            filter="url(#blur1)" opacity="0.7"/>
      <path d="M 58 52 C 58 62, 44 66, 40 60 C 36 54, 24 58, 22 48 C 20 40, 28 36, 34 40 C 40 44, 52 40, 56 30" 
            stroke="url(#botSwirl)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Core glow */}
      <circle cx="40" cy="40" r="8" fill="url(#coreGlow)"/>
      <circle cx="40" cy="40" r="4" fill="#ffffff" opacity="0.95"/>
      <circle cx="40" cy="40" r="2" fill="#4DE8FF"/>

      {/* Crosshair */}
      <line x1="40" y1="30" x2="40" y2="34" stroke="rgba(77,232,255,0.6)" strokeWidth="0.8"/>
      <line x1="40" y1="46" x2="40" y2="50" stroke="rgba(77,232,255,0.6)" strokeWidth="0.8"/>
      <line x1="30" y1="40" x2="34" y2="40" stroke="rgba(77,232,255,0.6)" strokeWidth="0.8"/>
      <line x1="46" y1="40" x2="50" y2="40" stroke="rgba(77,232,255,0.6)" strokeWidth="0.8"/>
      
      <style jsx>{`
        @keyframes logoSpin {
          0%   { filter: drop-shadow(0 0 6px #4DE8FF); }
          50%  { filter: drop-shadow(0 0 14px #6BFFB8); }
          100% { filter: drop-shadow(0 0 6px #4DE8FF); }
        }
        .animate-logo-glow {
          animation: logoSpin 8s linear infinite;
        }
      `}</style>
    </svg>
  );
};
