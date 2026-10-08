export function photosInCollection<T extends { group_slug: string | null; section: string; folder_id: string | null }>(photos: T[], group: string, section: string, folderId: string | null) {
  return photos.filter(photo => photo.group_slug === group && photo.section === section && photo.folder_id === folderId);
}
export function centerLastAnnouncement(index: number, count: number) {
  return count % 2 === 1 && index === count - 1;
}
export const weekdayShortNames = ['пн', 'вт', 'ср', 'чт', 'пт'];