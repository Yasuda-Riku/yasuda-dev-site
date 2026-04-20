# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio and app support site for yasuda-dev.com. Static HTML/CSS/JS — no build step, no frameworks, no npm, no node_modules. Push to `main` auto-deploys to Cloudflare.

**Live:** https://yasuda-dev.com/

## Development

Open `index.html` in a browser. No server needed. VS Code Live Server extension for live reload.

There is no build command, no linter, no test suite. The entire site is hand-authored static files.

## Deploy

Push to `main` → Cloudflare auto-deploys. Output directory is repo root. No build command configured.

## Architecture

### Design system

All design tokens live in CSS custom properties at the top of `style.css`:

- **Color:** `--bg: #FAFAF7`, `--fg: #1A1A1A`, `--muted: #636160`, `--accent: #FF5A1F` (vermillion)
- **Type:** Fraunces (display), Inter (body), JetBrains Mono (mono) — loaded from Google Fonts, non-render-blocking via `preload` + `onload` swap
- **Spacing:** `--section-gap: clamp(80px, 10vw, 140px)`, `--container: 1280px`
- **Type scale:** All `clamp()` based for responsive sizing

The muted color `#636160` was specifically chosen to pass WCAG AA contrast (5.89:1) against the background. Do not lighten it.

### Page types

**Top page** (`index.html`): Hero → Selected (work cards) → About → Contact. Each work card uses a "stretched link" pattern — the title `<a>` has `::after` covering the whole `.work` article, with inner CTAs at `z-index: 2`.

**App hub** (`apps/index.html`): Card list of all apps. Cards use the same cover-link pattern with `app-card__cover`.

**App support pages** (`apps/[slug]/index.html`): Per-app support with FAQ (using `<details>`), contact info, and links to privacy/terms. These are the URLs submitted to App Store Connect.

**Policy pages** (`apps/[slug]/privacy/`, `apps/[slug]/terms/`): Legal text extracted verbatim from each app's Swift source (PrivacyPolicyView.swift / TermsView.swift / LegalView.swift). Content must stay in sync with the app.

**404** (`404.html`): Minimal error page reusing site shell.

### Adding a new app

Follow this exact pattern (established for Joshirushi, Mentor AI, FitLoop):

1. Extract privacy policy and terms from the app's Swift source (full text, no edits)
2. Convert app icon: resize to 256px → WebP → `assets/apps/[slug]-icon.webp`
3. Convert screenshots: resize to 800px width → WebP → `assets/works/[slug]/`
4. Create `apps/[slug]/index.html` (support), `apps/[slug]/privacy/index.html`, `apps/[slug]/terms/index.html`
5. Add card to `apps/index.html`
6. Add work article to `index.html` Selected section (3 screenshots in `.work__shots` grid)
7. Update the Selected heading count ("Three apps" → "Four apps" etc.)
8. Update About section text
9. Update `sitemap.xml`

### Image handling

- Source PNGs are gitignored (`assets/works/**/*.png`)
- Only optimized WebPs are committed
- Screenshots: 800px wide, quality 82, method 6
- Icons: 256px square, quality 90
- All images must have `width`, `height`, `loading="lazy"`, `decoding="async"`

### JavaScript

`main.js` is ~20 lines: IntersectionObserver for `.reveal` elements (fade-in on scroll). That's it. No frameworks, no bundler.

## Design plan

Full design decisions documented in `docs/design-plan.md` (v3). Key constraints:

- **No dark mode** (decided, not deferred)
- **No build tools / npm** — "5 years from now the build still passes because there is no build"
- **No hamburger menu** — nav items are always visible
- **Font choice is permanent** — Fraunces + Inter + JetBrains Mono, never changing (swapping fonts breaks spacing)
- **NG list** enforced: no stock photos, no gradients, no parallax, no carousels, no `#000`/`#fff`, no emoji in body text

## gh CLI note

When using gh CLI from bash on this machine, set `GH_CONFIG_DIR="C:/Users/LLL/AppData/Roaming/GitHub CLI"` or auth won't be found.
