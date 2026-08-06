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
├── script.js         # Language toggle, floating menu, gallery filter, work viewer, footer year
├── analytics.js      # Firebase Analytics (ES module; http(s) only)
├── robots.txt        # Crawler rules + sitemap pointer
├── sitemap.xml       # Single-URL sitemap for GitHub Pages
├── images/
│   ├── hero.webp     # Landing hero background (see Hero below)
│   ├── about.webp    # About section portrait
│   └── works/        # Artwork images + local-only works_data.json (excluded from Pages)
├── README.md         # Human-facing setup/editing/deploy guide
└── AGENTS.md         # This file
```

Page sections, in order: **Hero → About → Works (filterable) → Exhibitions & Press → Contact →
Footer.** (There is deliberately **no "Process" section** — it was dropped by choice.)

## Internationalization (i18n)

- All copy lives in `translations.js` as `window.I18N = { en: {...}, el: {...} }`, keyed by dot
  strings (e.g. `nav.works`, `about.bio.p1`, `work.supreme.meta`).
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
- `--statement` = **Ysabeau** (nav, section titles, gallery names, hero subtitle)
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

- **Source of truth for copy (local only):** `images/works/works_data.json` — excluded from
  GitHub Pages via `_config.yml`. Not loaded at runtime; chat/editing reference. Sync into
  `index.html` + `translations.js` when adding works.
- Structure: `featured` (id list only), then category arrays `wall` / `sculptural` /
  `functional` with full records. Titles are **English-only** (same string in `en` and `el`).
  Meta fields: `year`, `material_en`/`material_el`, optional `dimensions_en`/`dimensions_el`,
  optional `extra_en`/`extra_el` (viewer only — not shown in gallery captions). Displayed
  as `material · dimensions · year` (omit missing parts).
- Each piece is a `<figure class="gallery__item" data-category="…" data-work="<slug>">` inside
  `#gallery`. Optional `data-featured="true"` puts it in the default **Featured** filter.
- Filter tabs: **`featured`** (flag, default — no “All”), then **`wall`**, **`sculptural`**,
  **`functional`** (by `data-category`). A piece can be featured *and* belong to a category.
- **Order:** `data-order-featured`, `data-order-wall`, and `data-order-sculptural` (0-based,
  from `works_data.json`). `script.js` reorders visible gallery items when the active filter
  changes — featured follows the `featured` array; wall/sculptural follow their category arrays.
- Cover thumb lives in a fixed-ratio `.gallery__thumb` frame. Extra images + description live
  in a hidden `.gallery__extra` block (`.gallery__images` children + `.gallery__desc`) so the
  site still works on `file://` with no `fetch`. Description elements stay empty in HTML; copy
  comes from `translations.js`.
- Click opens a **work viewer** (not a cross-work lightbox): carousel through that piece’s
  images only (arrows / keyboard / swipe), plus title, meta, and a scrollable description.
  Close and pick another from the grid.
- i18n keys per piece: `work.<slug>.name`, `work.<slug>.meta`, optional `work.<slug>.extra`,
  `work.<slug>.desc` (both `en` and `el`; name identical in both).
- Image convention: slug files in `images/works/` — `{slug}-1.webp`, `{slug}-2.webp`, ….
  JSON `cover` (1-based index) selects the grid thumb; viewer still lists all images in numeric
  order. Prefer WebP, ~1200–1600px, lazy-loaded on the grid cover.

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
- After edits, keep it lint-clean; test the language toggle, filters, and work viewer still work.

## Current state / outstanding placeholders

Works are synced from `works_data.json`. Wall, sculptural, and functional categories are live;
featured ids in JSON may reference works not yet added.
