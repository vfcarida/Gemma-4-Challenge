'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, X, Menu } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/dynamic-icon';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Globe className="text-white" size={20} />
          </div>
          <span className="text-lg font-black text-slate-900">
            Gemma<span className="text-blue-600">Bridge</span>
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {collapsed ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col transition-transform duration-300',
          'w-64 lg:translate-x-0',
          collapsed ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100">
          <Link href="/" className="flex items-center space-x-3" onClick={() => setCollapsed(false)}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Globe className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Gemma<span className="text-blue-600">Bridge</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                AI for Inclusion
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                )}
              >
                <DynamicIcon
                  name={item.icon}
                  size={20}
                  className={cn(isActive ? 'text-blue-600' : 'text-slate-400')}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status badge */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-700">Gemma 4 E2B — Local</span>
          </div>
        </div>
      </aside>
    </>
  );
};
