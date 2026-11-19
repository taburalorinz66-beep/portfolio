/* ============================================================
   js/visuals/pixel-city.js
   Helpers that draw blossom trees and building rows (used by the city).
   ============================================================ */

function bloomCluster(g, cx, cy, r, rand, P) {
  const pal = P.bloom;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const d = Math.hypot(dx, dy * 1.15);
      if (d > r * (0.78 + rand() * 0.28)) continue;
      const light = (-dy / r) * 0.5 + 0.5 + (rand() - 0.5) * 0.7;
      const idx = clamp(Math.floor(light * pal.length), 0, pal.length - 1);
      g.fillStyle = pal[idx];
      g.fillRect(Math.round(cx + dx), Math.round(cy + dy), 1, 1);
    }
  }
}

function drawTree(g, x, by, h, rand, P) {
  const tw = Math.max(3, Math.round(h / 20));
  g.fillStyle = P.trunk;
  for (let y = 0; y < h * 0.6; y++) {
    const wob = Math.round(Math.sin(y * 0.14) * 1.5);
    g.fillRect(Math.round(x - tw / 2 + wob), by - y, tw + (y < 7 ? 2 : 0), 1);
  }
  const tips = [];
  for (let i = 0; i < 6; i++) {
    const ang = -Math.PI / 2 + (rand() - 0.5) * 2.5;
    const len = h * (0.28 + rand() * 0.28);
    const sy = by - h * 0.3 - rand() * h * 0.3;
    let px = x, py = sy;
    for (let s = 0; s < len; s++) {
      px = x + Math.cos(ang) * s; py = sy + Math.sin(ang) * s;
      g.fillRect(Math.round(px), Math.round(py), 2, 2);
    }
    tips.push([px, py]);
  }
  tips.forEach(t => bloomCluster(g, t[0], t[1], Math.round(h * (0.15 + rand() * 0.09)), rand, P));
  bloomCluster(g, x, by - h * 0.82, Math.round(h * 0.26), rand, P);
  for (let i = 0; i < 18; i++) {
    g.fillStyle = pick(rand, P.bloom);
    g.fillRect(Math.round(x + (rand() - 0.5) * h * 0.9), Math.round(by - rand() * h * 0.5), 1, 1);
  }
}

function makeSkyline(P, o) {
  const cv = mk(o.w, o.h), g = cv.getContext("2d");
  const rand = mulberry32(o.seed);
  const wins = [], neons = [];
  let x = -6;
  while (x < o.w) {
    const bw = rint(rand, o.minW, o.maxW);
    const bh = rint(rand, o.minH, o.maxH);
    const by = o.base - bh;
    g.fillStyle = o.fill; g.fillRect(x, by, bw, bh);
    g.fillStyle = o.rim; g.fillRect(x, by, 1, bh); g.fillRect(x, by, bw, 1);
    const roof = rand();
    if (roof < 0.25) { g.fillStyle = o.rim; g.fillRect(x + (bw >> 1), by - rint(rand, 4, 10), 1, 10); }
    else if (roof < 0.45) { g.fillStyle = o.fill; g.fillRect(x + 2, by - 3, 5, 3); g.fillStyle = o.rim; g.fillRect(x + 2, by - 3, 5, 1); }
    else if (roof < 0.55) { g.fillStyle = o.fill; g.fillRect(x + 3, by - 5, bw - 6, 5); g.fillStyle = o.rim; g.fillRect(x + 3, by - 5, bw - 6, 1); }
    for (let wy = by + 4; wy < o.base - 5; wy += 5) {
      for (let wx = x + 3; wx < x + bw - 3; wx += 4) {
        if (rand() < o.lit) wins.push({ x: wx, y: wy, c: pick(rand, o.winColors), on: rand() < 0.75 });
        else { g.fillStyle = o.dark; g.fillRect(wx, wy, 2, 3); }
      }
    }
    if (o.neon && bh > 50 && rand() < 0.34) {
      neons.push({ x: x + bw - 3, y: by + rint(rand, 6, Math.max(7, bh - 34)), h: rint(rand, 12, 24), c: pick(rand, P.neon), ph: rand() * 6.28 });
    }
    x += bw + rint(rand, 0, 2);
  }
  return { cv, wins, neons };
}
