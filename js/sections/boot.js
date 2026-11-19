/* ============================================================
   js/sections/boot.js
   START screen (LORINZ.EXE): the loading lines, then PRESS START.
   It plays once per browser session.
   ============================================================ */

async function runBoot() {
  const loader = $("#loader");

  const finish = async () => {
    Sfx.whoosh();
    await Wipe.in();
    loader.remove();
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
    NavUI.moveInd();
    await wait(80);
    await Wipe.out();
    scramble($("#hero-name"), CONFIG.name.toUpperCase(), 900);
    startTyping();
  };

  // Already pressed start in this browser session (or reduced motion): skip the show.
  if (reduce || store.sget("lgt-booted")) {
    $("#boot-log").textContent = "> WELCOME BACK";
    $("#load-fill").style.width = "100%"; $("#load-pct").textContent = "100%";
    await wait(reduce ? 0 : 350);
    store.sset("lgt-booted", "1");
    await finish();
    return;
  }

  const lines = ["> INIT PIXEL ENGINE ........ OK", "> LOADING SAKURA.PNG ....... OK", "> CONNECTING NEON GRID ..... OK", "> COMPILING PORTFOLIO ...... OK"];
  const log = $("#boot-log"), fill = $("#load-fill"), pct = $("#load-pct");
  let shown = "";
  for (let i = 0; i < lines.length; i++) {
    shown += lines[i] + "\n"; log.textContent = shown;
    const to = Math.round((i + 1) / lines.length * 100);
    fill.style.width = to + "%"; pct.textContent = to + "%";
    await wait(380);
  }

  // PRESS START (everyone). Admin access is the ADMIN button in the corner of the page.
  const btn = $("#start-btn");
  btn.hidden = false;
  btn.focus();

  await new Promise(res => {
    btn.addEventListener("click", res, { once: true });
    window.addEventListener("keydown", function h(e) {
      if (e.key === "Enter" || e.key === " ") { window.removeEventListener("keydown", h); res(); }
    });
  });

  store.sset("lgt-booted", "1");
  Sfx.coin();
  await finish();
}
