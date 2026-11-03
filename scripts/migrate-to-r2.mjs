// Копіює фото з Supabase Storage в Cloudflare R2 (з тими самими шляхами).
// Нічого не видаляє. Запуск: node --env-file=.env scripts/migrate-to-r2.mjs
import { createClient } from '@supabase/supabase-js';
import { AwsClient } from 'aws4fetch';

const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env;

for (const [name, value] of Object.entries({
  VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
})) {
  if (!value) {
    console.error(`У .env немає ${name}`);
    process.exit(1);
  }
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);
const r2 = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: 's3',
  region: 'auto',
});

const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
const encodeKey = (key) => key.split('/').map(encodeURIComponent).join('/');

async function collectPaths() {
  const paths = new Set();
  for (const table of ['site_photos', 'team_members']) {
    const { data, error } = await supabase.from(table).select('storage_path');
    if (error) throw error;
    for (const row of data ?? []) if (row.storage_path) paths.add(row.storage_path);
  }
  return [...paths];
}

async function copyOne(key) {
  const target = `${endpoint}/${encodeKey(key)}`;
  const head = await r2.fetch(target, { method: 'HEAD' });
  if (head.ok) return 'skipped';

  const source = `${VITE_SUPABASE_URL}/storage/v1/object/public/site-photos/${encodeKey(key)}`;
  const res = await fetch(source);
  if (!res.ok) throw new Error(`Supabase ${res.status} для ${key}`);
  const body = new Uint8Array(await res.arrayBuffer());

  const put = await r2.fetch(target, {
    method: 'PUT',
    body,
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
  if (!put.ok) throw new Error(`R2 ${put.status} для ${key}: ${await put.text()}`);
  return 'copied';
}
console.log(JSON.stringify(endpoint));
const keys = await collectPaths();
console.log(`Знайдено файлів: ${keys.length}`);

let copied = 0;
let skipped = 0;
const failed = [];
let next = 0;

async function worker() {
  while (next < keys.length) {
    const key = keys[next++];
    try {
      const result = await copyOne(key);
      if (result === 'copied') copied++;
      else skipped++;
    } catch (e) {
      failed.push(key);
    console.error(`FAIL ${key}:`, e.message, e.cause?.code ?? e.cause);
    }
    const done = copied + skipped + failed.length;
    if (done % 10 === 0 || done === keys.length) console.log(`${done}/${keys.length}`);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));

console.log(`Готово. Скопійовано: ${copied}, уже було: ${skipped}, помилок: ${failed.length}`);
if (failed.length) {
  console.log('Не вдалося скопіювати:\n' + failed.join('\n'));
  process.exitCode = 1;
}