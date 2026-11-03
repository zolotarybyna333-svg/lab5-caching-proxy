import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { program } from 'commander';
import superagent from 'superagent';
program
  .helpOption(false)
  .requiredOption('-h, --host <address>', 'адреса сервера')
  .requiredOption('-p, --port <number>', 'порт сервера')
  .requiredOption('-c, --cache <path>', 'тека кешу');
program.parse();
const options = program.opts();
const host = options.host;
const port = Number(options.port);
const cacheDir = path.resolve(options.cache);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Помилка: порт має бути цілим числом від 1 до 65535');
  process.exit(1);
}
await fs.mkdir(cacheDir, { recursive: true });
function send(res, status, text, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(text);
}

function sendImage(res, status, data, source) {
  res.writeHead(status, {
    'Content-Type': 'image/jpeg',
    'Content-Length': data.length,
    'X-Cache': source,
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
      return send(res, 405, 'Method Not Allowed', { Allow: 'GET, PUT, DELETE' });
    }

    const { pathname } = new URL(req.url, 'http://localhost');
    const match = /^\/(\d{3})$/.exec(pathname);
    if (!match) {
      return send(res, 404, 'Not Found: використовуйте шлях виду /404');
    }
    const code = match[1];
    const file = path.join(cacheDir, `${code}.jpg`);

    switch (req.method) {
      // GET, PUT, DELETE додамо далі
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      send(res, 500, 'Internal Server Error');
    } else {
      res.end();
    }
  }
});

server.listen(port, host);
console.log(`Сервер: http://${host}:${port}, кеш: ${cacheDir}`);
