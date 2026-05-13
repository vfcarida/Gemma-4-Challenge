'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, BookText, Users, Monitor, TrendingUp, Clock, ArrowRight, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-storage';
import { ROUTES } from '@/lib/constants';
import { formatRelativeTime, getInitials } from '@/lib/utils';

interface DashboardStats {
  studentCount: number;
  boardCount: number;
  sessionCount: number;
  recentSessions: SessionLog[];
}

const OnboardingWizard: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const steps = [
    {
      label: 'Meet your students',
      description: 'Review the pre-seeded student profiles or add your own.',
      href: ROUTES.STUDENTS,
      done: stats.studentCount > 0,
      emoji: '👋',
    },
    {
      label: 'Generate your first PECS board',
      description: 'Describe a classroom situation and let Gemma 4 create a visual choice board.',
      href: ROUTES.PECS,
      done: stats.boardCount > 0,
      emoji: '🧩',
    },
    {
      label: 'Run a classroom exercise',
      description: 'Open a saved board in Student Mode and run a multi-round interactive session.',
      href: ROUTES.STUDENT_MODE,
      done: stats.sessionCount > 0,
      emoji: '🎯',
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">Getting Started</h2>
        </div>
        <p className="text-slate-500 text-sm">Complete these steps to experience the full GemmaBridge workflow.</p>
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{completedCount}/{steps.length}</span>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {steps.map((step, i) => (
          <Link
            key={i}
            href={step.href}
            className="flex items-center space-x-5 px-8 py-6 hover:bg-slate-50 transition-colors group"
          >
            <div className="text-3xl">{step.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {step.done ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <Circle size={18} className="text-slate-300" />
                )}
                <h3 className={`font-bold ${step.done ? 'text-green-700' : 'text-slate-800'}`}>
                  Step {i + 1}: {step.label}
                </h3>
              </div>
              <p className="text-sm text-slate-400 mt-1 ml-7">{step.description}</p>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const stats = useDashboardStats();

  const showOnboarding = stats.boardCount === 0 && stats.sessionCount === 0;

  const quickActions = [
    {
      title: 'Smart PECS Generator',
      description: 'Generate context-aware visual boards for students',
      icon: Layout,
      href: ROUTES.PECS,
      color: 'bg-blue-500',
    },
    {
      title: 'Lesson Adaptor',
      description: 'Adapt lesson plans for neurodiverse classrooms',
      icon: BookText,
      href: ROUTES.LESSONS,
      color: 'bg-purple-500',
    },
    {
      title: 'Student Mode',
      description: 'Launch an interactive PECS exercise',
      icon: Monitor,
      href: ROUTES.STUDENT_MODE,
      color: 'bg-green-500',
    },
    {
      title: 'Manage Students',
      description: 'View and manage student profiles',
      icon: Users,
      href: ROUTES.STUDENTS,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
          <Sparkles size={16} />
          <span>Google Gemma 4 Challenge</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Welcome to Gemma<span className="text-blue-600">Bridge</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Your AI-powered co-pilot for inclusive education. Generate visual supports
          and adapt lessons for neurodiverse learners in real-time.
        </p>
      </div>

      {/* Onboarding OR Stats */}
      {showOnboarding ? (
        <OnboardingWizard stats={stats} />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stats.studentCount}</p>
                <p className="text-sm font-medium text-slate-400">Students</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Layout size={24} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stats.boardCount}</p>
                <p className="text-sm font-medium text-slate-400">Boards Saved</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stats.sessionCount}</p>
                <p className="text-sm font-medium text-slate-400">Sessions Logged</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col space-y-4"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <action.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{action.description}</p>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {!showOnboarding && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            <Link href={ROUTES.HISTORY} className="text-sm text-blue-600 font-semibold hover:underline flex items-center">
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          {stats.recentSessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center">
              <Clock size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No sessions yet.</p>
              <p className="text-sm text-slate-300">Generate a PECS board and use Student Mode to log interactions.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
              {stats.recentSessions.map((session) => (
                <div key={session.id} className="flex items-center px-6 py-4 space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {getInitials(session.studentName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {session.studentName} selected &quot;{session.selectedCardTitle}&quot;
                    </p>
                    <p className="text-xs text-slate-400">{session.boardTitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{formatRelativeTime(session.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
