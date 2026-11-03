import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const need = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
for (const k of need) if (!process.env[k]) throw new Error(`Немає ${k} у .env`);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = 'documents';

async function listAll(prefix = '') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  let files = [];
  for (const item of data) {
    const full = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) files = files.concat(await listAll(full)); // це папка
    else files.push(full);
  }
  return files;
}

const files = await listAll();
console.log(`Знайдено файлів: ${files.length}`);

for (const path of files) {
  const { data: blob, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) { console.error('Помилка скачування', path, error.message); continue; }
  const body = Buffer.from(await blob.arrayBuffer());
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: `documents/${path}`,
    Body: body,
    ContentType: blob.type || 'application/octet-stream',
  }));
  console.log('OK', `documents/${path}`, `${(body.length / 1024).toFixed(0)} KB`);
}
console.log('Готово');