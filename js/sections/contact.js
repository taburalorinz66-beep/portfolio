/* ============================================================
   js/sections/contact.js
   CONTACT section: enter name, enter Gmail, enter message, SEND.
   What happens on SEND:
     1. the message is saved in your message log (admin panel)
     2. (optional) a copy is emailed to your Gmail via Web3Forms
   ============================================================ */

function initContact() {
  const form = $("#contact-form"), status = $("#form-status"), btn = $("#send-btn"), msg = $("#message");

  // Quick links box (your social links)
  const socials = CONTENT.socials.filter(s => safeUrl(s.url));
  $("#contact-links").innerHTML = socials.map(s => '<li><a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + "</a></li>").join("");
  $("#contact-links").closest(".panel").hidden = socials.length === 0;

  msg.addEventListener("input", () => { $("#msg-count").textContent = msg.value.length + "/500"; });

  const rules = {
    name: v => v.trim().length >= 2 ? "" : "Please enter your name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email.",
    message: v => v.trim().length >= 10 ? "" : "Message must be at least 10 characters."
  };
  const check = id => {
    const input = $("#" + id), err = $('.err[data-for="' + id + '"]'), bad = rules[id](input.value);
    err.textContent = bad;
    input.closest(".field").classList.toggle("invalid", !!bad);
    return !bad;
  };
  Object.keys(rules).forEach(id => $("#" + id).addEventListener("blur", () => check(id)));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status"; status.textContent = "";
    if (!Object.keys(rules).map(check).every(Boolean)) {
      Sfx.hit(); status.classList.add("bad"); status.textContent = "Fix the highlighted fields."; return;
    }
    if (form.elements._gotcha.value) return; // a robot filled the hidden box

    const data = { name: $("#name").value.trim(), email: $("#email").value.trim(), message: msg.value.trim() };
    btn.classList.add("sending"); btn.disabled = true;

    let saved = false, mailed = false;
    if (Backend.configured) {
      try { await Messages.send(data); saved = true; } catch (err) { /* try the other way */ }
    }
    if (CONFIG.web3formsKey) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject: "New portfolio message from " + data.name, from_name: "Portfolio Website", name: data.name, email: data.email, message: data.message })
        });
        let j = {}; try { j = await res.json(); } catch (err) { /* ignore */ }
        mailed = res.ok && j.success !== false;
      } catch (err) { /* ignore */ }
    }

    if (saved || mailed) {
      status.textContent = "Message sent! Thank you, " + data.name.split(" ")[0] + ".";
      toast("MESSAGE SENT!", "good"); Sfx.star();
      const r = btn.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top, 36, ["#19f0a0", "#22d3ee", "#ffd966"]);
      form.reset(); $("#msg-count").textContent = "0/500";
    } else {
      status.classList.add("bad");
      status.textContent = (!Backend.configured && !CONFIG.web3formsKey)
        ? "Contact form isn't connected yet. See README.md (STEP 2)."
        : "Couldn't send. Please try again later.";
      toast("SEND FAILED", "bad"); Sfx.hit();
    }
    btn.classList.remove("sending"); btn.disabled = false;
  });
}
