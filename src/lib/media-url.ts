const base = (import.meta.env['VITE_MEDIA_BASE_URL'] as string | undefined)?.replace(/\/$/, '') ?? '';

export function photoUrl(storagePath: string) {
  return `${base}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;
}