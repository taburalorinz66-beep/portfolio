/* ============================================================
   admin/js/admin-add-link.js
   ADD LINK tab: type a title and a web address, then PUBLISH.
   ============================================================ */

const AddLink = {
  async publish(e) {
    e.preventDefault();
    const status = $("#al-status"), btn = $("#al-btn");
    const title = $("#al-title").value.trim();
    const url = safeUrl($("#al-url").value.trim());
    if (!title) return formStatus(status, "Please type a title.", "bad");
    if (!url || url === "#") return formStatus(status, "Please type a full link starting with https://", "bad");

    btn.disabled = true;
    try {
      await Items.addLink({ category: $("#al-category").value, title, description: $("#al-desc").value.trim(), url });
      formStatus(status, "Published! It is now on the site.", "good");
      toast("Link published", "good");
      $("#al-form").reset();
      Tabs.pjStale = true;
    } catch (err) {
      formStatus(status, err.message, "bad");
    }
    btn.disabled = false;
  },

  init() { $("#al-form").addEventListener("submit", e => this.publish(e)); }
};
