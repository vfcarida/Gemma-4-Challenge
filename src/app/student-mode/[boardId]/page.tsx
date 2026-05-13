'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, Check, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/dynamic-icon';
import { getBoardById, getStudentById, saveSessionLog } from '@/lib/storage';
import { generateId, speakText, getInitials, cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { PECSBoard, StudentProfile, PECSCard } from '@/lib/types';

export default function StudentModeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;

  const [board, setBoard] = useState<PECSBoard | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [selectedCard, setSelectedCard] = useState<PECSCard | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const b = getBoardById(boardId);
    if (b) {
      setBoard(b);
      if (b.studentId) {
        setStudent(getStudentById(b.studentId) ?? null);
      }
    }
  }, [boardId]);

  const handleCardTap = useCallback((card: PECSCard) => {
    if (showConfirmation) return;

    setSelectedCard(card);
    setShowConfirmation(true);

    // Speak the card title aloud
    speakText(card.title);

    // Log the session
    if (board) {
      saveSessionLog({
        id: generateId('session'),
        boardId: board.id,
        boardTitle: board.title,
        studentId: student?.id ?? 'unknown',
        studentName: student?.name ?? 'Student',
        selectedCardId: card.id,
        selectedCardTitle: card.title,
        timestamp: new Date().toISOString(),
      });
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedCard(null);
    }, 3000);
  }, [board, student, showConfirmation]);

  const handleExit = () => {
    router.push(ROUTES.STUDENT_MODE);
  };

  if (!board) {
    return (
      <div className="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Board not found.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col overflow-hidden student-mode">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {student && (
            <div className={`w-10 h-10 ${student.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}>
              {getInitials(student.name)}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800">{student?.name ?? 'Student'}</h1>
            <p className="text-xs text-slate-400">{board.title}</p>
          </div>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
        >
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>

      {/* PECS Grid — Full screen */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
          {board.cards.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card)}
                disabled={showConfirmation}
                className={cn(
                  'flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl border-4 shadow-lg transition-all aspect-square',
                  card.colorClass,
                  isSelected && 'ring-4 ring-green-400 border-green-500 scale-105',
                  !showConfirmation && 'hover:shadow-xl active:scale-95',
                  showConfirmation && !isSelected && 'opacity-30',
                )}
              >
                <div className="mb-4 relative">
                  <DynamicIcon name={card.icon} size={80} strokeWidth={1.8} />
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
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

      {/* Confirmation Overlay */}
      {showConfirmation && selectedCard && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white py-6 px-8 flex items-center justify-center space-x-4 animate-in slide-in-from-bottom duration-300">
          <CheckCircle size={32} />
          <div>
            <p className="text-xl font-bold">{student?.name ?? 'Student'} chose:</p>
            <p className="text-2xl font-black">{selectedCard.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
