import { AwsClient } from 'aws4fetch';

function r2() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error('Missing R2 environment variables');
  }
  const client = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
  return { client, endpoint };
}

const encodeKey = (key: string) => key.split('/').map(encodeURIComponent).join('/');

export async function putObject(key: string, body: Blob | ArrayBuffer | Uint8Array<ArrayBuffer>, contentType: string) {
  const { client, endpoint } = r2();
  const res = await client.fetch(`${endpoint}/${encodeKey(key)}`, {
    method: 'PUT',
    body,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
  if (!res.ok) throw new Error(`R2 PUT ${res.status}: ${await res.text()}`);
}

export async function deleteObject(key: string) {
  const { client, endpoint } = r2();
  const res = await client.fetch(`${endpoint}/${encodeKey(key)}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`R2 DELETE ${res.status}: ${await res.text()}`);
}