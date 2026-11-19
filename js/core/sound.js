/* ============================================================
   js/core/sound.js
   Tiny sound effects (off by default). Sfx.coin(), Sfx.hit() ...
   ============================================================ */

const Sfx = {
  ctx: null,
  tone(f, d = 0.08, type = "square", v = 0.035, slide = 0) {
    if (!state.sound) return;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const c = this.ctx;
      if (c.state === "suspended") c.resume();
      const t = c.currentTime;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + d + 0.02);
    } catch (e) { /* audio not available */ }
  },
  hover() { this.tone(720, 0.035); },
  click() { this.tone(420, 0.09, "square", 0.045, 380); },
  coin() { this.tone(988, 0.06); setTimeout(() => this.tone(1319, 0.16), 60); },
  star() { [880, 1175, 1568].forEach((f, i) => setTimeout(() => this.tone(f, 0.1), i * 55)); },
  hit() { this.tone(180, 0.28, "sawtooth", 0.06, -120); },
  level() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.12), i * 90)); },
  whoosh() { this.tone(180, 0.35, "triangle", 0.04, 700); },
  over() { [392, 330, 262, 196].forEach((f, i) => setTimeout(() => this.tone(f, 0.18, "triangle", 0.05), i * 150)); }
};
