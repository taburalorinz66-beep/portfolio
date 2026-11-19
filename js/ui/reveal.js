/* ============================================================
   js/ui/reveal.js
   Makes things slide in when you scroll to them.
   ============================================================ */

function initReveal() {
  let terminalDone = false;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("visible");
      if (el.matches("[data-scramble]") && !el.dataset.done) { el.dataset.done = "1"; scramble(el, el.dataset.text, 700); }
      if (el.id === "stats") $$("b[data-count]", el).forEach(countUp);
      if (el.classList.contains("terminal") && !terminalDone) { terminalDone = true; runTerminal(); }
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".section-title").forEach(t => { t.dataset.text = t.textContent; });
  $$(".reveal, .section-title, .terminal").forEach(el => io.observe(el));
  $$(".skill").forEach(el => io.observe(el));
}
