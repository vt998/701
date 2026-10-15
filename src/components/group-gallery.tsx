import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GalleryFolders, PhotoStrip } from './gallery-folders';
import { useGroups, type Group } from '@/lib/use-groups';
import { categories, gallerySection, weeklyIndex, type GalleryCategory } from '@/lib/photo-rules';
import { useSitePhotos } from '@/lib/site-photos';

const commonGroup: Group = {
  slug: 'common',
  name: 'Спільні',
  age: '',
  type: '',
  text: '',
  color: 'bg-sun',
  photos: [],
  custom: false,
  overridden: false,
};

type CustomCategory = { id: string; name: string; sort_order: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoriesTable = () => (supabase as any).from('gallery_categories');

function useCustomCategories() {
  return useQuery({
    queryKey: ['gallery-categories'],
    queryFn: async (): Promise<CustomCategory[]> => {
      const { data, error } = await categoriesTable().select('*').order('sort_order').order('created_at');
      if (error) throw error;
      return data ?? [];
    },
  });
}

const builtIn: readonly string[] = categories;
const isBuiltIn = (c: string) => builtIn.includes(c);
const sectionFor = (c: string) => (isBuiltIn(c) ? gallerySection(c as GalleryCategory) : `groups:${c}`);

export function GroupGallery({ initialGroup = null, home = false }: { initialGroup?: string | null; home?: boolean }) {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const baseGroups = useGroups();
  const { data: customCategories = [] } = useCustomCategories();
  const [selected, setSelected] = useState<string | null>(initialGroup);
  const [category, setCategory] = useState<string>('Заняття');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [catBusy, setCatBusy] = useState(false);
  const [catError, setCatError] = useState('');
  const { data = [], isError } = useSitePhotos();
  const allCategories = [...builtIn, ...customCategories.map(c => c.name)];
  const hasCommonPhotos = data.some(p => p.group_slug === commonGroup.slug && p.section.startsWith('groups:') && p.folder_id === null);
  const groups = home && !hasCommonPhotos ? baseGroups : [...baseGroups, commonGroup];
  const active = home ? (selected ?? groups[0]?.slug ?? null) : selected;
  const section = sectionFor(category);
  const group = groups.find(g => g.slug === active);
  const uploaded = home
    ? data.filter(p => p.group_slug === active && p.section.startsWith('groups:') && p.folder_id === null)
    : data.filter(p => p.group_slug === active && p.section === section && p.folder_id === null);
  const builtInFallback = (g: Group) =>
    g.photos.filter((_, index) => category === 'Заняття' ? index === 0 || index === 3 : category === 'Дозвілля' ? index === 2 : index === 1);
  const fallback = group
    ? (home ? group.photos : isBuiltIn(category) ? builtInFallback(group) : [])
    : groups.flatMap(g => {
        const images = data.filter(p => p.group_slug === g.slug && p.section.startsWith('groups:') && p.folder_id === null);
        const source = images.length ? images : g.photos;
        if (!source.length) return [];
        const image = source[weeklyIndex(source.length, Date.now())];
        return image ? [image] : [];
      });
  const photos = uploaded.length ? uploaded : fallback;

  async function addCategory() {
    const name = newName.trim();
    if (!name) return;
    if (allCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
      setCatError('Така категорія вже є.');
      return;
    }
    setCatBusy(true);
    setCatError('');
    try {
      const { error } = await categoriesTable().insert({ name, sort_order: customCategories.length });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['gallery-categories'] });
      setCategory(name);
      setNewName('');
      setAdding(false);
    } catch (e) {
      console.error(e);
      setCatError('Не вдалося додати категорію. Спробуйте ще раз.');
    } finally {
      setCatBusy(false);
    }
  }

  return <div>
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {home ? groups.map(g => <Button
          key={g.slug}
          type="button"
          size="sm"
          variant={active === g.slug ? 'default' : 'outline'}
          aria-pressed={active === g.slug}
          onClick={() => setSelected(g.slug)}
          className="border-primary-deep font-display font-bold"
        >{g.name}</Button>)
      : selected ? <>
        <Button variant="outline" size="icon" aria-label="Назад до груп" title="Назад до груп" onClick={() => setSelected(null)}><ArrowLeft /></Button>
        <span className="mr-2 font-display font-bold text-primary-deep">{group?.name}</span>
        {allCategories.map(cat => <Button key={cat} variant={category === cat ? 'default' : 'outline'} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</Button>)}
        {admin && (adding
          ? <form className="flex items-center gap-2" onSubmit={e => { e.preventDefault(); void addCategory(); }}>
              <Input aria-label="Назва категорії" placeholder="Назва категорії" value={newName} onChange={e => setNewName(e.target.value)} maxLength={30} required autoFocus className="w-44" />
              <Button type="submit" size="icon" disabled={catBusy || !newName.trim()} aria-label="Зберегти категорію" title="Зберегти категорію"><Check /></Button>
              <Button type="button" variant="outline" size="icon" aria-label="Скасувати" title="Скасувати" onClick={() => { setAdding(false); setNewName(''); setCatError(''); }}><X /></Button>
            </form>
          : <Button variant="outline" onClick={() => setAdding(true)}><Plus />Нова категорія</Button>)}
      </> : groups.map(g => <Button key={g.slug} variant="outline" onClick={() => { setSelected(g.slug); setCategory('Заняття'); }}>{g.name}</Button>)}
    </div>
    {catError && <p role="alert" className="mb-3 text-destructive">{catError}</p>}
    {isError && <p role="status" className="mb-3 text-muted-foreground">Не вдалося завантажити нові фото.</p>}
    {(home || !selected) && <PhotoStrip photos={photos} />}
    {selected === 'common' && !home && uploaded.length > 0 && <div className="mb-8"><PhotoStrip photos={uploaded} /></div>}
    {selected && !home && <GalleryFolders key={`${selected}-${category}`} groupSlug={selected} section={section} photos={data} />}
  </div>;
}