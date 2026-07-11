# Vasiliki — Weaving Artist Website

A free, single-page portfolio website for a loom-weaving artist. Plain HTML, CSS and
vanilla JavaScript — no build step, no dependencies — designed to be hosted on **GitHub Pages**.

Bilingual (English / Ελληνικά) with a language toggle in the top-right of the navigation.

## Structure

```text
vasiliki/
├── index.html      # All content + section markup (edit text here)
├── styles.css      # Colours, fonts, layout (edit the design here)
├── script.js       # Language toggle, gallery filter, lightbox, menu
├── images/
│   └── works/      # Put artwork images here
└── README.md
```

Sections, in order: Hero → About → Works (with category filter) → Exhibitions & Press → Contact → Footer.

## Editing content

All visible text lives in `index.html`. Every translatable element carries two attributes:

```html
<a data-en="Works" data-el="Έργα">Works</a>
```

- `data-en` = English text
- `data-el` = Greek text

Edit **both** so the language toggle stays in sync. The text between the tags is just the
default shown before JavaScript runs — keep it equal to `data-en`.

Search the file for `[Replace ...]` / `[Add ...]` / `[...]` placeholders and fill in the real
bio, statement, exhibition entries, email and social links.

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
  <img src="images/works/piece-01.webp" alt="Untitled I" loading="lazy" />
  <figcaption>
    <span class="gallery__name" data-en="Untitled I" data-el="Χωρίς τίτλο I">Untitled I</span>
    <span class="gallery__meta" data-en="Wool, linen · 2024" data-el="Μαλλί, λινό · 2024">Wool, linen · 2024</span>
  </figcaption>
</figure>
```

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
