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
