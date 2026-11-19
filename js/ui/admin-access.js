/* ============================================================
   js/ui/admin-access.js
   The ADMIN button in the bottom-right corner. Tap it -> a login box.
   Nothing is filled in for you: type your admin email and password
   (your browser can remember them). Never write them in this file.
   After a good login it opens the admin panel (admin/index.html).
   ============================================================ */

const AdminAccess = {
  init() {
    if (document.getElementById("admin-fab")) return;
    const fab = document.createElement("button");
    fab.id = "admin-fab";
    fab.type = "button";
    fab.className = "admin-fab";
    fab.textContent = "ADMIN";
    fab.setAttribute("aria-label", "Admin login");
    fab.addEventListener("click", () => this.open());
    document.body.appendChild(fab);
  },

  open() {
    if (document.getElementById("admin-login")) return;
    const wrap = document.createElement("div");
    wrap.id = "admin-login";
    wrap.className = "dlg";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.innerHTML =
      '<div class="dlg-backdrop"></div><form class="dlg-card" novalidate>' +
      "<h3>ADMIN LOGIN</h3>" +
      '<input id="al-email" type="email" placeholder="Email" autocomplete="username" required />' +
      '<input id="al-pass" type="password" placeholder="Password" autocomplete="current-password" required />' +
      '<p id="al-msg" class="admin-msg" role="status"></p>' +
      '<div class="dlg-actions"><button type="button" class="btn small btn-outline" id="al-cancel">CANCEL</button>' +
      '<button type="submit" class="btn small" id="al-go">LOGIN</button></div></form>';
    document.body.appendChild(wrap);

    const $q = s => wrap.querySelector(s);
    const msg = $q("#al-msg");
    const close = () => {
      document.removeEventListener("keydown", onKey);
      wrap.classList.remove("open");
      setTimeout(() => wrap.remove(), 260);
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    $q("#al-cancel").addEventListener("click", close);
    $q(".dlg-backdrop").addEventListener("click", close);

    $q("form").addEventListener("submit", async e => {
      e.preventDefault();
      const email = $q("#al-email").value.trim();
      const pass = $q("#al-pass").value;
      if (!email || !pass) { msg.textContent = "Enter your email and password."; return; }
      if (!Backend.configured) { msg.textContent = "Backend not connected yet (js/config.js)."; return; }
      const btn = $q("#al-go");
      btn.disabled = true; msg.textContent = "Logging in...";
      try {
        const r = await Auth.login(email, pass);
        if (r.ok && r.isAdmin) {
          msg.textContent = "Welcome back!";
          location.href = "admin/index.html";
          return;
        }
        if (r.ok) { await Auth.logout(); msg.textContent = "That account is not the admin."; }
        else msg.textContent = r.error || "Login failed.";
      } catch (err) {
        msg.textContent = "Login failed. Try again.";
      }
      btn.disabled = false;
    });

    requestAnimationFrame(() => wrap.classList.add("open"));
    setTimeout(() => $q("#al-email").focus(), 60);
  }
};
