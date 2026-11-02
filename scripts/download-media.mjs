// Downloads every media file referenced by src/data into public/.
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://puppy.instabizweb.com';
const load = (f) => JSON.parse(fs.readFileSync(path.resolve('src/data', f), 'utf8'));

const urls = new Set(['/brand/logo.png', '/icon.png', '/apple-icon.png', '/cursor/paw.svg', '/cursor/paw-press.svg']);
const add = (m) => {
  if (!m) return;
  urls.add(m.url);
  if (m.poster) urls.add(m.poster.url);
};
for (const p of load('puppies.json')) {
  add(p.cover);
  p.media.forEach(add);
}
load('families.json').forEach(add);
load('showroom.json').forEach(add);

const queue = [...urls];
let bytes = 0;
const failed = [];
async function worker() {
  for (let u = queue.shift(); u; u = queue.shift()) {
    const file = path.resolve('public', '.' + u);
    if (fs.existsSync(file)) {
      bytes += fs.statSync(file).size;
      continue;
    }
    try {
      const res = await fetch(BASE + u);
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buf);
      bytes += buf.length;
    } catch (e) {
      failed.push(`${u}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
console.log({ files: urls.size, mb: +(bytes / 1048576).toFixed(1), failed: failed.length });
failed.slice(0, 10).forEach((f) => console.log(f));
