# AGENTS.md — Portfolio Project

> Single source of truth for any coding agent working on this repo (Antigravity, Claude Code, Codex, etc). Read this fully before writing any code. If the IDE's own generated `AGENTS.md`/`CLAUDE.md` exists alongside this one, treat this file as the project-specific layer on top — follow both, and where they conflict, this file wins.

## 0. Ground rules

- **Ask before guessing** on real content (name, bio, project descriptions, testimonials, work history) and any design value not defined in §2. Never invent facts about the person this site belongs to.
- Use `TODO:`-prefixed placeholder content anywhere real content isn't supplied yet. Never fabricate a testimonial, employer, or project detail.
- **After every section**, tell me to run in this order and when it is successful, fine if not, I will either find the error myself or paste the output to you. NEVER RUN THEM BY YOURSELF SO I DON'T WASTE TOKENS:
  1. `npm run build`
  2. `npm run lint`
  3. `npx tsc --noEmit`
  4. `npx playwright test` (once §5 test setup exists)
- **One git commit per completed, working, tested section.** Never bundle sections into one commit. I will commit it after you tell me it is successful and I agree.
- **Animation policy:** nothing on this site loops or autoplays except the AI bee (later phase). Standard hover/focus micro-interactions are fine everywhere. The one explicit exception is the Technologies section's hover-triggered "twinkle" (§3) — still hover-gated, not always-on.
- **No arbitrary Tailwind values.** Every size/color/spacing must come from the tokens in `app/globals.css`. Need a value that doesn't exist? Add it as a token there — don't hardcode it in a component.
- No component over ~150 lines — split into subcomponents before that.
- Every interactive element needs a visible focus state and correct semantic HTML.
- Mobile-first: build and check every section at 375px before checking desktop.
- Default to Server Components. Add `"use client"` only where actual interactivity/state/effects require it.

### Quota-conscious workflow (free-tier Antigravity — read this before starting)
- Work through §3's sections **in one continuous session**, not one fresh conversation per section — restarting loses context and costs more requests to re-establish it.
- Do the verification loop (build/lint/type-check/tests) **yourself, automatically, every time** — don't spend a request asking "does this look right?" when a script can tell you.
- Only stop and message the user at the checkpoints defined in the build prompt — not after every small change.
- Prefer targeted edits over regenerating whole files.
- Commit after every green section — if a later step goes wrong or a session gets cut off by a rate limit, nothing already-working is lost.

## 1. Tech stack

- Next.js — App Router, TypeScript, `src/` directory
- Tailwind CSS v4 — CSS-first config via `@theme` in `app/globals.css`. No `tailwind.config.js`.
- Framer Motion — reserved for the bee/chat-panel phase only
- Playwright — end-to-end testing (§5)
- Content: MDX for blog posts, JSON for project/testimonial/experience data (§4)
- Deploy target: Vercel

## 2. Design tokens

Final values — from Figma Dev Mode. Paste this verbatim into `app/globals.css`.

```css
@import "tailwindcss";

@theme {
  /* TYPOGRAPHY — Geist */
  --font-display: "Geist", sans-serif;
  --font-body: "Geist", sans-serif;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Display / XL — 96 / 96 / 700 / -2% */
  --text-display-xl: 6rem;
  --text-display-xl--line-height: 6rem;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-xl--font-weight: 700;

  /* Display / L — 72 / 72 / 700 / -2% */
  --text-display-l: 4.5rem;
  --text-display-l--line-height: 4.5rem;
  --text-display-l--letter-spacing: -0.02em;
  --text-display-l--font-weight: 700;

  /* Heading / H1 — 48 / 50.4 / 700 / -1% */
  --text-heading-h1: 3rem;
  --text-heading-h1--line-height: 3.15rem;
  --text-heading-h1--letter-spacing: -0.01em;
  --text-heading-h1--font-weight: 700;

  /* Heading / H2 — 40 / 44 / 600 / -1% */
  --text-heading-h2: 2.5rem;
  --text-heading-h2--line-height: 2.75rem;
  --text-heading-h2--letter-spacing: -0.01em;
  --text-heading-h2--font-weight: 600;

  /* Heading / H3 — 32 / 36.8 / 600 / -1% */
  --text-heading-h3: 2rem;
  --text-heading-h3--line-height: 2.3rem;
  --text-heading-h3--letter-spacing: -0.01em;
  --text-heading-h3--font-weight: 600;

  /* Heading / H4 — 24 / 28.8 / 600 / -1% */
  --text-heading-h4: 1.5rem;
  --text-heading-h4--line-height: 1.8rem;
  --text-heading-h4--letter-spacing: -0.01em;
  --text-heading-h4--font-weight: 600;

  /* Body / L — 20 / 30 / 400 */
  --text-body-l: 1.25rem;
  --text-body-l--line-height: 1.875rem;
  --text-body-l--font-weight: 400;

  /* Body / M — 18 / 27 / 400 */
  --text-body-m: 1.125rem;
  --text-body-m--line-height: 1.6875rem;
  --text-body-m--font-weight: 400;

  /* Body / S — 16 / 24 / 400 */
  --text-body-s: 1rem;
  --text-body-s--line-height: 1.5rem;
  --text-body-s--font-weight: 400;

  /* Label — 14 / 18.2 / 500 */
  --text-label: 0.875rem;
  --text-label--line-height: 1.1375rem;
  --text-label--font-weight: 500;

  /* Caption — 12 / 15.6 / 500 */
  --text-caption: 0.75rem;
  --text-caption--line-height: 0.975rem;
  --text-caption--font-weight: 500;

  --tracking-tight-display: -0.02em;
  --tracking-tight-heading: -0.01em;
  --tracking-normal: 0em;

  /* SPACING — 4px scale */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.5rem;
  --spacing-6: 2rem;
  --spacing-7: 3rem;
  --spacing-8: 4rem;
  --spacing-9: 6rem;
  --spacing-10: 8rem;

  --spacing-section: 6rem;
  --spacing-section-lg: 8rem;
  --spacing-section-mobile: 3rem;

  /* COLORS — primitives */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-500: #71717a;
  --color-neutral-700: #3f3f46;
  --color-neutral-900: #18181b;
  --color-neutral-950: #0a0a0a;

  --color-brand-gradient-1: #6366f1;
  --color-brand-gradient-2: #ec4899;

  /* COLORS — semantic */
  --color-background-default: var(--color-neutral-0);
  --color-background-subtle: var(--color-neutral-50);

  --color-text-primary: var(--color-neutral-950);
  --color-text-secondary: var(--color-neutral-700);
  --color-text-muted: var(--color-neutral-500);

  --color-border-default: var(--color-neutral-200);

  --color-action-primary: var(--color-neutral-950);
  --color-action-secondary: var(--color-neutral-0);

  --color-accent-primary: var(--color-brand-gradient-1);
  --color-accent-secondary: var(--color-brand-gradient-2);

  /* RADIUS */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.25rem;
  --radius-pill: 999px;

  /* LAYOUT */
  --container-portfolio: 75rem; /* 1200px */

  /* BREAKPOINTS */
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 90rem;
}
```

## 3. Page & section spec

### Global layout
- Content width: `--container-portfolio` (1200px), centered, side padding min `--spacing-5` mobile / `--spacing-8`+ desktop
- Background: `--color-background-default` throughout — no colored section backgrounds
- Section rhythm: `--spacing-section` / `--spacing-section-mobile` always — never a one-off margin

### Nav
- Left: name/logo as text (`--text-heading-h4`, `--font-weight-semibold`)
- Right: `Blog` link, `Contact ▾` dropdown (LinkedIn, WhatsApp, Email, Schedule a meeting, Phone, Download Résumé)
- No border, no background fill on the bar itself

### Hero
- Name: `--text-display-xl` desktop / `--text-display-l` or `--text-heading-h1` mobile, `--color-text-primary`
- One static role line beneath in `--color-text-secondary`, `--text-body-l`. No animation, no typewriter.

### Featured Projects
Two-column card: left = title (`--text-heading-h2`) + 2–3 sentence description (`--text-body-m`, `--color-text-secondary`); right = large tile, `--radius-lg`, holding a real screenshot or a soft radial-glow treatment behind a wordmark/icon using `--color-accent-primary` → `--color-accent-secondary`. Alternate text side left/right for 3+ projects; keep consistent for 2. Each card links to a full case-study page.

### Technologies / Skills
**Typography only — no chart.** Three groups as plain text columns: `Frontend`, `Backend & DevOps`, `AI`. Group name = `--text-label` + `--color-text-muted`, uppercase optional; tech names listed beneath in `--text-body-m`, `--color-text-primary`. Optional single monochrome glyph per item — no colored logos.

**Twinkle micro-interaction** on hover/focus of an individual tech item: a small cluster of faint dots (`--color-border-default` or `--color-text-muted` tone) fades in and softly twinkles around the item, then fades out on hover-out. Must be:
- Scoped to the hovered item only — never page-wide, never always-on
- CSS `opacity`/`transform` keyframes only, `animation-play-state: paused` by default, `running` only while hovered/focused
- Zero measurable cost at rest (no canvas, no JS animation loop running when idle)

This is the one explicit exception to the animation policy in §0. Do not extend it elsewhere without approval.

### Work Experience
Plain row list: role (`--text-body-m`, bold, left) — company (`--text-body-m`, regular, mid) — date range (`--text-body-s`, `--color-text-muted`, right-aligned). Hairline `--color-border-default` divider between rows. No logos, no icons, no timeline graphic.

### Testimonials
Quote (`--text-body-l`) + name + role/company (`--text-label`, `--color-text-muted`). Horizontal scroll or static row of 2–3 on desktop, stacked on mobile. No card borders — spacing separates them.

### Latest Blog
Horizontal row of cards. Each: dark rounded thumbnail (`--radius-lg`) with large bold white text overlaid near the bottom, then below: post title (`--text-heading-h4`), `date · category` (`--text-caption`, `--color-text-muted`), "Read blog →" link. Section header "Latest Blogs" + pill "View blog" button top-right, `--radius-pill`, linking to `/blog`.

### Footer
Small nav repeat, social icon row, one dry line referencing the bee, copyright line (`--text-caption`). Nothing else.

### Bee — folder only, do not build yet
Create `src/components/bee/README.md` only: "Phase 2 — do not implement until all static sections are built, reviewed, tested, and approved."

## 4. Content/data structure

- `src/content/projects/*.mdx` — frontmatter: `title, slug, summary, description, tags, image, links`
- `src/content/blog/*.mdx` — frontmatter: `title, slug, date, category, excerpt, coverImage`
- `src/content/experience.json` — array of `{ role, company, startDate, endDate }`
- `src/content/testimonials.json` — array of `{ quote, name, role, company }`

`TODO:`-prefix placeholder content until real content is supplied. Never invent real names, employers, or quotes.

## 5. Testing strategy

**Setup (do this right after project scaffold, before building sections):**
```bash
npm init playwright@latest -- --yes
```
Config: test dir `tests/e2e/`, base URL `http://localhost:3000`, run against `npm run dev`/`npm run start`, at minimum Chromium + WebKit (covers desktop + Safari/iOS behavior). Add `@axe-core/playwright` for automated accessibility checks.

**One spec file per section, written immediately after that section is built — not batched at the end:**
- `nav.spec.ts` — Contact dropdown opens/closes, all links have correct `href`s, mobile nav renders correctly at 375px
- `hero.spec.ts` — name and role line render, no layout shift on load
- `featured-projects.spec.ts` — each card links to a real, non-404 case-study route
- `technologies.spec.ts` — hover triggers the twinkle only on the hovered item (assert no animation running on sibling items), no animation running when nothing is hovered
- `experience.spec.ts` — rows render in correct chronological order
- `testimonials.spec.ts` — scroll/stack behavior works at mobile and desktop widths
- `blog.spec.ts` — cards link to real, non-404 post routes; "View blog" links to `/blog`
- `footer.spec.ts` — social links have correct `href`s
- `a11y.spec.ts` — run an axe scan on every route, zero critical/serious violations

**Responsive smoke test:** one spec that loads every route at 375px, 768px, and 1440px and asserts no horizontal scroll and no console errors.

A section is not complete until its spec file exists and passes — this replaces manual "does it look right" checks with something that stays true after future changes.

## 6. Working in Antigravity (free tier)

- Skills used on this project live in `.agents/skills/<skill-name>/` (project scope) — see repo setup notes for which ones are installed.
- These skills are **explicit-only**: Antigravity will not auto-trigger them. Name the skill directly in your prompt when you want it applied (e.g. "using the spencer-approved-frontends skill, review this component").
- Stay in one continuous session per work block rather than restarting conversations — restarts cost requests to rebuild context.
- Run the full verification loop (§0) yourself after every change instead of asking the agent to eyeball it — this is the biggest lever for not burning quota.
- Commit after every green, tested section.

## 7. Definition of done (every section must pass all of these)

1. `npm run build` — zero errors
2. `npm run lint` — zero warnings
3. `npx tsc --noEmit` — zero errors
4. Corresponding Playwright spec exists and passes
5. Axe accessibility scan — zero critical/serious violations
6. Visually verified at 375px, 768px, and 1440px
7. Zero console errors/warnings in the browser
8. Fully keyboard-navigable

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
