/* ============================================================
   js/visuals/palettes.js
   The colors of the pixel city for each look: night and day.
   The page colors (buttons, text...) are in css/base/variables.css.
   ============================================================ */

const SCENES = {
  night: {
    stars: true, craters: true, halo: 0.045,
    sky: ["#07071a", "#0d0e2e", "#1a1a4a", "#2d2466", "#4a2f7a", "#6b3b8c"],
    far: "#13123a", farRim: "#201f56", mid: "#0f0f34", midRim: "#2c3182", near: "#191640", nearRim: "#3a3a9a",
    farWin: ["#3a3a8a", "#4a4aa0"], dark: "#171650",
    win: ["#4fe3ff", "#ffe9a8", "#ff7bd5", "#8fd0ff"], neon: ["#4fe3ff", "#ff7bd5", "#b565e6"],
    moon: "#dfe6ff", tint: "rgba(7,6,26,.35)",
    bloom: ["#7a3fb0", "#a455d6", "#c46fe6", "#e48ae8", "#ff9fe6", "#ffc9f2"],
    trunk: "#2a1838", ground: "#0b0a20", side: "#1c1b4c", rail: "#2a2566", brace: "#c0407a", cloud: "#1b1b45", lamp: "#ffd98a"
  },
  day: {
    stars: false, craters: false, halo: 0.14,
    sky: ["#6fb8ff", "#8fcaff", "#b5dcff", "#d8e8ff", "#ffe0f0", "#ffd0e0"],
    far: "#b9b4e8", farRim: "#d3cff5", mid: "#8d86d2", midRim: "#b8b2ee", near: "#6c64b8", nearRim: "#9890e0",
    farWin: ["#cfc9f2", "#e2defa"], dark: "#7d76c6",
    win: ["#dff2ff", "#ffffff", "#c4e4ff", "#ffe8f5"], neon: ["#0fb3d6", "#e0409c", "#8a50d8"],
    moon: "#fff2a8", tint: "rgba(255,255,255,.10)",
    bloom: ["#c45aa8", "#d86cc0", "#e885d0", "#f59bdc", "#ffb3e6", "#ffd6f2"],
    trunk: "#5b3a62", ground: "#8a82c8", side: "#a9a2de", rail: "#6a62b4", brace: "#d6408f", cloud: "#ffffff", lamp: "#ffe7a0"
  }
};
