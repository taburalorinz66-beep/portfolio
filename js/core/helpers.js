/* ============================================================
   js/core/helpers.js
   Small tools used everywhere: $("#id") to find an element, wait(),
   clamp(), store (safe localStorage), esc() to make text safe, etc.
   Loaded on the site AND on the admin page.
   ============================================================ */

// Safety net: if js/config.js is missing, the site still opens (in sample mode) instead of a white page.
if (typeof CONFIG === "undefined") window.CONFIG = { name: "Lorinz G. Tabura", supabaseUrl: "", supabaseAnonKey: "", bucket: "portfolio-files", web3formsKey: "" };


const $ = (s, r = document) => r.querySelector(s);

const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const wait = ms => new Promise(r => setTimeout(r, ms));

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const lerp = (a, b, t) => a + (b - a) * t;

const rint = (r, a, b) => Math.floor(a + r() * (b - a + 1));

const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
};

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hexToRgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }

function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * t) + "," + Math.round(A[1] + (B[1] - A[1]) * t) + "," + Math.round(A[2] + (B[2] - A[2]) * t) + ")";
}

function mk(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

/* ---- text safety + formatting ---- */

// Turns  <b>  into plain text so nothing a visitor types can run as code.
function esc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Only allow normal web links (https:, http:). Blocks  javascript:  tricks.
function safeUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return "";
}

function formatSize(bytes) {
  const b = Number(bytes) || 0;
  if (b < 1024) return b + " B";
  if (b < 1048576) return Math.round(b / 1024) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// "My Game (v2).zip" -> "My-Game-v2-.zip"  (safe for file storage)
function safeName(name) {
  return String(name || "file").replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80);
}
