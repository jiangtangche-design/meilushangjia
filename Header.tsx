import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <header className="bg-white px-6 pt-8 pb-4 border-b border-slate-100 shrink-0">
    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
    {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
  </header>
);