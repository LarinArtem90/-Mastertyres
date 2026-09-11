import { access, readFile } from 'node:fs/promises';
import { Script } from 'node:vm';

const html = await readFile('index.html', 'utf8');
const failures = [];
for (const required of [
  'MasterTyres', '+7 (929) 975-71-70', 'Запись по телефону', 'Правка дисков',
  'программирования датчиков давления TPMS', 'https://t.me/MasterTyres',
  'https://wa.me/79299757170', 'Московская область, городской округ Пушкинский, деревня Талицы, 66',
  'Website by Verto Studio'
]) if (!html.includes(required)) failures.push(`Нет обязательного текста: ${required}`);

if (/онлайн[- ]запис/iu.test(html)) failures.push('Найдена запрещенная онлайн-запись');
for (const ref of [...new Set([...html.matchAll(/assets\/demo\/[^')"\s]+/g)].map(match => match[0]))]) {
  try { await access(ref); } catch { failures.push(`Нет медиафайла: ${ref}`); }
}
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  try { new Script(script[1]); } catch (error) { failures.push(`Ошибка JavaScript: ${error.message}`); }
}
if (!html.includes('@media')) failures.push('Нет адаптивных правил');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Проверка финального сайта: PASS');
