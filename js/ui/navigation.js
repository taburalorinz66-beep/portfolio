/* ============================================================
   js/ui/navigation.js
   Jumping between sections, the menu, the scroll bar and the level HUD.
   Add a section: add its id to SECTIONS and its name to LV_NAMES.
   ============================================================ */

const SECTIONS = ["home", "about", "skills", "projects", "arcade", "contact"];
const LV_NAMES = ["HOME", "ABOUT", "SKILLS", "PROJECTS", "ARCADE", "CONTACT"];

async function go(id) {
  const el = document.getElementById(id);
  if (!el) return;
  closeMenu();
  const y = id === "home" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - 40);
  if (reduce) { window.scrollTo(0, y); return; }
  if (state.busy) return;
  state.busy = true;
  Sfx.whoosh();
  await Wipe.in();
  window.scrollTo(0, y);
  try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignore */ }
  await wait(60);
  await Wipe.out();
  state.busy = false;
}

function closeMenu() {
  const nav = $("#nav");
  nav.classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
}

const NavUI = {
  maxIdx: 0, cur: -1,
  init() {
    this.header = $("#header"); this.ind = $("#nav-ind");
    this.links = $$("#nav a");
    this.fill = $("#progress span");
    this.xp = $("#xp"); this.lv = $("#lv"); this.lvName = $("#lv-name"); this.hud = $("#hud-level");
    this.toTop = $("#to-top"); this.heroContent = $("#hero-content");
    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { this.update(); ticking = false; }); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => this.moveInd());
    this.toTop.addEventListener("click", () => go("home"));
    $("#menu-toggle").addEventListener("click", () => {
      const open = $("#nav").classList.toggle("open");
      $("#menu-toggle").setAttribute("aria-expanded", String(open));
    });
    this.update();
  },
  update() {
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const pct = max > 0 ? clamp(y / max, 0, 1) : 0;
    this.fill.style.width = (pct * 100).toFixed(1) + "%";
    this.xp.style.width = (pct * 100).toFixed(0) + "%";
    this.header.classList.toggle("scrolled", y > 40);
    this.toTop.classList.toggle("show", y > 700);
    if (y < vh * 1.1 && !reduce) {
      this.heroContent.style.transform = "translateY(" + (y * 0.12).toFixed(1) + "px)";
      this.heroContent.style.opacity = String(clamp(1 - y / (vh * 0.75), 0, 1));
    }
    let idx = 0;
    SECTIONS.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < vh * 0.45) idx = i; });
    if (max > 0 && y >= max - 4) idx = SECTIONS.length - 1;
    if (idx !== this.cur) {
      this.cur = idx;
      this.lv.textContent = idx + 1; this.lvName.textContent = LV_NAMES[idx];
      this.links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + SECTIONS[idx]));
      this.moveInd();
      if (idx > this.maxIdx) {
        this.maxIdx = idx;
        toast("LEVEL UP!  LV " + (idx + 1) + ": " + LV_NAMES[idx], "good");
        Sfx.level();
        this.hud.classList.remove("pulse"); void this.hud.offsetWidth; this.hud.classList.add("pulse");
      }
    }
  },
  moveInd() {
    const a = $("#nav a.active");
    if (!a || getComputedStyle(this.ind).display === "none") { this.ind.style.opacity = 0; return; }
    this.ind.style.opacity = 1;
    this.ind.style.width = a.offsetWidth - 24 + "px";
    this.ind.style.transform = "translateX(" + (a.offsetLeft + 12) + "px)";
  }
};
