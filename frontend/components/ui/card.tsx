import React from 'react';
import { classNames } from '@/utils/helpers';

export const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={classNames("bg-white shadow-sm border border-slate-200 rounded-xl p-6", className)}>
    {children}
  </div>
);
