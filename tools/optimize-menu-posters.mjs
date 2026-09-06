import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Preserve the original art and 4K footage. Only encode smaller fallback images.
const root = fileURLToPath(new URL('../', import.meta.url));
const files = [
  ['src/public/worldloom/assets/menu/worldloom-drone-poster.jpg', 'src/public/worldloom/assets/menu/worldloom-drone-poster.webp'],
  ['src/public/worldloom/assets/menu/worldloom-drone-poster.jpg', 'src/public/worldloom/assets/menu/worldloom-drone-poster-1280.webp', 'scale=1280:720:flags=lanczos'],
  ['src/public/worldloom/assets/loading/forest-leaves-poster.jpg', 'src/public/worldloom/assets/loading/forest-leaves-poster.webp'],
  ['src/public/credit-shop-banner.png', 'src/public/credit-shop-banner.webp'],
];
for (const [input, output, filter] of files) {
  const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-i', input,
    ...(filter ? ['-vf', filter] : []),
    '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-frames:v', '1', '-y', output,
  ], { cwd: root, stdio: 'inherit', windowsHide: true });
  if (result.error || result.status !== 0) throw result.error || new Error(`Poster encoding failed: ${input}`);
}
