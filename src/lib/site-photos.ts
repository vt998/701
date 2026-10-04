import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
export type SitePhoto = Tables<'site_photos'> & { src: string; alt: string };
export function useSitePhotos() {
  return useQuery({ queryKey: ['site-photos'], staleTime: 60000, queryFn: async (): Promise<SitePhoto[]> => {
    const { data, error } = await supabase.from('site_photos').select('*').order('sort_order').order('created_at');
    if (error) throw error;
    return Promise.all((data ?? []).map(async photo => {
      const { data: url, error: urlError } = await supabase.storage.from('site-photos').createSignedUrl(photo.storage_path, 3600);
      if (urlError) throw urlError;
      return { ...photo, src: url.signedUrl, alt: photo.alt_text || 'Фото ЗДО № 701' };
    }));
  }});
}
