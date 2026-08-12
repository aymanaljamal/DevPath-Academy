import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generatedAssets, platformSources, sharedScriptSources, styleSources } from './source-manifest.mjs';

const root = process.cwd();
const src = join(root, 'src');
const courseDataFiles = (await readdir(join(src, 'data', 'courses')))
  .filter(name => name.endsWith('.js'))
  .sort();

const template = await readFile(join(src, 'index.template.html'), 'utf8');
const chapterNames = (await readdir(join(src, 'content', 'chapters')))
  .filter(name => /^chapter-\d{2}\.html$/.test(name))
  .sort();
if (chapterNames.length !== 18) throw new Error(`Build requires 18 chapters, found ${chapterNames.length}`);
const compactCss = css => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .trim();

const [styles, scripts, courseData, chapters] = await Promise.all([
  Promise.all(styleSources.map(name => readFile(join(src, name), 'utf8'))),
  Promise.all([
    ...sharedScriptSources.map(name => readFile(join(src, name), 'utf8')),
    Promise.all(platformSources.map(name => readFile(join(src, name), 'utf8'))).then(parts => parts.join('\n')),
  ]),
  Promise.all(courseDataFiles.map(name => readFile(join(src, 'data', 'courses', name), 'utf8'))),
  Promise.all(chapterNames.map(name => readFile(join(src, 'content', 'chapters', name), 'utf8'))),
]);

const assemble = chapterHtml => template
  .replace('<!-- INLINE_STYLES -->', () => styles.map((css, index) => `<style data-source="${styleSources[index]}">${compactCss(css)}</style>`).join('\n'))
  .replace('<!-- COURSE_CHAPTERS -->', () => chapterHtml)
  .replace('<!-- COURSE_DATA -->', () => courseData.map((js, index) => `<script data-course="${courseDataFiles[index]}">\n${js}</script>`).join('\n'))
  .replace('<!-- INLINE_SCRIPTS -->', () => scripts.map((js, index) => `<script data-source="${index<sharedScriptSources.length?sharedScriptSources[index]:'platform-bundle'}">\n${js}</script>`).join('\n'));

const output = assemble('');
const reactOutput = assemble(chapters.join('\n'))
  .replace('<title>DevPath Academy — Learn Modern Development</title>', '<title>React Developer Course | DevPath Academy</title>');

const unresolvedMarkers = (output + reactOutput).match(/<!-- (?:INLINE_STYLES|COURSE_CHAPTERS|COURSE_DATA|INLINE_SCRIPTS) -->/g) || [];
if (unresolvedMarkers.length) {
  throw new Error(`Build failed: unresolved template markers: ${unresolvedMarkers.join(', ')}`);
}

const publicDir = join(root, 'public');
await rm(publicDir, { recursive: true, force: true });
await mkdir(join(publicDir, 'assets'), { recursive: true });
await Promise.all([
  writeFile(join(root, 'index.html'), output, 'utf8'),
  writeFile(join(root, 'react.html'), reactOutput, 'utf8'),
  writeFile(join(publicDir, 'index.html'), output, 'utf8'),
  writeFile(join(publicDir, 'react.html'), reactOutput, 'utf8'),
  copyFile(join(root, 'manifest.webmanifest'), join(publicDir, 'manifest.webmanifest')),
  copyFile(join(root, 'sw.js'), join(publicDir, 'sw.js')),
  ...generatedAssets.map(name=>copyFile(join(root,'assets',name),join(publicDir,'assets',name))),
]);
const reduction = Math.round((1 - output.length / reactOutput.length) * 100);
console.log(`Built home index.html (${output.length.toLocaleString()} chars) and lazy React reader (${reactOutput.length.toLocaleString()} chars, ${chapterNames.length} chapters).`);
console.log(`Home payload reduced ${reduction}% by excluding full React lesson content.`);
