import React from 'react';
import { classNames } from '@/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  
  return (
    <button className={classNames(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
