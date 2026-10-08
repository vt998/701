import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderPlus, Folder, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PhotoManager } from './photo-manager';
import { ZoomImage } from './zoom-image';
import { photosInCollection } from '@/lib/gallery-rules';
import type { SitePhoto } from '@/lib/site-photos';

export function PhotoStrip({ photos }: { photos: { src: string; alt: string }[] }) {
  return <div className="flex snap-x gap-4 overflow-x-auto pb-4" aria-label="Фото групи">
    {photos.map((photo, index) => <div key={`${photo.src}-${index}`} className="w-72 shrink-0 snap-start overflow-hidden rounded-md border border-border sm:w-96">
     <ZoomImage src={photo.src} alt={photo.alt} className="aspect-video w-full bg-muted object-cover" />
    </div>)}
  </div>;
}

export function GalleryFolders({ groupSlug, section, photos }: { groupSlug: string; section: string; photos: SitePhoto[] }) {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
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
  const unnamed = photosInCollection(photos, groupSlug, section, null);
  return <div className="space-y-8">
    {admin && <div>
      <PhotoManager section={section} groupSlug={groupSlug} photos={unnamed} />
      {creating ? <form className="flex items-center gap-2" onSubmit={e => {
        e.preventDefault(); if (!title.trim()) return;
        void save(async () => {
          const { error } = await supabase.from('gallery_folders').insert({ group_slug: groupSlug, section, title: title.trim(), sort_order: Math.max(-1, ...folders.map(f => f.sort_order)) + 1 });
          if (error) throw error;
          setTitle(''); setCreating(false);
        });
      }}>
        <Input aria-label="Назва папки" placeholder="Назва папки" value={title} onChange={e => setTitle(e.target.value)} required maxLength={150} className="min-w-0 max-w-md" />
        <Button type="submit" size="icon" disabled={busy || !title.trim()} aria-label="Зберегти папку" title="Зберегти папку"><Check /></Button>
        <Button type="button" variant="outline" size="icon" aria-label="Скасувати" title="Скасувати" onClick={() => setCreating(false)}><X /></Button>
      </form> : <Button variant="outline" onClick={() => setCreating(true)}><FolderPlus />Створити папку</Button>}
    </div>}
    {(error || isError) && <p role="alert" className="text-destructive">{error || 'Не вдалося завантажити папки.'}</p>}
    {folders.map(folder => {
      const images = photosInCollection(photos, groupSlug, section, folder.id);
      return <section key={folder.id} aria-label={folder.title}>
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          {editing === folder.id ? <form className="flex min-w-0 gap-2" onSubmit={e => {
            e.preventDefault(); if (!editTitle.trim()) return;
            void save(async () => { const { error } = await supabase.from('gallery_folders').update({ title: editTitle.trim() }).eq('id', folder.id); if (error) throw error; setEditing(null); });
          }}><Input aria-label="Нова назва папки" value={editTitle} onChange={e => setEditTitle(e.target.value)} required maxLength={150} /><Button size="icon" disabled={busy} aria-label="Зберегти назву" title="Зберегти назву"><Check /></Button><Button type="button" size="icon" variant="outline" aria-label="Скасувати назву" onClick={() => setEditing(null)}><X /></Button></form>
          : <h3 className="flex min-w-0 items-center gap-2 font-display text-xl text-primary-deep"><Folder className="size-5 shrink-0" /><span className="break-words">{folder.title}</span></h3>}
          {admin && editing !== folder.id && <div className="flex shrink-0 gap-2">
            <Button size="icon" variant="ghost" aria-label={`Змінити назву ${folder.title}`} title="Змінити назву" onClick={() => { setEditing(folder.id); setEditTitle(folder.title); }}><Pencil /></Button>
            <Button size="icon" variant="ghost" disabled={busy || images.length > 0} title={images.length ? 'Спочатку видаліть фото папки' : 'Видалити папку'} aria-label={`Видалити папку ${folder.title}`} onClick={() => { if (window.confirm('Видалити порожню папку?')) void save(async () => { const { error } = await supabase.from('gallery_folders').delete().eq('id', folder.id); if (error) throw error; }); }}><Trash2 /></Button>
          </div>}
        </div>
        {admin && <PhotoManager section={section} groupSlug={groupSlug} folderId={folder.id} photos={images} />}
        <PhotoStrip photos={images} />
      </section>;
    })}
  </div>;
}