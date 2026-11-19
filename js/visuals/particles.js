/* ============================================================
   js/visuals/particles.js
   Falling blossom petals, click bursts, and the mouse trail (one canvas).
   ============================================================ */

const FX = {
  petals: [], parts: [], trail: [], wind: 0.3, vx: 0, lastX: 0, lastY: 0, scrollV: 0, lastScroll: 0, mxp: -100, myp: -100,
  init() {
    this.cv = $("#fx"); this.g = this.cv.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    for (let i = 0; i < 0; i++) this.petals.push(this.newPetal(true));
    window.addEventListener("mousemove", e => {
      this.vx = e.clientX - this.lastX; this.lastX = e.clientX; this.lastY = e.clientY;
      this.mxp = e.clientX; this.myp = e.clientY;
      if (false) { this.trail.push({ x: e.clientX, y: e.clientY, life: 1 }); if (this.trail.length > 16) this.trail.shift(); }
    }, { passive: true });
    window.addEventListener("scroll", () => { this.scrollV = window.scrollY - this.lastScroll; this.lastScroll = window.scrollY; }, { passive: true });
    window.addEventListener("pointerdown", e => { if (e.target.closest && e.target.closest("#game")) return; this.burst(e.clientX, e.clientY, 14); });
    if (!reduce) requestAnimationFrame(() => this.frame());
  },
  resize() { this.cv.width = window.innerWidth; this.cv.height = window.innerHeight; },
  colors() { return SCENES[state.theme].bloom; },
  newPetal(random) {
    return {
      x: Math.random() * this.cv.width, y: random ? Math.random() * this.cv.height : -10,
      s: 3 + Math.floor(Math.random() * 3) * 2, sp: 0.5 + Math.random() * 1.1, ph: Math.random() * 6.28,
      dr: 0.3 + Math.random() * 0.7, rot: Math.random() * 6.28, rs: 0.02 + Math.random() * 0.05,
      c: Math.floor(Math.random() * 6)
    };
  },
  burst(x, y, n = 14, colors) {
    const pal = colors || this.colors();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, v = 1.5 + Math.random() * 4;
      this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, life: 1, decay: 0.014 + Math.random() * 0.02, s: 3 + Math.floor(Math.random() * 3) * 2, c: pal[Math.floor(Math.random() * pal.length)] });
    }
  },
  frame() {
    const g = this.g, w = this.cv.width, h = this.cv.height;
    g.clearRect(0, 0, w, h);
    const target = 0.3 + this.vx * 0.04 + this.scrollV * 0.06;
    this.wind += (target - this.wind) * 0.04;
    this.vx *= 0.9; this.scrollV *= 0.9;
    if (state.petals) {
      const pal = this.colors();
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.ph += 0.025; p.rot += p.rs;
        p.y += p.sp + Math.max(0, this.scrollV) * 0.08;
        p.x += Math.sin(p.ph) * p.dr + this.wind * (0.6 + p.sp * 0.6);
        const pw = Math.max(1, Math.round(p.s * Math.abs(Math.cos(p.rot))));
        g.fillStyle = pal[p.c]; g.fillRect(Math.round(p.x), Math.round(p.y), pw, p.s);
        if (p.y > h + 12 || p.x > w + 20 || p.x < -30) { this.petals[i] = this.newPetal(false); if (Math.random() < 0.4) this.petals[i].x = -10 + Math.random() * 20; }
      }
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.16; p.life -= p.decay;
      if (p.life <= 0) { this.parts.splice(i, 1); continue; }
      g.globalAlpha = clamp(p.life * 1.5, 0, 1); g.fillStyle = p.c; g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    g.globalAlpha = 1;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const t = this.trail[i]; t.life -= 0.07;
      if (t.life <= 0) { this.trail.splice(i, 1); continue; }
      g.globalAlpha = t.life * 0.55; g.fillStyle = "#19f0a0"; const s = Math.max(2, Math.round(t.life * 7)); g.fillRect(Math.round(t.x - s / 2), Math.round(t.y - s / 2), s, s);
    }
    g.globalAlpha = 1;
    requestAnimationFrame(() => this.frame());
  }
};
