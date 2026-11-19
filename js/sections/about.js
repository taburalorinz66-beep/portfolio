/* ============================================================
   js/sections/about.js
   ABOUT section: pixel avatar, typing terminal, bio, and the stat boxes.
   Edit the words in js/content.js.
   ============================================================ */

function renderAbout() {
  $("#bio").textContent = CONTENT.bio;
  const av = $("#avatar");
  if (CONTENT.photo) {
    av.replaceWith(Object.assign(document.createElement("img"), { src: CONTENT.photo, alt: CONFIG.name }));
  } else {
    drawAvatar(av);
  }
  renderStats();
}

// The 4 boxes. GAMES and WEBSITES count what is published (see Projects.items).
function renderStats() {
  const games = Projects.items.filter(p => p.category === "game").length;
  const sites = Projects.items.filter(p => p.category === "website").length;
  const stats = [[games, "GAMES"], [sites, "WEBSITES"], [SKILLS.length, "SKILLS"], ["∞", "COFFEE"]];
  const box = $("#stats");
  box.innerHTML = stats.map(s => '<div class="stat"><b data-count="' + (typeof s[0] === "number" ? s[0] : "") + '">' + s[0] + "</b><span>" + s[1] + "</span></div>").join("");
  if (box.classList.contains("visible")) $$("b[data-count]", box).forEach(countUp);
}

function countUp(el) {
  const n = parseInt(el.dataset.count, 10);
  if (isNaN(n) || reduce) return;
  const start = performance.now();
  (function tick(now) {
    const p = clamp((now - start) / 1100, 0, 1);
    el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

async function runTerminal() {
  const out = $("#terminal");
  out.innerHTML = "";
  const caret = '<span class="caret"></span>';
  let html = "";
  for (const line of CONTENT.terminal) {
    const cmd = "$ " + line.cmd;
    if (reduce) { html += '<span class="cmd">' + cmd + "</span>\n" + line.out + "\n"; out.innerHTML = html; continue; }
    for (let i = 0; i <= cmd.length; i++) {
      out.innerHTML = html + '<span class="cmd">' + cmd.slice(0, i) + "</span>" + caret;
      await wait(28);
    }
    html += '<span class="cmd">' + cmd + "</span>\n";
    out.innerHTML = html + caret; await wait(260);
    html += line.out + "\n"; out.innerHTML = html + caret; await wait(180);
  }
  out.innerHTML = html + '<span class="cmd">$ </span>' + caret;
}
