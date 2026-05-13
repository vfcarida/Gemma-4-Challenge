'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, ArrowRight, Pencil } from 'lucide-react';
import { useToast } from '@/components/toast-provider';
import { useStudents } from '@/hooks/use-storage';
import { ROUTES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import { StudentFormModal } from '@/components/student-form-modal';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { StudentProfile } from '@/lib/types';

export default function StudentsPage() {
  const { showToast } = useToast();
  const { students, saveStudent, deleteStudent } = useStudents();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleSave = (student: StudentProfile) => {
    saveStudent(student);
    setShowForm(false);
    setEditingStudent(undefined);
    showToast(editingStudent ? `${student.name} updated!` : `${student.name} added!`, 'success');
  };

  const handleEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingStudent(undefined);
    setShowForm(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteStudent(deleteTarget.id);
    showToast(`${deleteTarget.name} removed`, 'info');
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Profiles</h1>
          <p className="text-slate-500">Manage student profiles with their needs and sensory preferences.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md"
        >
          <Plus size={18} /> <span>Add Student</span>
        </button>
      </div>

      {/* Student Form Modal */}
      <StudentFormModal
        open={showForm}
        student={editingStudent}
        onSave={handleSave}
        onClose={() => { setShowForm(false); setEditingStudent(undefined); }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Student"
        message={`Are you sure you want to remove ${deleteTarget?.name ?? ''}? This will not delete their saved boards or session history.`}
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit student"
                  >
                    <Pencil size={16} />
                  </button>
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
                  onClick={() => setDeleteTarget({ id: student.id, name: student.name })}
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
