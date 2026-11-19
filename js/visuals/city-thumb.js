/* ============================================================
   js/visuals/city-thumb.js
   paintCity(): a small still picture of the city (project thumbnails + arcade background).
   ============================================================ */

function paintCity(cv, seed) {
  const P = SCENES[state.theme];
  const W = cv.width, H = cv.height, g = cv.getContext("2d");
  const rand = mulberry32(seed * 977 + 5);
  const bands = 12;
  for (let b = 0; b < bands; b++) {
    const t = b / (bands - 1) * (P.sky.length - 1);
    const i = Math.min(Math.floor(t), P.sky.length - 2);
    g.fillStyle = mixHex(P.sky[i], P.sky[i + 1], t - i);
    g.fillRect(0, Math.floor(b * H / bands), W, Math.ceil(H / bands) + 1);
  }
  g.fillStyle = "#fff";
  for (let i = 0; P.stars && i < W / 6; i++) g.fillRect(Math.floor(rand() * W), Math.floor(rand() * H * 0.5), 1, 1);
  const mr = Math.max(3, Math.round(H * 0.08)), mx = Math.round(W * (0.2 + rand() * 0.6)), my = Math.round(H * 0.25);
  g.fillStyle = P.moon;
  for (let dy = -mr; dy <= mr; dy++) for (let dx = -mr; dx <= mr; dx++) if (dx * dx + dy * dy <= mr * mr) g.fillRect(mx + dx, my + dy, 1, 1);
  const layers = [[P.far, P.farRim, 0.3, 0.55, 0.15], [P.mid, P.midRim, 0.4, 0.8, 0.4]];
  const base = H - Math.round(H * 0.1);
  layers.forEach(l => {
    let x = -2;
    while (x < W) {
      const bw = rint(rand, Math.round(W * 0.07), Math.round(W * 0.13)), bh = Math.round(H * (l[2] + rand() * (l[3] - l[2])));
      g.fillStyle = l[0]; g.fillRect(x, base - bh, bw, bh);
      g.fillStyle = l[1]; g.fillRect(x, base - bh, bw, 1);
      const big = W > 150, stepY = big ? 6 : 4, stepX = big ? 5 : 3, ww = big ? 2 : 1, wh = big ? 3 : 2;
      for (let wy = base - bh + 3; wy < base - 3; wy += stepY) for (let wx = x + 2; wx < x + bw - 2; wx += stepX) {
        if (rand() < l[4]) { g.fillStyle = pick(rand, P.win); g.fillRect(wx, wy, ww, wh); }
      }
      x += bw + 1;
    }
  });
  g.fillStyle = P.ground; g.fillRect(0, base, W, H - base);
  const tx = Math.round(W * (0.12 + rand() * 0.76));
  g.fillStyle = P.trunk; g.fillRect(tx, base - Math.round(H * 0.3), 2, Math.round(H * 0.3));
  bloomCluster(g, tx + 1, base - Math.round(H * 0.34), Math.round(H * 0.17), rand, P);
}
