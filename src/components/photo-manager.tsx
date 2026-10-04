import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import type { SitePhoto } from '@/lib/site-photos';
export function PhotoManager({ section, groupSlug = null, photos }: { section: string; groupSlug?: string | null; photos: SitePhoto[] }) {
  const { admin } = useAdminSession();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  if (!admin) return null;
  async function operation(work: () => Promise<void>) {
    setBusy(true); setError('');
    try { await work(); await queryClient.invalidateQueries({ queryKey: ['site-photos'] }); }
    catch { setError('Не вдалося зберегти зміни. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  }
  async function upload(files: FileList | null) {
    if (!files) return;
    const chosen = Array.from(files);
    await operation(async () => {
      for (const [index, file] of chosen.entries()) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10485760) throw new Error('file');
        const path = `${section.replace(':', '-')}/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
        const { error: uploadError } = await supabase.storage.from('site-photos').upload(path, file);
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
      const { error: storageError } = await supabase.storage.from('site-photos').remove([photo.storage_path]);
      if (storageError) throw storageError;
      const { error: rowError } = await supabase.from('site_photos').delete().eq('id', photo.id);
      if (rowError) throw rowError;
    });
  }
  async function move(index: number, offset: number) {
    const reordered = [...photos];
    const target = index + offset;
    const current = reordered[index], neighbor = reordered[target];
    if (!current || !neighbor) return;
    reordered[index] = neighbor; reordered[target] = current;
    await operation(async () => {
      for (const [order, photo] of reordered.entries()) {
        const { error } = await supabase.from('site_photos').update({ sort_order: order }).eq('id', photo.id);
        if (error) throw error;
      }
    });
  }
  return <div className="my-5 border-y border-border py-4">
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e => void upload(e.target.files)} />
    <Button disabled={busy} onClick={() => input.current?.click()}><Plus />{busy ? 'Зберігаємо…' : 'Додати фото'}</Button>
    {error && <p role="alert" className="mt-3 text-destructive">{error} Оберіть JPG, PNG або WEBP до 10 МБ.</p>}
    <div className="mt-3 flex gap-4 overflow-x-auto">
      {photos.map((photo, index) => <div key={photo.id} className="w-40 shrink-0">
        <img src={photo.src} alt={photo.alt} className="aspect-video w-full rounded-md object-cover" />
        <Input className="mt-2" aria-label="Підпис фото" defaultValue={photo.alt_text} onBlur={e => { const value = e.target.value; if (value !== photo.alt_text) void operation(async () => { const { error } = await supabase.from('site_photos').update({ alt_text: value }).eq('id', photo.id); if (error) throw error; }); }} />
        <div className="mt-2 flex justify-between">
          <Button variant="outline" size="icon" title="Перемістити ліворуч" aria-label="Перемістити ліворуч" disabled={busy || index === 0} onClick={() => void move(index, -1)}><ArrowLeft /></Button>
          <Button variant="outline" size="icon" title="Перемістити праворуч" aria-label="Перемістити праворуч" disabled={busy || index === photos.length - 1} onClick={() => void move(index, 1)}><ArrowRight /></Button>
          <Button variant="destructive" size="icon" title="Видалити фото" aria-label="Видалити фото" disabled={busy} onClick={() => void remove(photo)}><Trash2 /></Button>
        </div>
      </div>)}
    </div>
  </div>;
}
