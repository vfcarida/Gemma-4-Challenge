'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Monitor, ArrowRight, Layout as LayoutIcon, Copy, Trash2, Filter } from 'lucide-react';
import { useStudents, useBoards } from '@/hooks/use-storage';
import { ROUTES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import { useToast } from '@/components/toast-provider';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { PECSBoard } from '@/lib/types';

export default function StudentModePage() {
  const { showToast } = useToast();
  const { students } = useStudents();
  const { boards, deleteBoard, duplicateBoard } = useBoards();
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredBoards = filterStudent === 'all'
    ? boards
    : boards.filter((b) => b.studentId === filterStudent);

  const handleDuplicate = (boardId: string) => {
    const copy = duplicateBoard(boardId);
    if (copy) {
      showToast(`"${copy.title}" created!`, 'success');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteBoard(deleteTarget.id);
    showToast(`"${deleteTarget.title}" deleted`, 'info');
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Mode</h1>
        <p className="text-slate-500">
          Select a saved PECS board to launch an interactive, full-screen exercise for a student.
        </p>
      </div>

      {/* Filter */}
      {boards.length > 0 && (
        <div className="flex items-center space-x-3">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="all">All students ({boards.length})</option>
            {students.map((s) => {
              const count = boards.filter((b) => b.studentId === s.id).length;
              return count > 0 ? (
                <option key={s.id} value={s.id}>{s.name} ({count})</option>
              ) : null;
            })}
            <option value="__none">Unassigned</option>
          </select>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Board"
        message={`Are you sure you want to delete "${deleteTarget?.title ?? ''}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
      ) : filteredBoards.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center">
          <p className="text-slate-400 font-medium">No boards match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBoards.map((board) => {
            const student = students.find((s) => s.id === board.studentId);
            return (
              <div
                key={board.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all overflow-hidden"
              >
                <Link href={ROUTES.STUDENT_MODE_BOARD(board.id)} className="block p-6 space-y-4">
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
                </Link>

                {/* Board Actions */}
                <div className="flex border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDuplicate(board.id)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Copy size={14} /> <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: board.id, title: board.title })}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border-l border-slate-100"
                  >
                    <Trash2 size={14} /> <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
