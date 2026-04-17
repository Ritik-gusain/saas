import React from 'react';
import { classNames } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input 
        className={classNames("border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", className)}
        {...props}
      />
    </div>
  );
};
