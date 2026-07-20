# Vasiliki — project context for AI assistants

Read this first. It is the core context for the `vasiliki` project and should be enough to start
work in any new chat without re-discovering the basics.

## What this is

A **free, single-page portfolio website** for **Vasiliki**, a textile artist who weaves on the
loom and creates woven/sculptural constructions. Hosted on **GitHub Pages**. The site is
**bilingual (English / Greek)** with a live language toggle.

Tone/aesthetic: quiet, gallery-like, image-first. Let the artwork breathe.

## Tech stack & hard constraints

- **Plain HTML + CSS + vanilla JS. No framework, no build step, no bundler, no npm.**
- **External resources:** Google Fonts + Firebase Analytics CDN (`analytics.js`, modular SDK).
  No other runtime deps. Analytics is skipped on `file://`.
- Must keep working when `index.html` is opened directly from disk (`file://`). This is why
  translations live in a **`.js`** file (a global object), NOT a `.json` loaded via `fetch()` —
  `fetch()` is blocked on `file://` and would silently break the site.
- Keep it accessible and responsive (mobile-first). Navigation is a floating menu button on all
  breakpoints (no fixed header bar).

## File structure

```text
vasiliki/
├── index.html        # Section markup; text referenced by i18n keys
├── translations.js   # ALL user-visible strings (en + el) — edit copy here
├── styles.css        # Design system + layout (single stylesheet)
├── script.js         # Language toggle, floating menu, gallery filter, lightbox, footer year
├── analytics.js      # Firebase Analytics (ES module; http(s) only)
├── robots.txt        # Crawler rules + sitemap pointer
├── sitemap.xml       # Single-URL sitemap for GitHub Pages
├── images/
│   ├── hero.webp     # Landing hero background (see Hero below)
│   └── works/        # Artwork images go here (currently empty; gallery uses placeholders)
├── README.md         # Human-facing setup/editing/deploy guide
└── AGENTS.md         # This file
```

Page sections, in order: **Hero → About → Works (filterable) → Exhibitions & Press → Contact →
Footer.** (There is deliberately **no "Process" section** — it was dropped by choice.)

## Internationalization (i18n)

- All copy lives in `translations.js` as `window.I18N = { en: {...}, el: {...} }`, keyed by dot
  strings (e.g. `nav.works`, `about.statement.p1`, `work.3.meta`).
- HTML references a key with `data-i18n="<key>"` (sets `textContent`; on `<meta>` sets
  `content`). Use `data-i18n-alt="<key>"` on an `<img>` to translate its `alt`.
- The visible text inside a tag is only a **fallback** shown before JS runs — keep it ≈ the
  English value.
- `script.js` `applyLanguage()` swaps all keys and **falls back to English** if a key is missing
  in the other language. Chosen language persists in `localStorage` under `vasiliki-lang`.
- Default language is English. Toggle floats top-right (`EN / ΕΛ`); menu button floats top-left.
- **When adding/adding to content, always provide BOTH `en` and `el`.**
- Adding a language: add a new top-level block to `window.I18N` with the same keys, then add a
  `<span data-lang="xx">` to the toggle in `index.html`.

## Design system (`:root` tokens in `styles.css`)

Palette is derived from the hero image (deep ultramarine blue with a gold thread):

| Token | Value | Role |
|-------|-------|------|
| `--accent` | `#1f2c9c` | Primary ultramarine — buttons, filters, links, exhibition year |
| `--accent-dark` | `#161f75` | Hover / darker primary |
| `--gold` / `--gold-bright` / `--gold-dark` | `#c8912f` / `#d4a53a` / `#a8781f` | Thread gold; bright gold for hero signature; dark for hovers |
| `--bg` / `--bg-alt` | `#f4f5fb` / `#e7e9f6` | Light cool backgrounds |
| `--ink` / `--muted` / `--line` | `#101641` / `#5a6086` / `#d2d6ec` | Text / secondary text / borders |

Change colors here; everything cascades from these variables.

### Fonts — and the Greek rule (IMPORTANT)

- `--sans` = **Inter** (body/UI)
- `--statement` = **Ysabeau** (nav, section titles, gallery names, statement, hero subtitle)
- `--script` = **Tangerine** Regular (hero signature only — Latin; SIL OFL 1.1)
- **HARD REQUIREMENT: any font used for content MUST include the basic *modern* Greek block
  (Unicode `U+0370–U+03FF`, the Google Fonts `greek` subset).** Otherwise Greek silently falls
  back to a different face and looks inconsistent.
  - `greek-ext` alone is NOT enough (that's polytonic/extended only).
  - Already rejected for this reason: **Cormorant Garamond** (no Greek), **Klee One**
    (`greek-ext` only), and **EB Garamond** (removed — replaced by Ysabeau). Do not reintroduce them.
  - Inter and Ysabeau cover modern Greek — verified.
- **Consistency between languages outranks stylistic wishes.** A true "handwritten" font with
  modern-Greek support is not available on Google Fonts; don't chase it.
- All fonts must be **free with a permissive license** (SIL OFL / Apache). No restrictive/binding
  licenses.

### Hero & navigation

- `.hero` is a full-viewport `cover` of `images/hero.webp` (`background-position: right bottom`
  so crop prefers top-left). Bottom-left signature block (~45vw):
  “Vasiliki Sofianou” in **Tangerine** (`--script`, bright gold `--gold-bright`; SIL OFL — Latin
  only, intentional exception to the Greek font rule), and underneath “Conceptual weaving” in
  **Ysabeau** (`--statement`). A gold scroll cue (↓) sits at the bottom center.
- There is **no fixed nav bar**. Floating frosted controls: menu button (top-left) opens a small
  panel with section links; language toggle (top-right). Over the hero they are cream-on-dark;
  after scrolling past the hero they switch to ink-on-frost for contrast on light sections.
- The image is preloaded (`<link rel="preload" as="image">`) as the LCP element; `theme-color`
  meta matches the blue.
- Keep `hero.webp` optimized (it was reduced from a 2.3 MB PNG to ~48 KB at 1536×1024). Prefer
  WebP, keep it small.

### SEO

- Canonical / OG / Twitter / JSON-LD `Person` live in `index.html` (absolute URLs for
  `https://vsofianou.github.io/vsofianou/`). If the site moves to a custom domain, update those,
  `robots.txt`, and `sitemap.xml` together.
- Hero name is the page `<h1>`. Real copy, image alts, and exhibitions matter more than tags.

## Portfolio / gallery

- Each piece is a `<figure class="gallery__item" data-category="…">` inside `#gallery`.
- Categories (map to filter buttons): **`wall`, `sculptural`, `functional`, `experimental`**.
- Filtering and the click-to-enlarge **lightbox** (keyboard + prev/next) are hand-rolled in
  `script.js` — no library.
- Currently the gallery shows grey **placeholders** (`Work 01`…`Work 06`). To add a real piece,
  replace the placeholder `<div>` with `<img src="images/works/… .webp" data-i18n-alt="work.N.name"
  alt="…" loading="lazy" />` and add `work.N.name` / `work.N.meta` to both languages in
  `translations.js`. Optimize images (WebP, ~1200–1600px, lazy-loaded).

## Deployment

- **Repo:** `https://github.com/vsofianou/vsofianou.git` · **branch:** `main`.
- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / root. Live at
  **`https://vsofianou.github.io/vsofianou/`**. No Actions workflow needed (static site).
- **SSH:** default `~/.ssh/id_rsa` is for `ioanniskouts`. For the **`vsofianou`** account, push
  with a key that account trusts (or HTTPS + PAT). Do not use the `xerx` host alias for this repo.
- Pushing to `main` is a protected action — expect an approval prompt and never force-push.
- Former remote (`xerx/vasiliki`) is obsolete; do not push site updates there.

## Local preview

Open `index.html`, or:

```bash
cd ~/Projects/vasiliki && python3 -m http.server 8000   # http://localhost:8000
```

## Conventions & guardrails

### Responses (token efficiency)

- Be maximally concise. Lead with the outcome; skip preamble, restating the ask, and recaps.
- Include only info the user needs to act or decide. No duplication across bullets/sections.
- Prefer one short sentence (or a tight bullet list) over paragraphs. Expand only if asked.
- Do not narrate internal steps, file tours, or “what I changed” line-by-line unless asked.
- Avoid filler (“Happy to…”, “Let me know if…”). Ask a question only when blocked.

### Code

- Edit copy in `translations.js`, not in the HTML.
- Restyle via the `:root` tokens, not scattered literals.
- Do not add build tooling, frameworks, or runtime dependencies without explicit approval.
- Do not hand-edit generated/minified assets (there are none — keep it that way).
- Verify any new content font supports modern Greek before using it (see Greek rule above).
- After edits, keep it lint-clean; test the language toggle, filter, and lightbox still work.

## Current state / outstanding placeholders

Real content still to be supplied by the owner (all currently placeholders):

- `about.bio` — the short bio paragraph (statement text IS real; bio is not).
- Contact email — `mailto:vsofianou.art@gmail.com` in `index.html`.
- Social links — Instagram / Facebook URLs in the Contact section.
- Exhibitions — add a `.exhibit` block in `index.html` + `exhibitions.N.venue` / `.place` /
  `.body` in both languages (`translations.js`). Year stays in the HTML `<time>`.
- Real artwork images in `images/works/` (gallery uses placeholders for now).
