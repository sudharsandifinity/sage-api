import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const files = ['package.json', 'package-lock.json', 'ecosystem.config.cjs'];

const hash = async (file) => createHash('sha1').update(await readFile(file)).digest('hex');

const walk = async (dir, base = dir, out = new Map()) => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, base, out);
    } else {
      out.set(path.relative(base, full).replace(/\\/g, '/'), await hash(full));
    }
  }

  return out;
};

const source = await walk(path.join(root, 'dist'));
const packed = await walk(path.join(root, 'prod', 'dist'));
const problems = [];

if (source === null) {
  problems.push('dist/ is missing - run npm run build');
}
if (packed === null) {
  problems.push('prod/dist is missing - run npm run prod:pack');
}

if (source !== null && packed !== null) {
  for (const [file, digest] of source) {
    if (!packed.has(file)) {
      problems.push(`missing from prod/dist: ${file}`);
    } else if (packed.get(file) !== digest) {
      problems.push(`differs: ${file}`);
    }
  }
  for (const file of packed.keys()) {
    if (!source.has(file)) {
      problems.push(`stale in prod/dist: ${file}`);
    }
  }
}

for (const file of files) {
  const a = path.join(root, file);
  const b = path.join(root, 'prod', file);
  try {
    await stat(b);
  } catch {
    problems.push(`missing from prod/: ${file}`);
    continue;
  }
  if ((await hash(a)) !== (await hash(b))) {
    problems.push(`differs: ${file}`);
  }
}

const count = source === null ? 0 : source.size;

if (problems.length === 0) {
  console.log(`prod/ is current - ${count} compiled files plus ${files.length} config files match`);
} else {
  console.log(`prod/ is NOT current - ${problems.length} problem(s):`);
  for (const problem of problems) {
    console.log(`  ${problem}`);
  }
  console.log('\nrun: npm run prod:pack');
  process.exitCode = 1;
}
