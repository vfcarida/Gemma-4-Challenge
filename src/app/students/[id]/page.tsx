'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Volume2, Sun, Hand, Clock, Layout, Pencil, BookText } from 'lucide-react';
import { useStudents, useSessionLogs, useBoards, useLessons } from '@/hooks/use-storage';
import { ROUTES } from '@/lib/constants';
import { formatDate, getInitials, formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/toast-provider';
import { StudentFormModal } from '@/components/student-form-modal';
import type { StudentProfile, SessionLog, PECSBoard, SavedLesson } from '@/lib/types';

const SENSITIVITY_LABELS = { low: 'Low', moderate: 'Moderate', high: 'High' };
const SENSITIVITY_COLORS = {
  low: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function StudentDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const studentId = params.id as string;
  
  const { students, saveStudent } = useStudents();
  const { sessions } = useSessionLogs();
  const { boards } = useBoards();
  const { lessons } = useLessons();
  
  const [showEdit, setShowEdit] = useState(false);

  const student = students.find(s => s.id === studentId);
  const studentSessions = sessions.filter(s => s.studentId === studentId);
  const studentBoards = boards.filter(b => b.studentId === studentId);
  const studentLessons = lessons.filter(l => l.studentId === studentId);

  const handleSave = (updated: StudentProfile) => {
    saveStudent(updated);
    setShowEdit(false);
    showToast(`${updated.name} updated!`, 'success');
  };

  if (!student) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-400">Student not found.</p>
        <Link href={ROUTES.STUDENTS} className="text-blue-600 font-semibold mt-2 inline-block">← Back to Students</Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <Link href={ROUTES.STUDENTS} className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-semibold text-sm">
        <ArrowLeft size={16} /> <span>Back to Students</span>
      </Link>

      {/* Edit Modal */}
      <StudentFormModal
        open={showEdit}
        student={student}
        onSave={handleSave}
        onClose={() => setShowEdit(false)}
      />

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className={`w-20 h-20 ${student.avatarColor} rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg`}>
          {getInitials(student.name)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900">{student.name}</h1>
          <p className="text-slate-400 font-medium">Age {student.age} • Added {formatDate(student.createdAt)}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {student.needs.map((need, i) => (
              <span key={i} className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{need}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold text-sm transition-colors"
        >
          <Pencil size={16} /> <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Sensory Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Sensory Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Volume2 size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Sound</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SENSITIVITY_COLORS[student.sensoryPreferences.soundSensitivity]}`}>
                    {SENSITIVITY_LABELS[student.sensoryPreferences.soundSensitivity]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Sun size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Light</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SENSITIVITY_COLORS[student.sensoryPreferences.lightSensitivity]}`}>
                    {SENSITIVITY_LABELS[student.sensoryPreferences.lightSensitivity]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Hand size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Touch</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SENSITIVITY_COLORS[student.sensoryPreferences.touchSensitivity]}`}>
                    {SENSITIVITY_LABELS[student.sensoryPreferences.touchSensitivity]}
                  </span>
                </div>
              </div>
            </div>
            {student.sensoryPreferences.preferredCalmingStrategies.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-2">Preferred Calming Strategies</p>
                <div className="flex flex-wrap gap-2">
                  {student.sensoryPreferences.preferredCalmingStrategies.map((s, i) => (
                    <span key={i} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Saved Lessons */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <BookText size={20} className="mr-2 text-purple-500" /> Saved Lessons ({studentLessons.length})
            </h2>
            {studentLessons.length === 0 ? (
              <p className="text-sm text-slate-400">No lesson adaptations saved for this student yet.</p>
            ) : (
              <div className="space-y-3">
                {studentLessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800">{lesson.title}</p>
                    <p className="text-xs text-slate-400 mb-2">{formatDate(lesson.createdAt)}</p>
                    <div className="flex flex-wrap gap-2">
                      {lesson.adaptations.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {a.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Session History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Session History ({studentSessions.length})</h2>
            {studentSessions.length === 0 ? (
              <p className="text-sm text-slate-400">No sessions logged yet. Use Student Mode to start logging.</p>
            ) : (
              <div className="space-y-2">
                {studentSessions.map((session) => (
                  <div key={session.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
                    <Clock size={16} className="text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        Selected &quot;{session.selectedCardTitle}&quot;
                      </p>
                      <p className="text-xs text-slate-400">{session.boardTitle}</p>
                    </div>
                    <span className="text-xs text-slate-400">{formatRelativeTime(session.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Notes */}
          {student.notes && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Teacher Notes</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{student.notes}</p>
            </div>
          )}

          {/* Saved Boards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Saved PECS Boards ({studentBoards.length})</h2>
            {studentBoards.length === 0 ? (
              <p className="text-sm text-slate-400">No boards generated for this student yet.</p>
            ) : (
              <div className="space-y-2">
                {studentBoards.map((board) => (
                  <Link key={board.id} href={ROUTES.STUDENT_MODE_BOARD(board.id)} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <Layout size={18} className="text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{board.title}</p>
                      <p className="text-xs text-slate-400">{formatDate(board.createdAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
