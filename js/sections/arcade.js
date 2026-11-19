/* ============================================================
   js/sections/arcade.js
   The Petal Catcher mini game: insert coin, hearts, pause, game over.
   ============================================================ */

const PLAYER_SPRITE = [
  "...kkkkkk...", "..kkkkkkkk..", "..kssssssk..", "..ksessesk..", "..kssssssk..", "...ssmmss...",
  "..hhhhhhhh..", ".shhhhhhhhs.", ".shhhhhhhhs.", "..hhhhhhhh..", "..dd....dd..", "..dd....dd.."
];

const Game = {
  W: 320, H: 180, state: "idle", visible: false, keys: { l: false, r: false }, target: null, cheat: false,
  init() {
    this.cv = $("#game"); this.g = this.cv.getContext("2d");
    this.overlay = $("#g-overlay"); this.hi = +store.get("lgt-hi", "0") || 0;
    $("#g-hi").textContent = this.hi;
    this.reset(); this.makeBg();
    $("#g-start").onclick = () => { Sfx.click(); this.start(); };
    $("#g-pause").addEventListener("click", () => this.togglePause());
    const hold = (id, key) => {
      const b = $(id);
      const on = e => { e.preventDefault(); this.keys[key] = true; b.classList.add("held"); this.target = null; };
      const off = () => { this.keys[key] = false; b.classList.remove("held"); };
      b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
    };
    hold("#g-left", "l"); hold("#g-right", "r");
    const setTarget = e => { const r = this.cv.getBoundingClientRect(); this.target = clamp((e.clientX - r.left) / r.width * this.W, 8, this.W - 8); };
    this.cv.addEventListener("pointermove", e => { if (this.state === "playing") setTarget(e); });
    this.cv.addEventListener("pointerdown", e => { if (this.state === "playing") setTarget(e); });
    window.addEventListener("keydown", e => this.onKey(e, true));
    window.addEventListener("keyup", e => this.onKey(e, false));
    new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (!this.visible && this.state === "playing") this.pause(); }, { threshold: 0.3 }).observe(this.cv);
    document.addEventListener("visibilitychange", () => { if (document.hidden && this.state === "playing") this.pause(); });
    this.draw(0);
  },
  makeBg() {
    const bg = mk(this.W, this.H); paintCity(bg, 42);
    this.bg = bg;
    if (this.g) this.draw(0);
  },
  reset() {
    this.score = 0; this.lives = this.cheat ? 30 : 3; this.combo = 1; this.streak = 0;
    this.items = []; this.parts = []; this.spawn = 0.5; this.shake = 0; this.flash = 0; this.t = 0;
    this.p = { x: this.W / 2, y: this.H - 24, w: 12, h: 12, face: 1 };
    this.target = null; this.updateHud();
  },
  start() {
    this.reset(); this.state = "playing"; this.overlay.classList.add("hide");
    $("#g-pause").textContent = "PAUSE";
    this.last = performance.now();
    this.cv.focus({ preventScroll: true });
    requestAnimationFrame(t => this.loop(t));
  },
  pause() { if (this.state !== "playing") return; this.state = "paused"; $("#g-pause").textContent = "RESUME"; this.showOverlay("PAUSED", "Press P or click resume.", "RESUME"); },
  resume() { if (this.state !== "paused") return; this.state = "playing"; this.overlay.classList.add("hide"); $("#g-pause").textContent = "PAUSE"; this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); },
  togglePause() { if (this.state === "playing") this.pause(); else if (this.state === "paused") this.resume(); else if (this.state === "idle" || this.state === "over") this.start(); },
  showOverlay(title, msg, btn) {
    $("#g-title").textContent = title; $("#g-msg").innerHTML = msg; const b = $("#g-start"); b.textContent = btn;
    b.onclick = () => { Sfx.click(); if (this.state === "paused") this.resume(); else this.start(); };
    this.overlay.classList.remove("hide");
  },
  onKey(e, down) {
    const k = e.key.toLowerCase();
    const left = k === "arrowleft" || k === "a", right = k === "arrowright" || k === "d";
    if (left || right) {
      this.keys[left ? "l" : "r"] = down;
      if (down) this.target = null;
      if (this.state === "playing" && this.visible && ["arrowleft", "arrowright"].includes(k)) e.preventDefault();
    }
    if (down && k === "p" && this.visible && !/input|textarea/i.test(e.target.tagName)) this.togglePause();
  },
  updateHud() {
    $("#g-score").textContent = this.score; $("#g-hi").textContent = this.hi; $("#g-combo").textContent = "x" + this.combo;
    $("#g-lives").textContent = this.lives > 6 ? "♥ x" + this.lives : "♥".repeat(Math.max(0, this.lives)) || "-";
  },
  burst(x, y, colors, n = 8) {
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 20 + Math.random() * 60; this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: 0.6 + Math.random() * 0.4, c: colors[Math.floor(Math.random() * colors.length)] }); }
  },
  loop(now) {
    if (this.state !== "playing") return;
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    this.step(dt); this.draw(now);
    requestAnimationFrame(t => this.loop(t));
  },
  step(dt) {
    this.t += dt;
    const p = this.p;
    const speed = 175;
    if (this.keys.l) { p.x -= speed * dt; p.face = -1; }
    if (this.keys.r) { p.x += speed * dt; p.face = 1; }
    if (this.target !== null) { const d = this.target - p.x; p.x += d * Math.min(1, dt * 14); if (Math.abs(d) > 1) p.face = d > 0 ? 1 : -1; }
    p.x = clamp(p.x, p.w / 2, this.W - p.w / 2);

    const lvl = 1 + this.score / 400;
    this.spawn -= dt;
    if (this.spawn <= 0) {
      this.spawn = Math.max(0.26, 0.85 - this.score / 1600);
      const r = Math.random(), bugP = Math.min(0.36, 0.17 + this.score / 3500);
      let type = "petal";
      if (r < bugP) type = "bug"; else if (r < bugP + 0.07) type = "star"; else if (r < bugP + 0.095) type = "heart";
      this.items.push({ type, x: 8 + Math.random() * (this.W - 16), y: -6, vy: (38 + Math.random() * 26) * Math.min(2.6, lvl), ph: Math.random() * 6.28 });
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.vy * dt; it.ph += dt * 3;
      if (it.type === "petal") it.x += Math.sin(it.ph) * 14 * dt;
      const hit = Math.abs(it.x - p.x) < 10 && it.y > p.y - 3 && it.y < p.y + 11;
      if (hit) {
        this.items.splice(i, 1);
        if (it.type === "bug") {
          if (this.lives > 0) this.lives--; this.combo = 1; this.streak = 0; this.shake = 0.25; this.flash = 0.2; Sfx.hit();
          this.burst(it.x, it.y, ["#ff5a6e", "#ff9aa5", "#7a1f33"], 14);
          if (this.lives <= 0) { this.over(); return; }
        } else {
          let pts = 10, cols = ["#ff7bd5", "#ffc9f2", "#d98cff"];
          if (it.type === "star") { pts = 50; cols = ["#ffd966", "#fff2b0", "#ffb347"]; Sfx.star(); }
          else if (it.type === "heart") { pts = 0; if (this.lives < 6) this.lives++; cols = ["#ff5a6e", "#ff9aa5"]; Sfx.star(); }
          else Sfx.coin();
          this.streak++; this.combo = Math.min(5, 1 + Math.floor(this.streak / 6));
          this.score += pts * this.combo; this.burst(it.x, it.y, cols, 8);
        }
        this.updateHud();
      } else if (it.y > this.H - 14) {
        this.items.splice(i, 1);
        if (it.type === "petal") { this.streak = 0; if (this.combo > 1) { this.combo = 1; this.updateHud(); } }
        this.burst(it.x, this.H - 14, ["#6a4a9a"], 2);
      }
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const q = this.parts[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 160 * dt; q.life -= dt;
      if (q.life <= 0) this.parts.splice(i, 1);
    }
    if (this.shake > 0) this.shake -= dt;
    if (this.flash > 0) this.flash -= dt;
  },
  over() {
    this.state = "over"; Sfx.over();
    const newHi = this.score > this.hi;
    if (newHi) { this.hi = this.score; store.set("lgt-hi", String(this.hi)); }
    this.updateHud();
    this.showOverlay(newHi ? "NEW HIGH SCORE!" : "GAME OVER", "Score: <span class=\"c-gold\">" + this.score + "</span>" + (newHi ? "<br>You beat the record. Nice!" : "<br>High score: " + this.hi), "PLAY AGAIN");
    if (newHi && this.score > 0) { const r = this.cv.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 40, ["#ffd966", "#ff7bd5", "#4fe3ff"]); }
    this.draw(performance.now());
  },
  draw(now) {
    const g = this.g; g.imageSmoothingEnabled = false;
    g.save();
    if (this.shake > 0) g.translate(Math.round((Math.random() - 0.5) * 6), Math.round((Math.random() - 0.5) * 6));
    g.drawImage(this.bg, 0, 0);
    g.fillStyle = SCENES[state.theme].tint; g.fillRect(0, 0, this.W, this.H);
    g.fillStyle = SCENES[state.theme].ground; g.fillRect(0, this.H - 14, this.W, 14);
    g.fillStyle = SCENES[state.theme].side; g.fillRect(0, this.H - 14, this.W, 2);
    for (const it of this.items) {
      const x = Math.round(it.x), y = Math.round(it.y);
      if (it.type === "petal") { g.fillStyle = "#ff7bd5"; g.fillRect(x - 1, y - 1, 3, 3); g.fillStyle = "#ffc9f2"; g.fillRect(x, y - 1, 1, 1); }
      else if (it.type === "star") { g.fillStyle = "#ffd966"; g.fillRect(x - 1, y - 3, 3, 7); g.fillRect(x - 3, y - 1, 7, 3); g.fillStyle = "#fff6c8"; g.fillRect(x, y, 1, 1); }
      else if (it.type === "heart") { g.fillStyle = "#ff5a6e"; g.fillRect(x - 3, y - 2, 3, 3); g.fillRect(x + 1, y - 2, 3, 3); g.fillRect(x - 3, y, 7, 2); g.fillRect(x - 2, y + 2, 5, 1); g.fillRect(x - 1, y + 3, 3, 1); }
      else { g.fillStyle = "#ff5a6e"; g.fillRect(x - 3, y - 2, 7, 5); g.fillStyle = "#1a0b2e"; g.fillRect(x - 2, y - 1, 2, 2); g.fillRect(x + 1, y - 1, 2, 2); g.fillStyle = "#7aff9a"; g.fillRect(x - 4, y - 3, 1, 1); g.fillRect(x + 4, y + 3, 1, 1); g.fillStyle = "#ff5a6e"; g.fillRect(x - 5, y, 1, 2); g.fillRect(x + 5, y, 1, 2); }
    }
    const p = this.p, frame = Math.floor((now || 0) / 140) % 2, moving = this.keys.l || this.keys.r || (this.target !== null && Math.abs(this.target - p.x) > 2);
    const pal = { k: "#1a1030", s: "#f2c9a5", e: "#1a1030", m: "#c0505a", h: "#ff7bd5", d: "#b04a96" };
    const px = Math.round(p.x - 6), py = Math.round(p.y);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
      const c = PLAYER_SPRITE[y][p.face === -1 ? 11 - x : x]; if (c === ".") continue;
      let yy = py + y; if (y >= 10 && moving && frame) yy -= 1;
      g.fillStyle = pal[c]; g.fillRect(px + x, yy, 1, 1);
    }
    for (const q of this.parts) { g.globalAlpha = clamp(q.life * 2, 0, 1); g.fillStyle = q.c; g.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); }
    g.globalAlpha = 1;
    if (this.flash > 0) { g.fillStyle = "rgba(255,90,110,.25)"; g.fillRect(0, 0, this.W, this.H); }
    g.restore();
  }
};
