'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, Check, CheckCircle, Play, Star, RotateCcw, Trophy, SlidersHorizontal, X } from 'lucide-react';
import { DynamicIcon } from '@/components/dynamic-icon';
import { getBoardById, getStudentById, saveSessionLog } from '@/lib/storage';
import { generateId, speakText, getInitials, cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { PECSBoard, StudentProfile, PECSCard } from '@/lib/types';

type SessionPhase = 'config' | 'playing' | 'feedback' | 'summary';

interface RoundResult {
  readonly round: number;
  readonly card: PECSCard;
}

/** Shuffle array using Fisher-Yates */
const shuffleCards = (cards: readonly PECSCard[]): PECSCard[] => {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function StudentModeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;

  const [board, setBoard] = useState<PECSBoard | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);

  // Session state
  const [phase, setPhase] = useState<SessionPhase>('config');
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [displayCards, setDisplayCards] = useState<PECSCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<PECSCard | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);

  // Sensory Friendly & Accessibility State
  const [sensoryFriendly, setSensoryFriendly] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [speechPitch, setSpeechPitch] = useState(1.1);
  const [isSensoryDrawerOpen, setIsSensoryDrawerOpen] = useState(false);

  useEffect(() => {
    const b = getBoardById(boardId);
    if (b) {
      setBoard(b);
      setDisplayCards(shuffleCards(b.cards));
      if (b.studentId) {
        const stud = getStudentById(b.studentId);
        if (stud) {
          setStudent(stud);
          // Set initial accessibility settings matching student's sensory profile
          if (stud.sensoryPreferences?.soundSensitivity === 'high') {
            setSpeechRate(0.70);
            setSpeechPitch(0.95);
            setSensoryFriendly(true);
          } else if (stud.sensoryPreferences?.soundSensitivity === 'moderate') {
            setSpeechRate(0.80);
          }
        }
      }
    }
  }, [boardId]);

  const studentName = student?.name ?? 'Student';

  const handleStart = useCallback(() => {
    if (!board) return;
    setPhase('playing');
    setCurrentRound(1);
    setResults([]);
    setSelectedCard(null);
    setDisplayCards(shuffleCards(board.cards));
  }, [board]);

  const handleCardTap = useCallback((card: PECSCard) => {
    if (phase !== 'playing' || !board) return;

    setSelectedCard(card);
    setPhase('feedback');
    speakText(card.title, speechRate, speechPitch);

    // Log this round
    saveSessionLog({
      id: generateId('session'),
      boardId: board.id,
      boardTitle: board.title,
      studentId: student?.id ?? 'unknown',
      studentName,
      selectedCardId: card.id,
      selectedCardTitle: card.title,
      timestamp: new Date().toISOString(),
      roundNumber: currentRound,
      totalRounds,
    });

    setResults((prev) => [...prev, { round: currentRound, card }]);

    // After 2s, advance to next round or summary
    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound((r) => r + 1);
        setSelectedCard(null);
        setDisplayCards(shuffleCards(board.cards));
        setPhase('playing');
      } else {
        setPhase('summary');
      }
    }, 2000);
  }, [phase, board, student, studentName, currentRound, totalRounds, speechRate, speechPitch]);

  const handleExit = () => router.push(ROUTES.STUDENT_MODE);

  const renderSensoryDrawer = () => {
    if (!isSensoryDrawerOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end">
        <div className="bg-white w-full max-w-sm h-full p-6 shadow-xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 text-slate-800">
                <SlidersHorizontal size={20} className="text-blue-600" />
                <h3 className="text-lg font-black">Sensory Settings</h3>
              </div>
              <button
                onClick={() => setIsSensoryDrawerOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 text-left">
              {/* Sensory Friendly Mode Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="pr-4">
                  <p className="font-bold text-slate-800 text-sm">Sensory-Friendly Mode</p>
                  <p className="text-xs text-slate-400 mt-0.5">Mutes animations and hides strong visual cues.</p>
                </div>
                <button
                  onClick={() => setSensoryFriendly(!sensoryFriendly)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none flex items-center shrink-0 cursor-pointer",
                    sensoryFriendly ? "bg-green-600" : "bg-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                      sensoryFriendly ? "translate-x-6" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* TTS Speech Rate Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Speech Speed</span>
                  <span className="text-blue-600 font-mono">{speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[10px] text-slate-400">Lower for slower, easier-to-understand voice feedback.</p>
              </div>

              {/* TTS Speech Pitch Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Speech Tone (Pitch)</span>
                  <span className="text-blue-600 font-mono">{speechPitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[10px] text-slate-400">Adjust the high or low pitch frequency of speech.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSensoryDrawerOpen(false)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer"
          >
            Save & Apply
          </button>
        </div>
      </div>
    );
  };

  if (!board) {
    return (
      <div className="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Board not found.</p>
      </div>
    );
  }

  // ── Config Screen ──
  if (phase === 'config') {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col overflow-hidden student-mode">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            {student && (
              <div className={`w-10 h-10 ${student.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}>
                {getInitials(student.name)}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-slate-800">{studentName}</h1>
              <p className="text-xs text-slate-400">{board.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSensoryDrawerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer"
            >
              <SlidersHorizontal size={16} /> <span>Sensory Settings</span>
            </button>
            <button onClick={handleExit} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer">
              <LogOut size={16} /> <span>Exit</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 shadow-lg max-w-md w-full text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Play size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Ready to Start?</h2>
              <p className="text-slate-500 mt-2">Choose how many rounds for this exercise.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block">Rounds</label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTotalRounds(n)}
                    className={cn(
                      'w-14 h-14 rounded-2xl text-xl font-black transition-all cursor-pointer',
                      totalRounds === n
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-110'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Play size={24} /> <span>Start Exercise</span>
            </button>
          </div>
        </div>

        {renderSensoryDrawer()}
      </div>
    );
  }

  // ── Summary Screen ──
  if (phase === 'summary') {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col overflow-hidden student-mode">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 shadow-lg max-w-lg w-full text-center space-y-8">
            {/* Reward */}
            <div className="relative">
              <div className={cn(
                "w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto",
                !sensoryFriendly && "reward-bounce"
              )}>
                <Trophy size={48} />
              </div>
              {!sensoryFriendly && (
                <div className="absolute -top-2 -right-4 flex space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-yellow-400 reward-star"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900">Great Job, {studentName}! 🎉</h2>
              <p className="text-slate-500 mt-2">You completed {totalRounds} {totalRounds === 1 ? 'round' : 'rounds'}!</p>
            </div>

            {/* Round Results */}
            <div className="space-y-3 text-left">
              {results.map((r) => (
                <div key={r.round} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                    R{r.round}
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.card.colorClass}`}>
                    <DynamicIcon name={r.card.icon} size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{r.card.title}</span>
                  <CheckCircle size={20} className="text-green-500 ml-auto" />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw size={18} /> <span>New Session</span>
              </button>
              <button
                onClick={handleExit}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut size={18} /> <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing / Feedback ──
  return (
    <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col overflow-hidden student-mode">
      {/* Header with round indicator */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {student && (
            <div className={`w-10 h-10 ${student.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}>
              {getInitials(student.name)}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800">{studentName}</h1>
            <p className="text-xs text-slate-400">{board.title}</p>
          </div>
        </div>

        {/* Round Progress */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalRounds }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-4 h-4 rounded-full transition-all',
                  sensoryFriendly ? (
                    i < currentRound - 1 ? 'bg-green-500' :
                    i === currentRound - 1 ? 'bg-blue-500 border-2 border-blue-600' :
                    'bg-slate-200'
                  ) : (
                    i < currentRound - 1 ? 'bg-green-500' :
                    i === currentRound - 1 ? 'bg-blue-500 ring-4 ring-blue-200' :
                    'bg-slate-200'
                  )
                )}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-500">
            {currentRound}/{totalRounds}
          </span>
          <button
            onClick={() => setIsSensoryDrawerOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer"
          >
            <SlidersHorizontal size={16} /> <span>Sensory Settings</span>
          </button>
          <button onClick={handleExit} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer">
            <LogOut size={16} /> <span>Exit</span>
          </button>
        </div>
      </div>

      {/* PECS Grid */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
          {displayCards.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card)}
                disabled={phase === 'feedback'}
                className={cn(
                  'flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl border-4 shadow-lg transition-all aspect-square cursor-pointer',
                  card.colorClass,
                  sensoryFriendly ? (
                    isSelected && 'border-green-600 bg-green-50/50'
                  ) : (
                    isSelected && 'ring-4 ring-green-400 border-green-500 scale-105'
                  ),
                  phase === 'playing' && (!sensoryFriendly && 'hover:shadow-xl active:scale-95'),
                  phase === 'feedback' && !isSelected && 'opacity-30',
                )}
              >
                <div className="mb-4 relative">
                  <DynamicIcon name={card.icon} size={80} strokeWidth={1.8} />
                  {isSelected && (
                    <div className={cn(
                      "absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center",
                      !sensoryFriendly && "animate-bounce"
                    )}>
                      <Check className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <span className="text-2xl sm:text-3xl font-black text-center leading-tight">
                  {card.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Overlay */}
      {phase === 'feedback' && selectedCard && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white py-6 px-8 flex items-center justify-center space-x-4">
          <CheckCircle size={32} />
          <div>
            <p className="text-xl font-bold">{studentName} chose:</p>
            <p className="text-2xl font-black">{selectedCard.title}</p>
          </div>
          <div className="ml-4 text-green-200 font-bold text-sm">
            Round {currentRound} of {totalRounds}
          </div>
        </div>
      )}

      {renderSensoryDrawer()}
    </div>
  );
}
