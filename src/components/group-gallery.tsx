import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Check, X, Trash2, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GalleryFolders, PhotoStrip } from './gallery-folders';
import { useGroups, type Group } from '@/lib/use-groups';
import { categories, gallerySection, weeklyIndex } from '@/lib/photo-rules';
import { useSitePhotos } from '@/lib/site-photos';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';

// Ці приклади-заглушки не показуємо в галереї. gallery-2 лишається тільки в «Гра замість хвилювання» на «Пам'ятці».
const exampleSrcs = new Set<string>([gallery1, gallery2, gallery3, gallery4]);
const withoutExamples = <T extends { src: string }>(list: T[]) => list.filter(p => !exampleSrcs.has(p.src));

function PhotoPlaceholder() {
  return <div className="px-1 pb-4 pt-1">
    <div className="w-[85%] overflow-hidden p-2 toy-card sm:w-[28rem] lg:w-[34rem]">
      <div className="grid aspect-[4/3] place-items-center rounded-md bg-secondary p-4 text-center font-display text-base font-bold text-primary-deep/70">
        Фото буде додано
      </div>
    </div>
  </div>;
}

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

type CustomTab = { id: string; name: string; sort_order: number };
type TabCategory = { id: string; group_slug: string; name: string; sort_order: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabsTable = () => (supabase as any).from('gallery_categories');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabCategoriesTable = () => (supabase as any).from('gallery_tab_categories');

function useCustomTabs() {
  return useQuery({
    queryKey: ['gallery-categories'],
    queryFn: async (): Promise<CustomTab[]> => {
      const { data, error } = await tabsTable().select('*').order('sort_order').order('created_at');
      if (error) throw error;
      return data ?? [];
    },
  });
}

function useTabCategories() {
  return useQuery({
    queryKey: ['gallery-tab-categories'],
    queryFn: async (): Promise<TabCategory[]> => {
      const { data, error } = await tabCategoriesTable().select('*').order('sort_order').order('created_at');
      if (error) throw error;
      return data ?? [];
    },
  });
}

const isVirtual = (slug: string | null) => slug === 'common' || (slug?.startsWith('custom-') ?? false);

export function GroupGallery({ initialGroup = null, home = false }: { initialGroup?: string | null; home?: boolean }) {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const baseGroups = useGroups();
  const { data: customTabs = [] } = useCustomTabs();
  const { data: tabCategories = [] } = useTabCategories();
  const [selected, setSelected] = useState<string | null>(initialGroup);
  const [category, setCategory] = useState<string | null>(null);
  const [addingTab, setAddingTab] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [renamingCat, setRenamingCat] = useState(false);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const { data = [], isError } = useSitePhotos();

  const extraGroups: Group[] = customTabs.map(t => ({ ...commonGroup, slug: `custom-${t.id}`, name: t.name }));
  const hasPhotos = (slug: string) => data.some(p => p.group_slug === slug && p.section.startsWith('groups:') && p.folder_id === null);
  const hasCommonPhotos = hasPhotos(commonGroup.slug);
  const showCommon = !(home && !hasCommonPhotos);
  const groups = [
    ...baseGroups,
    ...(home ? extraGroups.filter(g => hasPhotos(g.slug)) : extraGroups),
    ...(showCommon ? [commonGroup] : []),
  ];
  const active = home ? (selected ?? groups[0]?.slug ?? null) : selected;
  const group = groups.find(g => g.slug === active);

  const virtualTab = isVirtual(selected);
  const tabCategoryNames = tabCategories.filter(c => c.group_slug === selected).map(c => c.name);
  const categoryList: string[] = virtualTab ? tabCategoryNames : [...categories];
  const currentCategory = category && categoryList.includes(category) ? category : (categoryList[0] ?? null);
  const section = currentCategory === null
    ? ''
    : virtualTab ? `groups:${currentCategory}` : gallerySection(currentCategory as (typeof categories)[number]);

  const uploaded = home
    ? data.filter(p => p.group_slug === active && p.section.startsWith('groups:') && p.folder_id === null)
    : data.filter(p => p.group_slug === active && p.section === section && p.folder_id === null);
  const fallback = group
    ? (home
        ? withoutExamples(group.photos)
        : withoutExamples(group.photos.filter((_, index) => currentCategory === 'Заняття' ? index === 0 || index === 3 : currentCategory === 'Дозвілля' ? index === 2 : index === 1)))
    : groups.flatMap(g => {
        const images = data.filter(p => p.group_slug === g.slug && p.section.startsWith('groups:') && p.folder_id === null);
        const source = images.length ? images : withoutExamples(g.photos);
        if (!source.length) return [];
        const image = source[weeklyIndex(source.length, Date.now())];
        return image ? [image] : [];
      });
  const photos = uploaded.length ? uploaded : fallback;

  // Фото в корені вибраної категорії (без папки) — показуємо їх у галереї над папками.
  const rootPhotos = selected && !home && currentCategory !== null
    ? data.filter(p => p.group_slug === selected && p.section === section && p.folder_id === null)
    : [];

  function resetForm() {
    setAddingTab(false);
    setAddingCat(false);
    setRenamingCat(false);
    setNewName('');
    setFormError('');
  }

  async function addTab() {
    const name = newName.trim();
    if (!name) return;
    if ([...baseGroups, commonGroup, ...extraGroups].some(g => g.name.toLowerCase() === name.toLowerCase())) {
      setFormError('Така вкладка вже є.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      const { error } = await tabsTable().insert({ name, sort_order: customTabs.length });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['gallery-categories'] });
      resetForm();
    } catch (e) {
      console.error(e);
      setFormError('Не вдалося додати вкладку. Спробуйте ще раз.');
    } finally {
      setBusy(false);
    }
  }

  async function addCategory() {
    const name = newName.trim();
    if (!name || !selected) return;
    if (tabCategoryNames.some(n => n.toLowerCase() === name.toLowerCase())) {
      setFormError('Така категорія вже є.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      const { error } = await tabCategoriesTable().insert({ group_slug: selected, name, sort_order: tabCategoryNames.length });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['gallery-tab-categories'] });
      setCategory(name);
      resetForm();
    } catch (e) {
      console.error(e);
      setFormError('Не вдалося додати категорію. Спробуйте ще раз.');
    } finally {
      setBusy(false);
    }
  }

  async function renameCategory() {
    const name = newName.trim();
    if (!name || !selected || !currentCategory) return;
    if (name === currentCategory) {
      resetForm();
      return;
    }
    if (tabCategoryNames.some(n => n !== currentCategory && n.toLowerCase() === name.toLowerCase())) {
      setFormError('Така категорія вже є.');
      return;
    }
    const oldSection = `groups:${currentCategory}`;
    const newSection = `groups:${name}`;
    setBusy(true);
    setFormError('');
    let photosMoved = false;
    let foldersMoved = false;
    try {
      const { error: photoError } = await supabase.from('site_photos').update({ section: newSection }).eq('group_slug', selected).eq('section', oldSection);
      if (photoError) throw photoError;
      photosMoved = true;
      const { error: folderError } = await supabase.from('gallery_folders').update({ section: newSection }).eq('group_slug', selected).eq('section', oldSection);
      if (folderError) throw folderError;
      foldersMoved = true;
      const { error } = await tabCategoriesTable().update({ name }).eq('group_slug', selected).eq('name', currentCategory);
      if (error) throw error;
      await queryClient.invalidateQueries();
      setCategory(name);
      resetForm();
    } catch (e) {
      console.error(e);
      if (foldersMoved) await supabase.from('gallery_folders').update({ section: oldSection }).eq('group_slug', selected).eq('section', newSection);
      if (photosMoved) await supabase.from('site_photos').update({ section: oldSection }).eq('group_slug', selected).eq('section', newSection);
      await queryClient.invalidateQueries();
      setFormError('Не вдалося змінити назву категорії. Спробуйте ще раз.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategory() {
    if (!selected || !currentCategory) return;
    const sec = `groups:${currentCategory}`;
    setFormError('');
    if (data.some(p => p.group_slug === selected && p.section === sec)) {
      setFormError('Спочатку видаліть усі фото цієї категорії.');
      return;
    }
    setBusy(true);
    try {
      const { data: folders, error: folderError } = await supabase
        .from('gallery_folders')
        .select('id')
        .eq('group_slug', selected)
        .eq('section', sec)
        .limit(1);
      if (folderError) throw folderError;
      if (folders && folders.length > 0) {
        setFormError('Спочатку видаліть усі папки цієї категорії.');
        return;
      }
      if (!window.confirm(`Видалити категорію «${currentCategory}»?`)) return;
      const { error } = await tabCategoriesTable().delete().eq('group_slug', selected).eq('name', currentCategory);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['gallery-tab-categories'] });
      setCategory(null);
    } catch (e) {
      console.error(e);
      setFormError('Не вдалося видалити категорію. Спробуйте ще раз.');
    } finally {
      setBusy(false);
    }
  }

  const nameForm = (label: string, onSave: () => void) => <form className="flex items-center gap-2" onSubmit={e => { e.preventDefault(); onSave(); }}>
    <Input aria-label={label} placeholder={label} value={newName} onChange={e => setNewName(e.target.value)} maxLength={30} required autoFocus className="w-44" />
    <Button type="submit" size="icon" disabled={busy || !newName.trim()} aria-label="Зберегти" title="Зберегти"><Check /></Button>
    <Button type="button" variant="outline" size="icon" aria-label="Скасувати" title="Скасувати" onClick={resetForm}><X /></Button>
  </form>;

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
        <Button variant="outline" size="icon" aria-label="Назад до груп" title="Назад до груп" onClick={() => { setSelected(null); setCategory(null); resetForm(); }}><ArrowLeft /></Button>
        <span className="mr-2 font-display font-bold text-primary-deep">{group?.name}</span>
        {categoryList.map(cat => <Button key={cat} variant={currentCategory === cat ? 'default' : 'outline'} aria-pressed={currentCategory === cat} onClick={() => { setCategory(cat); resetForm(); }}>{cat}</Button>)}
        {virtualTab && admin && currentCategory !== null && !renamingCat && <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            aria-label={`Змінити назву категорії ${currentCategory}`}
            title={`Змінити назву «${currentCategory}»`}
            onClick={() => { resetForm(); setNewName(currentCategory); setRenamingCat(true); }}
          ><Pencil /></Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            aria-label={`Видалити категорію ${currentCategory}`}
            title={`Видалити категорію «${currentCategory}»`}
            onClick={() => void deleteCategory()}
          ><Trash2 /></Button>
        </>}
        {virtualTab && admin && renamingCat && nameForm('Нова назва категорії', () => void renameCategory())}
        {virtualTab && admin && !renamingCat && (addingCat
          ? nameForm('Назва категорії', () => void addCategory())
          : <Button variant="outline" onClick={() => { resetForm(); setAddingCat(true); }}><Plus />Нова категорія</Button>)}
      </> : <>
        {groups.map(g => <Button key={g.slug} variant="outline" onClick={() => { setSelected(g.slug); setCategory(null); resetForm(); }}>{g.name}</Button>)}
        {admin && (addingTab
          ? nameForm('Назва вкладки', () => void addTab())
          : <Button variant="outline" onClick={() => { resetForm(); setAddingTab(true); }}><Plus />Нова вкладка</Button>)}
      </>}
    </div>
    {formError && <p role="alert" className="mb-3 text-destructive">{formError}</p>}
    {isError && <p role="status" className="mb-3 text-muted-foreground">Не вдалося завантажити нові фото.</p>}
    {(home || !selected) && (photos.length > 0 ? <PhotoStrip photos={photos} /> : <PhotoPlaceholder />)}
    {selected && !home && virtualTab && currentCategory === null && <p className="text-muted-foreground">
      {admin ? 'Тут ще немає категорій. Натисніть «Нова категорія», щоб додати першу.' : 'Тут поки що порожньо.'}
    </p>}
    {rootPhotos.length > 0 && <div className="mb-6"><PhotoStrip photos={rootPhotos} /></div>}
    {selected && !home && currentCategory !== null && <GalleryFolders key={`${selected}-${currentCategory}`} groupSlug={selected} section={section} photos={data} />}
  </div>;
}