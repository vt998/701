import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 МБ, за потреби зміни

// Завантажує PDF у R2 (documents/<uuid>.pdf) і повертає "<uuid>.pdf" для таблиці documents.
export const uploadDocumentFile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error('Invalid form data');
    const file = data.get('file');
    if (!(file instanceof File)) throw new Error('file');
    return { file };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (isAdmin !== true) throw new Error('Forbidden');

    const { file } = data;
    if (file.type !== 'application/pdf' || file.size > MAX_PDF_SIZE) throw new Error('file');

    const path = `${crypto.randomUUID()}.pdf`;

    const { putObject } = await import('@/lib/r2.server');
    await putObject(`documents/${path}`, await file.arrayBuffer(), 'application/pdf');
    return { path };
  });

// Видаляє PDF з R2 (тільки адмін, тільки в папці documents/).
export const deleteDocumentFile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => {
    const p = data?.path;
    if (typeof p !== 'string' || !p || p.includes('..') || p.startsWith('/') || p.includes('\\')) {
      throw new Error('Invalid path');
    }
    return { path: p };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (isAdmin !== true) throw new Error('Forbidden');

    const { deleteObject } = await import('@/lib/r2.server');
    await deleteObject(`documents/${data.path}`);
  });