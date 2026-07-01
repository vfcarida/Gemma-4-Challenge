// ============================================================================
// GemmaBridge — Open Board Format (OBF) Serialization / Deserialization
// Implementation of OBF standard for assistive AAC communication boards.
// ============================================================================

import type { PECSBoard, PECSCard, PECSCategory } from './types';
import { generateId } from './utils';

/**
 * Translates a PECSBoard into the standard Open Board Format (JSON).
 */
export const exportToOBF = (board: PECSBoard): Record<string, any> => {
  const columns = Math.ceil(board.cards.length / 2) || 1;
  const rows = 2;

  const buttons = board.cards.map((card) => ({
    id: card.id,
    label: card.title,
    vocalization: card.title,
    ext_gemmabridge_icon: card.icon,
    ext_gemmabridge_colorClass: card.colorClass,
    ext_gemmabridge_category: card.category,
  }));

  return {
    format: 'open-board-0.1',
    id: board.id,
    name: board.title,
    locale: 'en-US',
    grid: {
      rows,
      columns,
    },
    buttons,
    ext_gemmabridge_prompt: board.prompt,
    ext_gemmabridge_studentId: board.studentId,
  };
};

/**
 * Parses and validates an OBF JSON object into a valid PECSBoard.
 * Fallbacks are provided for missing or malformed keys.
 */
export const importFromOBF = (obf: any): PECSBoard => {
  if (typeof obf !== 'object' || obf === null) {
    throw new Error('Invalid OBF document: input must be a JSON object.');
  }

  const boardId = typeof obf.id === 'string' && obf.id ? obf.id : generateId('board');
  const title = typeof obf.name === 'string' && obf.name ? obf.name : 'Imported Board';
  const prompt = typeof obf.ext_gemmabridge_prompt === 'string' ? obf.ext_gemmabridge_prompt : '';
  const studentId = typeof obf.ext_gemmabridge_studentId === 'string' ? obf.ext_gemmabridge_studentId : undefined;

  const rawButtons = Array.isArray(obf.buttons) ? obf.buttons : [];
  const cards: PECSCard[] = rawButtons.map((btn: any, idx: number) => {
    const id = typeof btn.id === 'string' && btn.id ? btn.id : `card-${idx}-${Math.random().toString(36).substring(2, 5)}`;
    const cardTitle = typeof btn.label === 'string' && btn.label ? btn.label : (typeof btn.vocalization === 'string' && btn.vocalization ? btn.vocalization : `Card ${idx + 1}`);
    const icon = typeof btn.ext_gemmabridge_icon === 'string' ? btn.ext_gemmabridge_icon : 'HelpCircle';
    const colorClass = typeof btn.ext_gemmabridge_colorClass === 'string' ? btn.ext_gemmabridge_colorClass : 'bg-slate-100 border-slate-300 text-slate-700';
    const category = (typeof btn.ext_gemmabridge_category === 'string' ? btn.ext_gemmabridge_category : 'request') as PECSCategory;

    return {
      id,
      title: cardTitle,
      icon,
      colorClass,
      category,
    };
  });

  return {
    id: boardId,
    title,
    cards,
    prompt,
    createdAt: new Date().toISOString(),
    studentId,
  };
};
