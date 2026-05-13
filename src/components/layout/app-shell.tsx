'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { ToastProvider } from '@/components/toast-provider';
import { ErrorBoundary } from '@/components/error-boundary';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Sidebar />
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen bg-slate-50">
          {children}
        </main>
      </ToastProvider>
    </ErrorBoundary>
  );
};
