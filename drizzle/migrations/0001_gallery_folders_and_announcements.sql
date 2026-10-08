CREATE TABLE public.gallery_folders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 group_slug text NOT NULL,
 section text NOT NULL,
 title text NOT NULL,
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_folders TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_folders TO authenticated;
GRANT ALL ON public.gallery_folders TO service_role;
ALTER TABLE public.gallery_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Folders are public" ON public.gallery_folders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create folders" ON public.gallery_folders FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins edit folders" ON public.gallery_folders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete folders" ON public.gallery_folders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
ALTER TABLE public.site_photos ADD COLUMN folder_id uuid REFERENCES public.gallery_folders(id);
CREATE INDEX site_photos_folder_id_idx ON public.site_photos(folder_id);
CREATE TABLE public.announcements (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL DEFAULT '',
 body text NOT NULL DEFAULT '',
 date_label text NOT NULL DEFAULT '',
 tag text NOT NULL DEFAULT '',
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements are public" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins edit announcements" ON public.announcements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete announcements" ON public.announcements FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));