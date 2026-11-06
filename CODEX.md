# CODEX — project router

1. Always read `ARCHITECTURE-ESSENTIALS.md`.
2. Product or scope question: read `PRD.md`.
3. Runtime, data, build or deployment question: read `ARCHITECTURE.md`.
4. Work boundaries or release checks: read `AGENTS.md`.
5. Prior decisions only when needed: search `PROGRESS-AND-DECISIONS.md`.

Project: Care4Students — Vite 5 + React 18 + TypeScript + Tailwind 3 + shadcn/ui; mock localStorage auth; Netlify.
Branch for all work: `redesign-2026`. Never push.

## Commands

- Install: `npm ci`
- Dev server: `npm run dev` (http://localhost:8080)
- Build: `npm run build`
- Lint: `npm run lint` (baseline: 3 errors, 8 warnings, pre-existing)
- Preview the build: `npm run preview`
- No test runner is configured.

## Routes (preserve all)

Public: `/`, `/bonuses`, `/housing`, `/find-buddy`, `/how-it-works`, `/faq`, `/contact`, `/legal`, `/blog`, `/login`, `/signup`, `*` (404).
Protected (mock auth, not redesigned): `/dashboard`, `/dashboard/{bonuses,housing,buddy,documents,support,settings}`.

## Verification floor

Build passes, lint no worse than baseline; browser check at 360 / 390 / 768 / 1280 px; no horizontal scroll; console clean; reduced-motion works;
every copy string present compared with `origin/main`.

## Do not touch

`src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`, the route table, `Dashboard*` pages, `.olympus/run.json`, `.olympus/00-run-plan.md`.
