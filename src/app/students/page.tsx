'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, X, Users, ArrowRight } from 'lucide-react';
import { getStudents, saveStudent, deleteStudent } from '@/lib/storage';
import { AVATAR_COLORS, ROUTES } from '@/lib/constants';
import { generateId, getInitials } from '@/lib/utils';
import { useToast } from '@/components/toast-provider';
import type { StudentProfile, SensitivityLevel } from '@/lib/types';

export default function StudentsPage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState(7);
  const [formNeeds, setFormNeeds] = useState('');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handleAddStudent = () => {
    if (!formName.trim()) return;

    const newStudent: StudentProfile = {
      id: generateId('student'),
      name: formName.trim(),
      age: formAge,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      needs: formNeeds.split(',').map((n) => n.trim()).filter(Boolean),
      sensoryPreferences: {
        soundSensitivity: 'moderate' as SensitivityLevel,
        lightSensitivity: 'low' as SensitivityLevel,
        touchSensitivity: 'low' as SensitivityLevel,
        preferredCalmingStrategies: [],
      },
      notes: formNotes,
      createdAt: new Date().toISOString(),
    };

    saveStudent(newStudent);
    setStudents(getStudents());
    setShowForm(false);
    setFormName('');
    setFormAge(7);
    setFormNeeds('');
    setFormNotes('');
    showToast(`${newStudent.name} added successfully!`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteStudent(id);
    setStudents(getStudents());
    showToast(`${name} removed`, 'info');
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Profiles</h1>
          <p className="text-slate-500">Manage student profiles with their needs and sensory preferences.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md"
        >
          <Plus size={18} /> <span>Add Student</span>
        </button>
      </div>

      {/* Add Student Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">New Student</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Name *</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Age</label>
                <input
                  type="number"
                  value={formAge}
                  onChange={(e) => setFormAge(parseInt(e.target.value) || 7)}
                  min={3}
                  max={18}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Needs (comma-separated)</label>
                <input
                  value={formNeeds}
                  onChange={(e) => setFormNeeds(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  placeholder="e.g., Sensory regulation, Communication support"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none h-20"
                  placeholder="Additional observations..."
                />
              </div>
            </div>
            <button
              onClick={handleAddStudent}
              disabled={!formName.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Add Student
            </button>
          </div>
        </div>
      )}

      {/* Student Cards */}
      {students.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center">
          <Users size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No students yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${student.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {getInitials(student.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{student.name}</h3>
                    <p className="text-sm text-slate-400">Age {student.age}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {student.needs.slice(0, 3).map((need, i) => (
                    <span key={i} className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                      {need}
                    </span>
                  ))}
                </div>

                {student.notes && (
                  <p className="text-xs text-slate-400 line-clamp-2">{student.notes}</p>
                )}
              </div>

              <div className="flex border-t border-slate-100">
                <Link
                  href={ROUTES.STUDENT_DETAIL(student.id)}
                  className="flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <span>View Profile</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(student.id, student.name)}
                  className="px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors border-l border-slate-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
