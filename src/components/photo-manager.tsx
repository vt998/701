import { useRef, useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import type { SitePhoto } from '@/lib/site-photos';
import { photoStoragePath, isAllowedImage, moveItem } from '@/lib/photo-rules';

export function PhotoManager({ section, groupSlug = null, photos }: { section: string; groupSlug?: string | null; photos: SitePhoto[] }) {
  const { admin } = useAdminSession();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();
  if (!admin) return null;
  async function operation(work: () => Promise<void>) {
    setBusy(true); setError('');
    try { await work(); await queryClient.invalidateQueries({ queryKey: ['site-photos'] }); }
    catch (e) { console.error(e); setError(e instanceof Error && e.message === 'file' ? 'Оберіть JPG, PNG або WEBP до 10 МБ.' : 'Не вдалося зберегти зміни. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  }
  async function upload(files: FileList | null) {
    if (!files) return;
    const chosen = Array.from(files);
    await operation(async () => {
      for (const [index, file] of chosen.entries()) {
        if (!isAllowedImage(file.type, file.size)) throw new Error('file');
        const path = photoStoragePath(section, groupSlug, file.type, crypto.randomUUID());
        const { error: uploadError } = await supabase.storage.from('site-photos').upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        const { error: rowError } = await supabase.from('site_photos').insert({ section, group_slug: groupSlug, storage_path: path, alt_text: file.name.replace(/\.[^.]+$/, ''), sort_order: Math.max(-1, ...photos.map(p => p.sort_order)) + index + 1 });
        if (rowError) { await supabase.storage.from('site-photos').remove([path]); throw rowError; }
      }
    });
    if (input.current) input.current.value = '';
  }
  async function remove(photo: SitePhoto) {
    if (!window.confirm('Видалити це фото?')) return;
    await operation(async () => {
      const { error: rowError } = await supabase.from('site_photos').delete().eq('id', photo.id);
      if (rowError) throw rowError;
      await supabase.storage.from('site-photos').remove([photo.storage_path]);
    });
  }
  async function drop(target: number) {
    if (dragIndex === null || dragIndex === target) return setDragIndex(null);
    const reordered = moveItem(photos, dragIndex, target);
    setDragIndex(null);
    await operation(async () => {
      for (const [order, photo] of reordered.entries()) {
        if (photo.sort_order === order) continue;
        const { error } = await supabase.from('site_photos').update({ sort_order: order }).eq('id', photo.id);
        if (error) throw error;
      }
    });
  }
  return <div className="my-5 rounded-md border border-dashed border-primary p-4">
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e => void upload(e.target.files)} />
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled={busy} onClick={() => input.current?.click()}><Plus />{busy ? 'Зберігаємо…' : 'Додати фото'}</Button>
      {photos.length > 1 && <span className="text-sm text-muted-foreground">Перетягніть фото, щоб змінити порядок</span>}
    </div>
    {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
    {photos.length > 0 && <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
      {photos.map((photo, index) => <div key={photo.id} draggable onDragStart={() => setDragIndex(index)} onDragOver={e => e.preventDefault()} onDrop={() => void drop(index)}
        className={`w-36 shrink-0 cursor-grab rounded-md border bg-card p-1 ${dragIndex === index ? 'opacity-50' : ''}`}>
        <div className="relative"><img src={photo.src} alt={photo.alt} className="pointer-events-none aspect-video w-full rounded object-cover" /><GripVertical className="absolute left-1 top-1 size-4 rounded bg-card" /></div>
        <Input className="mt-1 h-8 text-xs" aria-label="Підпис фото" defaultValue={photo.alt_text} onBlur={e => { const value = e.target.value; if (value !== photo.alt_text) void operation(async () => { const { error } = await supabase.from('site_photos').update({ alt_text: value }).eq('id', photo.id); if (error) throw error; }); }} />
        <Button variant="destructive" size="sm" className="mt-1 w-full" disabled={busy} onClick={() => void remove(photo)}><Trash2 />Видалити</Button>
      </div>)}
    </div>}
  </div>;
}
