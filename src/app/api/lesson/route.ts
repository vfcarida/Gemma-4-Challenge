// ============================================================================
// GemmaBridge — Lesson Adaptation API Route
// Simulates Gemma 4 E2B lesson analysis with scenario matching.
// ============================================================================

import { NextResponse } from 'next/server';
import { matchLessonScenario } from '@/lib/scenarios';
import type { GenerateLessonRequest, GenerateLessonResponse } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateLessonRequest;
    const { prompt } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lesson plan is required' } satisfies GenerateLessonResponse,
        { status: 400 },
      );
    }

    // Simulate Gemma 4 local processing delay (1.5–2.5s)
    const delay = 1500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Match scenario using keyword scoring
    const scenario = matchLessonScenario(prompt);

    return NextResponse.json({
      success: true,
      lessonTitle: scenario.title,
      adaptations: [...scenario.adaptations],
    } satisfies GenerateLessonResponse);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate lesson adaptations' } satisfies GenerateLessonResponse,
      { status: 500 },
    );
  }
}
