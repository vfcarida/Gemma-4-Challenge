import { describe, it, expect } from 'vitest';
import { cn, generateId, formatDate, formatRelativeTime, getInitials, safeJsonParse } from '../utils';

describe('cn()', () => {
  it('joins valid class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});

describe('generateId()', () => {
  it('generates unique IDs with prefix', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    expect(id1).toMatch(/^test-/);
    expect(id1).not.toBe(id2);
  });

  it('uses default prefix when none provided', () => {
    expect(generateId()).toMatch(/^id-/);
  });
});

describe('formatDate()', () => {
  it('formats ISO string to readable date', () => {
    const result = formatDate('2026-01-15T10:00:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });
});

describe('formatRelativeTime()', () => {
  it('returns "just now" for recent timestamps', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('just now');
  });
});

describe('getInitials()', () => {
  it('extracts initials from full name', () => {
    expect(getInitials('Lucas Silva')).toBe('LS');
  });

  it('handles single name', () => {
    expect(getInitials('Maria')).toBe('M');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('Ana Beatriz Costa')).toBe('AB');
  });
});

describe('safeJsonParse()', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('returns fallback for invalid JSON', () => {
    expect(safeJsonParse('invalid', [])).toEqual([]);
  });
});
