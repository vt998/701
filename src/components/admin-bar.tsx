import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart3, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAdminSession } from './admin-session';
import { supabase } from '@/integrations/supabase/client';

export function AdminBar() {
  const { admin } = useAdminSession();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({ queryKey: ['page-statistics'], enabled: admin && open, queryFn: async () => {
    const now = Date.now();
    const { count, error } = await supabase.from('page_views').select('id', { count: 'exact', head: true });
    if (error) throw error;
    const { data: rows, error: e2 } = await supabase.from('page_views').select('path,viewed_at').gte('viewed_at', new Date(now - 30 * 86400000).toISOString()).limit(10000);
    if (e2) throw e2;
    const pages: Record<string, number> = {};
    for (const r of rows ?? []) pages[r.path] = (pages[r.path] ?? 0) + 1;
    return { total: count ?? 0, month: rows?.length ?? 0, week: rows?.filter(r => Date.parse(r.viewed_at) >= now - 7 * 86400000).length ?? 0, pages: Object.entries(pages).sort((a, b) => b[1] - a[1]) };
  } });
  if (!admin) return null;
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); }
  return <div className="border-b border-primary-deep bg-secondary">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 text-sm sm:px-6">
      <span className="font-display font-bold text-primary-deep">Режим адміністратора</span>
      <span className="text-muted-foreground">Додавайте, видаляйте та перетягуйте фото прямо на сторінках.</span>
      <div className="ml-auto flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(o => !o)}><BarChart3 />Статистика</Button>
        <Button size="sm" variant="outline" onClick={() => void signOut()}><LogOut />Вийти</Button>
      </div>
    </div>
    {open && <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="grid grid-cols-3 gap-4">{([['Усі перегляди', stats?.total], ['За 7 днів', stats?.week], ['За 30 днів', stats?.month]] as const).map(([l, v]) => <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="font-display text-2xl text-primary-deep">{v ?? '—'}</p></div>)}</div>
      <ul className="mt-2 text-sm">{stats?.pages.map(([p, c]) => <li key={p} className="flex justify-between border-b border-border py-1"><span>{p}</span><span>{c}</span></li>)}</ul>
    </div>}
  </div>;
}
