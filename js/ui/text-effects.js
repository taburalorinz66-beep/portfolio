/* ============================================================
   js/ui/text-effects.js
   Scrambling title text and the typing effect in the hero.
   ============================================================ */

function scramble(el, text, dur = 800) {
  if (reduce) { el.textContent = text; return; }
  const chars = "#@%&*+=<>/\\?!0123456789";
  const start = performance.now();
  (function tick(now) {
    const p = clamp((now - start) / dur, 0, 1);
    const rev = Math.floor(p * text.length);
    let out = "";
    for (let i = 0; i < text.length; i++) {
      out += (text[i] === " " || i < rev) ? text[i] : chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
  })(start);
}

function startTyping() {
  const el = $("#typing");
  let ri = 0, ci = 0, del = false;
  if (reduce) { el.textContent = CONTENT.roles[0]; return; }
  (function step() {
    const word = CONTENT.roles[ri];
    el.textContent = word.substring(0, ci);
    let delay = del ? 40 : 85;
    if (!del && ci < word.length) ci++;
    else if (!del) { del = true; delay = 1500; }
    else if (ci > 0) ci--;
    else { del = false; ri = (ri + 1) % CONTENT.roles.length; delay = 350; }
    setTimeout(step, delay);
  })();
}
