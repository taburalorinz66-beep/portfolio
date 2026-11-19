/* ============================================================
   admin/js/admin-main.js
   The last admin script: decides what to show (login or panel).
   ============================================================ */

function showGate(msg, showForm, showSignOut) {
  $("#panel").hidden = true;
  $("#gate").hidden = false;
  $("#gate-msg").textContent = msg;
  $("#login-form").hidden = !showForm;
  $("#signout-user").hidden = !showSignOut;
}

async function showPanel() {
  const s = await Auth.session();
  $("#who").textContent = s && s.user ? s.user.email : "";
  $("#gate").hidden = true;
  $("#panel").hidden = false;
  Tabs.show("messages");
}

async function checkLogin() {
  if (!Backend.configured) {
    showGate("The backend is not connected yet. Fill in js/config.js (see README), then reload.", false, false);
    return;
  }
  const s = await Auth.session();
  if (!s) return showGate("Log in with your admin account.", true, false);
  if (await Auth.isAdmin()) return showPanel();
  showGate("You are logged in, but this account is not the admin.", false, true);
}

function initAdmin() {
  Tabs.init();
  MsgTab.init();
  AddFiles.init();
  AddLink.init();
  AddCv.init();

  $("#login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = $("#login-btn");
    btn.disabled = true;
    $("#gate-msg").textContent = "Logging in...";
    const r = await Auth.login($("#login-email").value.trim(), $("#login-pass").value);
    btn.disabled = false;
    if (!r.ok) return showGate(r.error, true, false);
    $("#login-pass").value = "";
    if (r.isAdmin) showPanel();
    else showGate("You are logged in, but this account is not the admin.", false, true);
  });

  const out = async () => { await Auth.logout(); showGate("Logged out.", true, false); };
  $("#logout-btn").addEventListener("click", out);
  $("#signout-user").addEventListener("click", out);

  checkLogin();
}

initAdmin();
