/* ============================================================
   js/visuals/cursor.js
   The custom pixel mouse cursor (desktop only).
   ============================================================ */

const Cursor = {
  x: 0, y: 0, rx: 0, ry: 0,
  init() {
    if (!finePointer || reduce) return;
    document.documentElement.classList.add("has-cursor");
    this.el = $("#cursor"); this.dot = $("#cursor-dot"); this.ring = $("#cursor-ring");
    window.addEventListener("mousemove", e => { this.x = e.clientX; this.y = e.clientY; }, { passive: true });
    window.addEventListener("mousedown", () => this.el.classList.add("down"));
    window.addEventListener("mouseup", () => this.el.classList.remove("down"));
    document.addEventListener("mouseover", e => { this.el.classList.toggle("hover", !!(e.target.closest && e.target.closest("a, button, .card, input, textarea, #pal-list li, [data-close]"))); });
    const loop = () => {
      this.rx += (this.x - this.rx) * 0.22; this.ry += (this.y - this.ry) * 0.22;
      this.dot.style.transform = "translate(" + this.x + "px," + this.y + "px)";
      this.ring.style.transform = "translate(" + Math.round(this.rx) + "px," + Math.round(this.ry) + "px)";
      requestAnimationFrame(loop);
    };
    loop();
  }
};
