/* ============================================================
   js/services/items.js
   Everything published on the site: games, websites and the CV.
   An "item" is one row in the database:
     { id, category: "game" | "website" | "cv",
       kind: "file" | "link", title, description,
       url (links), file_path + file_size (files), created_at }
   Visitors can only READ. Only the admin can add/replace/delete.
   ============================================================ */

const Items = {
  _bucket() { return Backend.db.storage.from(CONFIG.bucket); },

  /* ---------- reading (everyone) ---------- */

  async list() {
    const { data, error } = await Backend.db.from("items").select("*")
      .in("category", ["game", "website"]).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async latestCv() {
    const { data, error } = await Backend.db.from("items").select("*")
      .eq("category", "cv").order("created_at", { ascending: false }).limit(1);
    if (error) throw new Error(error.message);
    return data && data.length ? data[0] : null;
  },

  // The web address of an item. download=true makes the browser save the file.
  fileUrl(item, download) {
    if (item.kind === "link") return item.url;
    const { data } = this._bucket().getPublicUrl(item.file_path, download ? { download: true } : undefined);
    return data.publicUrl;
  },

  /* ---------- publishing (admin only) ---------- */

  async _upload(category, file) {
    const path = category + "/" + Date.now() + "-" + safeName(file.name);
    const { error } = await this._bucket().upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || "application/octet-stream" });
    if (error) throw new Error(error.message);
    return path;
  },

  async _removeFiles(paths) {
    const list = paths.filter(Boolean);
    if (list.length) await this._bucket().remove(list); // best effort
  },

  async addFile({ category, title, description, file }) {
    const path = await this._upload(category, file);
    const { error } = await Backend.db.from("items").insert({ category, kind: "file", title, description: description || null, file_path: path, file_size: file.size });
    if (error) { await this._removeFiles([path]); throw new Error(error.message); }
  },

  async addLink({ category, title, description, url }) {
    const { error } = await Backend.db.from("items").insert({ category, kind: "link", title, description: description || null, url });
    if (error) throw new Error(error.message);
  },

  // Publish a new CV and remove the old one(s).
  async setCv(file) {
    const { data: old } = await Backend.db.from("items").select("*").eq("category", "cv");
    const path = await this._upload("cv", file);
    const { error } = await Backend.db.from("items").insert({ category: "cv", kind: "file", title: file.name, file_path: path, file_size: file.size });
    if (error) { await this._removeFiles([path]); throw new Error(error.message); }
    for (const row of old || []) await this.remove(row);
  },

  async remove(item) {
    const { data, error } = await Backend.db.from("items").delete().eq("id", item.id).select();
    if (error) throw new Error(error.message);
    if (!data || !data.length) throw new Error("Not allowed (are you logged in as admin?)");
    await this._removeFiles([item.file_path]);
  },

  async replaceFile(item, file) {
    const path = await this._upload(item.category, file);
    const { data, error } = await Backend.db.from("items").update({ file_path: path, file_size: file.size }).eq("id", item.id).select();
    if (error || !data || !data.length) { await this._removeFiles([path]); throw new Error(error ? error.message : "Not allowed (are you logged in as admin?)"); }
    await this._removeFiles([item.file_path]);
  },

  async replaceLink(item, url) {
    const { data, error } = await Backend.db.from("items").update({ url }).eq("id", item.id).select();
    if (error) throw new Error(error.message);
    if (!data || !data.length) throw new Error("Not allowed (are you logged in as admin?)");
  }
};
