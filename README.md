# Exxede.dev

Web app development studio website for **Exxede.dev** — based in Punta Cana, Dominican Republic.

Live: [exxede-dev.vercel.app](https://exxede-dev.vercel.app)

## Quick Start

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # Production build → dist/
bun run preview  # Preview production build
```

## Tech Stack

- **Build:** Vite 8
- **Code:** Vanilla HTML / CSS / JavaScript (zero framework dependencies)
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **3D Background:** Three.js + Vanta.js NET effect
- **Hosting:** Vercel (auto-deploys from `main` branch)
- **Forms:** Formspree (with mailto fallback)

## Project Structure

```
exxede-dev/
├── index.html                  # Single-page app (787 lines)
├── public/
│   ├── images/
│   │   ├── logo.png            # Primary logo (3032x1264)
│   │   ├── favicon-32.png      # Favicon
│   │   ├── favicon-192.png     # Android/PWA icon
│   │   └── apple-touch-icon.png
│   ├── scripts/
│   │   ├── main.js             # Dynamic engine (1,094 lines)
│   │   └── i18n.js             # EN/ES translations (292 lines)
│   └── styles/
│       └── main.css            # Full stylesheet (2,309 lines)
├── package.json
├── vite.config.js
└── .gitignore
```

## Features

### Sections (13)
1. **Hero** — Vanta.js 3D mesh background, typewriter text cycling, animated counters
2. **Tech Marquee** — Auto-scrolling SVG logo ticker
3. **Services** — 6 cards with 3D tilt, modal popups with full descriptions
4. **Portfolio** — 7 projects with iframe preview popups (fallback for blocked sites)
5. **Process** — 4-step timeline with deliverables
6. **Tech Stack** — 4 categories with hover tooltips linking to official sites
7. **About** — Company story + animated code block
8. **Why Punta Cana** — 4 competitive advantages
9. **FAQ** — 8 expandable questions (fully translated EN/ES)
10. **Contact** — Form with Formspree + mailto fallback
11. **Footer** — Links, company family, copyright

### Dynamic Effects
| Effect | Technique |
|--------|-----------|
| Shooting stars | Canvas 2D with particle system |
| 3D mesh background | Vanta.js NET (Three.js) |
| 3D card tilt | CSS perspective + JS mousemove |
| Typewriter hero | JS character-by-character typing/deleting |
| Letter-by-letter nav | JS span splitting + CSS staggered delays |
| Scroll-driven logo | JS scroll delta → CSS rotate, snaps to 0deg |
| Animated counters | IntersectionObserver + ease-out cubic |
| Code typing | Character-by-character with blinking cursor |
| Section zoom | IntersectionObserver ratio → scale/opacity |
| Parallax | Scroll position → translateY on hero elements |
| Rotating gradient buttons | `@property --btn-angle` + `conic-gradient` |
| Shimmer sweep | `::before` pseudo translateX on hover |
| Magnetic buttons | JS mousemove → translate towards cursor |

### Internationalization (i18n)
- **Languages:** English (en), Spanish (es)
- **Keys:** 200+ translation keys covering all sections
- **Toggle:** EN/ES pill button in navbar
- **Persistence:** `localStorage` key `exxede-lang`
- **File:** `public/scripts/i18n.js`

### Theming
- **Modes:** Dark (default), Light
- **Toggle:** Sun/moon button in navbar
- **Persistence:** `localStorage` key `exxede-theme`
- **CSS:** `[data-theme="light"]` overrides (25+ rules)
- **Vanta.js:** Colors update dynamically on theme change

## Portfolio Projects

| Project | URL | Type |
|---------|-----|------|
| Vlitz.ai | vilzai.web.app | AI Platform |
| Ocean Paradise | oceanparadise.do | Hospitality |
| LaMelaZa.do | dist-two-self-23.vercel.app | AI News |
| Prolici | prolici.web.app | Construction |
| Exxede Investments | exxede-28e8f.web.app | Investment |
| The Craziest Idea | wreir.com | Interactive Book |
| RDR Tours | rdrtours.vercel.app | Tourism |

Sites that block iframes (Vlitz.ai, Ocean Paradise, Exxede Investments) open in a new tab instead of the preview popup.

## Services

Each service has a clickable card that opens a modal with:
- Full description
- "What's Included" feature list (8 items)
- Technology tags
- Example project from the portfolio

| Service | Modal Key |
|---------|-----------|
| Web Applications | `web-apps` |
| Mobile-First PWAs | `pwa` |
| API & Backend | `api` |
| AI Integration | `ai` |
| E-Commerce | `ecommerce` |
| Performance & DevOps | `devops` |

## Contact Form

Submissions go to **godrulla@gmail.com** via:
1. **Primary:** Formspree API (`POST /f/xpwzgkvq`)
2. **Fallback:** `mailto:` with pre-filled subject and body

Fields: Name, Email, Project Type, Budget Range, Message.

## Deployment

Vercel auto-deploys on push to `main`:

```bash
git add -A
git commit -m "description"
git push  # Triggers Vercel build
```

Manual deploy: `vercel --prod`

## CSS Architecture

### Variables
- 48 CSS custom properties in `:root`
- Dual theme system via `[data-theme="light"]`
- Fluid typography using `clamp()`

### Button System
- **Primary:** Rotating conic-gradient border, shimmer sweep, pulsing glow
- **Ghost:** Underline draw animation, inset glow on hover
- **Card CTA:** Minimal with arrow slide-in on hover
- All buttons have `scale(0.97)` active press state

### Responsive Breakpoints
- `768px` — Mobile nav, single-column grids
- `480px` — Stacked buttons, reduced font sizes
- `640px` — Modal padding adjustments

## Browser Support

- Chrome/Edge 90+
- Safari 15.4+ (for `@property`, `color-mix`)
- Firefox 110+ (for `@property`)
- Mobile Safari / Chrome Android

## Dependencies

**Production:** None (zero runtime dependencies)

**Dev:** Vite 8.0.7

**CDN (loaded at runtime):**
- Three.js r134 — `cdnjs.cloudflare.com`
- Vanta.js 0.5.24 — `cdn.jsdelivr.net`
- Google Fonts — Space Grotesk, Inter, JetBrains Mono

## License

Proprietary. All rights reserved. Exxede.dev / Armando Diaz Silverio.
