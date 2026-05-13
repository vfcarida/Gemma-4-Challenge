'use client';

import React, { useState } from 'react';
import { Send, Loader2, Sparkles, RefreshCw, Lightbulb, Download, Save, User } from 'lucide-react';
import { useToast } from '@/components/toast-provider';
import { DynamicIcon } from '@/components/dynamic-icon';
import { useStudents, useLessons } from '@/hooks/use-storage';
import { generateId } from '@/lib/utils';
import type { LessonAdaptation, StudentProfile, SavedLesson } from '@/lib/types';


const EXAMPLES = [
  'Adapt a 30-minute English Reading lesson for a classroom with 2 ASD students.',
  'Plan a Math lesson on addition for 7-year-olds with one non-verbal student.',
  'Adapt a Science experiment about volcanoes for sensory-sensitive students.',
  'Design an Art class activity that accommodates students with high touch sensitivity.',
  'Create a Physical Education warm-up routine for students who are noise-sensitive.',
];

const PRIORITY_COLORS = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-green-50 text-green-700 border-green-200',
};

export default function LessonsPage() {
  const { showToast } = useToast();
  const { students } = useStudents();
  const { saveLesson } = useLessons();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adaptations, setAdaptations] = useState<LessonAdaptation[]>([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setAdaptations([]);

    try {
      const response = await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.success) {
        setAdaptations(data.adaptations);
        setLessonTitle(data.lessonTitle);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      showToast('Failed to generate adaptations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (adaptations.length === 0) return;

    const newLesson: SavedLesson = {
      id: generateId('lesson'),
      title: lessonTitle || 'Untitled Lesson',
      prompt,
      adaptations,
      createdAt: new Date().toISOString(),
      studentId: selectedStudent || undefined,
    };

    saveLesson(newLesson);
    showToast('Lesson adaptations saved!', 'success');
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dynamic Lesson Adaptor</h1>
        <p className="text-slate-500">Paste or describe your lesson plan to receive autism-friendly adaptations powered by Gemma 4.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-purple-600">
            <Sparkles className="animate-pulse" size={20} />
            <h2 className="text-lg font-bold">Lesson Plan</h2>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Gemma 4 E2B Local
          </div>
        </div>

        {/* Student Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-2 flex items-center">
            <User size={14} className="mr-1" /> Student Context (optional)
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="">No student selected</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — Age {s.age}</option>
            ))}
          </select>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your lesson plan or paste the content here..."
          className="w-full h-44 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-50 outline-none resize-none text-base text-slate-800 placeholder:text-slate-400"
        />

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Lightbulb size={14} className="mr-1 text-yellow-500" /> Quick Examples
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs font-medium text-slate-500 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 px-3 py-2 rounded-lg border border-slate-200 text-left transition-colors"
                >
                  {ex.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-200 flex items-center space-x-2 disabled:opacity-50 transition-all active:scale-95 self-end"
          >
            {isLoading ? <><Loader2 className="animate-spin" size={18} /><span>Analyzing...</span></> : <><Send size={18} /><span>Adapt</span></>}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-6 py-16">
          <Loader2 size={56} className="text-purple-500 animate-spin" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-700">Gemma 4 processing locally...</h3>
            <p className="text-slate-400 text-sm">Adapting instructional content for neurodiverse learners</p>
          </div>
        </div>
      )}

      {/* Results */}
      {adaptations.length > 0 && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">{lessonTitle}</h3>
            <div className="flex items-center space-x-2">
              <button onClick={handleGenerate} className="flex items-center space-x-1 text-slate-400 hover:text-purple-600 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                <RefreshCw size={16} /> <span>Regenerate</span>
              </button>
              <button onClick={handleSave} className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                <Save size={16} /> <span>Save Adaptations</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adaptations.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <DynamicIcon name={item.icon} size={20} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${PRIORITY_COLORS[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-600 p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h4 className="text-lg font-bold">Lesson Adaptation Complete</h4>
              <p className="text-purple-200 text-sm">Ready to implement in your classroom.</p>
            </div>
            <button
              onClick={() => showToast('PDF download simulated!', 'info')}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all active:scale-95 shadow-md flex items-center space-x-2"
            >
              <Download size={18} /> <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
