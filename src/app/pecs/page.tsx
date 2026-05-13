'use client';

import React, { useState } from 'react';
import { Mic, Send, Loader2, Sparkles, RefreshCw, Lightbulb, Save, Monitor } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PECSCard, PECSGrid } from '@/components/pecs-card';
import { useToast } from '@/components/toast-provider';
import { useStudents, useBoards } from '@/hooks/use-storage';
import { ROUTES } from '@/lib/constants';
import type { PECSBoard, StudentProfile } from '@/lib/types';

const EXAMPLES = [
  'Lucas is overwhelmed by the recess bell. Generate self-regulation options.',
  'Maria is hungry but cannot express what she wants to eat.',
  'A student is struggling with the transition to Math class.',
  'A child is feeling sad and cannot explain why.',
  'The student needs to go to the bathroom but is non-verbal.',
  'Students on the playground need to practice sharing and turn-taking.',
];

export default function PECSPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { students } = useStudents();
  const { saveBoard } = useBoards();

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState<PECSBoard | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setBoard(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, studentId: selectedStudent || undefined }),
      });

      const data = await response.json();
      if (data.success && data.board) {
        setBoard(data.board);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      showToast('Failed to generate board', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBoard = () => {
    if (!board) return;
    saveBoard(board);
    showToast('Board saved successfully!', 'success');
  };

  const handleOpenStudentMode = () => {
    if (!board) return;
    saveBoard(board);
    router.push(ROUTES.STUDENT_MODE_BOARD(board.id));
  };

  const simulateListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setPrompt(EXAMPLES[0]);
      setIsListening(false);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart PECS Generator</h1>
        <p className="text-slate-500">Describe a classroom situation to generate a context-aware visual choice board.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-blue-600">
            <Sparkles className="animate-pulse" size={20} />
            <h2 className="text-lg font-bold">Prompt</h2>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Gemma 4 E2B Local
          </div>
        </div>

        {/* Student Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-2">Student Context (optional)</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">No student selected</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — Age {s.age}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the student's needs or classroom situation..."
            className="w-full h-36 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none resize-none text-base text-slate-800 placeholder:text-slate-400"
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={simulateListening}
              className={`p-2.5 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              title="Simulate Speech-to-Text"
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 flex items-center space-x-2 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 text-sm"
            >
              {isLoading ? <><Loader2 className="animate-spin" size={18} /><span>Analyzing...</span></> : <><Send size={18} /><span>Generate</span></>}
            </button>
          </div>
        </div>

        {isListening && (
          <p className="text-sm text-slate-500 animate-pulse flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            Listening to teacher...
          </p>
        )}

        {/* Quick Examples */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <Lightbulb size={14} className="mr-1 text-yellow-500" /> Quick Examples
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="text-xs font-medium text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg border border-slate-200 text-left transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-6 py-16">
          <div className="relative">
            <Loader2 size={56} className="text-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full animate-ping" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-700">Gemma 4 processing locally...</h3>
            <p className="text-slate-400 text-sm">Analyzing classroom context & generating visual options</p>
          </div>
        </div>
      )}

      {/* Results */}
      {board && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{board.title}</h3>
              <p className="text-sm text-slate-400 mt-1">Board ID: {board.id}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleGenerate} className="flex items-center space-x-1 text-slate-400 hover:text-blue-600 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <RefreshCw size={16} /> <span>Regenerate</span>
              </button>
            </div>
          </div>

          <PECSGrid>
            {board.cards.map((card) => (
              <PECSCard key={card.id} title={card.title} iconName={card.icon} colorClass={card.colorClass} />
            ))}
          </PECSGrid>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button onClick={handleSaveBoard} className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95 shadow-md">
              <Save size={18} /> <span>Save Board</span>
            </button>
            <button onClick={handleOpenStudentMode} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-md">
              <Monitor size={18} /> <span>Open in Student Mode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
