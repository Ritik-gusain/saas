import React from 'react';
import { classNames } from '@/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-bold focus:outline-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-br from-hud-cyan to-hud-mint text-hud-bg shadow-lg shadow-hud-cyan/20 hover:opacity-90",
    secondary: "border border-hud-soft/20 text-hud-soft hover:bg-hud-cyan/5 hover:border-hud-cyan/40",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
  };
  
  return (
    <button className={classNames(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
