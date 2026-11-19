/* ============================================================
   js/visuals/thumb.js
   paintThumb(): the small neon picture on each project card.
   Each project gets its own pattern from its "seed" number.
   ============================================================ */

function paintThumb(cv, seed) {
  const css = getComputedStyle(document.documentElement);
  const col = n => css.getPropertyValue(n).trim() || "#19f0a0";
  const W = cv.width, H = cv.height, g = cv.getContext("2d");
  const rand = mulberry32(seed * 977 + 5);
  const main = [col("--a1"), col("--a2"), col("--a3"), col("--a4")];
  const c1 = main[Math.floor(rand() * 4)], c2 = main[Math.floor(rand() * 4)];

  g.fillStyle = col("--field"); g.fillRect(0, 0, W, H);

  // soft color glow
  const glow = g.createRadialGradient(W * (0.2 + rand() * 0.6), H * (0.2 + rand() * 0.6), 2, W * 0.5, H * 0.5, W * 0.7);
  glow.addColorStop(0, c1 + "88"); glow.addColorStop(1, "transparent");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);

  // grid lines
  g.strokeStyle = col("--border"); g.globalAlpha = 0.7; g.lineWidth = 1;
  const step = Math.max(8, Math.round(W / 12));
  for (let x = 0; x < W; x += step) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
  for (let y = 0; y < H; y += step) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
  g.globalAlpha = 1;

  // a few glowing blocks, like game tiles
  for (let i = 0; i < 6; i++) {
    const s = step * (1 + Math.floor(rand() * 2));
    const x = Math.floor(rand() * (W / step)) * step, y = Math.floor(rand() * (H / step)) * step;
    g.fillStyle = (i % 2 ? c1 : c2) + "cc"; g.fillRect(x + 2, y + 2, s - 4, s - 4);
  }

  // diagonal accent line
  g.strokeStyle = c2; g.lineWidth = Math.max(2, W / 60);
  g.beginPath(); g.moveTo(0, H * (0.6 + rand() * 0.3)); g.lineTo(W, H * (0.1 + rand() * 0.3)); g.stroke();
}
