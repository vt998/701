GRANT SELECT ON public.site_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_photos TO authenticated;
GRANT ALL ON public.site_photos TO service_role;
GRANT INSERT ON public.page_views TO anon;
GRANT SELECT, INSERT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

CREATE POLICY "Admins can read all site photo files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'site-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL DEFAULT 'Посада',
  name text NOT NULL DEFAULT 'Ім’я та прізвище',
  storage_path text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team is public" ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins add team" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins edit team" ON public.team_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete team" ON public.team_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team photo files are public" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'site-photos' AND EXISTS (SELECT 1 FROM public.team_members t WHERE t.storage_path = objects.name));

INSERT INTO public.team_members (position, sort_order)
SELECT p, ord FROM unnest(ARRAY[
 'Директор','Вихователь-методист',
 'Вихователь 1 · група «Джерельце»','Вихователь 2 · група «Джерельце»','Помічник вихователя · група «Джерельце»',
 'Вихователь 1 · група «Струмочок»','Вихователь 2 · група «Струмочок»','Помічник вихователя · група «Струмочок»',
 'Вихователь 1 · група «Ромашка»','Вихователь 2 · група «Ромашка»','Помічник вихователя · група «Ромашка»',
 'Вихователь 1 · група «Сонечко»','Вихователь 2 · група «Сонечко»','Помічник вихователя · група «Сонечко»',
 'Вихователь 1 · група «Калинка»','Вихователь 2 · група «Калинка»','Помічник вихователя · група «Калинка»',
 'Інструктор з фізичного виховання','Музичний керівник','Логопед','Практичний психолог','Медична сестра',
 'Завідувач господарством','Комірник','Кухар','Кухар','Праля','Робітник з обслуговування','Головна бабуся нашого садочка'
]) WITH ORDINALITY AS a(p, ord);