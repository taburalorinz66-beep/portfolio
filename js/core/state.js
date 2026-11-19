/* ============================================================
   js/core/state.js
   The few things the site remembers while it runs.
   Two looks only: "night" and "day" (see css/base/variables.css).
   ============================================================ */

const THEMES = ["night", "day"];

const state = {
  theme: store.get("lgt-theme", "night"),
  sound: store.get("lgt-sound", "0") === "1",
  petals: true,
  busy: false
};

if (!THEMES.includes(state.theme)) state.theme = "night";
