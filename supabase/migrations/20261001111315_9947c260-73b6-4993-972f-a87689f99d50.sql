DROP POLICY IF EXISTS "Approved email can claim admin role" ON public.user_roles;
CREATE POLICY "Approved email can claim admin role" ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'admin'::app_role AND lower(coalesce(auth.jwt() ->> 'email', '')) = 'dnz701@ukr.net');