'use client';

import React, { useEffect, useState } from 'react';
import { Clock, User, Layout as LayoutIcon } from 'lucide-react';
import { getSessionLogs } from '@/lib/storage';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import type { SessionLog } from '@/lib/types';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionLog[]>([]);

  useEffect(() => {
    setSessions(getSessionLogs());
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Session History</h1>
        <p className="text-slate-500">View all logged interactions from Student Mode sessions.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center">
          <Clock size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-lg">No sessions yet</p>
          <p className="text-sm text-slate-300 mt-1">Generate a PECS board and use Student Mode to log interactions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <div className="col-span-3">Student</div>
            <div className="col-span-3">Board</div>
            <div className="col-span-3">Selected Card</div>
            <div className="col-span-3 text-right">Time</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-50">
            {sessions.map((session) => (
              <div key={session.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center">
                <div className="md:col-span-3 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {getInitials(session.studentName)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{session.studentName}</span>
                </div>
                <div className="md:col-span-3 flex items-center space-x-2">
                  <LayoutIcon size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500 truncate">{session.boardTitle}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {session.selectedCardTitle}
                  </span>
                </div>
                <div className="md:col-span-3 text-right">
                  <span className="text-xs text-slate-400" title={formatDate(session.timestamp)}>
                    {formatRelativeTime(session.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
