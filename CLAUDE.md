# CLAUDE.md — Exxede.dev

## Project Overview
Exxede.dev marketing site — web app development studio in Punta Cana, DR.
Single-page vanilla HTML/CSS/JS site built with Vite 8, deployed to Vercel.

## Commands
```bash
bun run dev       # Dev server on :5173
bun run build     # Build to dist/
bun run preview   # Preview prod build
```

## Architecture
- **No framework** — vanilla HTML + CSS + JS
- `index.html` — single page, all sections
- `public/styles/main.css` — all styles, dark/light themes, responsive
- `public/scripts/main.js` — all interactivity (23 init functions)
- `public/scripts/i18n.js` — EN/ES translations (200+ keys)
- CDN: Three.js + Vanta.js for 3D mesh background

## Key Patterns
- Theme: `[data-theme="light"]` on `<html>`, persisted in localStorage
- Language: `currentLang` global, translations applied via `applyTranslations()`
- Modals: Service modals use `SERVICE_DATA` object in main.js
- Portfolio previews: iframe popups, `blockedSites` array for sites that refuse frames
- Buttons: `@property --btn-angle` drives rotating conic-gradient borders
- Nav letters: split into `<span class="letter">` by `initLetterNav()`
- Logo: rotates with scroll delta, snaps to 0deg when scroll stops

## Brand Colors
- Accent (teal): `#4fd1c5` (dark) / `#0d9488` (light)
- Electric (blue): `#60a5fa` / `#3b82f6`
- No purple — use dark blue or light gray instead
- Background: `#06060b` (dark) / `#f8f9fc` (light)

## Rules
- Never deploy without testing (`bun run build` first)
- No purple/violet colors anywhere
- Contact email: godrulla@gmail.com
- Formspree ID: xpwzgkvq
- Auto-deploy: push to `main` → Vercel builds
