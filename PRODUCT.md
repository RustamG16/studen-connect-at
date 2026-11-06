# Product

<!-- impeccable:product-schema 1 -->

Durable product truth. Visual decisions live in `DESIGN.md`. No interview ran: the brief says "no questions" and this file was written by a deputy session, so every fact comes from `PRD.md`, `.olympus/00-brief.md`, `.olympus/BRAND.md` or the repository. Anything inferred on top of those says *(inferred)*.

## Platform

web

## Stack

Vite, React 18, TypeScript, Tailwind and shadcn, kept because the brief fixes them. Mock auth in `localStorage`, kept because the auth contract is frozen. No backend, API, database or analytics service. Netlify at `base: "/"`, kept because the deploy is frozen. Allowed additions, all from the brief and its amendment: `gsap`, `@gsap/react`, `lenis`, `@fontsource/plus-jakarta-sans`, `@fontsource/instrument-serif`, Playwright as a dev-only tool.

## Users

- **Primary:** a student at an Austrian university, Vienna first, 18–28, mostly on a phone at 360–430 px, who needs money, a room or a roommate and does not know what they qualify for or which documents they need. Copy signals international students too; the share is unknown.
- **Secondary:** parents and university or student-union staff checking that the service is credible.
- **What they are deciding:** whether this site can really find them money, a room and a roommate, and whether signing up is worth it. They decide on a phone, probably between other tasks *(inferred)*.

## Product Purpose

A free platform for students in Austria: find and apply for grants and bonuses, find verified housing, and match with roommates, all in one place.

Success is a visitor reaching **Sign up** (`/signup`), with **Explore Bonuses** (`/bonuses`) as the secondary action. No metric exists and mock auth cannot measure one, so for this run success means an independent finish review of PASS or PASS WITH NOTES, the mobile budgets met and encoded as a test, build, lint and QA clean, and nothing pushed by any session.

## Positioning

The site's own line: "Your all-in-one platform for student funding, housing, and support in Austria", and free. As far as their page titles and descriptions show, the awarding bodies, the ÖH, dorm operators and flat-share marketplaces each cover one of those needs *(inferred; the site makes no such comparison)*. Holding all three together is the claim a neighbour could not copy.

It reads as a guide to the Studienbeihilfenbehörde and a partner of the ÖH, not a rival to either.

## Operating Context

- **Primary viewport:** 360–430 px, working from 320 px. Desktop is a full experience, not an afterthought, and this client named no single target resolution.
- **Budgets at 390×844:** home ≤ 10 screens, every other route ≤ 8; 0 tap targets under 24 px; primary actions and tab cells ≥ 44 px; inputs ≥ 16 px; no horizontal overflow from 320 px.
- **Connection and device:** mobile networks and mid-range phones are assumed *(inferred)*. No analytics exist, so the real phone share and age range are unknown.
- **Shared computers:** a financial-need tick must be easy to remove.
- **Language:** English only, with German terms as they are (WG, Studienbeihilfe). No i18n.

## Capabilities and Constraints

- **Routes, all preserved:** `/`, `/bonuses`, `/housing`, `/find-buddy`, `/how-it-works`, `/faq`, `/contact`, `/legal`, `/blog`, `/login`, `/signup`, 404, `/dashboard/*`. Nav labels preserved. `ProtectedRoute` and the auth contract preserved.
- **Copy is frozen.** No string is lost, reworded, shortened or translated. The only new strings are N1–N14 in `.olympus/06-build-plan.md`.
- **Personal ledger:** a visitor ticks facts about themselves and sees which bonuses may apply, stored only in that browser under `c4s.ledger.v1`, with no account. Nothing is sent anywhere. Logging out does not touch it and the dashboard does not read it.
- **Shipped as a prototype:** auth and the contact form are mocks. The usual on-screen disclosure is not available, because copy is frozen and N1–N14 contain none. This goes to `09-handoff.md` as an owner decision, not onto the page.
- **Dashboard:** `/dashboard/*` gets tokens, sidebar and buttons only; no layout change. `PRD.md` and the project `AGENTS.md` read narrower than this. The brief and the plan govern.
- **Media:** the 2026-10-31 amendment replaces `PRD.md`'s "no paid media generation": Higgsfield only, at most 160 credits for the run. The site must build and read as finished with zero generated assets.
- **Never pushed or deployed by a relay session.** Work stays on `redesign-2026`.
- **Must not be invented:** any source for the figures below, customers, press, testimonials, partnerships, licensing, or how the service is funded.
- **Open and undecided:** whether this is an operating business or a demonstration; where the headline figures come from; whether the testimonials are real; what formal relationship exists with Education4Students; who pays for a service that is free to students.

## Brand Commitments

- **Name:** Care4Students. Family: Education4Students, as a sibling and never a reskin. The migration guide's "match exactly" is superseded.
- **Mark:** the dragonfly, with **books in the lower wings**. The books are this site's distinguishing detail; Education4Students' cut has a cap and a diploma only. The origin and rights of the artwork are unknown.
- **Family palette, fixed by the brief:** primary `#18b1bf`, depth `#316272`, warm `#f6bd13`, ink `#283848`, canvas `#f6f6f3`. Plus Jakarta Sans is the family typeface. The rest is `DESIGN.md`'s.
- **Voice:** warm, practical, plain-spoken, concrete, reassuring. Copy is frozen, so voice decides what gets emphasis, not what gets written.
- **Subject:** the brand is presented as real. Whether it trades is an open question above. Nothing on the site says it is fictional, and the placeholder Imprint values stay as they are.

## Evidence on Hand

Only the copy is established. None of these could be verified.

| On the site | Status |
|---|---|
| €2,400+ average bonus value, 5,000+ students supported, 2 weeks to find housing, 1,200+ on House Buddy | No source in the repo |
| €5,040/year (Studienbeihilfe) | Does not match BGBl. II 221/2026, per `.olympus/01-audit.md`. The other bonus amounts were not checked |
| Rents €350-550, €600-900, €300-450 a month | Not checked |
| Three testimonials, including Lisa M.'s "€2,400" | Not verified as real |
| Deadlines in 2025 | Past as of 2026-10-31 |
| Imprint values and statutes | Placeholders; not reviewed for an Austrian GmbH |

No photography, video, customer research or analytics exists.

## Product Principles

1. **The sums are done for you.** The visitor sees real amounts, plainly, and works out what applies to them in seconds.
2. **Reward with information, never with mechanics.** A student's money is not a game: no streaks, levels, badges, urgency or sign-up wall. All of it stays reversible and private.
3. **One thumb to sign up.** The primary action is reachable from every public route, at phone width, within one tap.
4. **Every claim gets only the weight it can bear.** Past dates stay small, and an estimate says it is an estimate.
5. **It works when everything else fails.** No motion, no generated media, no storage and no script chunk still leaves a finished page with every string readable.

## Accessibility & Inclusion

Required, not optional: visible focus at ≥ 3:1 on every ground; all interactive text at ≥ 4.5:1; reduced motion lands every beat on its final state with the `h1` at opacity 1; keyboard reaches every row and never lands on an invisible one; `forced-colors` and print keep rules, focus and content; text sizes respond to zoom. No WCAG level was named by the client *(inferred: WCAG 2.2 AA is the working standard, because the plan cites its criteria)*.
