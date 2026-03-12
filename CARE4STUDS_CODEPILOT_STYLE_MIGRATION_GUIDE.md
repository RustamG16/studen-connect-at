# Care4Studs Style Migration Guide for Codepilot

This guide is for a separate `care4studs` project that is already running at `http://localhost:8080/`.
Goal: make its visual style match the `education-hub-connect` style system exactly, while keeping Care4Studs content and routes.

## 1. What I Verified in Existing Care4Studs (localhost:8080)

Observed from the running app:

- Stack is Vite + React + Tailwind (dev server and `/src/main.tsx` entry are visible).
- Current brand uses Nunito and teal/navy palette.
- Current global tokens include:
  - `--primary: 177 63% 57%`
  - `--secondary: 216 100% 15%`
  - light + dark token sets already exist.
- Current app already has sections like:
  - Hero: "Funding. Housing. Support."
  - "Everything You Need"
  - "Why Students Choose Us"
  - "What Students Say"
  - CTA and footer.
- Current style is already decent but differs from target in key areas:
  - Typography (Nunito vs Manrope)
  - Token values and gradients
  - Card shadows and glass effect details
  - Component micro-interactions
  - Hero section wave transition
  - Motion rhythm and reveal timing

## 2. Target Design to Match (Education4Students)

Design identity to replicate:

- Clean, airy off-white base with cyan-navy accents.
- Primary cyan family around `#41e0eb` but contrast-corrected in HSL tokens.
- Deep navy secondary for depth and contrast.
- Soft layered shadows (not harsh drop shadows).
- Glass cards for selected surfaces.
- Smooth reveal animations with Framer Motion.
- Large section spacing and balanced typography.

## 3. Execute in This Order

1. Replace global design tokens and utility classes.
2. Update Tailwind theme extension (fonts, colors, animations, radius, container).
3. Align typography and spacing scale.
4. Apply section backgrounds and card styles.
5. Align navbar, hero, buttons, and footer interactions.
6. Add/align motion patterns.
7. Run visual QA on desktop and mobile.

## 4. Exact Global Token Pack (Use This)

Put this in global CSS (typically `src/index.css`) under `:root`.

```css
:root {
  --background: 210 20% 99%;
  --foreground: 220 20% 14%;

  --card: 0 0% 100%;
  --card-foreground: 220 20% 14%;

  --popover: 0 0% 100%;
  --popover-foreground: 220 20% 14%;

  --primary: 185 78% 42%;
  --primary-foreground: 0 0% 100%;

  --secondary: 215 50% 18%;
  --secondary-foreground: 0 0% 100%;

  --muted: 215 18% 96%;
  --muted-foreground: 215 12% 48%;

  --accent: 185 65% 94%;
  --accent-foreground: 185 75% 28%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  --border: 215 15% 90%;
  --input: 215 15% 90%;
  --ring: 185 78% 42%;

  --radius: 0.75rem;

  --teal: 185 78% 42%;
  --teal-light: 185 65% 94%;
  --navy: 215 50% 18%;
  --navy-light: 215 40% 30%;

  --gradient-hero: linear-gradient(135deg, hsl(185 55% 76%) 0%, hsl(215 35% 46%) 100%);
  --gradient-hero-start: 185 55% 76%;
  --gradient-hero-to-bg: linear-gradient(180deg, hsl(var(--gradient-hero-start)) 0%, hsl(210 20% 99%) 100%);
  --gradient-subtle: linear-gradient(180deg, hsl(185 55% 92%) 0%, hsl(210 15% 99%) 100%);

  --shadow-card: 0 1px 3px hsl(220 20% 14% / 0.03), 0 4px 24px -4px hsl(220 20% 14% / 0.07);
  --shadow-card-hover: 0 2px 8px hsl(220 20% 14% / 0.05), 0 16px 48px -8px hsl(220 20% 14% / 0.12);
  --shadow-button: 0 4px 16px -4px hsl(185 78% 42% / 0.35);
}
```

## 5. Global Utility Classes (Must Exist)

```css
.gradient-hero {
  background: var(--gradient-hero);
}

.gradient-hero-to-bg {
  background: var(--gradient-hero-to-bg);
}

.gradient-subtle {
  background: var(--gradient-subtle);
}

.shadow-card {
  box-shadow: var(--shadow-card);
}

.shadow-card-hover {
  box-shadow: var(--shadow-card-hover);
}

.shadow-button {
  box-shadow: var(--shadow-button);
}

.glass {
  background: hsl(0 0% 100% / 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(0 0% 100% / 0.2);
}

.glass-dark {
  background: hsl(213 50% 25% / 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(0 0% 100% / 0.1);
}
```

## 6. Tailwind Config Targets

Apply these in `tailwind.config.ts`:

- `container.center = true`
- `container.padding = "1.5rem"`
- `container.screens["2xl"] = "1280px"`
- Extend `fontFamily.sans = ["Manrope", "system-ui", "sans-serif"]`
- Add custom color groups:
  - `teal.DEFAULT = hsl(var(--teal))`
  - `teal.light = hsl(var(--teal-light))`
  - `navy.DEFAULT = hsl(var(--navy))`
  - `navy.light = hsl(var(--navy-light))`
- Radius scale:
  - `lg: var(--radius)`
  - `md: calc(var(--radius) - 2px)`
  - `sm: calc(var(--radius) - 4px)`
  - `xl: calc(var(--radius) + 4px)`
  - `2xl: calc(var(--radius) + 8px)`
- Keyframes and animation names:
  - `fade-in`, `fade-in-left`, `fade-in-right`, `scale-in`, `float`
- Keep `tailwindcss-animate` plugin.

## 7. Typography and Base Rules

- Replace Nunito with Manrope globally.
- Import font weights 400/500/600/700 via `@fontsource/manrope`.
- Base rules:

```css
html { scroll-behavior: smooth; }
body { @apply bg-background text-foreground font-sans antialiased; }
h1, h2, h3, h4, h5, h6 { @apply font-semibold tracking-tight text-foreground; }
```

## 8. Component-Level Styling Rules

### Navbar

- Keep fixed top nav with blur and subtle border transitions on scroll.
- Scrolled state:
  - `bg-background/80 backdrop-blur-lg shadow-sm border-b border-border/50`
- Default state:
  - `bg-background/95 backdrop-blur-sm border-b border-transparent`

### Hero

- Use `gradient-hero` background.
- White hero text (`text-primary-foreground`).
- Two-column layout on desktop, stacked on mobile.
- Add bottom SVG wave transition filled with `hsl(var(--gradient-hero-start))`.

### Service/Feature cards

- Use gradient cards for key service actions:
  - `gradient-hero rounded-2xl p-6 shadow-card`
- Hover state:
  - `hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300`

### Steps / How It Works cards

- White cards on gradient section:
  - `bg-card rounded-2xl p-6 shadow-card`
- Number badges:
  - `w-16 h-16 rounded-full gradient-hero`

### Contact form card

- Use `glass rounded-2xl p-8 shadow-card` on `gradient-subtle` section.

### Testimonials cards

- Use `glass` style with soft hover elevation.
- If carousel exists, add infinite scroll + pause-on-hover behavior.

### Footer

- Add 1px gradient top border:
  - `bg-gradient-to-r from-transparent via-primary/40 to-transparent`
- Keep text muted and clean.

## 9. Button System Rules

If using shadcn button variants, align to this:

- `default`: `bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md`
- `hero`: `bg-card text-secondary hover:bg-card/90 hover:scale-105 hover:shadow-lg`
- `heroOutline`: `border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10`

Global button motion:

- `transition-all duration-200`
- `active:scale-[0.98]`

## 10. Motion System

Add reusable reveal wrapper with Framer Motion:

- Initial:
  - up: `opacity: 0, y: 40`
  - left: `opacity: 0, x: -40`
  - right: `opacity: 0, x: 40`
- Animate into view once:
  - `opacity: 1, x: 0, y: 0`
- Transition:
  - `duration: 0.6`
  - `ease: [0.25, 0.1, 0.25, 1]`
  - optional stagger via `delay`

## 11. What to Keep From Existing Care4Studs

Keep these as-is unless product owner says otherwise:

- Content, route URLs, and business copy.
- Existing section order (Hero, Features, Why, Testimonials, CTA).
- Existing CTA destinations like `/dashboard`, `/contact`, etc.

Only style and interaction language should be migrated.

## 12. Codepilot Prompt (Copy-Paste for New Chat)

Use this exact prompt in a new Codepilot chat inside `care4studs`:

```text
You are updating an existing Vite + React + Tailwind app (Care4Studs).
Do not redesign content or routes. Only migrate visual style to match Education4Students exactly.

Required outcomes:
1) Replace global tokens in src/index.css with this target palette:
- background 210 20% 99%
- foreground 220 20% 14%
- primary 185 78% 42%
- secondary 215 50% 18%
- muted 215 18% 96%
- accent 185 65% 94%
- border/input 215 15% 90%
- ring 185 78% 42%
- radius 0.75rem
- custom teal/navy tokens and gradients/shadows from this guide

2) Switch typography from Nunito to Manrope using @fontsource/manrope (400/500/600/700).

3) In tailwind.config.ts:
- container center true, padding 1.5rem, 2xl 1280px
- extend custom teal/navy colors
- add radius xl/2xl
- add keyframes: fade-in, fade-in-left, fade-in-right, scale-in, float
- keep tailwindcss-animate

4) Implement utility classes:
- gradient-hero, gradient-hero-to-bg, gradient-subtle
- shadow-card, shadow-card-hover, shadow-button
- glass and glass-dark

5) Style key sections:
- Navbar with translucent blur states
- Hero with gradient, white text, CTA button, and bottom wave divider
- Cards with rounded-2xl + shadow-card and hover elevation
- Contact card with glass style
- Footer with subtle gradient top border

6) Button interactions:
- active scale 0.98
- smooth transitions 200ms
- hero and heroOutline variants if shadcn button exists

7) Motion:
- add reusable scroll reveal component with framer-motion
- viewport once, cubic-bezier [0.25,0.1,0.25,1]

8) Preserve all existing content and routes.

After edits:
- run build
- fix any TS or lint errors introduced
- provide a concise file-by-file change summary.
```

## 13. Visual QA Checklist

Check these before finalizing:

- Body background is off-white, not pure white.
- Hero uses cyan-to-navy gradient and white text.
- Section spacing feels airy (`py-20` to `py-28`).
- Cards have soft layered shadows and rounded corners.
- Hover lifts are subtle and consistent.
- Form/testimonial glass cards blur correctly.
- Footer top divider uses transparent-primary-transparent gradient.
- Font is Manrope everywhere.
- Mobile layout still reads cleanly at 360px width.
- No route/content regressions.

## 14. Done Definition

Migration is complete when:

- Style language is visually consistent with Education4Students.
- Existing Care4Studs content remains intact.
- Build passes without errors.
- Desktop + mobile screenshots show the same design tone and component behavior.
