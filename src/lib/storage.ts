// ============================================================================
// GemmaBridge — Local Storage Abstraction
// Type-safe persistence layer using localStorage.
// ============================================================================

import type { StudentProfile, PECSBoard, SessionLog } from './types';
import { STORAGE_KEYS, DEFAULT_STUDENTS } from './constants';
import { safeJsonParse } from './utils';

// ---- Events ----

const notifyStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gemmabridge-storage-change'));
  }
};

// ---- Students ----

/** Retrieves all student profiles. Seeds defaults on first call. */
export const getStudents = (): StudentProfile[] => {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (raw === null) {
    // Seed default students on first access
    const defaults = [...DEFAULT_STUDENTS] as StudentProfile[];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaults));
    return defaults;
  }
  return safeJsonParse<StudentProfile[]>(raw, []);
};

/** Retrieves a single student by ID. */
export const getStudentById = (id: string): StudentProfile | undefined =>
  getStudents().find((s) => s.id === id);

/** Saves or updates a student profile. */
export const saveStudent = (student: StudentProfile): void => {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === student.id);

  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  notifyStorageChange();
};

/** Deletes a student profile by ID. */
export const deleteStudent = (id: string): void => {
  const students = getStudents().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  notifyStorageChange();
};

// ---- PECS Boards ----

/** Retrieves all saved PECS boards. */
export const getBoards = (): PECSBoard[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.BOARDS);
  return raw ? safeJsonParse<PECSBoard[]>(raw, []) : [];
};

/** Retrieves a single board by ID. */
export const getBoardById = (id: string): PECSBoard | undefined =>
  getBoards().find((b) => b.id === id);

/** Saves a new PECS board. */
export const saveBoard = (board: PECSBoard): void => {
  const boards = getBoards();
  const index = boards.findIndex((b) => b.id === board.id);

  if (index >= 0) {
    boards[index] = board;
  } else {
    boards.push(board);
  }

  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  notifyStorageChange();
};

/** Deletes a PECS board by ID. */
export const deleteBoard = (id: string): void => {
  const boards = getBoards().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  notifyStorageChange();
};

/** Duplicates a PECS board with a new ID and title suffix. */
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
  // saveBoard already calls notifyStorageChange
  return copy;
};

// ---- Session Logs ----

/** Retrieves all session logs, sorted newest first. */
export const getSessionLogs = (): SessionLog[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  const logs = raw ? safeJsonParse<SessionLog[]>(raw, []) : [];
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/** Saves a new session log entry. */
export const saveSessionLog = (log: SessionLog): void => {
  const logs = getSessionLogs();
  logs.unshift(log);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(logs));
  notifyStorageChange();
};

/** Gets session logs filtered by student ID. */
export const getSessionLogsByStudent = (studentId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.studentId === studentId);

/** Gets session logs filtered by board ID. */
export const getSessionLogsByBoard = (boardId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.boardId === boardId);

// ---- Lessons ----

/** Retrieves all saved lessons. */
export const getLessons = (): SavedLesson[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
  return raw ? safeJsonParse<SavedLesson[]>(raw, []) : [];
};

/** Saves a new lesson adaptation. */
export const saveLesson = (lesson: SavedLesson): void => {
  const lessons = getLessons();
  const index = lessons.findIndex((l) => l.id === lesson.id);

  if (index >= 0) {
    lessons[index] = lesson;
  } else {
    lessons.push(lesson);
  }

  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  notifyStorageChange();
};

/** Deletes a lesson by ID. */
export const deleteLesson = (id: string): void => {
  const lessons = getLessons().filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  notifyStorageChange();
};

// ---- Stats ----

/** Returns aggregate stats for the dashboard. */
export const getDashboardStats = () => ({
  studentCount: getStudents().length,
  boardCount: getBoards().length,
  lessonCount: getLessons().length,
  sessionCount: getSessionLogs().length,
  recentSessions: getSessionLogs().slice(0, 5),
});
