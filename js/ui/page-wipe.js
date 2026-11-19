/* ============================================================
   js/ui/page-wipe.js
   The pixel-grid wipe used when you jump between sections.
   ============================================================ */

const Wipe = {
  el: null, cols: 0, rows: 0,
  build() {
    this.el = $("#wipe");
    const size = 96;
    this.cols = Math.ceil(window.innerWidth / size); this.rows = Math.ceil(window.innerHeight / size);
    this.el.style.gridTemplateColumns = "repeat(" + this.cols + ",1fr)";
    this.el.style.gridTemplateRows = "repeat(" + this.rows + ",1fr)";
    this.el.innerHTML = "";
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const d = document.createElement("div");
      d.className = "cell" + ((r + c) % 2 ? " alt" : "");
      d.style.transitionDelay = (r + c) * 7 + "ms";
      this.el.appendChild(d);
    }
  },
  total() { return (this.cols + this.rows) * 7 + 260; },
  async in() { this.el.classList.add("in"); await wait(this.total()); },
  async out() { this.el.classList.remove("in"); await wait(this.total()); }
};
