(function () {
  "use strict";

  /* ===================== Language toggle ===================== */
  var STORAGE_KEY = "vasiliki-lang";
  var langToggle = document.getElementById("langToggle");

  var DICT = window.I18N || {};

  function translate(key, lang) {
    var value = (DICT[lang] && DICT[lang][key]);
    if (value == null) value = (DICT.en && DICT.en[key]); // fallback to English
    return value;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = translate(el.getAttribute("data-i18n"), lang);
      if (value == null) return;
      if (el.tagName === "META") {
        el.setAttribute("content", value);
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var value = translate(el.getAttribute("data-i18n-alt"), lang);
      if (value != null) el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-lang") === lang);
    });

    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", lang === "el" ? "el_GR" : "en_US");

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  var savedLang = "en";
  try { savedLang = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) {}
  applyLanguage(savedLang);

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = document.documentElement.lang === "en" ? "el" : "en";
      applyLanguage(next);
    });
  }

  /* ===================== Floating nav (over hero / scrolled) ===================== */
  var nav = document.getElementById("nav");
  var hero = document.getElementById("hero");
  function onScroll() {
    if (!nav) return;
    var threshold = hero ? Math.max(hero.offsetHeight - 48, 40) : 40;
    nav.classList.toggle("is-scrolled", window.scrollY > threshold);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ===================== Menu panel ===================== */
  var navToggle = document.getElementById("navToggle");
  var navPanel = document.getElementById("navPanel");
  var navBackdrop = document.getElementById("navBackdrop");
  var navLinks = document.getElementById("navLinks");

  function isMenuOpen() {
    return !!(nav && nav.classList.contains("is-menu-open"));
  }

  function setMenuOpen(open) {
    if (!navToggle || !navPanel || !nav) return;
    nav.classList.toggle("is-menu-open", open);
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navPanel.setAttribute("aria-hidden", String(!open));
    if (navBackdrop) navBackdrop.setAttribute("aria-hidden", String(!open));
  }

  function closeMenu() { setMenuOpen(false); }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      setMenuOpen(!isMenuOpen());
    });
    if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);
    if (navLinks) {
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
    }
  }

  /* ===================== Portfolio filter ===================== */
  var filters = document.getElementById("filters");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filters.querySelectorAll(".filter").forEach(function (f) {
        f.classList.toggle("is-active", f === btn);
      });
      var cat = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = cat === "all" || item.getAttribute("data-category") === cat;
        item.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ===================== Lightbox ===================== */
  var lightbox = document.getElementById("lightbox");
  var stage = document.getElementById("lightboxStage");
  var caption = document.getElementById("lightboxCaption");
  var btnClose = document.getElementById("lightboxClose");
  var btnPrev = document.getElementById("lightboxPrev");
  var btnNext = document.getElementById("lightboxNext");
  var current = -1;

  function visibleItems() {
    return items.filter(function (item) { return !item.classList.contains("is-hidden"); });
  }

  function render(index) {
    var list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var item = list[current];
    var media = item.querySelector("img, .placeholder");
    stage.innerHTML = "";
    if (media) stage.appendChild(media.cloneNode(true));
    var name = item.querySelector(".gallery__name");
    caption.textContent = name ? name.textContent : "";
  }

  function openLightbox(item) {
    if (!lightbox) return;
    var list = visibleItems();
    render(list.indexOf(item));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnPrev) btnPrev.addEventListener("click", function () { render(current - 1); });
  if (btnNext) btnNext.addEventListener("click", function () { render(current + 1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMenuOpen()) {
        closeMenu();
        return;
      }
      if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
      return;
    }
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "ArrowLeft") render(current - 1);
    else if (e.key === "ArrowRight") render(current + 1);
  });

  /* ===================== Footer year ===================== */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
