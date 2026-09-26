import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat();
}

// Derive the release from the actual production build, including local Three
// modules and authored models. A failed update never replaces a working pack.
export async function buildOffline(outputDirectory) {
  const root = resolve(outputDirectory);
  const files = (await walk(root)).sort();
  const core = [], media = [];
  for (const file of files) {
    const path = '/' + relative(root, file).replaceAll('\\', '/');
    if (/offline-worker\.js$|\.(?:map|md|txt|blend|py)$/.test(path)) continue;
    // Aurora's large bundle and relic icons are fetched when you first play it, not precached for everyone.
    // The same goes for the Onyx download page's screenshots.
    if (/\.(?:mp4|ogg)$/.test(path) || (path.endsWith('.mp3') && !path.startsWith('/worldloom/assets/')) || (/^\/(?:aurora|hexgl|2048|hextris|Onyx)\//.test(path) && !path.endsWith('/index.html'))) {
      media.push({ url: path, revision: hash(await readFile(file)) }); continue;
    }
    if (!/\.(?:html|js|css|svg|png|webp|jpe?g|glb|woff2?|mp3)$/.test(path)) continue;
    // Verification/reset screens must always use their live network flow.
    if (path.startsWith('/account/') && path.endsWith('.html') && path !== '/account/dialog.html') continue;
    let bytes = await readFile(file);
    // Git stores these text assets with LF. Hash the bytes Linux/Cloudflare
    // will deploy, not the Windows checkout's CRLF representation.
    if (/\.(?:html|js|css|svg)$/.test(path)) {
      // Vite can combine copied CRLF with generated HTML into CRCRLF. Remove
      // all carriage returns in one pass, before recording any release digest.
      const normalized = Buffer.from(bytes.toString('utf8').replace(/\r+\n?/g, '\n'));
      if (!normalized.equals(bytes)) await writeFile(file, normalized);
      bytes = normalized;
    }
    core.push({ url: path.endsWith('/index.html') ? path.slice(0, -10) : path, revision: hash(bytes), size: bytes.length });
  }
  const release = { version: hash(JSON.stringify({ core, media })).slice(0, 20), core, media: media.map(item => item.url) };
  const template = await readFile(new URL('./offline-worker-template.js', import.meta.url), 'utf8');
  await writeFile(resolve(root, 'offline-worker.js'), template.replace('/* OFFLINE_RELEASE */', JSON.stringify(release)));
  console.log(`Offline pack: ${core.length} files, ${(core.reduce((n, item) => n + item.size, 0) / 1048576).toFixed(1)} MiB`);
  return release;
}

// Run after Vite has fully finished writing HTML and copied assets.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildOffline(fileURLToPath(new URL('../dist', import.meta.url)));
}
