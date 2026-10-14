import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { groups as staticGroups } from '@/lib/groups';

type StaticGroup = {
  slug: string;
  name: string;
  age: string;
  type: string;
  text: string;
  color: string;
  photos: { src: string; alt: string }[];
};

export type Group = StaticGroup & {
  rowId?: string;
  custom: boolean;
  overridden: boolean;
};

export type CustomGroup = {
  id: string;
  slug: string;
  name: string;
  age: string;
  type: string;
  description: string;
  color: string;
  sort_order: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const kidsGroupsTable = () => (supabase as any).from('kids_groups');

export function useCustomGroups() {
  return useQuery({
    queryKey: ['kids-groups'],
    queryFn: async (): Promise<CustomGroup[]> => {
      const { data, error } = await kidsGroupsTable().select('*').order('sort_order').order('created_at');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGroups(): Group[] {
  const { data = [] } = useCustomGroups();
  const bySlug = new Map(data.map((row) => [row.slug, row]));
  const base: Group[] = (staticGroups as unknown as StaticGroup[]).map((g) => {
    const row = bySlug.get(g.slug);
    if (!row) return { ...g, custom: false, overridden: false };
    return {
      ...g,
      name: row.name,
      age: row.age,
      type: row.type,
      text: row.description,
      color: row.color,
      rowId: row.id,
      custom: false,
      overridden: true,
    };
  });
  const staticSlugs = new Set(base.map((g) => g.slug));
  const extra: Group[] = data
    .filter((row) => !staticSlugs.has(row.slug))
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      age: row.age,
      type: row.type,
      text: row.description,
      color: row.color,
      photos: [],
      rowId: row.id,
      custom: true,
      overridden: false,
    }));
  return [...base, ...extra];
}