/* ============================================================
   js/core/dialog.js
   A small question box. Used for "Download CV?" and for the admin's
   Delete / Replace / Cancel choice.

   const r = await Dialog.open({
     title: "Download CV?",
     text: "Do you want to download my CV?",
     buttons: [ { label: "NO", value: "no", cls: "btn-outline" }, { label: "YES", value: "yes" } ]
   });
   r.value   -> the value of the button that was pressed ("cancel" if closed)
   r.text    -> what was typed (when input: { type: "text" })
   r.files   -> chosen files (when input: { type: "file" })
   ============================================================ */

const Dialog = {
  open(opts) {
    return new Promise(resolve => {
      const wrap = document.createElement("div");
      wrap.className = "dlg";
      wrap.setAttribute("role", "dialog");
      wrap.setAttribute("aria-modal", "true");

      let inputHtml = "";
      if (opts.input) {
        inputHtml = '<input id="dlg-input" type="' + esc(opts.input.type || "text") + '"' +
          (opts.input.accept ? ' accept="' + esc(opts.input.accept) + '"' : "") +
          (opts.input.placeholder ? ' placeholder="' + esc(opts.input.placeholder) + '"' : "") +
          (opts.input.value ? ' value="' + esc(opts.input.value) + '"' : "") + " />";
      }
      wrap.innerHTML =
        '<div class="dlg-backdrop"></div><div class="dlg-card"><h3>' + esc(opts.title) + "</h3>" +
        (opts.text ? "<p>" + esc(opts.text) + "</p>" : "") + inputHtml +
        '<div class="dlg-actions"></div></div>';

      const actions = wrap.querySelector(".dlg-actions");
      const input = wrap.querySelector("#dlg-input");
      let done = false;

      const close = value => {
        if (done) return;
        done = true;
        document.removeEventListener("keydown", onKey);
        const result = { value, text: input ? input.value.trim() : "", files: input && input.files ? Array.from(input.files) : [] };
        wrap.classList.remove("open");
        setTimeout(() => wrap.remove(), 260);
        resolve(result);
      };
      const onKey = e => { if (e.key === "Escape") close("cancel"); };

      (opts.buttons || []).forEach(b => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn small " + (b.cls || "");
        btn.textContent = b.label;
        btn.addEventListener("click", () => close(b.value));
        actions.appendChild(btn);
      });

      wrap.querySelector(".dlg-backdrop").addEventListener("click", () => close("cancel"));
      document.addEventListener("keydown", onKey);
      document.body.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add("open"));
      setTimeout(() => (input || actions.lastElementChild || wrap).focus(), 60);
    });
  }
};
