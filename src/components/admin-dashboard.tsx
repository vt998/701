import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { GroupGallery } from './group-gallery';
import { PhotoManager } from './photo-manager';
import { useSitePhotos } from '@/lib/site-photos';
import { supabase } from '@/integrations/supabase/client';
export function AdminDashboard() {
  const [section, setSection] = useState('groups');
  const { data: photos = [] } = useSitePhotos();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: stats } = useQuery({ queryKey: ['page-statistics'], queryFn: async () => {
    const now = Date.now();
    const cutoff = new Date(now - 30 * 86400000).toISOString();
    const { count, error } = await supabase.from('page_views').select('id', { count: 'exact', head: true });
    if (error) throw error;
    const { data: rows, error: rowsError } = await supabase.from('page_views').select('path,viewed_at').gte('viewed_at', cutoff).order('viewed_at', { ascending: false }).limit(10000);
    if (rowsError) throw rowsError;
    const pages: Record<string, number> = {};
    for (const row of rows ?? []) pages[row.path] = (pages[row.path] ?? 0) + 1;
    return { total: count ?? 0, month: rows?.length ?? 0, week: rows?.filter(r => Date.parse(r.viewed_at) >= now - 7 * 86400000).length ?? 0, pages: Object.entries(pages).sort((a,b) => b[1] - a[1]) };
  }});
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: '/admin', replace: true }); }
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h1 className="font-display text-3xl text-primary-deep">Кабінет адміністратора</h1><Button variant="outline" onClick={() => void signOut()}><LogOut />Вийти</Button></div>
    <div className="mb-8 flex flex-wrap gap-2">{([['groups','Галереї груп'],['team','Колектив'],['adaptation','Адаптація'],['meals','Харчування'],['routine','Режим дня']] as const).map(([value,label]) => <Button key={value} variant={section === value ? 'default' : 'outline'} onClick={() => setSection(value)}>{label}</Button>)}</div>
    {section === 'groups' ? <GroupGallery /> : <PhotoManager section={section} photos={photos.filter(p => p.section === section)} />}
    <section className="mt-10 border-t border-border py-8"><h2 className="font-display text-2xl text-primary-deep">Статистика відвідувань</h2>
      <div className="my-5 grid grid-cols-3 gap-4">{[['Усі перегляди',stats?.total],['За 7 днів',stats?.week],['За 30 днів',stats?.month]].map(([label,value]) => <div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="font-display text-3xl text-primary-deep">{value ?? '—'}</p></div>)}</div>
      <ul className="space-y-2">{stats?.pages.map(([path,count]) => <li key={path} className="flex justify-between border-b border-border py-2"><span>{path}</span><span>{count}</span></li>)}</ul>
    </section>
    <Button asChild variant="outline"><Link to="/">На сайт</Link></Button>
  </main>;
}
