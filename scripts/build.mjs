import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'robots.txt', 'MasterTyres-final.html']) await cp(file, `dist/${file}`);
await cp('assets/demo', 'dist/assets/demo', { recursive: true });
console.log('Сборка готова: dist/');
