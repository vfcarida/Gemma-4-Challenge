// ============================================================================
// GemmaBridge — Local Storage Abstraction
// Type-safe persistence layer using localStorage with In-Memory Cache.
// ============================================================================

import type { StudentProfile, PECSBoard, SessionLog, SavedLesson } from './types';
import { STORAGE_KEYS, DEFAULT_STUDENTS } from './constants';
import { safeJsonParse } from './utils';

// ---- In-Memory Cache (Singleton Pattern) ----

interface CacheState {
  students: StudentProfile[] | null;
  boards: PECSBoard[] | null;
  sessions: SessionLog[] | null;
  lessons: SavedLesson[] | null;
}

const cache: CacheState = {
  students: null,
  boards: null,
  sessions: null,
  lessons: null,
};

// ---- Events ----

const notifyStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gemmabridge-storage-change'));
  }
};

// ---- Core IO ----

const readFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const data = safeJsonParse<T>(raw, fallback);
  // Basic array validation to prevent runtime crashes if storage is corrupted
  if (Array.isArray(fallback) && !Array.isArray(data)) return fallback;
  return data;
};

const writeToStorage = <T>(key: string, data: T, cacheKey: keyof CacheState): void => {
  cache[cacheKey] = data as any;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Failed to write ${key} to localStorage:`, err);
    }
  }
  notifyStorageChange();
};

// ---- Students ----

export const getStudents = (): StudentProfile[] => {
  if (cache.students !== null) return cache.students;
  if (typeof window === 'undefined') return [];

  let students = readFromStorage<StudentProfile[] | null>(STORAGE_KEYS.STUDENTS, null);
  if (!students || !Array.isArray(students)) {
    // Seed default students on first access or corruption
    students = [...DEFAULT_STUDENTS] as StudentProfile[];
    writeToStorage(STORAGE_KEYS.STUDENTS, students, 'students');
  } else {
    cache.students = students;
  }
  return cache.students;
};

export const getStudentById = (id: string): StudentProfile | undefined =>
  getStudents().find((s) => s.id === id);

export const saveStudent = (student: StudentProfile): void => {
  const students = [...getStudents()];
  const index = students.findIndex((s) => s.id === student.id);

  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }

  writeToStorage(STORAGE_KEYS.STUDENTS, students, 'students');
};

export const deleteStudent = (id: string): void => {
  const students = getStudents().filter((s) => s.id !== id);
  writeToStorage(STORAGE_KEYS.STUDENTS, students, 'students');
};

// ---- PECS Boards ----

export const getBoards = (): PECSBoard[] => {
  if (cache.boards !== null) return cache.boards;
  cache.boards = readFromStorage<PECSBoard[]>(STORAGE_KEYS.BOARDS, []);
  return cache.boards;
};

export const getBoardById = (id: string): PECSBoard | undefined =>
  getBoards().find((b) => b.id === id);

export const saveBoard = (board: PECSBoard): void => {
  const boards = [...getBoards()];
  const index = boards.findIndex((b) => b.id === board.id);

  if (index >= 0) {
    boards[index] = board;
  } else {
    boards.push(board);
  }

  writeToStorage(STORAGE_KEYS.BOARDS, boards, 'boards');
};

export const deleteBoard = (id: string): void => {
  const boards = getBoards().filter((b) => b.id !== id);
  writeToStorage(STORAGE_KEYS.BOARDS, boards, 'boards');
};

export const duplicateBoard = (id: string): PECSBoard | null => {
  const board = getBoardById(id);
  if (!board) return null;

  const copy: PECSBoard = {
    ...board,
    id: `${board.id}-copy-${Date.now()}`,
    title: `${board.title} (Copy)`,
    createdAt: new Date().toISOString(),
  };

  saveBoard(copy);
  return copy;
};

// ---- Session Logs ----

export const getSessionLogs = (): SessionLog[] => {
  if (cache.sessions !== null) return cache.sessions;
  const logs = readFromStorage<SessionLog[]>(STORAGE_KEYS.SESSIONS, []);
  cache.sessions = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return cache.sessions;
};

export const saveSessionLog = (log: SessionLog): void => {
  const logs = [...getSessionLogs()];
  logs.unshift(log);
  writeToStorage(STORAGE_KEYS.SESSIONS, logs, 'sessions');
};

export const getSessionLogsByStudent = (studentId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.studentId === studentId);

export const getSessionLogsByBoard = (boardId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.boardId === boardId);

// ---- Lessons ----

export const getLessons = (): SavedLesson[] => {
  if (cache.lessons !== null) return cache.lessons;
  cache.lessons = readFromStorage<SavedLesson[]>(STORAGE_KEYS.LESSONS, []);
  return cache.lessons;
};

export const saveLesson = (lesson: SavedLesson): void => {
  const lessons = [...getLessons()];
  const index = lessons.findIndex((l) => l.id === lesson.id);

  if (index >= 0) {
    lessons[index] = lesson;
  } else {
    lessons.push(lesson);
  }

  writeToStorage(STORAGE_KEYS.LESSONS, lessons, 'lessons');
};

export const deleteLesson = (id: string): void => {
  const lessons = getLessons().filter((l) => l.id !== id);
  writeToStorage(STORAGE_KEYS.LESSONS, lessons, 'lessons');
};

// ---- Stats ----

export const getDashboardStats = () => ({
  studentCount: getStudents().length,
  boardCount: getBoards().length,
  lessonCount: getLessons().length,
  sessionCount: getSessionLogs().length,
  recentSessions: getSessionLogs().slice(0, 5),
});

// For testing purposes
export const clearCache = () => {
  cache.students = null;
  cache.boards = null;
  cache.sessions = null;
  cache.lessons = null;
};
