---
name: testing-portfolio
description: Test the Sweta Irom multi-page portfolio site end-to-end. Use when verifying UI, navigation, theme toggle, or page content changes.
---

# Testing the Portfolio Site

## Local Setup
- The site is pure static HTML/CSS/JS — no build step needed.
- Serve with any static server: `python3 -m http.server 8080` from the repo root, or `npx serve -p 8080`.
- Pages: `index.html` (Home), `works.html` (Works), `about.html` (About).

## Key Features to Test

### Navigation
- Three nav links in the header: HOME, WORKS, ABOUT.
- Each page has `class="active"` on its own nav link (highlighted in rust/orange color).
- Cross-page links: "VIEW WORKS" CTA on Home → works.html, "GET IN TOUCH" → about.html#contact.

### Theme Toggle
- Button in top-right of nav bar, labeled "LIGHT" (when dark) or "DARK" (when light).
- Theme is persisted via `localStorage.setItem('theme', ...)` so it survives page navigations.
- Default is `data-theme="dark"` set on `<html>` in all pages; JS overrides from localStorage or system preference.
- To test persistence: toggle theme, navigate to another page, confirm theme is retained.
- To test from clean state: clear localStorage first (`localStorage.clear()` in console, then reload).

### Home Page Content
- Hero section: name "Sweta Irom", eyebrow "IMPHAL VALLEY · MANIPUR, INDIA", description paragraph, 3 meta items (Based in, Graduate 2021, Specialization).
- Animated contour canvas (`canvas#contour`) — should show animated wavy lines.
- 3 organic blob divs with CSS animations.
- 2 featured work cards: "Poa Mecca" and "Mishing & Panbari Village".
- Stats strip: 4 cells with values "6+", "4", "2x", "5".
- Approach section: 3 columns (2D drafting, 3D visualization, Handoff).

### Works Page Content
- 6 project cards in 2-column grid: Poa Mecca, Mishing & Panbari Village, 60th ZoNASA, 62nd ZoNASA, Laurie Baker's Approach, ANDC.
- Approach section (same 3 columns as home).
- Toolset grid: 4 tiles — Photoshop, AutoCAD, SketchUp, Lumion.

### About Page Content
- Page header "About Sweta".
- Two-column layout: bio text + credentials sidebar (Education, Experience, Achievements, Skills).
- Blockquote: "A good drawing removes doubt..."
- Contact footer: email chanusweta57@gmail.com, phone +91 89741 86093, "SEND AN EMAIL" CTA.

### Mobile Menu (viewport < 720px)
- Nav links hidden; "MENU" button visible.
- Click MENU → mobile overlay opens with nav links.
- Click a link or the scrim → menu closes.
- Menu button uses `classList.toggle('open')` so clicking it again also closes.

## Common Issues
- If theme flashes on load, check that `<html>` has `data-theme="dark"` attribute and JS runs early.
- If theme doesn't persist across pages, check localStorage read/write in `applyTheme()`.
- The nav uses `mix-blend-mode: difference` on desktop (>720px) — this is intentional for legibility over varying hero backgrounds.
- Canvas animation respects `prefers-reduced-motion: reduce` — draws static contours once instead of animating.

## Devin Secrets Needed
None — the site is fully static with no external APIs or auth.
