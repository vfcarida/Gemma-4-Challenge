// ============================================================================
// GemmaBridge — Local Storage Abstraction
// Type-safe persistence layer using localStorage.
// ============================================================================

import type { StudentProfile, PECSBoard, SessionLog } from './types';
import { STORAGE_KEYS, DEFAULT_STUDENTS } from './constants';
import { safeJsonParse } from './utils';

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
};

/** Deletes a student profile by ID. */
export const deleteStudent = (id: string): void => {
  const students = getStudents().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
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
};

/** Deletes a PECS board by ID. */
export const deleteBoard = (id: string): void => {
  const boards = getBoards().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
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
};

/** Gets session logs filtered by student ID. */
export const getSessionLogsByStudent = (studentId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.studentId === studentId);

/** Gets session logs filtered by board ID. */
export const getSessionLogsByBoard = (boardId: string): SessionLog[] =>
  getSessionLogs().filter((log) => log.boardId === boardId);

// ---- Stats ----

/** Returns aggregate stats for the dashboard. */
export const getDashboardStats = () => ({
  studentCount: getStudents().length,
  boardCount: getBoards().length,
  sessionCount: getSessionLogs().length,
  recentSessions: getSessionLogs().slice(0, 5),
});
