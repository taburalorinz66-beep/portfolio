/* ============================================================
   admin/js/admin-projects.js
   VIEW PROJECTS tab: Games and Websites lists.
   Click one -> DELETE / REPLACE / CANCEL.
   ============================================================ */

const ProjTab = {
  async load() {
    try {
      const items = await Items.list();
      this.fill($("#pj-games"), items.filter(i => i.category === "game"));
      this.fill($("#pj-websites"), items.filter(i => i.category === "website"));
    } catch (e) {
      $("#pj-games").innerHTML = '<p class="adm-empty">Could not load: ' + esc(e.message) + "</p>";
      $("#pj-websites").innerHTML = "";
    }
  },

  fill(box, items) {
    box.innerHTML = "";
    if (!items.length) { box.innerHTML = '<p class="adm-empty">Nothing here yet.</p>'; return; }
    items.forEach(item => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "adm-row";
      b.innerHTML = "<b>" + esc(item.title) + "</b><small>" +
        (item.kind === "link" ? "LINK" : "FILE " + formatSize(item.file_size || 0)) + " &middot; " + esc(formatDate(item.created_at)) + "</small>";
      b.addEventListener("click", () => this.choose(item));
      box.appendChild(b);
    });
  },

  async choose(item) {
    const r = await Dialog.open({
      title: item.title,
      text: "What do you want to do with this project?",
      buttons: [
        { label: "DELETE", value: "delete", cls: "danger" },
        { label: "REPLACE", value: "replace" },
        { label: "CANCEL", value: "cancel", cls: "btn-outline" }
      ]
    });
    if (r.value === "delete") return this.del(item);
    if (r.value === "replace") return this.replace(item);
  },

  async del(item) {
    const sure = await Dialog.open({
      title: "Delete?", text: "\"" + item.title + "\" will be removed from the site for good.",
      buttons: [{ label: "NO", value: "no", cls: "btn-outline" }, { label: "YES, DELETE", value: "yes", cls: "danger" }]
    });
    if (sure.value !== "yes") return;
    try { await Items.remove(item); toast("Deleted", "good"); this.load(); }
    catch (e) { toast(e.message, "bad"); }
  },

  async replace(item) {
    try {
      if (item.kind === "link") {
        const r = await Dialog.open({
          title: "Replace link", text: "Type the new link.",
          input: { type: "url", placeholder: "https://", value: item.url },
          buttons: [{ label: "CANCEL", value: "cancel", cls: "btn-outline" }, { label: "REPLACE", value: "ok" }]
        });
        if (r.value !== "ok") return;
        const url = safeUrl(r.text);
        if (!url || url === "#") return toast("That is not a valid link", "bad");
        await Items.replaceLink(item, url);
      } else {
        const r = await Dialog.open({
          title: "Replace file", text: "Choose the new file (max 50 MB).",
          input: { type: "file" },
          buttons: [{ label: "CANCEL", value: "cancel", cls: "btn-outline" }, { label: "REPLACE", value: "ok" }]
        });
        if (r.value !== "ok") return;
        if (!r.files.length) return toast("No file chosen", "bad");
        if (r.files[0].size > MAX_BYTES) return toast("Too big. The limit is 50 MB.", "bad");
        toast("Uploading...");
        await Items.replaceFile(item, r.files[0]);
      }
      toast("Replaced", "good");
      this.load();
    } catch (e) { toast(e.message, "bad"); }
  }
};

Tabs.onShow.projects = () => ProjTab.load();
