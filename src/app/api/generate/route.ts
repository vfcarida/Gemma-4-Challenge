// ============================================================================
// GemmaBridge — PECS Generation API Route
// Simulates Gemma 4 E2B local inference with rich scenario matching.
// ============================================================================

import { NextResponse } from 'next/server';
import { matchPECSScenario } from '@/lib/scenarios';
import { generateId } from '@/lib/utils';
import type { GeneratePECSRequest, GeneratePECSResponse, PECSBoard } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GeneratePECSRequest;
    const { prompt, studentId } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' } satisfies GeneratePECSResponse,
        { status: 400 },
      );
    }

    // Simulate Gemma 4 local processing delay (1.5–2.5s)
    const delay = 1500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Match scenario using keyword scoring
    const scenario = matchPECSScenario(prompt);

    const board: PECSBoard = {
      id: generateId('board'),
      title: scenario.title,
      cards: [...scenario.cards],
      prompt,
      createdAt: new Date().toISOString(),
      studentId,
    };

    return NextResponse.json({ success: true, board } satisfies GeneratePECSResponse);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate PECS board' } satisfies GeneratePECSResponse,
      { status: 500 },
    );
  }
}
