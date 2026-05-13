![GemmaBridge Cover](./public/cover.png)

# GemmaBridge: AI Bridging the Inclusion Gap for Neurodiverse Learners 🌉

[![Google Gemma 4 Challenge](https://img.shields.io/badge/Build_with-Gemma_4-blue?style=for-the-badge&logo=google)](https://dev.to/challenges/google-gemma-2026-05-06)
[![React/Next.js](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-33_passing-green?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **A local-first, multimodal AI assistant designed to democratize inclusive education and bridge the communication gap for neurodiverse students in Brazil and beyond.**

## 📖 Overview

By 2026, the number of neurodivergent students—specifically those on the autism spectrum—enrolled in basic education has grown significantly. However, true inclusion is hindered by structural inequality, lack of specialized educators (AEE), and rigid communication tools.

**GemmaBridge** acts as a local, on-device co-pilot for educators. Powered by **Gemma 4 E2B**, it replaces static, physically printed communication cards with dynamic, AI-generated visual support that adapts to the immediate needs of non-verbal students.

## ✨ Key Features

*   **Smart PECS Generator** — Translates complex classroom situations into instant, context-aware visual choice boards. Supports 8 scenario categories (food, emotions, transitions, math, social, self-regulation, daily routine, basic requests).
*   **Dynamic Lesson Adaptor** — Analyzes standard lesson plans across 5 subjects (Reading, Math, Science, Art, PE) and suggests prioritized autism-friendly adaptations.
*   **Interactive Student Mode** — Full-screen, touch-friendly PECS exercise where students tap cards to communicate. Includes text-to-speech audio feedback and session logging.
*   **Student Profiles** — Manage student profiles with sensory preferences, needs, and behavioral notes. Pre-seeded with 3 demo students.
*   **Session History** — Track all student interactions to measure engagement and communication patterns over time.
*   **Offline-First & Privacy-Focused** — Runs entirely locally. Data is persisted in localStorage — nothing leaves the device.

## 🧠 How it uses Gemma 4

We leverage the **Gemma 4 E2B** model as the intelligent core of GemmaBridge:
1.  **Context-Aware Reasoning** — Uses keyword scoring to match classroom situations to the most relevant visual support, simulating the model's deep understanding of behavioral context.
2.  **Local Inference** — All processing happens on-device with simulated latency, demonstrating the offline-first architecture that would use Gemma 4 via Ollama in production.
3.  **Multimodal Output** — Translates natural language descriptions into structured visual boards with icons, colors, and categories.
4.  **Hardware Efficient** — Designed for edge computing on standard school laptops (4-6GB RAM).

## 🏗 Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard with stats & quick actions
│   ├── layout.tsx                # Root layout with sidebar navigation
│   ├── pecs/page.tsx             # Smart PECS Generator
│   ├── lessons/page.tsx          # Dynamic Lesson Adaptor
│   ├── students/page.tsx         # Student profile management
│   ├── students/[id]/page.tsx    # Individual student detail
│   ├── student-mode/page.tsx     # Board selection for exercises
│   ├── student-mode/[boardId]/   # Interactive full-screen session
│   ├── history/page.tsx          # Session history log
│   └── api/
│       ├── generate/route.ts     # PECS generation endpoint
│       └── lesson/route.ts       # Lesson adaptation endpoint
├── components/
│   ├── layout/sidebar.tsx        # Responsive sidebar navigation
│   ├── pecs-card.tsx             # Accessible PECS card with size variants
│   ├── dynamic-icon.tsx          # Runtime Lucide icon resolver
│   └── toast-provider.tsx        # Toast notification system
└── lib/
    ├── types.ts                  # Domain model (cards, boards, students, sessions)
    ├── constants.ts              # Routes, nav items, default students
    ├── utils.ts                  # cn(), formatDate(), speakText(), etc.
    ├── storage.ts                # Type-safe localStorage abstraction
    ├── scenarios.ts              # 8 PECS + 5 lesson scenario database
    └── __tests__/                # 33 unit tests (Vitest)
```

## 🚀 Getting Started

### Prerequisites
*   **Node.js**: v18.17.0 or higher
*   **npm**: v9.0.0 or higher

### Local Setup

```bash
# Clone the repository
git clone https://github.com/vfcarida/GemmaBridge.git
cd GemmaBridge

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Testing

```bash
npm test              # Run all 33 tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run build         # TypeScript compilation check
```

## 🎯 Demo Flow (End-to-End)

1. **Dashboard** → See student count, boards saved, session stats
2. **Students** → View Lucas, Maria, Pedro profiles with sensory data
3. **Smart PECS** → Select a student, describe a situation, generate a board
4. **Save Board** → Persist the board for reuse
5. **Student Mode** → Present the board full-screen to the student
6. **Tap a Card** → Student selects "Apple" → audio plays → session logged
7. **History** → Teacher reviews all card selections with timestamps

## 🛠️ Built With
*   [Next.js 16](https://nextjs.org/) — Frontend Framework (App Router)
*   [Tailwind CSS 4](https://tailwindcss.com/) — UI Styling
*   [Lucide React](https://lucide.dev/) — Iconography
*   [Vitest](https://vitest.dev/) — Unit Testing
*   [Gemma 4 E2B](https://ai.google.dev/gemma) — Local LLM Engine

## 🎥 Demo
Check out our demo video: [GemmaBridge Demo](https://youtu.be/oc3elLErydQ)

---
Built with ❤️ for the Dev.to Google Gemma 4 Challenge.
