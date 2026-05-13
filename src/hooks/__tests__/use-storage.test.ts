import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudents, useBoards, useDashboardStats } from '../use-storage';
import * as storage from '@/lib/storage';

// Mock storage
vi.mock('@/lib/storage', () => ({
  getStudents: vi.fn(),
  getStudentById: vi.fn(),
  saveStudent: vi.fn(),
  deleteStudent: vi.fn(),
  getBoards: vi.fn(),
  getBoardById: vi.fn(),
  saveBoard: vi.fn(),
  deleteBoard: vi.fn(),
  duplicateBoard: vi.fn(),
  getDashboardStats: vi.fn(),
}));

describe('useStorage Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useStudents returns students and storage methods', () => {
    const mockStudents = [{ id: '1', name: 'Test' }];
    (storage.getStudents as any).mockReturnValue(mockStudents);

    const { result } = renderHook(() => useStudents());

    expect(result.current.students).toEqual(mockStudents);
    expect(result.current.saveStudent).toBeDefined();
  });

  it('useDashboardStats returns stats', () => {
    const mockStats = { studentCount: 1, boardCount: 2, sessionCount: 3, recentSessions: [] };
    (storage.getDashboardStats as any).mockReturnValue(mockStats);

    const { result } = renderHook(() => useDashboardStats());

    expect(result.current).toEqual(mockStats);
  });

  it('re-renders on gemmabridge-storage-change event', () => {
    (storage.getStudents as any).mockReturnValue([]);
    const { result } = renderHook(() => useStudents());

    expect(result.current.students).toEqual([]);

    // Simulate storage change
    act(() => {
      (storage.getStudents as any).mockReturnValue([{ id: '1', name: 'New' }]);
      window.dispatchEvent(new Event('gemmabridge-storage-change'));
    });

    expect(result.current.students).toEqual([{ id: '1', name: 'New' }]);
  });
});
