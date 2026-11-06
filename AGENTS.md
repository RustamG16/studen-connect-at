# AGENTS.md

<!-- apollo:begin -->
## Convenium.Design

This project is designed with Convenium.Design. `.olympus/APOLLO.md` says where the system folder
lives on this machine. Project evidence and decisions go in `.olympus/`, never into that folder.

**Before acting on any design, brand, page or build request:**

1. Read `.olympus/run.json` if it exists. A `phase` other than `intake` means resume that phase
   per the system's `START-HERE.md` — never restart intake, never re-plan a built site.
2. Otherwise triage the request and make the opening move its kind calls for:

| The request reads as | Opening move |
|---|---|
| "redesign", "new look", "make it better" — no specifics | Ask what exactly they want: one question with the three most likely readings as options (visual refresh / restructure / new direction), then the brief's remaining open fields, one question at a time |
| "improve the current design", "polish", "bring it up to date" | Ask nothing first. Audit the current state against the current standards floor, then propose a plan and stop for approval |
| "mobile", "phone pages too long", "optimize mobile" | The mobile retrofit lane; no intake, no new direction |
| A new business, no site yet, "brand", "identity" | Brand DNA first, then only the gaps it leaves |
| "build", "implement" — and `.olympus/06-build-plan.md` exists | Implement from the plan and `DESIGN.md` in this session; no re-planning |
| Explicit creative freedom, alternatives refused, "no need to ask" | No questions: resolve the brief from the material, record it as director-resolved, continue to the plan |
| "separate chats", "agents in their own windows", "run it as a relay", "one take" | The relay: `relay.py plan` in the system's `library/tools/`, then its `relay` skill; you orchestrate, sessions author |

3. Ask one question per message, your proposed answer first so a one-word reply accepts it;
   never ask what the brief, the files or an earlier reply already answered. On Claude Code use
   the AskUserQuestion tool; on Codex, lettered options in plain text.
4. Then read, in this order, from the system folder: `ARCHITECTURE-ESSENTIALS.md`, `AGENTS.md`,
   `START-HERE.md`, and act as its Design Director: gates A/B/C, one direction, every artifact
   in `.olympus/`.

On Claude desktop, agent phases run as separate sessions via `relay.py next`. A session whose
first message is a relay packet does that packet only and skips everything above.
<!-- apollo:end -->

# AGENTS — Care4Students

Redesign of the Care4Students student-support site (Austria). Brief and non-goals: `PRD.md`.

## Read order

Read `ARCHITECTURE-ESSENTIALS.md`, then only the document relevant to the task: `PRD.md` for scope,
`ARCHITECTURE.md` for stack and layout, `PROGRESS-AND-DECISIONS.md` for prior decisions. `CODEX.md` is the short router.

## Ownership and boundaries

- Work on branch `redesign-2026`. Never push, deploy, or touch `main`.
- Preserved: every route path, every copy string, nav labels, the mock auth contract, `ProtectedRoute` behaviour.
- Free to change: `src/index.css`, `tailwind.config.ts`, `index.html`, Navbar/Footer/LoadingScreen/AnimatedLogo, new components, public pages' layout and motion.
- Out of scope: dashboard redesign (`src/pages/Dashboard*.tsx`, `DashboardSidebar.tsx`), paid media generation, any backend.
- Stage only the paths you changed; never `git add -A`. Do not hand-edit `.olympus/run.json` or `.olympus/00-run-plan.md` unless your phase row names them.
- `CARE4STUDS_CODEPILOT_STYLE_MIGRATION_GUIDE.md` is superseded by the brief (same family, own style); do not follow its "match exactly" goal.

## Evidence and safety

- Facts about the live site or reference come from fetched pages or the code, not memory; say what is not verified.
- No real personal data, credentials or API keys in the repo. Auth stays a localStorage mock.
- Imagery: existing assets, code-drawn graphics or free-licence sources with the licence recorded. No paid generation.

## Verification

Before any handoff: `npm run build` passes and `npm run lint` adds nothing beyond the baseline of 3 errors and 8 warnings; changed routes checked in a browser at 360, 390, 768 and 1280 px;
no horizontal scroll, console clean, reduced-motion fallback works; compare copy against `origin/main` so no string is lost.

## Amendments

### 2026-11-01: paid generation for the media pass

**Reason.** "Out of scope: ... paid media generation" and "No paid generation" above forbid what the owner now asks for. **The user's words,** as relayed by the main session in `.olympus/00-run-plan.md`: "Use higgsfield to generate images and videos and also find assets online. Use remotion to add more posters and animated cards." and "use videos 480p for framed banners and images as much required to make remotion animations. budget 130 credits."

**Change.** For the media pass only, once the user approves Gate 1: Higgsfield generation up to 130 credits for the rows in `.olympus/05-asset-manifest.md`, free-licence sources with the licence recorded, and Remotion renders from `media-src/`, an isolated folder with its own `package.json`. `eslint.config.js` may add `media-src` to its ignores. Everything else in this file stands. Rule changes for the design are in `DESIGN.md`, *Amendments*.
