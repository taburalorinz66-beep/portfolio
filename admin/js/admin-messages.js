/* ============================================================
   admin/js/admin-messages.js
   MESSAGE LOGS tab: view messages, then REPLY or IGNORE.
   REPLY opens Gmail with the visitor's address and your answer
   filled in; you press Send there.
   ============================================================ */

const MsgTab = {
  all: [],
  filter: "all",

  async load() {
    const box = $("#msg-list");
    try {
      this.all = await Messages.list();
      this.render();
    } catch (e) {
      box.innerHTML = '<p class="adm-empty">Could not load messages: ' + esc(e.message) + "</p>";
    }
  },

  render() {
    const box = $("#msg-list");
    const news = this.all.filter(m => m.status === "new").length;
    $("#new-count").textContent = news;
    const rows = this.all.filter(m => this.filter === "all" || m.status === this.filter);
    if (!rows.length) { box.innerHTML = '<p class="adm-empty">No messages here.</p>'; return; }
    box.innerHTML = "";
    rows.forEach(m => box.appendChild(this.card(m)));
  },

  card(m) {
    const el = document.createElement("article");
    el.className = "msg-card" + (m.status === "new" ? " is-new" : "");
    el.innerHTML =
      '<div class="msg-head"><b>' + esc(m.name) + '</b><span class="status s-' + esc(m.status) + '">' + esc(m.status.toUpperCase()) + "</span></div>" +
      '<div class="msg-meta">' + esc(m.email) + " &middot; " + esc(formatDate(m.created_at)) + "</div>" +
      '<div class="msg-text">' + esc(m.message) + "</div>" +
      '<div class="msg-actions">' +
        '<button type="button" class="btn small" data-act="reply"><span>REPLY</span></button>' +
        '<button type="button" class="btn btn-outline small" data-act="ignore">IGNORE</button>' +
      "</div>" +
      '<div class="msg-reply" hidden>' +
        '<textarea placeholder="Write your reply..."></textarea>' +
        '<div class="msg-actions">' +
          '<button type="button" class="btn small" data-act="send"><span>OPEN IN GMAIL</span></button>' +
          '<button type="button" class="btn btn-ghost small" data-act="cancel">CANCEL</button>' +
        "</div></div>";

    const reply = el.querySelector(".msg-reply");
    el.addEventListener("click", async e => {
      const act = e.target.closest("[data-act]");
      if (!act) return;
      const what = act.dataset.act;
      if (what === "reply") { reply.hidden = false; reply.querySelector("textarea").focus(); }
      if (what === "cancel") reply.hidden = true;
      if (what === "ignore") await this.setStatus(m, "ignored");
      if (what === "send") {
        const text = reply.querySelector("textarea").value.trim();
        if (!text) { toast("Write a reply first", "bad"); return; }
        const url = "https://mail.google.com/mail/?view=cm&fs=1" +
          "&to=" + encodeURIComponent(m.email) +
          "&su=" + encodeURIComponent("Re: your message on my portfolio") +
          "&body=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener");
        await this.setStatus(m, "replied");
      }
    });
    return el;
  },

  async setStatus(m, status) {
    try {
      await Messages.setStatus(m.id, status);
      m.status = status;
      this.render();
      toast("Marked " + status, "good");
    } catch (e) { toast(e.message, "bad"); }
  },

  init() {
    $$("#msg-filters .filter").forEach(b => b.addEventListener("click", () => {
      $$("#msg-filters .filter").forEach(x => x.classList.toggle("active", x === b));
      this.filter = b.dataset.mf;
      this.render();
    }));
  }
};

Tabs.onShow.messages = () => MsgTab.load();
