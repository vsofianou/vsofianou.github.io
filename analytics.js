/**
 * Firebase Analytics (GA4). Loaded only over http(s) — skipped on file://.
 * Config is public by design; restrict the API key to your GitHub Pages domain
 * in Firebase Console → Project settings → Your apps / API key restrictions.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

var firebaseConfig = {
  apiKey: "AIzaSyDTDCisYd4tLLxQVIA0hURcFwsaZit1aOk",
  authDomain: "vasiliki-website.firebaseapp.com",
  projectId: "vasiliki-website",
  storageBucket: "vasiliki-website.firebasestorage.app",
  messagingSenderId: "335495407887",
  appId: "1:335495407887:web:52353e17a1a54e5398f67a",
  measurementId: "G-H6WQMDZCPJ"
};

if (location.protocol === "http:" || location.protocol === "https:") {
  isSupported().then(function (ok) {
    if (!ok) return;
    getAnalytics(initializeApp(firebaseConfig));
  }).catch(function () { /* ignore */ });
}
