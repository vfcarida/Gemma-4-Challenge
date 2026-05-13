import { describe, it, expect } from 'vitest';
import { matchPECSScenario, matchLessonScenario } from '../scenarios';

describe('matchPECSScenario()', () => {
  it('matches food-related prompt', () => {
    const result = matchPECSScenario('Maria is hungry and wants a snack');
    expect(result.category).toBe('food');
    expect(result.cards.length).toBe(4);
  });

  it('matches math-related prompt', () => {
    const result = matchPECSScenario('Student struggling with math and numbers');
    expect(result.category).toBe('academic');
  });

  it('matches emotion-related prompt', () => {
    const result = matchPECSScenario('The child is feeling very sad today');
    expect(result.category).toBe('emotions');
  });

  it('matches transition-related prompt', () => {
    const result = matchPECSScenario('Difficulty with transition to next class');
    expect(result.category).toBe('transition');
  });

  it('defaults to self-regulation for unknown prompt', () => {
    const result = matchPECSScenario('generic classroom situation without keywords');
    expect(result.category).toBe('self-regulation');
  });

  it('returns 4 cards per scenario', () => {
    const result = matchPECSScenario('any prompt');
    expect(result.cards).toHaveLength(4);
    result.cards.forEach((card) => {
      expect(card.id).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.icon).toBeTruthy();
      expect(card.colorClass).toBeTruthy();
    });
  });
});

describe('matchLessonScenario()', () => {
  it('matches reading/language prompt', () => {
    const result = matchLessonScenario('English Reading lesson for 30 minutes');
    expect(result.title).toContain('Reading');
  });

  it('matches math prompt', () => {
    const result = matchLessonScenario('Math arithmetic lesson on addition');
    expect(result.title).toContain('Math');
  });

  it('matches science prompt', () => {
    const result = matchLessonScenario('Science experiment about biology');
    expect(result.title).toContain('Science');
  });

  it('defaults to first scenario for unmatched prompt', () => {
    const result = matchLessonScenario('generic classroom xyz');
    expect(result.adaptations.length).toBeGreaterThan(0);
  });

  it('returns adaptations with priority levels', () => {
    const result = matchLessonScenario('reading lesson');
    expect(result.adaptations.length).toBeGreaterThan(0);
    result.adaptations.forEach((a) => {
      expect(['high', 'medium', 'low']).toContain(a.priority);
    });
  });
});
