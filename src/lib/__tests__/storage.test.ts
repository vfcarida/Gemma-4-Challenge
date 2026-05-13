import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStudents,
  getStudentById,
  saveStudent,
  deleteStudent,
  getBoards,
  saveBoard,
  deleteBoard,
  duplicateBoard,
  getSessionLogs,
  saveSessionLog,
  getLessons,
  saveLesson,
  deleteLesson,
  getDashboardStats,
} from '../storage';
import { STORAGE_KEYS } from '../constants';
import type { StudentProfile, PECSBoard, SessionLog, SavedLesson } from '../types';

// Mock localStorage in Node environment
const store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { 
    store[key] = value;
  },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => Object.keys(store).forEach((key) => delete store[key]),
};

beforeEach(() => {
  Object.keys(store).forEach((key) => delete store[key]);

  // Ensure window and localStorage exist in Node
  (globalThis as any).window = globalThis;
  (globalThis as any).localStorage = localStorageMock;
  (globalThis as any).dispatchEvent = vi.fn();
});

const mockStudent: StudentProfile = {
  id: 'test-student-1',
  name: 'Test Student',
  age: 7,
  avatarColor: 'bg-blue-500',
  needs: ['Test need'],
  sensoryPreferences: {
    soundSensitivity: 'moderate',
    lightSensitivity: 'low',
    touchSensitivity: 'low',
    preferredCalmingStrategies: [],
  },
  notes: 'Test notes',
  createdAt: '2026-01-01T00:00:00Z',
};

const mockBoard: PECSBoard = {
  id: 'test-board-1',
  title: 'Test Board',
  cards: [
    { id: 'c1', title: 'Card 1', icon: 'Apple', colorClass: 'bg-red-100 border-red-300 text-red-700' },
  ],
  prompt: 'test prompt',
  createdAt: '2026-01-01T00:00:00Z',
  studentId: 'test-student-1',
};

const mockSession: SessionLog = {
  id: 'test-session-1',
  boardId: 'test-board-1',
  boardTitle: 'Test Board',
  studentId: 'test-student-1',
  studentName: 'Test Student',
  selectedCardId: 'c1',
  selectedCardTitle: 'Card 1',
  timestamp: '2026-01-01T12:00:00Z',
};

const mockLesson: SavedLesson = {
  id: 'test-lesson-1',
  title: 'Test Lesson',
  prompt: 'test prompt',
  adaptations: [],
  createdAt: '2026-01-01T00:00:00Z',
  studentId: 'test-student-1',
};

describe('Student Storage', () => {
  it('seeds default students on first access', () => {
    const students = getStudents();
    expect(students.length).toBeGreaterThan(0);
    expect(students[0].name).toBeTruthy();
  });

  it('saves and retrieves a student', () => {
    saveStudent(mockStudent);
    const found = getStudentById('test-student-1');
    expect(found).toBeDefined();
    expect(found!.name).toBe('Test Student');
    expect(globalThis.dispatchEvent).toHaveBeenCalled();
  });

  it('updates an existing student', () => {
    saveStudent(mockStudent);
    saveStudent({ ...mockStudent, name: 'Updated Name' });
    const found = getStudentById('test-student-1');
    expect(found!.name).toBe('Updated Name');
  });

  it('deletes a student', () => {
    saveStudent(mockStudent);
    deleteStudent('test-student-1');
    const found = getStudentById('test-student-1');
    expect(found).toBeUndefined();
  });
});

describe('Board Storage', () => {
  it('starts with empty boards', () => {
    expect(getBoards()).toEqual([]);
  });

  it('saves and retrieves a board', () => {
    saveBoard(mockBoard);
    const boards = getBoards();
    expect(boards).toHaveLength(1);
    expect(boards[0].title).toBe('Test Board');
    expect(globalThis.dispatchEvent).toHaveBeenCalled();
  });

  it('duplicates a board', () => {
    saveBoard(mockBoard);
    const copy = duplicateBoard(mockBoard.id);
    expect(copy).not.toBeNull();
    expect(copy!.title).toContain('(Copy)');
    expect(getBoards()).toHaveLength(2);
  });

  it('deletes a board', () => {
    saveBoard(mockBoard);
    deleteBoard('test-board-1');
    expect(getBoards()).toEqual([]);
  });
});

describe('Session Log Storage', () => {
  it('starts with empty sessions', () => {
    expect(getSessionLogs()).toEqual([]);
  });

  it('saves and retrieves a session log', () => {
    saveSessionLog(mockSession);
    const logs = getSessionLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].selectedCardTitle).toBe('Card 1');
  });
});

describe('Lesson Storage', () => {
  it('starts with empty lessons', () => {
    expect(getLessons()).toEqual([]);
  });

  it('saves and retrieves a lesson', () => {
    saveLesson(mockLesson);
    const lessons = getLessons();
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe('Test Lesson');
    expect(globalThis.dispatchEvent).toHaveBeenCalled();
  });

  it('deletes a lesson', () => {
    saveLesson(mockLesson);
    deleteLesson(mockLesson.id);
    expect(getLessons()).toHaveLength(0);
  });
});

describe('Dashboard Stats', () => {
  it('returns aggregate stats', () => {
    saveBoard(mockBoard);
    saveSessionLog(mockSession);
    saveLesson(mockLesson);
    const stats = getDashboardStats();
    expect(stats.boardCount).toBe(1);
    expect(stats.sessionCount).toBe(1);
    expect(stats.lessonCount).toBe(1);
    expect(stats.studentCount).toBeGreaterThan(0);
  });
});
