/* ============================================================
   js/visuals/avatar.js
   The little pixel-art person in the About section and boot screen.
   ============================================================ */

const AVATAR_HALF = [
  "........",
  ".....kkk",
  "...kkkkk",
  "..kkkkkk",
  ".kkkssss",
  ".kksssss",
  "pkkssess",
  "pkksssss",
  ".kkssssm",
  "..ksssss",
  "...hhhss",
  "..hhhhhh",
  ".hhhhhwh",
  ".hhhhhhh",
  ".dhhhhhh",
  ".dddhhhh"
];

function drawAvatar(cv) {
  const g = cv.getContext("2d");
  const pal = { k: "#1a1030", s: "#f2c9a5", e: "#1a1030", p: "#4fe3ff", m: "#c0505a", h: "#ff7bd5", d: "#b04a96", w: "#ffffff" };
  g.clearRect(0, 0, 16, 16);
  AVATAR_HALF.forEach((half, y) => {
    const row = half + half.split("").reverse().join("");
    for (let x = 0; x < 16; x++) {
      const c = row[x];
      if (c === ".") continue;
      g.fillStyle = pal[c];
      g.fillRect(x, y, 1, 1);
    }
  });
}
