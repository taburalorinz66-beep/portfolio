/* ============================================================
   js/sections/hero.js
   The top of the page: intro text, moving ticker, social links,
   and the "Download CV?" question (YES -> downloads, NO -> closes).
   The CV file itself is uploaded by the admin (Add CV tab).
   ============================================================ */

const Cv = {
  item: null,
  loaded: false,

  async prefetch() {
    if (this.loaded) return;
    if (Backend.configured) {
      try { this.item = await Items.latestCv(); } catch (e) { this.item = null; }
    }
    this.loaded = true;
  }
};

async function askDownloadCv() {
  const r = await Dialog.open({
    title: "DOWNLOAD CV?",
    text: "Do you want to download my CV?",
    buttons: [{ label: "NO", value: "no", cls: "btn-outline" }, { label: "YES", value: "yes" }]
  });
  if (r.value !== "yes") return;

  await Cv.prefetch();
  if (!Cv.item) { toast("CV is not uploaded yet. Check back soon!", "bad"); return; }

  const a = document.createElement("a");
  a.href = Items.fileUrl(Cv.item, true);
  a.download = Cv.item.title || "cv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("DOWNLOADING CV...", "good");
}

function renderHero() {
  $("#hero-text").textContent = CONTENT.heroText;

  const items = CONTENT.ticker.map(t => "<span>★ " + esc(t) + "</span>").join("");
  $("#ticker").innerHTML = items + items;

  const socials = CONTENT.socials.filter(s => safeUrl(s.url));
  $("#hero-socials").innerHTML = socials.map(s => '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + "</a>").join("");

  $("#cv-btn").addEventListener("click", askDownloadCv);
}
