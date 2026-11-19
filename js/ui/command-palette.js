/* ============================================================
   js/ui/command-palette.js
   Ctrl+K (or /) opens a search box of commands. Also holds the Konami code.
   ============================================================ */

const Palette = {
  idx: 0, list: [],
  commands() {
    const cmds = SECTIONS.map((id, i) => ({ t: "Go to " + LV_NAMES[i].toLowerCase(), h: "NAVIGATE", run: () => go(id) }));
    THEMES.forEach(t => cmds.push({ t: "Theme: " + t, h: "THEME", run: () => applyTheme(t, true) }));
    cmds.push({ t: "Toggle sound effects", h: "SYSTEM", run: () => setSound(!state.sound, true) });
    cmds.push({ t: "Toggle falling petals", h: "SYSTEM", run: () => { state.petals = !state.petals; toast(state.petals ? "PETALS ON" : "PETALS OFF", "good"); } });
    cmds.push({ t: "Play Petal Catcher", h: "GAME", run: async () => { await go("arcade"); Game.start(); } });
    Projects.items.forEach((p, i) => cmds.push({ t: "Open project: " + p.title, h: "PROJECT", run: () => openModal(i) }));
    cmds.push({ t: "Download CV", h: "CV", run: () => askDownloadCv() });
    CONTENT.socials.filter(s => s.url).forEach(s => cmds.push({ t: "Open " + s.name, h: "LINK", run: () => window.open(s.url, "_blank", "noopener") }));
    return cmds;
  },
  open() {
    const el = $("#palette"); if (!el.hidden) return;
    this.all = this.commands(); $("#pal-input").value = ""; this.render("");
    el.hidden = false; document.body.style.overflow = "hidden";
    requestAnimationFrame(() => el.classList.add("open"));
    setTimeout(() => $("#pal-input").focus(), 30); Sfx.click();
  },
  close() {
    const el = $("#palette"); if (el.hidden) return;
    el.classList.remove("open"); document.body.style.overflow = "";
    setTimeout(() => { el.hidden = true; }, 280);
  },
  render(q) {
    q = q.trim().toLowerCase();
    this.list = this.all.filter(c => !q || c.t.toLowerCase().includes(q) || c.h.toLowerCase().includes(q));
    this.idx = 0;
    $("#pal-list").innerHTML = this.list.length
      ? this.list.map((c, i) => '<li role="option" data-i="' + i + '" class="' + (i === 0 ? "active" : "") + '"><span>' + c.t + "</span><small>" + c.h + "</small></li>").join("")
      : "<li>No matching command.</li>";
  },
  move(d) {
    if (!this.list.length) return;
    this.idx = (this.idx + d + this.list.length) % this.list.length;
    $$("#pal-list li").forEach((li, i) => li.classList.toggle("active", i === this.idx));
    const a = $("#pal-list li.active"); if (a) a.scrollIntoView({ block: "nearest" });
    Sfx.hover();
  },
  run(i) { const c = this.list[i]; if (!c) return; this.close(); setTimeout(c.run, 220); }
};

function initPalette() {
  $("#btn-cmd").addEventListener("click", () => Palette.open());
  $("#palette").addEventListener("click", e => { if (e.target.closest("[data-close]")) Palette.close(); });
  $("#pal-input").addEventListener("input", e => Palette.render(e.target.value));
  $("#pal-input").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); Palette.move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); Palette.move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); Palette.run(Palette.idx); }
  });
  $("#pal-list").addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) Palette.run(+li.dataset.i); });
  $("#pal-list").addEventListener("mousemove", e => { const li = e.target.closest("li[data-i]"); if (li && +li.dataset.i !== Palette.idx) { Palette.idx = +li.dataset.i; $$("#pal-list li").forEach((x, i) => x.classList.toggle("active", i === Palette.idx)); } });

  const konami = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let kpos = 0;
  window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    const typing = /input|textarea/i.test(e.target.tagName);
    if ((e.ctrlKey || e.metaKey) && k === "k") { e.preventDefault(); $("#palette").hidden ? Palette.open() : Palette.close(); return; }
    if (k === "/" && !typing && $("#palette").hidden) { e.preventDefault(); Palette.open(); return; }
    if (k === "escape") { closeModal(); Palette.close(); closeMenu(); }
    if (!$("#modal").hidden && !typing) { if (k === "arrowright") stepModal(1); if (k === "arrowleft") stepModal(-1); }
    if (typing) return;
    kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
    if (kpos === konami.length) {
      kpos = 0;
      const on = document.documentElement.classList.toggle("cheat");
      Game.cheat = on; Sfx.level();
      FX.burst(window.innerWidth / 2, window.innerHeight / 2, 80, ["#19f0a0", "#22d3ee", "#ffd966", "#7c5cff"]);
      toast(on ? "CHEAT CODE ON: +30 LIVES & RAINBOW MODE" : "CHEAT CODE OFF", "good");
    }
  });
}
