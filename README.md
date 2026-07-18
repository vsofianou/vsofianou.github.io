# Vasiliki — Weaving Artist Website

A free, single-page portfolio website for a loom-weaving artist. Plain HTML, CSS and
vanilla JavaScript — no build step, no dependencies — designed to be hosted on **GitHub Pages**.

Bilingual (English / Ελληνικά) with a floating language toggle (top-right) and a menu button (top-left).

## Structure

```text
vasiliki/
├── index.html        # Section markup (references text by key)
├── translations.js   # All user-visible strings (edit text here)
├── styles.css        # Colours, fonts, layout (edit the design here)
├── script.js         # Language toggle, gallery filter, lightbox, menu
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

Search `translations.js` for `[Replace ...]` / `[Add ...]` / `[...]` placeholders and fill in
the real bio, statement, exhibition entries, email and social links.

### Adding a language

Add a new top-level block to `window.I18N` (e.g. `fr: { ... }`) with the same keys, then add a
`<span data-lang="fr">FR</span>` to the language toggle in `index.html`. Missing keys fall back
to English automatically.

### Contact

The email button uses `mailto:`. In `index.html` change:

```html
<a class="btn" href="mailto:hello@example.com" ...>
```

to the real address, and update the Instagram / Facebook URLs just below it.

## Adding artworks

Each piece is a `<figure class="gallery__item">` inside `<div class="gallery">`. Replace the
grey placeholder with a real image:

```html
<figure class="gallery__item" data-category="wall">
  <img src="images/works/piece-01.webp" data-i18n-alt="work.1.name" alt="Untitled I" loading="lazy" />
  <figcaption>
    <span class="gallery__name" data-i18n="work.1.name">Untitled I</span>
    <span class="gallery__meta" data-i18n="work.1.meta">Wool, linen · 2024</span>
  </figcaption>
</figure>
```

- Add the matching `work.N.name` / `work.N.meta` strings to **both** languages in
  `translations.js`. Use `data-i18n-alt="<key>"` on the `<img>` to translate its `alt` text.
- `data-category` must be one of: `wall`, `sculptural`, `functional`, `experimental`
  (these map to the filter buttons; rename/add both here and in the `.filters` block if needed).
- Put image files in `images/works/`.
- Prefer **WebP or optimized JPG**, roughly **1200–1600px** on the long edge, to keep the
  page fast. `loading="lazy"` defers off-screen images automatically.

## Preview locally

Just open `index.html` in a browser, or run a tiny local server (needed only if you later
add features that require it):

```bash
cd vasiliki
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `vasiliki`).
2. Push this folder to it:

```bash
cd vasiliki
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/vasiliki.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment**.
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` / `/ (root)` → **Save**
4. Wait ~1 minute. The site goes live at:

   `https://<your-username>.github.io/vasiliki/`

No build or GitHub Actions workflow is required — GitHub Pages serves the static files directly.

### Custom domain (optional)

In **Settings → Pages → Custom domain**, enter your domain, then add the DNS records GitHub
shows (a `CNAME` for a subdomain, or `A` records for an apex domain). GitHub can also issue a
free HTTPS certificate once DNS resolves.

## Notes

- Colours and fonts are CSS variables at the top of `styles.css` (`:root`) — change them in one
  place to restyle the whole site.
- The chosen language is remembered in the browser via `localStorage`.
