import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { ToastProvider } from '@/components/toast-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GemmaBridge | AI Bridging the Inclusion Gap',
  description:
    'GemmaBridge: AI Bridging the Inclusion Gap for Neurodiverse Learners using Google Gemma 4 E2B.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <Sidebar />
          {/* Main content area offset by sidebar width */}
          <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen bg-slate-50">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
