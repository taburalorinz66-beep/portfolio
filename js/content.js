/* ============================================================
   js/content.js   ★ YOUR TEXT: what the site says about you.
   Change the words here. No other file needs to be touched.
   ============================================================ */

const CONTENT = {
  roles: ["Game Developer", "Gameplay Programmer", "Web Developer", "Pixel Night Owl"],
  heroText: "I build games and websites with code, pixels, and a lot of late nights.",
  bio: "I'm Lorinz, a game developer who loves building worlds in code, from first-person survival shooters in PlayCanvas to Roblox tools. I also build websites with HTML, CSS and JavaScript.",

  // Optional: a photo file in assets/images/ (example: "assets/images/me.png") replaces the pixel avatar.
  photo: "assets/images/avatar.png",

  // Leave a url empty ("") to hide that link.
  socials: [
    { name: "GitHub", url: "" },
    { name: "itch.io", url: "" },
    { name: "LinkedIn", url: "" },
    { name: "Roblox", url: "" }
  ],

  ticker: ["GAME DEVELOPER", "WEB DEVELOPER", "PLAYCANVAS", "ROBLOX STUDIO", "UNITY", "JAVASCRIPT", "PIXEL ART", "OPEN FOR COLLABS"],

  terminal: [
    { cmd: "whoami", out: "lorinz-g-tabura" },
    { cmd: "cat role.txt", out: "game developer + web developer" },
    { cmd: "ls tools/", out: "playcanvas  roblox-studio  unity  javascript  html-css" },
    { cmd: "echo $STATUS", out: "leveling up... always." }
  ]
};

// level 0-100. Change names, levels and notes to match your real skills.
const SKILLS = [
  { name: "HTML / CSS", lvl: 85, color: "a3", note: "Layouts, animations, responsive design." },
  { name: "JavaScript", lvl: 80, color: "a1", note: "Gameplay scripts, DOM, canvas." },
  { name: "Game Design", lvl: 65, color: "a2", note: "Mechanics, loops and player feedback." },
  { name: "PlayCanvas", lvl: 55, color: "a3", note: "3D web games: movement, enemies, UI." },
  { name: "Unity / C#", lvl: 45, color: "a1", note: "Porting gameplay systems into C#." },
  { name: "Roblox Studio", lvl: 40, color: "a2", note: "Tools, clothing and Lua scripting." },
  { name: "Git / GitHub", lvl: 50, color: "a3", note: "Version control for every project." }
];

// Always shown on the site (first in the list). Projects you publish from the
// admin panel are added after these. To change or add a built-in one, edit here.
// category: "game" or "website"   url: "" = no link yet
const FEATURED_PROJECTS = [
  { id: "f1", category: "game", kind: "link", title: "My First Game", url: "https://playcanv.as/b/b0da0001", created_at: "2026-01-01",
    description: "The very first game I ever made, built with PlayCanvas. Press PLAY to try it in your browser.",
    features: [] },
  { id: "f2", category: "website", kind: "link", title: "Portfolio", url: "", created_at: "2026-10-30",
    description: "This website: my first successful web project, with a playable arcade, day/night mode and an admin panel.",
    features: ["Plain HTML, CSS and JavaScript", "Playable mini game", "Admin panel for files and links"] }
];
