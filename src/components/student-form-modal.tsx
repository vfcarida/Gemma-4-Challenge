'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Volume2, Sun, Hand, Sparkles } from 'lucide-react';
import { AVATAR_COLORS } from '@/lib/constants';
import { generateId, cn } from '@/lib/utils';
import type { StudentProfile, SensitivityLevel } from '@/lib/types';

interface StudentFormModalProps {
  readonly open: boolean;
  readonly student?: StudentProfile; // undefined = create mode, defined = edit mode
  readonly onSave: (student: StudentProfile) => void;
  readonly onClose: () => void;
}

const SENSITIVITY_OPTIONS: readonly SensitivityLevel[] = ['low', 'moderate', 'high'];
const SENSITIVITY_LABELS: Record<SensitivityLevel, string> = { low: 'Low', moderate: 'Moderate', high: 'High' };
const SENSITIVITY_COLORS: Record<SensitivityLevel, string> = {
  low: 'bg-green-100 text-green-700 border-green-300',
  moderate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  high: 'bg-red-100 text-red-700 border-red-300',
};

const CALMING_PRESETS = [
  'Noise-canceling headphones', 'Drawing', 'Quiet corner', 'Fidget toys',
  'Music', 'Weighted blanket', 'Deep breathing', 'Counting', 'Stretching',
  'Rocking chair', 'Sensory ball', 'Timer-based breaks',
];

const SensitivitySelector: React.FC<{
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly value: SensitivityLevel;
  readonly onChange: (v: SensitivityLevel) => void;
}> = ({ label, icon, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600">
      {icon}
      <span>{label}</span>
    </div>
    <div className="flex gap-2">
      {SENSITIVITY_OPTIONS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all',
            value === level
              ? SENSITIVITY_COLORS[level]
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100',
          )}
        >
          {SENSITIVITY_LABELS[level]}
        </button>
      ))}
    </div>
  </div>
);

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  open,
  student,
  onSave,
  onClose,
}) => {
  const isEdit = !!student;

  const [name, setName] = useState('');
  const [age, setAge] = useState(7);
  const [needs, setNeeds] = useState('');
  const [notes, setNotes] = useState('');
  const [soundSensitivity, setSoundSensitivity] = useState<SensitivityLevel>('moderate');
  const [lightSensitivity, setLightSensitivity] = useState<SensitivityLevel>('low');
  const [touchSensitivity, setTouchSensitivity] = useState<SensitivityLevel>('low');
  const [calmingStrategies, setCalmingStrategies] = useState<string[]>([]);

  // Populate fields when editing
  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age);
      setNeeds(student.needs.join(', '));
      setNotes(student.notes);
      setSoundSensitivity(student.sensoryPreferences.soundSensitivity);
      setLightSensitivity(student.sensoryPreferences.lightSensitivity);
      setTouchSensitivity(student.sensoryPreferences.touchSensitivity);
      setCalmingStrategies([...student.sensoryPreferences.preferredCalmingStrategies]);
    } else {
      setName('');
      setAge(7);
      setNeeds('');
      setNotes('');
      setSoundSensitivity('moderate');
      setLightSensitivity('low');
      setTouchSensitivity('low');
      setCalmingStrategies([]);
    }
  }, [student, open]);

  const toggleStrategy = (strategy: string) => {
    setCalmingStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((s) => s !== strategy)
        : [...prev, strategy],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    const profile: StudentProfile = {
      id: student?.id ?? generateId('student'),
      name: name.trim(),
      age,
      avatarColor: student?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      needs: needs.split(',').map((n) => n.trim()).filter(Boolean),
      sensoryPreferences: {
        soundSensitivity,
        lightSensitivity,
        touchSensitivity,
        preferredCalmingStrategies: calmingStrategies,
      },
      notes: notes.trim(),
      createdAt: student?.createdAt ?? new Date().toISOString(),
    };

    onSave(profile);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? `Edit ${student.name}` : 'New Student'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-semibold text-slate-600 block mb-1">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                placeholder="Student name"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-semibold text-slate-600 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 7)}
                min={3}
                max={18}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Needs (comma-separated)</label>
            <input
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              placeholder="e.g., Sensory regulation, Communication support"
            />
          </div>

          {/* Sensory Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-purple-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sensory Profile</h3>
            </div>

            <SensitivitySelector
              label="Sound Sensitivity"
              icon={<Volume2 size={16} className="text-slate-400" />}
              value={soundSensitivity}
              onChange={setSoundSensitivity}
            />
            <SensitivitySelector
              label="Light Sensitivity"
              icon={<Sun size={16} className="text-slate-400" />}
              value={lightSensitivity}
              onChange={setLightSensitivity}
            />
            <SensitivitySelector
              label="Touch Sensitivity"
              icon={<Hand size={16} className="text-slate-400" />}
              value={touchSensitivity}
              onChange={setTouchSensitivity}
            />
          </div>

          {/* Calming Strategies */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600 block">Preferred Calming Strategies</label>
            <div className="flex flex-wrap gap-2">
              {CALMING_PRESETS.map((strategy) => (
                <button
                  key={strategy}
                  type="button"
                  onClick={() => toggleStrategy(strategy)}
                  className={cn(
                    'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                    calmingStrategies.includes(strategy)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100',
                  )}
                >
                  {strategy}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Teacher Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none h-20"
              placeholder="Additional observations about the student..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-8 py-5 border-t border-slate-100 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-blue-200"
          >
            {isEdit ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
};
