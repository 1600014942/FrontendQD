import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import bookDemoHandler from './api/book-demo.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return path.join(root, normalized);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/book-demo')) {
      let rawBody = '';
      for await (const chunk of req) rawBody += chunk;
      try {
        req.body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: '请求 JSON 格式不正确。' }));
        return;
      }
      const response = {
        status(code) { res.statusCode = code; return response; },
        json(payload) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(payload));
        }
      };
      await bookDemoHandler(req, response);
      return;
    }
    let requested = safePath(req.url || '/');
    let info;
    try { info = await stat(requested); } catch { info = null; }
    if (info?.isDirectory()) requested = path.join(requested, 'index.html');
    if (!info && !path.extname(requested)) requested = path.join(requested, 'index.html');
    let body;
    try { body = await readFile(requested); }
    catch { body = await readFile(path.join(root, '404.html')); res.statusCode = 404; }
    res.setHeader('Content-Type', mime[path.extname(requested)] || 'application/octet-stream');
    res.setHeader('Cache-Control', path.extname(requested) === '.html' ? 'no-cache' : 'public, max-age=3600');
    res.end(body);
  } catch (error) {
    res.statusCode = 500;
    res.end(String(error));
  }
});
server.listen(port, () => console.log(`Qingdu site: http://localhost:${port}`));
