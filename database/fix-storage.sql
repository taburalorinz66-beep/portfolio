-- ============================================================
-- database/fix-storage.sql
-- Run this ONCE in the Supabase SQL Editor if you already ran the
-- old setup.sql. It lets the admin delete and replace uploaded files.
-- Safe to run again.
-- ============================================================
drop policy if exists "admin reads files" on storage.objects;

create policy "admin reads files"
  on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-files' and public.is_admin());
