'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PECSCardProps {
  title: string;
  iconName: string;
  colorClass: string;
  onClick?: () => void;
}

export const PECSCard: React.FC<PECSCardProps> = ({ title, iconName, colorClass, onClick }) => {
  // @ts-ignore - Dynamic icon resolution
  const Icon = Icons[iconName] as LucideIcon;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 shadow-lg active:scale-95 transition-all duration-200 aspect-square ${colorClass} hover:shadow-xl group`}
    >
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {Icon ? <Icon size={64} strokeWidth={2} /> : <Icons.HelpCircle size={64} />}
      </div>
      <span className="text-xl font-bold text-center leading-tight">
        {title}
      </span>
    </button>
  );
};

export const PECSGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      {children}
    </div>
  );
};
