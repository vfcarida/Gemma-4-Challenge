// ============================================================================
// GemmaBridge — Application Constants
// ============================================================================

import type { StudentProfile, PECSCategory } from './types';

/** Navigation route definitions. */
export const ROUTES = {
  DASHBOARD: '/',
  PECS: '/pecs',
  LESSONS: '/lessons',
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students/${id}` as const,
  STUDENT_MODE: '/student-mode',
  STUDENT_MODE_BOARD: (boardId: string) => `/student-mode/${boardId}` as const,
  HISTORY: '/history',
} as const;

/** Navigation items for the sidebar. */
export const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Smart PECS', href: ROUTES.PECS, icon: 'Layout' },
  { label: 'Lesson Adaptor', href: ROUTES.LESSONS, icon: 'BookText' },
  { label: 'Students', href: ROUTES.STUDENTS, icon: 'Users' },
  { label: 'Student Mode', href: ROUTES.STUDENT_MODE, icon: 'Monitor' },
  { label: 'History', href: ROUTES.HISTORY, icon: 'Clock' },
] as const;

/** Color palettes for PECS card categories. */
export const CATEGORY_COLORS: Record<PECSCategory, string> = {
  'self-regulation': 'bg-blue-100 border-blue-300 text-blue-700',
  'food': 'bg-orange-100 border-orange-300 text-orange-700',
  'academic': 'bg-indigo-100 border-indigo-300 text-indigo-700',
  'social': 'bg-pink-100 border-pink-300 text-pink-700',
  'emotions': 'bg-yellow-100 border-yellow-300 text-yellow-700',
  'daily-routine': 'bg-green-100 border-green-300 text-green-700',
  'transition': 'bg-purple-100 border-purple-300 text-purple-700',
  'request': 'bg-teal-100 border-teal-300 text-teal-700',
};

/** Avatar color options for student profiles. */
export const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
] as const;

/** Pre-seeded student profiles for demo. */
export const DEFAULT_STUDENTS: readonly StudentProfile[] = [
  {
    id: 'student-lucas',
    name: 'Lucas',
    age: 7,
    avatarColor: 'bg-blue-500',
    needs: ['Sensory regulation', 'Noise sensitivity', 'Transition support'],
    sensoryPreferences: {
      soundSensitivity: 'high',
      lightSensitivity: 'moderate',
      touchSensitivity: 'low',
      preferredCalmingStrategies: ['Noise-canceling headphones', 'Drawing', 'Quiet corner'],
    },
    notes: 'Lucas responds well to visual schedules and needs advance warning before transitions.',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'student-maria',
    name: 'Maria',
    age: 6,
    avatarColor: 'bg-pink-500',
    needs: ['Communication support', 'Food preferences', 'Social interaction'],
    sensoryPreferences: {
      soundSensitivity: 'moderate',
      lightSensitivity: 'low',
      touchSensitivity: 'high',
      preferredCalmingStrategies: ['Fidget toys', 'Music', 'Weighted blanket'],
    },
    notes: 'Maria is non-verbal and communicates primarily through PECS cards. She loves music.',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'student-pedro',
    name: 'Pedro',
    age: 8,
    avatarColor: 'bg-green-500',
    needs: ['Academic adaptation', 'Routine structure', 'Emotional regulation'],
    sensoryPreferences: {
      soundSensitivity: 'moderate',
      lightSensitivity: 'high',
      touchSensitivity: 'moderate',
      preferredCalmingStrategies: ['Deep breathing', 'Counting', 'Stretching'],
    },
    notes: 'Pedro excels at math but struggles with reading. Benefits from visual aids and structured routines.',
    createdAt: '2026-03-05T10:00:00Z',
  },
] as const;

/** localStorage keys. */
export const STORAGE_KEYS = {
  STUDENTS: 'gemmabridge-students',
  BOARDS: 'gemmabridge-boards',
  SESSIONS: 'gemmabridge-sessions',
} as const;
