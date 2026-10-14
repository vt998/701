import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
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

export function GroupGallery({ initialGroup = null, home = false }: { initialGroup?: string | null; home?: boolean }) {
  const baseGroups = useGroups();
  const [selected, setSelected] = useState<string | null>(initialGroup);
  const [category, setCategory] = useState<GalleryCategory>('Заняття');
  const { data = [], isError } = useSitePhotos();
  const hasCommonPhotos = data.some(p => p.group_slug === commonGroup.slug && p.section.startsWith('groups:') && p.folder_id === null);
  const groups = home && !hasCommonPhotos ? baseGroups : [...baseGroups, commonGroup];
  const active = home ? (selected ?? groups[0]?.slug ?? null) : selected;
  const section = gallerySection(category);
  const group = groups.find(g => g.slug === active);
  const uploaded = home
    ? data.filter(p => p.group_slug === active && p.section.startsWith('groups:') && p.folder_id === null)
    : data.filter(p => p.group_slug === active && p.section === section && p.folder_id === null);
  const fallback = group
    ? (home
        ? group.photos
        : group.photos.filter((_, index) => category === 'Заняття' ? index === 0 || index === 3 : category === 'Дозвілля' ? index === 2 : index === 1))
    : groups.flatMap(g => {
        const images = data.filter(p => p.group_slug === g.slug && p.section.startsWith('groups:') && p.folder_id === null);
        const source = images.length ? images : g.photos;
        if (!source.length) return [];
        const image = source[weeklyIndex(source.length, Date.now())];
        return image ? [image] : [];
      });
  const photos = uploaded.length ? uploaded : fallback;
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
        {categories.map(cat => <Button key={cat} variant={category === cat ? 'default' : 'outline'} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</Button>)}
      </> : groups.map(g => <Button key={g.slug} variant="outline" onClick={() => { setSelected(g.slug); setCategory('Заняття'); }}>{g.name}</Button>)}
    </div>
    {isError && <p role="status" className="mb-3 text-muted-foreground">Не вдалося завантажити нові фото.</p>}
    {(home || !selected) && <PhotoStrip photos={photos} />}
    {selected === 'common' && !home && uploaded.length > 0 && <div className="mb-8"><PhotoStrip photos={uploaded} /></div>}
    {selected && !home && <GalleryFolders key={`${selected}-${category}`} groupSlug={selected} section={section} photos={data} />}
  </div>;
}