# ARCHITECTURE ESSENTIALS — Care4Students

Derived from `ARCHITECTURE.md`; keep it that way.

1. **Source of truth:** this repo, branch `redesign-2026` (from `origin/main`). Copy lives in `src/pages/*.tsx`; route table in `src/App.tsx`.
2. **Boundaries:** redesign tokens, `index.html`, Navbar/Footer/Loading and the public pages. Frozen: `AuthContext`, `ProtectedRoute`, route paths, `Dashboard*`, `src/components/ui` internals. No copy changes.
3. **Stack:** Vite 5 + React 18 + TypeScript + Tailwind 3 + shadcn/Radix + react-router 6. Mock localStorage auth. No backend, no env, no secrets. npm (`package-lock.json`).
4. **Gates:** phone first (360–430 px), no horizontal scroll, touch targets ≥ 44 px, safe areas, WCAG AA contrast, visible focus, `prefers-reduced-motion` fallback, lazy heavy motion, bundle must not balloon (baseline 1.06 MB JS / 95 kB CSS).
5. **Commands:** `npm ci` · `npm run dev` (port 8080) · `npm run build` · `npm run lint`. No test runner.
6. **Publication:** Netlify (https://care4students.netlify.app/). Relay sessions commit on `redesign-2026`, never push, never deploy.
