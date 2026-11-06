# PRD — Care4Students

## Problem and goal

Care4Students is a marketing and onboarding site for Austrian university students: funding and bonuses,
housing, a roommate ("buddy") finder, a how-it-works guide, FAQ and contact. The current build is a
Lovable-generated template look (teal/navy, Manrope, shadcn defaults) that does not stand out.

**Product goal (the brief, verbatim):** Clone https://github.com/RustamG16/studen-connect-at.git
(Care4Students) and redesign it with Convenium.Design into a 2026 Awwwards-worthy site: same brand
family as Education4Students (https://rustamg16.github.io/education-hub-connect/, repo
RustamG16/education-hub-connect) but its own unique style, with the phone experience optimised. Full
creative freedom, no questions, one direction, every route and copy string preserved.

Resolved reading (director-resolved, no questions asked): a visual and interaction redesign of the
public marketing site. Same brand family means a shared brand sensibility (the dragonfly mark, the
Education4Students tone and quality bar), not a copy of its styling. Care4Students gets a distinct
visual identity of its own.

## Audience

- Primary: students arriving at, or already studying in, Austria who need money, a room or a roommate. Most
  open the site on a phone (360–430 px wide).
- Secondary: parents, university and student-union staff checking that the service is credible.

## Success criteria

- Every public route renders with its original copy strings intact: `/`, `/bonuses`, `/housing`,
  `/find-buddy`, `/how-it-works`, `/faq`, `/contact`, `/legal`, `/blog`, `/login`, `/signup`, and the 404 page.
- The site reads as a different brand expression from Education4Students while clearly belonging to
  the same family.
- Phone experience is the primary design target: per-page screen budgets, thumb-zone navigation, safe
  areas, fluid type, touch targets ≥ 44 px, no horizontal scroll at 360 px.
- Awwwards-level craft judged by the relay's award rubric and visual QA; reduced-motion and static fallbacks exist.
- `npm run build` and `npm run lint` pass; existing routes and auth redirect behaviour are unchanged.
- Performance floor: the current 1.06 MB single JS chunk does not grow materially; heavy motion is lazy and phone-cheap.

## Data and publication boundary

- No real user data. Auth is a client-side mock (`localStorage` key `user`); nothing is sent anywhere.
- Copy comes from the existing pages; it is not invented, shortened or translated. Layout, order and
  presentation may change; strings do not.
- Published to Netlify (https://care4students.netlify.app/). Nothing is pushed or deployed by relay sessions.

## Out of scope

- No dashboard redesign: `/dashboard/*` keeps its current look and behaviour, and only inherits token
  changes that do not break it.
- No paid media generation: imagery comes from existing assets (`public/i`, `src/assets`), code-drawn
  graphics and free-licence sources only.
- No new backend: auth stays the mock; no API, database or analytics service is added.
- No route, URL or navigation-label changes; no copy rewrites.

## Amendments

### 2026-11-01: paid generation for the media pass

**Reason.** "No paid media generation" above forbids what the owner now asks for. The earlier run's 160-credit allowance (`PRODUCT.md`, *Media*) was for that run only.

**The user's words,** as relayed by the main session in `.olympus/00-run-plan.md`: "Use higgsfield to generate images and videos and also find assets online." and "use videos 480p for framed banners and images as much required to make remotion animations. budget 130 credits."

**Change.** For the media pass only, paid generation is in scope: Higgsfield, at most 130 credits, for the rows in `.olympus/05-asset-manifest.md`, once the user approves Gate 1. Free-licence sources stay allowed with the licence recorded. Remotion renders are local and carry no credit cost; its licence case is confirmed by the owner in the manifest. Anything beyond those rows or that ceiling needs a new approval.

**Unchanged.** Every other non-goal: no dashboard redesign, no backend, no route or label changes, no copy rewrites. Media stays decoration: each route must read as finished without it.

### 2026-11-04: university and Klagenfurt photos, and their credit

**Reason.** "Copy comes from the existing pages; it is not invented" would forbid the credit line that a CC BY-SA photo requires.

**The user's words,** as relayed by the main session: "but add imagery from uni and klagenfurt (it is a product for uni, you can use the licensed images)".

**Change.** Free-licence photos of the university campus and Klagenfurt are in scope, as `DESIGN.md` (*Amendments*, 2026-11-04, later) allows. Two new strings are allowed on `/`: N15, the photo's licence credit, and N16, its alt text (`.olympus/05-asset-manifest.md`, *Hero pass addendum*). Both describe the photo. Neither is marketing copy, and neither claims a tie to the university. AAU's own press photos stay out of the public build until AAU consents in writing.

**Unchanged.** Every existing string, route and label; no paid generation in the hero pass; every other non-goal.
