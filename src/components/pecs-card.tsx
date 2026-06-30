'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from './dynamic-icon';

interface PECSCardProps {
  readonly title: string;
  readonly iconName: string;
  readonly colorClass: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly selected?: boolean;
  readonly onClick?: () => void;
}

const SIZES = {
  sm: { icon: 40, text: 'text-sm', padding: 'p-4', gap: 'mb-2' },
  md: { icon: 64, text: 'text-xl', padding: 'p-6', gap: 'mb-4' },
  lg: { icon: 80, text: 'text-2xl', padding: 'p-8', gap: 'mb-5' },
} as const;

export const PECSCard: React.FC<PECSCardProps> = ({
  title,
  iconName,
  colorClass,
  size = 'md',
  selected = false,
  onClick,
}) => {
  const sizeConfig = SIZES[size];

  return (
    <button
      onClick={onClick}
      role="option"
      aria-selected={selected}
      aria-label={title}
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border-4 shadow-sm active:scale-[0.98] transition-all duration-300 aspect-square group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:border-transparent',
        sizeConfig.padding,
        colorClass,
        selected && 'ring-4 ring-green-400 border-green-500 bg-green-50/50',
        'hover:shadow-md motion-reduce:transition-none motion-reduce:transform-none',
      )}
    >
      <div className={cn(sizeConfig.gap, 'transform group-hover:scale-105 transition-transform duration-300 motion-reduce:transform-none')}>
        <DynamicIcon name={iconName} size={sizeConfig.icon} strokeWidth={2} />
      </div>
      <span className={cn(sizeConfig.text, 'font-bold text-center leading-tight')}>
        {title}
      </span>
    </button>
  );
};

export const PECSGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      role="listbox"
      aria-label="PECS choices"
      className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto"
    >
      {children}
    </div>
  );
};
