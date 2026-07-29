# Vasiliki — Weaving Artist Website

A free, single-page portfolio website for a loom-weaving artist. Plain HTML, CSS and
vanilla JavaScript — no build step, no npm — designed to be hosted on **GitHub Pages**.

Bilingual (English / Ελληνικά) with a floating language toggle (top-right) and a menu button (top-left).
Firebase Analytics (`analytics.js`) runs on the live/http site only.

## Structure

```text
vasiliki/
├── index.html        # Section markup (references text by key)
├── translations.js   # All user-visible strings (edit text here)
├── styles.css        # Colours, fonts, layout (edit the design here)
├── script.js         # Language toggle, gallery filter, work viewer, menu
├── analytics.js      # Firebase Analytics (skipped on file://)
├── images/
│   └── works/        # Put artwork images here
└── README.md
```

Sections, in order: Hero → About → Works (with category filter) → Exhibitions & Press → Contact → Footer.

## Editing content

All user-visible text lives in **`translations.js`**, grouped by language (`en`, `el`).
Each string has a key; the markup in `index.html` references that key via `data-i18n`:

```js
// translations.js
window.I18N = {
  en: { "nav.works": "Works", /* ... */ },
  el: { "nav.works": "Έργα",  /* ... */ }
};
```

```html
<!-- index.html -->
<a href="#portfolio" data-i18n="nav.works">Works</a>
```

To change wording, edit the value in `translations.js` for **both** `en` and `el`. The text
between the tags in `index.html` is only a fallback shown before JavaScript runs — keep it
roughly equal to the English string.

Search `translations.js` for `[Replace ...]` / `[Add ...]` / `[...]` placeholders when adding
new copy (e.g. artwork names). Edit existing strings in place for both `en` and `el`.

### Adding a language

Add a new top-level block to `window.I18N` (e.g. `fr: { ... }`) with the same keys, then add a
`<span data-lang="fr">FR</span>` to the language toggle in `index.html`. Missing keys fall back
to English automatically.

### Contact

The email button uses `mailto:`. In `index.html` change:

```html
<a class="btn" href="mailto:vsofianou.art@gmail.com" ...>
```

to the real address, and update the Instagram / Facebook URLs just below it.

## Adding artworks

Each piece is a `<figure class="gallery__item">` inside `<div class="gallery">`. The grid shows
the cover image; click opens a viewer with all photos and the description.

```html
<figure class="gallery__item" data-category="wall" data-featured="true" data-work="1">
  <div class="gallery__thumb">
    <img src="images/works/1/01.webp" data-i18n-alt="work.1.name" alt="Untitled I" loading="lazy" />
  </div>
  <figcaption>
    <span class="gallery__name" data-i18n="work.1.name">Untitled I</span>
    <span class="gallery__meta" data-i18n="work.1.meta">Wool, linen · 2024</span>
  </figcaption>
  <div class="gallery__extra" hidden>
    <div class="gallery__images">
      <img src="images/works/1/01.webp" alt="" />
      <img src="images/works/1/02.webp" alt="" />
    </div>
    <p class="gallery__desc" data-i18n="work.1.desc"></p>
  </div>
</figure>
```

- Add `work.N.name` / `work.N.meta` / `work.N.desc` in **both** languages in `translations.js`.
  Use `data-i18n-alt="<key>"` on the cover `<img>` for its `alt` text.
- `data-category`: `wall`, `sculptural`, `functional`, or `experimental`.
- `data-featured="true"` includes the piece in the default **Featured** tab (there is no All).
- Put images in `images/works/N/` as `01.webp`, `02.webp`, … Prefer **WebP**, roughly
  **1200–1600px** on the long edge. `loading="lazy"` on the cover defers off-screen loads.

## Preview locally

Just open `index.html` in a browser, or run a tiny local server (needed only if you later
add features that require it):

```bash
cd vasiliki
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

Repo: [vsofianou/vsofianou](https://github.com/vsofianou/vsofianou) · live URL:
`https://vsofianou.github.io/vsofianou/`

```bash
cd vasiliki
git push -u origin main
```

Then on GitHub: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.

No build or GitHub Actions workflow is required — GitHub Pages serves the static files directly.

### Custom domain (optional)

In **Settings → Pages → Custom domain**, enter your domain, then add the DNS records GitHub
shows (a `CNAME` for a subdomain, or `A` records for an apex domain). GitHub can also issue a
free HTTPS certificate once DNS resolves.

## Notes

- Colours and fonts are CSS variables at the top of `styles.css` (`:root`) — change them in one
  place to restyle the whole site.
- The chosen language is remembered in the browser via `localStorage`.
