/* ============================================================
   admin/js/admin-add-cv.js
   ADD CV tab: browse, select, PUBLISH. The old CV is replaced.
   ============================================================ */

const AddCv = {
  file: null,

  async showCurrent() {
    const el = $("#cv-current");
    try {
      const cv = await Items.latestCv();
      el.textContent = cv ? "Current CV: " + cv.title + " (" + formatSize(cv.file_size || 0) + "). Publishing a new one replaces it." : "No CV published yet.";
    } catch (e) { el.textContent = "Could not check the current CV."; }
  },

  async publish(e) {
    e.preventDefault();
    const status = $("#ac-status"), btn = $("#ac-btn");
    if (!this.file) return formStatus(status, "Please browse a file first.", "bad");
    if (this.file.size > MAX_BYTES) return formStatus(status, "Too big. The limit is 50 MB.", "bad");
    btn.disabled = true;
    try {
      formStatus(status, "Uploading...", "");
      await Items.setCv(this.file);
      formStatus(status, "Published! Visitors now download this CV.", "good");
      toast("CV published", "good");
      $("#ac-form").reset();
      this.file = null;
      $("#ac-picked").textContent = "Nothing selected yet.";
      this.showCurrent();
    } catch (err) {
      formStatus(status, err.message, "bad");
    }
    btn.disabled = false;
  },

  init() {
    $("#ac-file").addEventListener("change", e => {
      this.file = e.target.files[0] || null;
      $("#ac-picked").textContent = this.file ? this.file.name + " - " + formatSize(this.file.size) : "Nothing selected yet.";
    });
    $("#ac-form").addEventListener("submit", e => this.publish(e));
  }
};

Tabs.onShow.cv = () => AddCv.showCurrent();
