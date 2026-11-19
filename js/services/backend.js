/* ============================================================
   js/services/backend.js
   Connects to Supabase (your free online database + file storage).
   Backend.configured is false until you fill in js/config.js,
   and the site then falls back to sample projects.
   ============================================================ */

const Backend = {
  db: null,
  configured: false,

  init() {
    const lib = window.supabase; // loaded from the <script> tag in the HTML
    if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && lib && lib.createClient) {
      this.db = lib.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      this.configured = true;
    }
  }
};

Backend.init();
