import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const outputs = [
  ['mela-192.png', 192],
  ['mela-512.png', 512],
  ['mela-maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
];

const colors = {
  background: [23, 59, 53, 255],
  gold: [244, 198, 106, 255],
  white: [255, 255, 255, 255],
};
// The M polygon and dot match the public/favicon.svg brand mark.
const mark = [[42,178],[42,75],[72,75],[128,137],[184,75],[214,75],[214,178],[178,178],[178,122],[128,171],[78,122],[78,178]];

function insidePolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const crosses = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function makePng(size) {
  const scale = 3;
  const high = size * scale;
  const pixels = Buffer.alloc(high * high * 4);
  const scaledMark = mark.map(([x, y]) => [x / 256 * high, y / 256 * high]);
  const dot = { x: 204 / 256 * high, y: 201 / 256 * high, r: 14 / 256 * high };

  for (let y = 0; y < high; y++) {
    for (let x = 0; x < high; x++) {
      let color = colors.background;
      const px = x + 0.5;
      const py = y + 0.5;
      if (insidePolygon(px, py, scaledMark)) color = colors.gold;
      const dx = px - dot.x;
      const dy = py - dot.y;
      if (dx * dx + dy * dy <= dot.r * dot.r) color = colors.white;
      const offset = (y * high + x) * 4;
      pixels.set(color, offset);
    }
  }

  // 3x supersampling with box filtering gives smooth edges without native dependencies.
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0, 0];
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const source = (((y * scale + sy) * high) + (x * scale + sx)) * 4;
          for (let channel = 0; channel < 4; channel++) sum[channel] += pixels[source + channel];
        }
      }
      const target = row + 1 + x * 4;
      for (let channel = 0; channel < 4; channel++) raw[target + channel] = Math.round(sum[channel] / (scale * scale));
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // 8-bit channels
  header[9] = 6; // RGBA
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

await Promise.all(outputs.map(async ([name, size]) => {
  await writeFile(path.join(publicDir, name), makePng(size));
  console.log(`Generated public/${name}`);
}));
