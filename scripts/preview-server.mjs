// Tiny static server for an exported Rise web build.
// "/" redirects to the Today route (the app has no index route) and route
// paths (/sos, /checkin, …) resolve to their .html files so refreshes work.
//
// Usage: npm run preview   (after: npx expo export --platform ios --platform web)
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = process.argv[2] ?? 'dist';
const port = Number(process.argv[3] ?? 8080);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

http
  .createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') {
      res.writeHead(302, { location: '/today' });
      return res.end();
    }
    let file = join(process.cwd(), normalize(pathname));
    if (!file.startsWith(join(process.cwd(), root))) {
      res.writeHead(403);
      return res.end('forbidden');
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file) && !extname(file)) {
      const candidate = `${file}.html`;
      if (existsSync(candidate)) file = candidate;
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Rise preview serving ${root}/ at http://127.0.0.1:${port}/`);
  });
