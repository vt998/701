import { useRef, useState, type ChangeEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderPlus, Folder, Pencil, Trash2, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PhotoManager } from './photo-manager';
import { ZoomImage } from './zoom-image';
import { photosInCollection } from '@/lib/gallery-rules';
import type { SitePhoto } from '@/lib/site-photos';

type FolderValues = { title: string; theme: string; teachers: string; date: string };
type FolderExtra = { theme: string | null; teachers: string | null; event_date: string | null };

const emptyValues: FolderValues = { title: '', theme: '', teachers: '', date: '' };

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

export function PhotoStrip({ photos }: { photos: { src: string; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  return <div>
    <div ref={ref} className="flex snap-x gap-5 overflow-x-auto px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Фото групи">
      {photos.map((photo, index) => <div key={`${photo.src}-${index}`} className="w-[85%] shrink-0 snap-start overflow-hidden p-2 toy-card sm:w-[28rem] lg:w-[34rem]">
        <ZoomImage src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full rounded-md bg-muted object-cover" />
      </div>)}
    </div>
    {photos.length > 1 && <div className="mx-auto flex w-44 justify-between sm:w-60">
      <Button type="button" variant="outline" size="icon" aria-label="Назад" title="Назад" onClick={() => scroll(-1)} className="rounded-full border-primary-deep bg-card"><ArrowLeft /></Button>
      <Button type="button" variant="outline" size="icon" aria-label="Далі" title="Далі" onClick={() => scroll(1)} className="rounded-full border-primary-deep bg-card"><ArrowRight /></Button>
    </div>}
  </div>;
}

function FolderForm({ initial, busy, onSubmit, onCancel }: {
  initial: FolderValues;
  busy: boolean;
  onSubmit: (values: FolderValues) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<FolderValues>(initial);
  const set = (key: keyof FolderValues) => (e: ChangeEvent<HTMLInputElement>) =>
    setV(prev => ({ ...prev, [key]: e.target.value }));
  return <form className="grid gap-3 sm:grid-cols-2" onSubmit={e => {
    e.preventDefault();
    if (!v.title.trim()) return;
    onSubmit(v);
  }}>
    <Input aria-label="Назва групи" placeholder="Назва групи" value={v.title} onChange={set('title')} required maxLength={150} className="sm:col-span-2" />
    <Input aria-label="Тема" placeholder="Тема (необов’язково)" value={v.theme} onChange={set('theme')} maxLength={200} />
    <Input aria-label="Вихователі" placeholder="Вихователі (необов’язково)" value={v.teachers} onChange={set('teachers')} maxLength={200} />
    <label className="grid gap-1 text-sm text-muted-foreground">
      Дата (необов’язково)
      <Input type="date" aria-label="Дата" value={v.date} onChange={set('date')} />
    </label>
    <div className="flex items-end gap-2">
      <Button type="submit" disabled={busy || !v.title.trim()}><Check />Зберегти</Button>
      <Button type="button" variant="outline" onClick={onCancel}><X />Скасувати</Button>
    </div>
  </form>;
}

export function GalleryFolders({ groupSlug, section, photos }: { groupSlug: string; section: string; photos: SitePhoto[] }) {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const { data: folders = [], isError } = useQuery({
    queryKey: ['gallery-folders', groupSlug, section],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery_folders').select('*').eq('group_slug', groupSlug).eq('section', section).order('sort_order').order('created_at');
      if (error) throw error;
      return data;
    },
  });
  async function save(work: () => Promise<void>) {
    setBusy(true); setError('');
    try { await work(); await queryClient.invalidateQueries({ queryKey: ['gallery-folders'] }); }
    catch { setError('Не вдалося зберегти папку. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  }
  const toRow = (v: FolderValues) => ({
    title: v.title.trim(),
    theme: v.theme.trim() || null,
    teachers: v.teachers.trim() || null,
    event_date: v.date || null,
  });
  const unnamed = photosInCollection(photos, groupSlug, section, null);
  return <div className="space-y-8">
    {admin && <div>
      <PhotoManager section={section} groupSlug={groupSlug} photos={unnamed} />
      <div className="mt-3">
        {creating
          ? <FolderForm initial={emptyValues} busy={busy} onCancel={() => setCreating(false)} onSubmit={v => void save(async () => {
              const row = { group_slug: groupSlug, section, sort_order: Math.max(-1, ...folders.map(f => f.sort_order)) + 1, ...toRow(v) };
              const { error } = await supabase.from('gallery_folders').insert(row);
              if (error) throw error;
              setCreating(false);
            })} />
          : <Button variant="outline" onClick={() => setCreating(true)}><FolderPlus />Створити папку</Button>}
      </div>
    </div>}
    {(error || isError) && <p role="alert" className="text-destructive">{error || 'Не вдалося завантажити папки.'}</p>}
    {folders.map(folder => {
      const images = photosInCollection(photos, groupSlug, section, folder.id);
      const f = folder;
      return <section key={folder.id} aria-label={folder.title}>
        {editing === folder.id
          ? <div className="mb-4">
              <FolderForm
                initial={{ title: folder.title, theme: f.theme ?? '', teachers: f.teachers ?? '', date: f.event_date ?? '' }}
                busy={busy}
                onCancel={() => setEditing(null)}
                onSubmit={v => void save(async () => {
                  const { error } = await supabase.from('gallery_folders').update(toRow(v)).eq('id', folder.id);
                  if (error) throw error;
                  setEditing(null);
                })}
              />
            </div>
          : <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="flex min-w-0 items-center gap-2 font-display text-xl text-primary-deep"><Folder className="size-5 shrink-0" /><span className="break-words">{folder.title}</span></h3>
                {f.theme && <p className="mt-1 text-muted-foreground"><span className="font-bold text-primary-deep">Тема:</span> {f.theme}</p>}
                {f.teachers && <p className="mt-1 text-muted-foreground"><span className="font-bold text-primary-deep">Вихователі:</span> {f.teachers}</p>}
                {f.event_date && <p className="mt-1 text-muted-foreground"><span className="font-bold text-primary-deep">Дата:</span> {formatDate(f.event_date)}</p>}
              </div>
              {admin && <div className="flex shrink-0 gap-2">
                <Button size="icon" variant="ghost" aria-label={`Змінити ${folder.title}`} title="Змінити" onClick={() => setEditing(folder.id)}><Pencil /></Button>
                <Button size="icon" variant="ghost" disabled={busy || images.length > 0} title={images.length ? 'Спочатку видаліть фото папки' : 'Видалити папку'} aria-label={`Видалити папку ${folder.title}`} onClick={() => { if (window.confirm('Видалити порожню папку?')) void save(async () => { const { error } = await supabase.from('gallery_folders').delete().eq('id', folder.id); if (error) throw error; }); }}><Trash2 /></Button>
              </div>}
            </div>}
        {admin && <PhotoManager section={section} groupSlug={groupSlug} folderId={folder.id} photos={images} />}
        <PhotoStrip photos={images} />
      </section>;
    })}
  </div>;
}