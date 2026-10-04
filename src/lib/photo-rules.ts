export const ADMIN_EMAIL = 'dnz701@ukr.net';
export const categories = ['Заняття', 'Дозвілля', 'Свята'] as const;
export type GalleryCategory = typeof categories[number];
export function isApprovedEmail(email?: string) { return email?.trim().toLowerCase() === ADMIN_EMAIL; }
export function gallerySection(category: GalleryCategory) { return `groups:${category}`; }
export function weeklyIndex(length: number, time: number) { return length ? Math.floor(time / 604800000) % length : 0; }
