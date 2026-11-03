import { photoUrl } from '@/lib/media-url';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
export type SitePhoto = Tables<'site_photos'> & { src: string; alt: string };
export function useSitePhotos() {
  return useQuery({ queryKey: ['site-photos'], staleTime: 300000, queryFn: async (): Promise<SitePhoto[]> => {
    const { data, error } = await supabase.from('site_photos').select('*').order('sort_order').order('created_at');
    if (error) throw error;
    return (data ?? []).map(photo => ({
      ...photo,
      src: photoUrl(photo.storage_path),
      alt: photo.alt_text || 'Фото ЗДО № 701',
    }));
  }});
}