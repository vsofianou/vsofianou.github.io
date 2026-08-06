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

  /* ===================== Exhibitions accordion (one open) ===================== */
  var exhibits = document.querySelector(".exhibits");
  if (exhibits) {
    exhibits.addEventListener("toggle", function (e) {
      var panel = e.target;
      if (!panel.classList || !panel.classList.contains("exhibit") || !panel.open) return;
      exhibits.querySelectorAll(".exhibit[open]").forEach(function (other) {
        if (other !== panel) other.open = false;
      });
    }, true);
  }

  /* ===================== Portfolio filter ===================== */
  var filters = document.getElementById("filters");
  var gallery = document.getElementById("gallery");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));

  function itemMatchesFilter(item, cat) {
    return cat === "featured"
      ? item.getAttribute("data-featured") === "true"
      : item.getAttribute("data-category") === cat;
  }

  function orderKeyForFilter(cat) {
    if (cat === "featured") return "data-order-featured";
    if (cat === "wall") return "data-order-wall";
    if (cat === "functional") return "data-order-functional";
    return "data-order-sculptural";
  }

  function applyFilter(cat) {
    if (!gallery) return;
    var orderKey = orderKeyForFilter(cat);
    var visible = [];
    var hidden = [];

    items.forEach(function (item) {
      if (itemMatchesFilter(item, cat)) visible.push(item);
      else hidden.push(item);
    });

    visible.sort(function (a, b) {
      return parseInt(a.getAttribute(orderKey), 10) - parseInt(b.getAttribute(orderKey), 10);
    });

    visible.forEach(function (item) { item.classList.remove("is-hidden"); });
    hidden.forEach(function (item) { item.classList.add("is-hidden"); });
    visible.concat(hidden).forEach(function (item) { gallery.appendChild(item); });
  }

  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filters.querySelectorAll(".filter").forEach(function (f) {
        f.classList.toggle("is-active", f === btn);
      });
      applyFilter(btn.getAttribute("data-filter"));
    });
    var active = filters.querySelector(".filter.is-active");
    applyFilter(active ? active.getAttribute("data-filter") : "featured");
  }

  /* ===================== Work viewer ===================== */
  var viewer = document.getElementById("viewer");
  var viewerPanel = document.getElementById("viewerPanel");
  var viewerStage = document.getElementById("viewerStage");
  var viewerName = document.getElementById("viewerName");
  var viewerExtra = document.getElementById("viewerExtra");
  var viewerDesc = document.getElementById("viewerDesc");
  var viewerCounter = document.getElementById("viewerCounter");
  var btnClose = document.getElementById("viewerClose");
  var btnPrev = document.getElementById("viewerPrev");
  var btnNext = document.getElementById("viewerNext");
  var workMedia = [];
  var mediaIndex = 0;

  function isViewerOpen() {
    return !!(viewer && viewer.classList.contains("is-open"));
  }

  function collectMedia(item) {
    var nodes = item.querySelectorAll(".gallery__images > img, .gallery__images > .placeholder");
    if (nodes.length) return Array.prototype.slice.call(nodes);
    var cover = null;
    for (var i = 0; i < item.children.length; i++) {
      var child = item.children[i];
      if (child.tagName === "IMG" || (child.classList && child.classList.contains("placeholder"))) {
        cover = child;
        break;
      }
    }
    return cover ? [cover] : [];
  }

  function renderMedia(index) {
    if (!workMedia.length || !viewerStage) return;
    mediaIndex = (index + workMedia.length) % workMedia.length;
    viewerStage.innerHTML = "";
    viewerStage.appendChild(workMedia[mediaIndex].cloneNode(true));

    var multi = workMedia.length > 1;
    if (btnPrev) btnPrev.hidden = !multi;
    if (btnNext) btnNext.hidden = !multi;
    if (viewerCounter) {
      viewerCounter.hidden = !multi;
      viewerCounter.textContent = multi ? (mediaIndex + 1) + " / " + workMedia.length : "";
    }
  }

  function openViewer(item) {
    if (!viewer) return;
    workMedia = collectMedia(item);
    mediaIndex = 0;

    var nameEl = item.querySelector(".gallery__name");
    var extraEl = item.querySelector(".gallery__extra-line");
    var descEl = item.querySelector(".gallery__desc");
    if (viewerName) viewerName.textContent = nameEl ? nameEl.textContent : "";
    if (viewerExtra) {
      var extraText = extraEl ? extraEl.textContent.trim() : "";
      viewerExtra.textContent = extraText;
      viewerExtra.hidden = !extraText;
    }
    if (viewerDesc) viewerDesc.textContent = descEl ? descEl.textContent : "";

    renderMedia(0);
    if (viewerPanel) viewerPanel.scrollTop = 0;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    workMedia = [];
    mediaIndex = 0;
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () { openViewer(item); });
  });
  if (btnClose) btnClose.addEventListener("click", closeViewer);
  if (btnPrev) btnPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    renderMedia(mediaIndex - 1);
  });
  if (btnNext) btnNext.addEventListener("click", function (e) {
    e.stopPropagation();
    renderMedia(mediaIndex + 1);
  });
  if (viewer) {
    viewer.addEventListener("click", function (e) {
      if (e.target === viewer) closeViewer();
    });
  }

  /* Swipe on stage for prev/next image */
  var touchStartX = null;
  if (viewerStage) {
    viewerStage.addEventListener("touchstart", function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    viewerStage.addEventListener("touchend", function (e) {
      if (touchStartX == null || !e.changedTouches || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) renderMedia(mediaIndex + 1);
      else renderMedia(mediaIndex - 1);
    }, { passive: true });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMenuOpen()) {
        closeMenu();
        return;
      }
      if (isViewerOpen()) closeViewer();
      return;
    }
    if (!isViewerOpen()) return;
    if (e.key === "ArrowLeft") renderMedia(mediaIndex - 1);
    else if (e.key === "ArrowRight") renderMedia(mediaIndex + 1);
  });

  /* ===================== Footer year ===================== */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
