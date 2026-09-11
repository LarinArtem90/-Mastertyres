import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const input = resolve(root, 'index.html');
const output = resolve(root, 'MasterTyres-final.html');
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

let html = await readFile(input, 'utf8');
const refs = [...new Set([...html.matchAll(/assets\/demo\/[^')"\s]+/g)].map(match => match[0]))];

for (const ref of refs) {
  const file = resolve(root, ref);
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  const encoded = (await readFile(file)).toString('base64');
  html = html.replaceAll(ref, `data:${mime[ext]};base64,${encoded}`);
}

await writeFile(output, html);
console.log(`Standalone file: ${output}`);
