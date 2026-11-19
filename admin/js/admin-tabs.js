/* ============================================================
   admin/js/admin-tabs.js
   Switches between the 5 admin tabs and small shared helpers.
   Each tab file adds a function to Tabs.onShow so it can load
   its data when you open it.
   ============================================================ */

const MAX_BYTES = 50 * 1024 * 1024; // free Supabase limit per file

const Tabs = {
  onShow: {}, // name -> function, filled by the other admin files

  show(name) {
    $$("#adm-tabs .filter").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    $$(".adm-tab").forEach(s => { s.hidden = s.id !== "tab-" + name; });
    if (Tabs.onShow[name]) Tabs.onShow[name]();
  },

  init() {
    $$("#adm-tabs .filter").forEach(b => b.addEventListener("click", () => Tabs.show(b.dataset.tab)));
  }
};

// Shows a message under a form. kind: "" | "good" | "bad"
function formStatus(el, msg, kind) {
  el.textContent = msg || "";
  el.className = "form-status " + (kind || "");
}

// Turns a list of files into ONE file: a single file stays as it is, many become a .zip
async function packFiles(files, zipName) {
  if (files.length === 1 && !files[0].webkitRelativePath) return files[0];
  const zip = new JSZip();
  files.forEach(f => zip.file(f.webkitRelativePath || f.name, f));
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  return new File([blob], safeName(zipName) + ".zip", { type: "application/zip" });
}
