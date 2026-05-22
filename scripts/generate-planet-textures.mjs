/**
 * Generates stylized 64×64 planet texture PNGs for Phase 2.
 * Run: node scripts/generate-planet-textures.mjs
 */
import { deflateSync } from 'zlib';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../assets/textures');
const SIZE = 64;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function writePng(path, width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      row[1 + x * 4] = rgba[i];
      row[1 + x * 4 + 1] = rgba[i + 1];
      row[1 + x * 4 + 2] = rgba[i + 2];
      row[1 + x * 4 + 3] = rgba[i + 3];
    }
    rows.push(row);
  }

  const png = Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function noise(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43758.5453) * 43758.5453;
  return n - Math.floor(n);
}

function makeTexture(baseHex, paint) {
  const [br, bg, bb] = hexToRgb(baseHex);
  const rgba = new Uint8Array(SIZE * SIZE * 4);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const maxR = SIZE / 2 - 1;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const d = dist(x, y, cx, cy);
      if (d > maxR) {
        rgba[i + 3] = 0;
        continue;
      }

      const sphere = Math.sqrt(Math.max(0, 1 - (d / maxR) ** 2));
      const n = noise(x * 0.18, y * 0.18, paint.seed);
      const band = Math.sin((x + y) * paint.bandFreq + paint.seed) * 0.5 + 0.5;
      const shade = 0.55 + sphere * 0.35 + n * paint.noise + band * paint.band;

      rgba[i] = Math.min(255, Math.max(0, br * shade + paint.rShift));
      rgba[i + 1] = Math.min(255, Math.max(0, bg * shade + paint.gShift));
      rgba[i + 2] = Math.min(255, Math.max(0, bb * shade + paint.bShift));
      rgba[i + 3] = 255;
    }
  }

  paint.spots?.forEach((spot) => {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (dist(x, y, spot.x * SIZE, spot.y * SIZE) < spot.r * SIZE) {
          const i = (y * SIZE + x) * 4;
          rgba[i] = spot.rgba[0];
          rgba[i + 1] = spot.rgba[1];
          rgba[i + 2] = spot.rgba[2];
        }
      }
    }
  });

  return rgba;
}

const PLANETS = [
  {
    id: 'mercury',
    color: '#B5B5B5',
    paint: { seed: 1.1, noise: 0.18, band: 0.08, bandFreq: 0.22, rShift: 0, gShift: 0, bShift: 0 },
  },
  {
    id: 'venus',
    color: '#E6C87A',
    paint: { seed: 2.3, noise: 0.12, band: 0.15, bandFreq: 0.14, rShift: 8, gShift: 4, bShift: -6 },
  },
  {
    id: 'earth',
    color: '#4F8CD9',
    paint: {
      seed: 3.7,
      noise: 0.1,
      band: 0.05,
      bandFreq: 0.1,
      rShift: 0,
      gShift: 0,
      bShift: 0,
      spots: [
        { x: 0.38, y: 0.42, r: 0.16, rgba: [52, 130, 72, 255] },
        { x: 0.58, y: 0.55, r: 0.12, rgba: [45, 118, 65, 255] },
        { x: 0.48, y: 0.28, r: 0.1, rgba: [60, 140, 80, 255] },
      ],
    },
  },
  {
    id: 'mars',
    color: '#E27B58',
    paint: {
      seed: 4.2,
      noise: 0.2,
      band: 0.1,
      bandFreq: 0.18,
      rShift: 0,
      gShift: 0,
      bShift: 0,
      spots: [{ x: 0.45, y: 0.5, r: 0.14, rgba: [160, 60, 40, 255] }],
    },
  },
  {
    id: 'jupiter',
    color: '#C88B3A',
    paint: { seed: 5.5, noise: 0.08, band: 0.35, bandFreq: 0.45, rShift: 12, gShift: -4, bShift: -8 },
  },
  {
    id: 'saturn',
    color: '#E8D4A8',
    paint: { seed: 6.1, noise: 0.1, band: 0.12, bandFreq: 0.2, rShift: 4, gShift: 2, bShift: -2 },
  },
  {
    id: 'uranus',
    color: '#7FD4E8',
    paint: { seed: 7.4, noise: 0.06, band: 0.08, bandFreq: 0.12, rShift: -6, gShift: 8, bShift: 10 },
  },
  {
    id: 'neptune',
    color: '#3B5FBD',
    paint: { seed: 8.8, noise: 0.14, band: 0.12, bandFreq: 0.16, rShift: -8, gShift: -4, bShift: 12 },
  },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const planet of PLANETS) {
  const rgba = makeTexture(planet.color, planet.paint);
  writePng(join(OUT_DIR, `${planet.id}.png`), SIZE, SIZE, rgba);
  console.log(`Wrote ${planet.id}.png`);
}
