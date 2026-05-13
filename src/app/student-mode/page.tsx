'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Monitor, ArrowRight, Layout as LayoutIcon } from 'lucide-react';
import { getStudents, getBoards } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import type { StudentProfile, PECSBoard } from '@/lib/types';

export default function StudentModePage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [boards, setBoards] = useState<PECSBoard[]>([]);

  useEffect(() => {
    setStudents(getStudents());
    setBoards(getBoards());
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Mode</h1>
        <p className="text-slate-500">
          Select a saved PECS board to launch an interactive, full-screen exercise for a student.
        </p>
      </div>

      {boards.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center space-y-4">
          <Monitor size={56} className="text-slate-300 mx-auto" />
          <div>
            <p className="text-lg text-slate-400 font-medium">No boards saved yet</p>
            <p className="text-sm text-slate-300 mt-1">Go to the Smart PECS Generator, create a board, and click &quot;Save Board&quot; first.</p>
          </div>
          <Link
            href={ROUTES.PECS}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <LayoutIcon size={18} /> <span>Go to PECS Generator</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {boards.map((board) => {
            const student = students.find((s) => s.id === board.studentId);
            return (
              <Link
                key={board.id}
                href={ROUTES.STUDENT_MODE_BOARD(board.id)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Monitor size={24} />
                    </div>
                    <ArrowRight size={20} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-green-700 transition-colors">{board.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{board.prompt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {student ? (
                      <>
                        <div className={`w-6 h-6 ${student.avatarColor} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>
                          {getInitials(student.name)}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{student.name}</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-300">No student assigned</span>
                    )}
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-300">{board.cards.length} cards</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
