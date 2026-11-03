import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { isAllowedImage, photoStoragePath } from '@/lib/photo-rules';

// Завантажує файл у R2 і повертає шлях (storage_path). Записи в таблиці лишаються на клієнті.
export const uploadPhotoFile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error('Invalid form data');
    const file = data.get('file');
    if (!(file instanceof File)) throw new Error('file');
    const kind = data.get('kind');
    if (kind !== 'gallery' && kind !== 'team') throw new Error('Invalid kind');
    const section = String(data.get('section') ?? '');
    const groupSlug = String(data.get('groupSlug') ?? '') || null;
    return { file, kind, section, groupSlug };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (isAdmin !== true) throw new Error('Forbidden');

    const { file, kind, section, groupSlug } = data;
    if (!isAllowedImage(file.type, file.size)) throw new Error('file');

    const id = crypto.randomUUID();
    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = kind === 'team' ? `team/${id}.${ext}` : photoStoragePath(section, groupSlug, file.type, id);

    const { putObject } = await import('@/lib/r2.server');
    await putObject(path, await file.arrayBuffer(), file.type);
    return { path };
  });

// Видаляє файл з R2 (тільки адмін).
export const deletePhotoFile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => {
    if (typeof data?.path !== 'string' || !data.path || data.path.includes('..')) throw new Error('Invalid path');
    return { path: data.path };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (isAdmin !== true) throw new Error('Forbidden');

    const { deleteObject } = await import('@/lib/r2.server');
    await deleteObject(data.path);
  });