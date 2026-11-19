/* ============================================================
   js/ui/theme.js
   Night / Day mode button, and the sound on/off button.
   Click NIGHT -> day mode turns on.  Click DAY -> night mode turns on.
   ============================================================ */

function setThemeLabel() {
  const night = state.theme === "night";
  const b = $("#btn-theme");
  b.textContent = night ? "NIGHT" : "DAY";
  b.title = night ? "Switch to day mode" : "Switch to night mode";
}

function applyTheme(name, announce) {
  state.theme = name;
  const root = document.documentElement;
  root.classList.add("theme-anim");
  root.setAttribute("data-theme", name);
  store.set("lgt-theme", name);
  setThemeLabel();
  Projects.repaintThumbs();
  Game.makeBg();
  setTimeout(() => root.classList.remove("theme-anim"), 700);
  if (announce) {
    toast(name === "night" ? "NIGHT MODE ON" : "DAY MODE ON", "good");
    FX.burst(window.innerWidth - 120, 40, 18);
    Sfx.coin();
  }
}

function toggleTheme() {
  applyTheme(state.theme === "night" ? "day" : "night", true);
}

function setSound(on, announce) {
  state.sound = on;
  store.set("lgt-sound", on ? "1" : "0");
  const b = $("#btn-sound");
  b.textContent = on ? "SFX ON" : "SFX OFF";
  b.setAttribute("aria-pressed", String(on));
  if (announce) { toast(on ? "SOUND ON" : "SOUND OFF", "good"); Sfx.click(); }
}
