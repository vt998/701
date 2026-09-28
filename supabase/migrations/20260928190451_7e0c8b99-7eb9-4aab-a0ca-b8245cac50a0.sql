CREATE POLICY "Published site photos can be read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'site-photos'
  AND EXISTS (
    SELECT 1
    FROM public.site_photos
    WHERE storage_path = name
      AND is_published = true
  )
);

CREATE POLICY "Admins can add site photo files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can edit site photo files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'site-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete site photo files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);