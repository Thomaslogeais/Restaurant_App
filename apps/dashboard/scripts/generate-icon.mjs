#!/usr/bin/env node
/**
 * generate-icon.mjs
 *
 * Converts apps/dashboard/assets/icon.svg into all PNG assets required by Expo:
 *   icon.png                 — 1024 × 1024  (main iOS / web icon)
 *   favicon.png              — 48  × 48     (web favicon)
 *   android-icon-foreground.png — 1024 × 1024 (Android adaptive foreground)
 *
 * Usage (from repo root):
 *   pnpm --filter @restaurant/dashboard gen:icon
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
const svgBuffer = readFileSync(join(assetsDir, 'icon.svg'));

const outputs = [
  { file: 'icon.png',                    size: 1024, label: 'icon.png (1024×1024)' },
  { file: 'favicon.png',                 size: 48,   label: 'favicon.png (48×48)' },
  { file: 'android-icon-foreground.png', size: 1024, label: 'android-icon-foreground.png (1024×1024)' },
];

console.log('\n🎨  Generating icon assets from icon.svg…\n');

await Promise.all(
  outputs.map(({ file, size, label }) =>
    sharp(svgBuffer)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(assetsDir, file))
      .then(() => console.log(`  ✓ ${label}`))
  )
);

console.log('\n✅  All assets written to apps/dashboard/assets/\n');
