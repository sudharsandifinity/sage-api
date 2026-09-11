import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const prod = path.join(root, 'prod');

const files = ['package.json', 'package-lock.json', 'ecosystem.config.cjs'];

await mkdir(prod, { recursive: true });
await rm(path.join(prod, 'dist'), { recursive: true, force: true });
await cp(path.join(root, 'dist'), path.join(prod, 'dist'), { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(prod, file));
}

console.log(`prod/ updated: dist + ${files.join(', ')}`);
