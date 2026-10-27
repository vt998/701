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
      src: supabase.storage.from('site-photos').getPublicUrl(photo.storage_path).data.publicUrl,
      alt: photo.alt_text || 'Фото ЗДО № 701',
    }));
  }});
}