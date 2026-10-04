import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ZoomImage } from './zoom-image';
import { PhotoManager } from './photo-manager';
import { groups } from '@/lib/groups';
import { categories, gallerySection, weeklyIndex, type GalleryCategory } from '@/lib/photo-rules';
import { useSitePhotos } from '@/lib/site-photos';
export function GroupGallery({ initialGroup = null }: { initialGroup?: string | null }) {
  const [selected, setSelected] = useState<string | null>(initialGroup);
  const [category, setCategory] = useState<GalleryCategory>('Заняття');
  const { data = [], isError } = useSitePhotos();
  const section = gallerySection(category);
  const uploaded = data.filter(p => p.group_slug === selected && p.section === section);
  const group = groups.find(g => g.slug === selected);
  const fallback = group ? group.photos.filter((_, index) => category === 'Заняття' ? index === 0 || index === 3 : category === 'Дозвілля' ? index === 2 : index === 1) : groups.flatMap(g => {
    const images = data.filter(p => p.group_slug === g.slug && p.section.startsWith('groups:'));
    const source = images.length ? images : g.photos;
    const image = source[weeklyIndex(source.length, Date.now())];
    return image ? [image] : [];
  });
  const photos = uploaded.length ? uploaded : fallback;
  return <div>
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {selected ? <>
        <Button variant="outline" size="icon" aria-label="Назад до груп" title="Назад до груп" onClick={() => setSelected(null)}><ArrowLeft /></Button>
        <span className="mr-2 font-display font-bold text-primary-deep">{group?.name}</span>
        {categories.map(cat => <Button key={cat} variant={category === cat ? 'default' : 'outline'} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</Button>)}
      </> : groups.map(g => <Button key={g.slug} variant="outline" onClick={() => { setSelected(g.slug); setCategory('Заняття'); }}>{g.name}</Button>)}
    </div>
    {isError && <p role="status" className="mb-3 text-muted-foreground">Не вдалося завантажити нові фото.</p>}
    {selected && <PhotoManager section={section} groupSlug={selected} photos={uploaded} />}
    <div className="flex snap-x gap-4 overflow-x-auto pb-4" aria-label="Фото групи">
      {photos.map((photo, index) => <div key={`${selected}-${category}-${photo.src}-${index}`} className="w-72 shrink-0 snap-start overflow-hidden rounded-md border border-border sm:w-96">
        <ZoomImage src={photo.src} alt={photo.alt} className="aspect-video w-full object-cover" />
      </div>)}
    </div>
  </div>;
}
