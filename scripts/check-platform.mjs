import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {platformSources, sharedScriptSources} from './source-manifest.mjs';

const root = process.cwd();
const readSource = file => readFile(join(root, 'src', file), 'utf8');
const platform =
    (await Promise.all(platformSources.map(readSource))).join('\n');

try {
  new Function(platform);
  console.log(`PASS platform bundle syntax (${
      platformSources.length} ordered fragments)`);
} catch (error) {
  console.error(`FAIL platform bundle syntax: ${error.message}`);
  process.exitCode = 1;
}

for (const file of sharedScriptSources) {
  try {
    new Function(await readSource(file));
    console.log(`PASS ${file}`);
  } catch (error) {
    console.error(`FAIL ${file}: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.exitCode) throw new Error('Source syntax validation failed.');
