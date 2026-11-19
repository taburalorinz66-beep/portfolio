/* ============================================================
   js/core/toast.js
   The small pop-up messages in the corner: toast('Hello', 'good').
   ============================================================ */

function toast(msg, kind = "") {
  const box = $("#toasts");
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.textContent = msg;
  box.appendChild(t);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 380); }, 2800);
}
