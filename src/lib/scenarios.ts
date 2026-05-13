// ============================================================================
// GemmaBridge — Scenario Database
// Rich mock scenarios simulating Gemma 4 E2B context-aware responses.
// ============================================================================

import type { PECSCard, LessonAdaptation, PECSCategory } from './types';

interface PECSScenario {
  readonly keywords: readonly string[];
  readonly title: string;
  readonly category: PECSCategory;
  readonly cards: readonly PECSCard[];
}

interface LessonScenario {
  readonly keywords: readonly string[];
  readonly title: string;
  readonly adaptations: readonly LessonAdaptation[];
}

// ============================================================================
// PECS Scenarios (~8 diverse classroom situations)
// ============================================================================

export const PECS_SCENARIOS: readonly PECSScenario[] = [
  {
    keywords: ['overwhelm', 'bell', 'loud', 'noise', 'recess', 'regulation', 'calm', 'sensory'],
    title: 'Self-Regulation Board',
    category: 'self-regulation',
    cards: [
      { id: 'sr-1', title: 'Noise-canceling headphones', icon: 'Headphones', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'self-regulation' },
      { id: 'sr-2', title: 'Go to the Quiet Room', icon: 'DoorOpen', colorClass: 'bg-green-100 border-green-300 text-green-700', category: 'self-regulation' },
      { id: 'sr-3', title: 'Play with blocks', icon: 'Blocks', colorClass: 'bg-purple-100 border-purple-300 text-purple-700', category: 'self-regulation' },
      { id: 'sr-4', title: 'Draw a picture', icon: 'Palette', colorClass: 'bg-orange-100 border-orange-300 text-orange-700', category: 'self-regulation' },
    ],
  },
  {
    keywords: ['hungry', 'food', 'eat', 'snack', 'lunch', 'drink', 'thirsty'],
    title: 'Food & Drink Board',
    category: 'food',
    cards: [
      { id: 'fd-1', title: 'Apple', icon: 'Apple', colorClass: 'bg-red-100 border-red-300 text-red-700', category: 'food' },
      { id: 'fd-2', title: 'Water Bottle', icon: 'CupSoda', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'food' },
      { id: 'fd-3', title: 'Cracker', icon: 'Cookie', colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-700', category: 'food' },
      { id: 'fd-4', title: 'I am finished', icon: 'CheckCircle', colorClass: 'bg-green-100 border-green-300 text-green-700', category: 'food' },
    ],
  },
  {
    keywords: ['math', 'number', 'count', 'calculator', 'addition', 'subtract'],
    title: 'Math Support Board',
    category: 'academic',
    cards: [
      { id: 'mt-1', title: 'Use Calculator', icon: 'Calculator', colorClass: 'bg-slate-100 border-slate-300 text-slate-700', category: 'academic' },
      { id: 'mt-2', title: 'Count with fingers', icon: 'Hand', colorClass: 'bg-orange-100 border-orange-300 text-orange-700', category: 'academic' },
      { id: 'mt-3', title: 'Draw numbers', icon: 'Pencil', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'academic' },
      { id: 'mt-4', title: 'I need help', icon: 'HelpCircle', colorClass: 'bg-purple-100 border-purple-300 text-purple-700', category: 'academic' },
    ],
  },
  {
    keywords: ['transition', 'change', 'next class', 'moving', 'switch', 'new activity'],
    title: 'Transition Support Board',
    category: 'transition',
    cards: [
      { id: 'tr-1', title: 'See schedule', icon: 'CalendarDays', colorClass: 'bg-indigo-100 border-indigo-300 text-indigo-700', category: 'transition' },
      { id: 'tr-2', title: '5-minute warning', icon: 'Timer', colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-700', category: 'transition' },
      { id: 'tr-3', title: 'Take a deep breath', icon: 'Wind', colorClass: 'bg-teal-100 border-teal-300 text-teal-700', category: 'transition' },
      { id: 'tr-4', title: 'Walk with a friend', icon: 'UsersRound', colorClass: 'bg-pink-100 border-pink-300 text-pink-700', category: 'transition' },
    ],
  },
  {
    keywords: ['bathroom', 'toilet', 'restroom', 'wash', 'hands'],
    title: 'Daily Routine Board',
    category: 'daily-routine',
    cards: [
      { id: 'dr-1', title: 'Go to bathroom', icon: 'Bath', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'daily-routine' },
      { id: 'dr-2', title: 'Wash hands', icon: 'Droplets', colorClass: 'bg-cyan-100 border-cyan-300 text-cyan-700', category: 'daily-routine' },
      { id: 'dr-3', title: 'Get tissue', icon: 'Flower2', colorClass: 'bg-green-100 border-green-300 text-green-700', category: 'daily-routine' },
      { id: 'dr-4', title: 'I am done', icon: 'ThumbsUp', colorClass: 'bg-purple-100 border-purple-300 text-purple-700', category: 'daily-routine' },
    ],
  },
  {
    keywords: ['sad', 'angry', 'happy', 'feeling', 'emotion', 'cry', 'frustrated', 'scared'],
    title: 'Emotions Board',
    category: 'emotions',
    cards: [
      { id: 'em-1', title: 'I feel happy', icon: 'Smile', colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-700', category: 'emotions' },
      { id: 'em-2', title: 'I feel sad', icon: 'Frown', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'emotions' },
      { id: 'em-3', title: 'I feel angry', icon: 'Angry', colorClass: 'bg-red-100 border-red-300 text-red-700', category: 'emotions' },
      { id: 'em-4', title: 'I feel scared', icon: 'ShieldAlert', colorClass: 'bg-purple-100 border-purple-300 text-purple-700', category: 'emotions' },
    ],
  },
  {
    keywords: ['play', 'friend', 'share', 'together', 'social', 'playground', 'recess game'],
    title: 'Social Interaction Board',
    category: 'social',
    cards: [
      { id: 'so-1', title: 'Play together', icon: 'UsersRound', colorClass: 'bg-pink-100 border-pink-300 text-pink-700', category: 'social' },
      { id: 'so-2', title: 'My turn', icon: 'HandMetal', colorClass: 'bg-orange-100 border-orange-300 text-orange-700', category: 'social' },
      { id: 'so-3', title: 'I want to share', icon: 'Heart', colorClass: 'bg-red-100 border-red-300 text-red-700', category: 'social' },
      { id: 'so-4', title: 'I want alone time', icon: 'UserX', colorClass: 'bg-slate-100 border-slate-300 text-slate-700', category: 'social' },
    ],
  },
  {
    keywords: ['want', 'need', 'please', 'give', 'more', 'help', 'request'],
    title: 'Basic Requests Board',
    category: 'request',
    cards: [
      { id: 'rq-1', title: 'I want more', icon: 'Plus', colorClass: 'bg-green-100 border-green-300 text-green-700', category: 'request' },
      { id: 'rq-2', title: 'Help me please', icon: 'Handshake', colorClass: 'bg-blue-100 border-blue-300 text-blue-700', category: 'request' },
      { id: 'rq-3', title: 'All done', icon: 'CircleCheckBig', colorClass: 'bg-teal-100 border-teal-300 text-teal-700', category: 'request' },
      { id: 'rq-4', title: 'Wait please', icon: 'Pause', colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-700', category: 'request' },
    ],
  },
];

// ============================================================================
// Lesson Adaptation Scenarios (~5 subjects)
// ============================================================================

export const LESSON_SCENARIOS: readonly LessonScenario[] = [
  {
    keywords: ['reading', 'english', 'language', 'literacy', 'book', 'text', 'story'],
    title: 'Reading/Language Arts Adaptations',
    adaptations: [
      { title: 'Break Down Instructions', description: 'Divide the reading block into 10-minute segments with 2-minute "stretching" transitions between each.', priority: 'high', icon: 'ListChecks' },
      { title: 'Visual Schedule', description: 'Provide a printed checklist of lesson steps (Read → Discuss → Write → Draw) to reduce transition anxiety.', priority: 'high', icon: 'CalendarDays' },
      { title: 'Quiet Reading Zone', description: 'Designate a "Quiet Corner" with noise-reducing headphones for students who become overstimulated during group discussion.', priority: 'medium', icon: 'Volume' },
      { title: 'Choice Board for Responses', description: 'Instead of requiring verbal answers, offer a PECS-style response board (thumbs up, confused, need help).', priority: 'medium', icon: 'Layout' },
    ],
  },
  {
    keywords: ['math', 'number', 'arithmetic', 'geometry', 'calcul'],
    title: 'Mathematics Adaptations',
    adaptations: [
      { title: 'Manipulative First', description: 'Introduce concepts with physical manipulatives (blocks, counters) before transitioning to abstract notation.', priority: 'high', icon: 'Blocks' },
      { title: 'Reduced Problem Sets', description: 'Cut the worksheet to 5 key problems instead of 20. Quality of understanding over quantity.', priority: 'high', icon: 'Scissors' },
      { title: 'Visual Number Line', description: 'Place a large, colorful number line on the student\'s desk for reference during addition and subtraction.', priority: 'medium', icon: 'Ruler' },
      { title: 'Movement Breaks', description: 'After every 10 minutes of seated math work, allow a 2-minute standing/stretching break.', priority: 'medium', icon: 'PersonStanding' },
    ],
  },
  {
    keywords: ['science', 'experiment', 'nature', 'biology', 'lab'],
    title: 'Science Adaptations',
    adaptations: [
      { title: 'Sensory Warning Cards', description: 'Before any experiment, show a card indicating what senses will be engaged (loud sounds, bright light, strong smells).', priority: 'high', icon: 'AlertTriangle' },
      { title: 'Step-by-Step Visual Guide', description: 'Provide a visual flowchart of the experiment steps with pictures instead of paragraphs of text.', priority: 'high', icon: 'GitBranch' },
      { title: 'Partner System', description: 'Pair the ASD student with a calm, empathetic buddy for group experiments.', priority: 'medium', icon: 'UsersRound' },
      { title: 'Alternative Recording', description: 'Allow students to draw observations or use a pre-made template instead of writing full sentences.', priority: 'low', icon: 'Pencil' },
    ],
  },
  {
    keywords: ['art', 'draw', 'paint', 'creative', 'craft', 'color'],
    title: 'Art Class Adaptations',
    adaptations: [
      { title: 'Texture Options', description: 'Offer multiple material choices (crayons, markers, digital tablet) so the student can avoid textures that cause discomfort.', priority: 'high', icon: 'Palette' },
      { title: 'Visual Model', description: 'Provide a completed example alongside step-by-step instructions. Avoid open-ended "draw anything" prompts.', priority: 'high', icon: 'Image' },
      { title: 'Noise-Controlled Environment', description: 'If music is playing during art time, ensure the volume is moderate and offer headphones.', priority: 'medium', icon: 'Volume1' },
      { title: 'Extended Time', description: 'Allow extra time for completion without rushing. Remove the class timer from the student\'s line of sight.', priority: 'low', icon: 'Clock' },
    ],
  },
  {
    keywords: ['physical', 'gym', 'sport', 'exercise', 'pe', 'motor', 'body'],
    title: 'Physical Education Adaptations',
    adaptations: [
      { title: 'Quiet Warm-Up Zone', description: 'Allow the student to warm up separately in a low-stimulus area before joining the group activity.', priority: 'high', icon: 'PersonStanding' },
      { title: 'Visual Rules Board', description: 'Display game rules as a visual poster with numbered steps and pictures rather than verbal instructions.', priority: 'high', icon: 'ClipboardList' },
      { title: 'Alternative Activities', description: 'Offer yoga, stretching, or solo ball skills as an alternative when team games are overwhelming.', priority: 'medium', icon: 'Dumbbell' },
      { title: 'Transition Cue', description: 'Use a visual countdown (3-2-1 cards) before whistles or loud signals to prevent startle responses.', priority: 'medium', icon: 'Timer' },
    ],
  },
];

// ============================================================================
// Matching Logic
// ============================================================================

/** Scores a prompt against a set of keywords. Higher = better match. */
const scoreMatch = (prompt: string, keywords: readonly string[]): number => {
  const lower = prompt.toLowerCase();
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0);
};

/** Finds the best-matching PECS scenario for a given prompt. Falls back to self-regulation. */
export const matchPECSScenario = (prompt: string): PECSScenario => {
  let bestScore = 0;
  let bestScenario = PECS_SCENARIOS[0]; // default: self-regulation

  for (const scenario of PECS_SCENARIOS) {
    const score = scoreMatch(prompt, scenario.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestScenario = scenario;
    }
  }

  return bestScenario;
};

/** Finds the best-matching lesson scenario for a given prompt. Falls back to reading. */
export const matchLessonScenario = (prompt: string): LessonScenario => {
  let bestScore = 0;
  let bestScenario = LESSON_SCENARIOS[0]; // default: reading

  for (const scenario of LESSON_SCENARIOS) {
    const score = scoreMatch(prompt, scenario.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestScenario = scenario;
    }
  }

  return bestScenario;
};
