import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const svg = await readFile(path.join(publicDir, 'favicon.svg'));

const outputs = [
  ['mela-192.png', 192],
  ['mela-512.png', 512],
  ['mela-maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
];

await Promise.all(outputs.map(async ([name, size]) => {
  await sharp(svg)
    .resize(size, size, { fit: 'contain', background: '#173b35' })
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`Generated public/${name}`);
}));
