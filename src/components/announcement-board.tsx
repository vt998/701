import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { centerLastAnnouncement } from '@/lib/gallery-rules';

const original = [
  { id: 'open-day', date_label: 'Щодня', tag: 'Батькам', title: 'День відкритих дверей 24/7', body: 'Ми завжди відкриті до спілкування.' },
  { id: 'shelter', date_label: 'Щодня', tag: 'Безпека', title: 'Наше укриття', body: 'Для учасників освітнього процесу працює укриття, що розраховане на 300 осіб. Для дитини є своє ліжечко, постільна білизна, ігрова зона, санітарно-гігієнічна кімната(санвузол), проведено опалення, є приточно-витяжні витяжки і гарна шумоізоляція. Наші діти не чують вибухів. Зроблений додатковий вхід в укриття, прямо з дитячого садочка (без виходу на вулицю), щоб діти могли в груповому взутті та кофтинках виходити в укриття.' },
];
export function AnnouncementBoard() {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { data: saved = [], isError } = useQuery({ queryKey: ['announcements'], queryFn: async () => {
    const { data, error } = await supabase.from('announcements').select('*').order('sort_order').order('created_at');
    if (error) throw error; return data;
  } });
  const items = [...original, ...saved];
  async function run(work: () => Promise<void>) {
    setBusy(true); setError('');
    try { await work(); await queryClient.invalidateQueries({ queryKey: ['announcements'] }); }
    catch { setError('Не вдалося зберегти оголошення. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  }
  return <section className="pb-14" aria-labelledby="announcement-heading">
    <h2 id="announcement-heading" className="mb-6 font-display text-3xl text-primary-deep">Дошка оголошень</h2>
    {admin && <div className="mb-5">
      {!creating ? <Button variant="outline" onClick={() => setCreating(true)}><Plus />Додати оголошення</Button> : <form className="max-w-xl space-y-3" onSubmit={e => {
        e.preventDefault(); if (!title.trim() || !body.trim()) return;
        void run(async () => {
          const { error } = await supabase.from('announcements').insert({ title: title.trim(), body: body.trim(), date_label: date.trim(), tag: tag.trim(), sort_order: Math.max(-1, ...saved.map(n => n.sort_order)) + 1 });
          if (error) throw error;
          setCreating(false); setTitle(''); setBody(''); setDate(''); setTag('');
        });
      }}>
        <Input aria-label="Заголовок оголошення" placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)} required maxLength={200} />
        <Textarea aria-label="Текст оголошення" placeholder="Текст оголошення" value={body} onChange={e => setBody(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3"><Input aria-label="Дата оголошення" placeholder="Дата (необов’язково)" value={date} onChange={e => setDate(e.target.value)} /><Input aria-label="Позначка оголошення" placeholder="Позначка (необов’язково)" value={tag} onChange={e => setTag(e.target.value)} /></div>
        <div className="flex gap-3"><Button disabled={busy || !title.trim() || !body.trim()} type="submit">Зберегти оголошення</Button><Button type="button" variant="outline" onClick={() => setCreating(false)}>Скасувати</Button></div>
      </form>}
    </div>}
    {(error || isError) && <p role="alert" className="mb-4 text-destructive">{error || 'Не вдалося завантажити додаткові оголошення.'}</p>}
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => <article key={item.id} className={`min-w-0 p-5 toy-card ${centerLastAnnouncement(index, items.length) ? 'md:col-span-2 md:w-[calc(50%-0.5rem)] md:justify-self-center' : ''}`}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <span className="break-words font-display text-xs font-bold text-accent">{item.date_label}</span>
          {item.tag && <span className="break-words rounded-md border border-primary-deep bg-mint px-2.5 py-0.5 text-xs font-bold text-primary-deep">{item.tag}</span>}
        </div>
        <h3 className="mt-3 break-words font-display text-lg text-primary-deep">{item.title}</h3>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">{item.body}</p>
        {admin && index >= original.length && <Button className="mt-3" size="icon" variant="ghost" aria-label={`Видалити оголошення ${item.title}`} title="Видалити оголошення" disabled={busy} onClick={() => { if (window.confirm('Видалити оголошення?')) void run(async () => { const { error } = await supabase.from('announcements').delete().eq('id', item.id); if (error) throw error; }); }}><Trash2 /></Button>}
      </article>)}
    </div>
  </section>;
}