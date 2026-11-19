/* ============================================================
   js/main.js
   The very last script. It starts everything, in order.
   Read this file top to bottom to see how the site starts up.
   ============================================================ */

function startSite() {
  // 1. look + sound settings remembered from last visit
  document.documentElement.setAttribute("data-theme", state.theme);
  setThemeLabel();
  setSound(state.sound, false);

  // 2. page transitions
  Wipe.build();
  window.addEventListener("resize", () => { clearTimeout(Wipe.rt); Wipe.rt = setTimeout(() => Wipe.build(), 300); });

  // 3. write the text into each section
  $("#year").textContent = new Date().getFullYear();
  if (CONTENT.photo) $("#loader-sprite").replaceWith(Object.assign(document.createElement("img"), { id: "loader-sprite", src: CONTENT.photo, alt: "" }));
  else drawAvatar($("#loader-sprite"));
  renderHero();
  renderAbout();
  renderSkills();
  Projects.init();

  // 4. visuals and behavior
  FX.init();
  Cursor.init();
  NavUI.init();
  initReveal();
  Game.init();
  initPalette();
  initContact();
  initGlobalFeel();
  AdminAccess.init();

  // 5. start screen, then fetch the live data from the backend
  runBoot();
  Projects.load();
  Cv.prefetch();
}

startSite();
