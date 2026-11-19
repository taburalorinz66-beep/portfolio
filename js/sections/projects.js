/* ============================================================
   js/sections/projects.js
   PROJECTS section:  All / Games / Websites  ->  click a card for details.
   The list comes from the database (js/services/items.js).
   FEATURED_PROJECTS (js/content.js) always come first, then the ones you publish.
   ============================================================ */

const Projects = {
  items: [],
  filter: "all",
  modalIndex: -1,

  /* ---------- loading ---------- */
  async load() {
    $("#cards").innerHTML = '<p class="cards-empty">Loading projects...</p>';
    this.items = FEATURED_PROJECTS.slice();
    if (Backend.configured) {
      try {
        this.items = this.items.concat(await Items.list());
      } catch (e) {
        toast("Could not load your published projects", "bad");
      }
    }
    this.render();
    renderStats();
  },

  /* ---------- drawing the cards ---------- */
  seed(item) {
    let n = 7;
    for (const ch of String(item.id)) n = (n * 31 + ch.charCodeAt(0)) % 100000;
    return n;
  },

  isImage(item) {
    return item.kind === "file" && /\.(png|jpe?g|gif|webp)$/i.test(item.file_path || "");
  },

  kindLabel(item) {
    return item.category === "game" ? "GAME" : "WEBSITE";
  },

  thumbHtml(item) {
    return this.isImage(item)
      ? '<img src="' + esc(Items.fileUrl(item)) + '" alt="' + esc(item.title) + ' preview" loading="lazy" />'
      : '<canvas width="96" height="54" data-seed="' + this.seed(item) + '"></canvas>';
  },

  updateCounts() {
    $("#c-all").textContent = this.items.length;
    $("#c-game").textContent = this.items.filter(p => p.category === "game").length;
    $("#c-website").textContent = this.items.filter(p => p.category === "website").length;
  },

  render() {
    const grid = $("#cards");
    this.updateCounts();
    if (!this.items.length) {
      grid.innerHTML = '<p class="cards-empty">No projects yet. Check back soon!</p>';
      return;
    }
    grid.innerHTML = this.items.map((p, i) => {
      const tags = [p.kind === "file" ? "FILE" : "LINK"];
      if (p.kind === "file" && p.file_size) tags.push(formatSize(p.file_size));
      return '<article class="card" data-type="' + esc(p.category) + '" data-idx="' + i + '" tabindex="0" role="button" aria-label="Open ' + esc(p.title) + '" style="--i:' + i + '">' +
        '<div class="card-glare"></div>' +
        '<div class="thumb"><span class="badge ' + (p.category === "game" ? "" : "web") + '">' + this.kindLabel(p) + "</span>" + this.thumbHtml(p) + "</div>" +
        "<h3>" + esc(p.title) + '</h3><div class="tags">' + tags.map(t => "<span>" + esc(t) + "</span>").join("") + "</div>" +
        "<p>" + esc(p.description || "") + '</p><span class="more">VIEW DETAILS ▶</span></article>';
    }).join("");
    this.repaintThumbs();
    this.applyFilterNow();
  },

  // (re)paints the little pixel-city pictures. Called again when the theme changes.
  repaintThumbs() {
    $$("#cards canvas[data-seed]").forEach(c => paintThumb(c, +c.dataset.seed));
  },

  /* ---------- filter: All / Games / Websites ---------- */
  applyFilterNow() {
    $$("#cards .card").forEach(c => { c.hidden = !(this.filter === "all" || c.dataset.type === this.filter); });
  },

  async setFilter(f) {
    if (f === this.filter) return;
    this.filter = f;
    $$("#filters .filter").forEach(b => { const on = b.dataset.filter === f; b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); });
    const cards = $$("#cards .card");
    cards.forEach(c => { if (!c.hidden) c.classList.add("leaving"); });
    await wait(reduce ? 0 : 280);
    let n = 0;
    cards.forEach(c => {
      const show = f === "all" || c.dataset.type === f;
      c.hidden = !show;
      c.classList.remove("leaving");
      c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
      if (show) c.style.setProperty("--i", n++);
    });
  },

  visibleIdx() {
    return this.items.map((p, i) => i).filter(i => this.filter === "all" || this.items[i].category === this.filter);
  },

  /* ---------- details pop-up ---------- */
  open(i) {
    const p = this.items[i];
    if (!p) return;
    this.modalIndex = i;
    const m = $("#modal");
    $("#m-kind").textContent = this.kindLabel(p) + (p.created_at ? " / " + formatDate(p.created_at) : "");
    $("#m-title").textContent = p.title;
    $("#m-tags").innerHTML = ["file", "link"].includes(p.kind) ? "<span>" + (p.kind === "file" ? "FILE" : "LINK") + "</span>" + (p.file_size ? "<span>" + esc(formatSize(p.file_size)) + "</span>" : "") : "";
    $("#m-desc").textContent = p.description || "";
    $("#m-list").innerHTML = (p.features || []).map(f => "<li>" + esc(f) + "</li>").join("");

    const links = [];
    if (p.kind === "file") {
      links.push('<a class="btn" href="' + esc(Items.fileUrl(p, true)) + '" download>DOWNLOAD</a>');
    } else if (safeUrl(p.url)) {
      links.push('<a class="btn" href="' + esc(safeUrl(p.url)) + '" target="_blank" rel="noopener noreferrer">' + (p.category === "game" ? "PLAY" : "VISIT") + "</a>");
    }
    $("#m-links").innerHTML = links.length ? links.join("") : '<span class="na">LINK COMING SOON</span>';

    const mt = $(".m-thumb");
    mt.innerHTML = this.isImage(p)
      ? '<img src="' + esc(Items.fileUrl(p)) + '" alt="' + esc(p.title) + ' preview" />'
      : '<canvas id="m-canvas" width="192" height="108"></canvas>';
    if (!this.isImage(p)) paintThumb($("#m-canvas"), this.seed(p));

    m.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => m.classList.add("open"));
    Sfx.coin();
    $(".modal-close").focus();
  },

  close() {
    const m = $("#modal");
    if (m.hidden) return;
    m.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { m.hidden = true; }, 320);
  },

  step(d) {
    const list = this.visibleIdx();
    if (!list.length) return;
    const pos = list.indexOf(this.modalIndex);
    this.open(list[(pos + d + list.length) % list.length]);
    Sfx.click();
  },

  /* ---------- wiring ---------- */
  init() {
    $("#filters").addEventListener("click", e => { const b = e.target.closest(".filter"); if (b) { Sfx.click(); this.setFilter(b.dataset.filter); } });
    const grid = $("#cards");
    grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c) this.open(+c.dataset.idx); });
    grid.addEventListener("keydown", e => {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) { e.preventDefault(); this.open(+e.target.dataset.idx); }
    });
    if (finePointer && !reduce) {
      grid.addEventListener("mousemove", e => {
        const c = e.target.closest(".card"); if (!c) return;
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ry", ((px - 0.5) * 14).toFixed(2) + "deg");
        c.style.setProperty("--rx", ((0.5 - py) * 14).toFixed(2) + "deg");
        c.style.setProperty("--mx", (px * 100).toFixed(0) + "%"); c.style.setProperty("--my", (py * 100).toFixed(0) + "%");
      });
      grid.addEventListener("mouseout", e => { const c = e.target.closest(".card"); if (c) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); } });
    }
    $("#modal").addEventListener("click", e => { if (e.target.closest("[data-close]")) this.close(); });
    $("#m-prev").addEventListener("click", () => this.step(-1));
    $("#m-next").addEventListener("click", () => this.step(1));
  }
};

// Short names used by the command palette and keyboard shortcuts.
function openModal(i) { Projects.open(i); }
function closeModal() { Projects.close(); }
function stepModal(d) { Projects.step(d); }
