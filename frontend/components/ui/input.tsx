import React from 'react';
import { classNames } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-[11px] font-bold text-hud-soft uppercase tracking-widest opacity-70">{label}</label>}
      <input 
        className={classNames(
          "bg-hud-blue/20 border border-hud-soft/10 rounded-xl px-4 py-2.5 text-white placeholder-hud-soft/40 transition-all focus:border-hud-cyan/50 focus:ring-1 focus:ring-hud-cyan/50 outline-none", 
          className
        )}
        {...props}
      />
    </div>
  );
};
