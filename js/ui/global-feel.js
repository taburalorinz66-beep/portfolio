/* ============================================================
   js/ui/global-feel.js
   Click sounds, hover sounds, nav links, and the header buttons.
   ============================================================ */

function initGlobalFeel() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-nav]");
    if (a) { e.preventDefault(); go(a.getAttribute("href").slice(1)); return; }
    if (e.target.closest("button, a, .filter")) Sfx.click();
  });
  let lastHover = 0;
  document.addEventListener("mouseover", e => {
    if (!e.target.closest("a, button, .card")) return;
    const n = performance.now(); if (n - lastHover > 90) { lastHover = n; Sfx.hover(); }
  });
  $("#btn-theme").addEventListener("click", toggleTheme);
  $("#btn-sound").addEventListener("click", () => setSound(!state.sound, true));
}
