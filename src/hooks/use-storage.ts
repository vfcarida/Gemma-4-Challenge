'use client';

import { useState, useEffect, useCallback } from 'react';
import * as storage from '@/lib/storage';
import type { StudentProfile, PECSBoard, SessionLog, SavedLesson } from '@/lib/types';

/** Custom hook that re-renders whenever storage changes. */
const useStorageListener = () => {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => setVersion((v) => v + 1);
    window.addEventListener('gemmabridge-storage-change', handleStorageChange);
    return () => window.removeEventListener('gemmabridge-storage-change', handleStorageChange);
  }, []);

  return version;
};

/** Hook for managing student profiles. */
export const useStudents = () => {
  useStorageListener();
  const [students, setStudents] = useState<StudentProfile[]>([]);

  const refresh = useCallback(() => {
    setStudents(storage.getStudents());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    students,
    getStudentById: storage.getStudentById,
    saveStudent: storage.saveStudent,
    deleteStudent: storage.deleteStudent,
    refresh,
  };
};

/** Hook for managing PECS boards. */
export const useBoards = () => {
  useStorageListener();
  const [boards, setBoards] = useState<PECSBoard[]>([]);

  const refresh = useCallback(() => {
    setBoards(storage.getBoards());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    boards,
    getBoardById: storage.getBoardById,
    saveBoard: storage.saveBoard,
    deleteBoard: storage.deleteBoard,
    duplicateBoard: storage.duplicateBoard,
    refresh,
  };
};

/** Hook for managing session logs. */
export const useSessionLogs = () => {
  useStorageListener();
  const [sessions, setSessions] = useState<SessionLog[]>([]);

  const refresh = useCallback(() => {
    setSessions(storage.getSessionLogs());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    sessions,
    saveSessionLog: storage.saveSessionLog,
    getSessionLogsByStudent: storage.getSessionLogsByStudent,
    getSessionLogsByBoard: storage.getSessionLogsByBoard,
    refresh,
  };
};

/** Hook for dashboard statistics. */
export const useDashboardStats = () => {
  useStorageListener();
  const [stats, setStats] = useState(() => ({
    studentCount: 0,
    boardCount: 0,
    lessonCount: 0,
    sessionCount: 0,
    recentSessions: [] as SessionLog[],
  }));

  useEffect(() => {
    setStats(storage.getDashboardStats());
  }, []);

  return stats;
};

/** Hook for managing saved lessons. */
export const useLessons = () => {
  useStorageListener();
  const [lessons, setLessons] = useState<SavedLesson[]>([]);

  const refresh = useCallback(() => {
    setLessons(storage.getLessons());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    lessons,
    saveLesson: storage.saveLesson,
    deleteLesson: storage.deleteLesson,
    refresh,
  };
};
