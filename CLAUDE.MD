# RL 

A **front-end-only demo** of the RL tutoring platform, built to record a teaser
video. Every "AI" feature is **faked** and every outcome is **pre-made**, so a
live walkthrough is deterministic and can't fail on camera. **No backend, no real
AI, no network calls.**

> The app lives in the **`AI-Trial-Website/`** subdirectory — run all commands from there.

## Run

```bash
cd AI-Trial-Website
npm install
npm run dev                       # http://localhost:5173
```

## Stack

- **React 19** + **TypeScript** (strict: `verbatimModuleSyntax`, `noUnusedLocals`/
  `noUnusedParameters`, `erasableSyntaxOnly`, `resolveJsonModule`). Keep imports
  clean, use `import type`, **no TS enums** (use string-literal unions).
- **Vite 8** + **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. Config is
  **CSS-first** in `src/index.css` (`@theme { … }`) — there is **no `tailwind.config.js`**.
- **react-router-dom v7** (library mode, `<BrowserRouter>` in `main.tsx`).
- **No chart / animation / icon libraries.** Charts are a custom SVG component,
  animations are CSS-only, icons are inline SVG in `components/ui/Icons.tsx`.

## How the fakery works (important)

- All data is static under `src/data/` — `.json` for plain records, `.ts` where
  typing/derivation helps. Everything is loaded and typed through `src/data/index.ts`.
- "AI" actions play a deterministic `components/feedback/FakeAiOverlay.tsx`
  (fixed timers, **no `Math.random`/`Date.now`**), then reveal pre-made results.
- Pre-made PDFs live in `public/pdfs/` (served at `/pdfs/…`). The **same files are
  returned regardless of input**. Regenerate them with `scripts/generate_pdfs.py`
  (`pip install reportlab`). Swap in real RL papers by replacing the files (same names).
- Auth is fake: `context/AuthContext.tsx` matches `data/accounts.json` and persists
  to `localStorage`; `components/layout/RequireAuth.tsx` role-gates routes.

## Demo accounts (password = username, except admin which is `demo`)

| role    | username  | lands on                         |
| ------- | --------- | -------------------------------- |
| student | `rlstaff` | full Student portal              |
| student | `kelvin`  | full Student portal              |
| student | `alan`    | full Student portal              |
| student | `tom`     | full Student portal              |
| parent  | `ricky`   | Performance dashboard            |
| teacher | `jali`    | "in development" placeholder     |
| teacher | `grace`   | "in development" placeholder     |
| admin   | `admin`   | "in development" placeholder     |

The four students share the same (static) classes and dashboard data. Teachers
**Jali** (Methods & Specialist) and **Grace** (IB AA HL) are the class teachers.

Only **Student** and **Parent** are built. **Teacher** and **Admin** are deliberate
"coming soon" pages (`pages/placeholder/ComingSoon.tsx`).

## What's built

- **Student** (`pages/student/`): home → three areas —
  - **Classroom** — Google-Classroom-style class list + per-class Stream / Tasks /
    Files / People.
  - **AI Features** — **Practice** (6-step wizard → two PDFs), **AI Marking** (upload
    any PDF → pre-marked PDF + score), **Ask AI** (scripted step-by-step chat).
  - **Performance** — the student's own progress dashboard.
- **Parent** (`pages/parent/ParentDashboard.tsx`) — the same dashboard the student
  sees. Both render `components/dashboard/PerformanceDashboard.tsx` (single source of
  truth): 5 stat tiles + a dual-line chart + a log, all on **one no-scroll screen**
  (only the log scrolls internally; uses `AppShell` `fill` mode).

### Scripted Practice flow (the on-camera happy path)

MM34 → topic **Differentiation** → **Normal** → **Exam 1** → **6** questions →
**3 VCAA + 3 RL Question Bank** → **Generate**. The wizard pre-defaults 6 questions
and a 3/3 split, so the last steps are confirming clicks. The two source options are
labelled **VCAA** and **RL Question Bank** (the internal data key is still `modified`).

Notable wizard mechanics:
- **Topics** (`practice/TopicMultiSelect.tsx`) — a tree multi-select: each topic has a
  tri-state checkbox, expands to its sub-topics, plus "All Unit N topics" / "All topics"
  presets. Model: `topics: { overall, subs[] }[]` (empty `subs` = the whole topic).
- **Difficulty** — multi-select; each level carries a percentage that always
  auto-rebalances to sum 100 (default even split).

## Layout & code map

- Pages in `src/pages/`, reusable pieces in
  `src/components/{ui,layout,feedback,chart,pdf,dashboard}/`, shared types in
  `src/types/index.ts`, helpers in `src/lib/` (`format.ts` has `stagger()` + accent
  helpers; `delay.ts` is the fake-async timer).
- The route table is `src/App.tsx`. `components/layout/AppShell.tsx` is the top bar
  (logo, user chip, logout) and exposes a `fill` mode for the no-scroll dashboards.

## Design direction — brutalist editorial (NOT "AI slop")

The user explicitly rejects generic AI-looking UI ("looks too much like AI"). Match
the **existing** aesthetic when adding or editing anything:

- **Right angles everywhere** — no border radius (`rounded-none`). The only round
  element is the spinner ring in `FakeAiOverlay`. Avatars, badges, checkboxes, step
  markers and dots are all square.
- **Flat surfaces** — solid `bg-base`/`bg-raised` separated by 1px `border-line`
  hairlines; **no drop shadows** on cards (a popover may use one subtle shadow).
  Hovers are colour/border flips, not soft `-translate-y` lifts.
- **Type** — **Fraunces** serif for large display; **IBM Plex Mono** for *all* labels,
  metadata, indices, badges, stat numbers and captions (sentence/lowercase, never
  uppercase-tracked); **Hanken Grotesk** for body. Avoid Inter/Roboto/Arial/Space Grotesk.
- **No icon-in-coloured-circle** — use bare accent-coloured icons or mono index
  numbers (`01`, `02`).
- **Vary the layouts** (asymmetric, deliberate whitespace): Landing = bordered portal
  **directory**; StudentHome = asymmetric **bento**; AiFeaturesHub = oversized
  **chapter index**; ComingSoon = intro + roadmap **ledger**. Avoid centred empty
  heroes, hero-with-illustration-on-right, and repeated 3-column feature grids.
- **Motion** — one orchestrated page-load with staggered `rl-reveal` + `stagger(i)`
  (keyframes in `index.css`, helper in `lib/format.ts`). CSS-only; honor
  `prefers-reduced-motion`. No scattered micro-interactions.

### Palette & tokens (`src/index.css` `@theme`)

Dark slate base (colours per rlblackmagic.com). Use the Tailwind tokens
(`bg-base`, `text-mint`, `border-line`, `font-mono`, …) rather than raw hex:

- Surfaces: `night #10151a`, `base #202830`, `raised #28323c`, hairline `line #38454f`
- Accents: `mint #74be9c` (primary), `amber #f4a52e` (secondary / CTA),
  `pine #2d5048`, `info #84bcd9`, `danger #e8806b`
- Text: `ink #eef3f0`, `ink-dim`, `ink-faint`

## Gotchas

- The production build (`npm run build` = `tsc -b && vite build`) is the gate; it is
  strict about unused imports and type-only imports. `eslint` may report a few
  pre-existing warnings that don't affect the build.
- Record in **Chrome** for reliable inline PDF preview (headless screenshots often
  show the PDF iframe blank even though it works); every PDF viewer also has
  **Open** / **Download** fallbacks.
