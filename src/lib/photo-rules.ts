export const ADMIN_EMAIL = 'dnz701@ukr.net';
export const categories = ['Заняття', 'Дозвілля', 'Свята'] as const;
export type GalleryCategory = typeof categories[number];
const categoryKeys: Record<string, string> = { 'Заняття': 'classes', 'Дозвілля': 'leisure', 'Свята': 'holidays' };
export const MAX_PHOTO_BYTES = 10485760;
export function isApprovedEmail(email?: string) { return email?.trim().toLowerCase() === ADMIN_EMAIL; }
export function gallerySection(category: GalleryCategory) { return `groups:${category}`; }
export function weeklyIndex(length: number, time: number) { return length ? Math.floor(time / 604800000) % length : 0; }
export function isAllowedImage(type: string, size: number) { return ['image/jpeg', 'image/png', 'image/webp'].includes(type) && size > 0 && size <= MAX_PHOTO_BYTES; }
/** File storage only accepts latin letters in file names, so Ukrainian section names are translated. */
export function photoStoragePath(section: string, groupSlug: string | null, type: string, id: string) {
  const parts = section.split(':').map(p => categoryKeys[p] ?? p.replace(/[^a-z0-9-]/gi, '')).filter(Boolean);
  const ext = type === 'image/jpeg' ? 'jpg' : type.split('/')[1];
  return [...parts, groupSlug, `${id}.${ext}`].filter(Boolean).join('/');
}
export function moveItem<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item as T);
  return copy;
}
