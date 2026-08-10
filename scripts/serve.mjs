#!/usr/bin/env node
/**
 * Static server for dist/ that behaves like GitHub Pages, so local Lighthouse
 * numbers mean something.
 *
 * Pages compresses responses and sets caching headers; a bare file server does
 * neither, which inflates every network-bound metric and produces a
 * pessimistic score that sends you optimising the wrong things.
 *
 *   node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

// Already-compressed formats gain nothing and lose CPU.
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg']);

const cache = new Map();

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);

    // Pages serves index.html for a directory request.
    if (pathname.endsWith('/')) pathname += 'index.html';

    // Refuse to escape dist/.
    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      // Pages serves 404.html with a 404 status.
      const notFound = join(ROOT, '404.html');
      if (existsSync(notFound)) {
        res.writeHead(404, { 'Content-Type': TYPES['.html'] });
        createReadStream(notFound).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      }
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const type = TYPES[ext] ?? 'application/octet-stream';

    const headers = {
      'Content-Type': type,
      // What GitHub Pages actually sends.
      'Cache-Control': 'max-age=600',
      'X-Content-Type-Options': 'nosniff',
    };

    const accept = String(req.headers['accept-encoding'] ?? '');
    let body = await readFile(filePath);

    if (COMPRESSIBLE.has(ext)) {
      // Include mtime in the key: index.html keeps its name across rebuilds,
      // so a path-only key would serve a stale compressed body all session.
      const enc0 = accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gz' : 'id';
      const key = `${filePath}:${enc0}:${statSync(filePath).mtimeMs}`;
      if (cache.has(key)) {
        body = cache.get(key).body;
        if (cache.get(key).enc) headers['Content-Encoding'] = cache.get(key).enc;
      } else {
        let enc = null;
        if (accept.includes('br')) {
          body = brotliCompressSync(body, {
            params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
          });
          enc = 'br';
        } else if (accept.includes('gzip')) {
          body = gzipSync(body, { level: 6 });
          enc = 'gzip';
        }
        if (enc) headers['Content-Encoding'] = enc;
        cache.set(key, { body, enc });
      }
      headers.Vary = 'Accept-Encoding';
    }

    headers['Content-Length'] = body.length;
    res.writeHead(200, headers).end(req.method === 'HEAD' ? undefined : body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`Serving dist/ on http://localhost:${PORT}/  (gzip/brotli + Pages-like headers)`);
});
