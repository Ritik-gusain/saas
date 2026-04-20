import React from 'react';
import { classNames } from '@/utils/helpers';

export const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={classNames("bg-hud-blue/10 backdrop-blur-xl border border-hud-soft/10 rounded-2xl shadow-2xl transition-all hover:border-hud-cyan/30", className)}>
    {children}
  </div>
);
