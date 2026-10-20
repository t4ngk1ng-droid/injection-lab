import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const PORT = 8123;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = normalize(join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`injection-lab: http://127.0.0.1:${PORT}/`);
  console.log(`  v1 可见注入   http://127.0.0.1:${PORT}/v1-visible.html`);
  console.log(`  v2 隐形文字   http://127.0.0.1:${PORT}/v2-hidden.html`);
  console.log(`  v3 HTML注释   http://127.0.0.1:${PORT}/v3-comment.html`);
  console.log(`  v4 meta标签   http://127.0.0.1:${PORT}/v4-meta.html`);
});
