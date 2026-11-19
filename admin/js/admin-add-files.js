/* ============================================================
   admin/js/admin-add-files.js
   ADD FILES tab: browse file(s) or a folder, then PUBLISH.
   Several files or a folder are zipped into one download.
   ============================================================ */

const AddFiles = {
  picked: [],

  pick(list) {
    this.picked = Array.from(list);
    const n = this.picked.length;
    if (!n) { $("#af-picked").textContent = "Nothing selected yet."; return; }
    const total = this.picked.reduce((s, f) => s + f.size, 0);
    const first = this.picked[0].webkitRelativePath;
    const label = first ? "Folder \"" + first.split("/")[0] + "\" (" + n + " files)" : n === 1 ? this.picked[0].name : n + " files";
    $("#af-picked").textContent = label + " - " + formatSize(total);
    if (!$("#af-title").value) $("#af-title").value = first ? first.split("/")[0] : (n === 1 ? this.picked[0].name.replace(/\.[^.]+$/, "") : "");
  },

  async publish(e) {
    e.preventDefault();
    const status = $("#af-status"), btn = $("#af-btn");
    const title = $("#af-title").value.trim();
    if (!title) return formStatus(status, "Please type a title.", "bad");
    if (!this.picked.length) return formStatus(status, "Please browse a file or folder first.", "bad");
    if (this.picked.reduce((s, f) => s + f.size, 0) > MAX_BYTES) return formStatus(status, "Too big. The limit is 50 MB.", "bad");

    btn.disabled = true;
    try {
      formStatus(status, "Preparing...", "");
      const first = this.picked[0].webkitRelativePath;
      const file = await packFiles(this.picked, first ? first.split("/")[0] : title);
      if (file.size > MAX_BYTES) throw new Error("Too big after zipping. The limit is 50 MB.");
      formStatus(status, "Uploading...", "");
      await Items.addFile({ category: $("#af-category").value, title, description: $("#af-desc").value.trim(), file });
      formStatus(status, "Published! It is now on the site.", "good");
      toast("Published", "good");
      $("#af-form").reset();
      this.pick([]);
      Tabs.pjStale = true;
    } catch (err) {
      formStatus(status, err.message, "bad");
    }
    btn.disabled = false;
  },

  init() {
    $("#af-files").addEventListener("change", e => { $("#af-folder").value = ""; this.pick(e.target.files); });
    $("#af-folder").addEventListener("change", e => { $("#af-files").value = ""; this.pick(e.target.files); });
    $("#af-form").addEventListener("submit", e => this.publish(e));
  }
};
