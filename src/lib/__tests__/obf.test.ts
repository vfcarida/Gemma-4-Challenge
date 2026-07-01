import { describe, it, expect } from 'vitest';
import { exportToOBF, importFromOBF } from '../obf';
import type { PECSBoard } from '../types';

const mockBoard: PECSBoard = {
  id: 'test-board-id',
  title: 'Test Board',
  prompt: 'test prompt',
  createdAt: '2026-01-01T00:00:00Z',
  studentId: 'test-student-id',
  cards: [
    { id: 'c1', title: 'Yes', icon: 'Check', colorClass: 'bg-green-100', category: 'social' },
    { id: 'c2', title: 'No', icon: 'X', colorClass: 'bg-red-100', category: 'social' },
  ],
};

describe('OBF Serialization & Deserialization', () => {
  it('correctly exports PECSBoard to standard OBF JSON', () => {
    const obf = exportToOBF(mockBoard);

    expect(obf.format).toBe('open-board-0.1');
    expect(obf.id).toBe(mockBoard.id);
    expect(obf.name).toBe(mockBoard.title);
    expect(obf.locale).toBe('en-US');
    expect(obf.grid).toEqual({ rows: 2, columns: 1 });
    expect(obf.buttons).toHaveLength(2);
    expect(obf.buttons[0].id).toBe('c1');
    expect(obf.buttons[0].label).toBe('Yes');
    expect(obf.buttons[0].ext_gemmabridge_icon).toBe('Check');
  });

  it('correctly imports OBF JSON into a PECSBoard', () => {
    const obf = {
      format: 'open-board-0.1',
      id: 'custom-obf-id',
      name: 'Custom Board Name',
      buttons: [
        {
          id: 'btn-1',
          label: 'Apple',
          vocalization: 'Eat Apple',
          ext_gemmabridge_icon: 'Apple',
          ext_gemmabridge_colorClass: 'bg-red-100 border-red-300 text-red-700',
          ext_gemmabridge_category: 'food',
        },
      ],
      ext_gemmabridge_prompt: 'Generate food',
      ext_gemmabridge_studentId: 'stud-id',
    };

    const board = importFromOBF(obf);

    expect(board.id).toBe('custom-obf-id');
    expect(board.title).toBe('Custom Board Name');
    expect(board.prompt).toBe('Generate food');
    expect(board.studentId).toBe('stud-id');
    expect(board.cards).toHaveLength(1);
    expect(board.cards[0].id).toBe('btn-1');
    expect(board.cards[0].title).toBe('Apple');
    expect(board.cards[0].icon).toBe('Apple');
    expect(board.cards[0].category).toBe('food');
  });

  it('provides safe fallbacks for missing/corrupted fields on import', () => {
    const corruptedObf = {
      format: 'open-board-0.1',
      // id and name are missing
      buttons: [
        {
          // id, icon, colorClass, category are missing
          label: 'Apple',
        },
      ],
    };

    const board = importFromOBF(corruptedObf);

    expect(board.id).toContain('board-');
    expect(board.title).toBe('Imported Board');
    expect(board.cards).toHaveLength(1);
    expect(board.cards[0].id).toContain('card-');
    expect(board.cards[0].title).toBe('Apple');
    expect(board.cards[0].icon).toBe('HelpCircle');
    expect(board.cards[0].colorClass).toBe('bg-slate-100 border-slate-300 text-slate-700');
    expect(board.cards[0].category).toBe('request');
  });

  it('throws an error if input is not an object', () => {
    expect(() => importFromOBF(null)).toThrow('Invalid OBF document');
    expect(() => importFromOBF(123)).toThrow('Invalid OBF document');
    expect(() => importFromOBF('string')).toThrow('Invalid OBF document');
  });
});
