import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm mt-auto">
      &copy; {new Date().getFullYear()} Luminescent.io. All rights reserved.
    </footer>
  );
};
