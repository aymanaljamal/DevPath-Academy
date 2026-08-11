import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const src = join(root, 'src');
const styleFiles = ['base.css', 'course-enhancements.css', 'learning-dashboard.css'];
const scriptFiles = ['course.js', 'learning-dashboard.js'];

const template = await readFile(join(src, 'index.template.html'), 'utf8');
const chapterNames = (await readdir(join(src, 'content', 'chapters')))
  .filter(name => /^chapter-\d{2}\.html$/.test(name))
  .sort();
if (chapterNames.length !== 18) throw new Error(`Build requires 18 chapters, found ${chapterNames.length}`);

const [styles, scripts, chapters] = await Promise.all([
  Promise.all(styleFiles.map(name => readFile(join(src, 'styles', name), 'utf8'))),
  Promise.all(scriptFiles.map(name => readFile(join(src, 'scripts', name), 'utf8'))),
  Promise.all(chapterNames.map(name => readFile(join(src, 'content', 'chapters', name), 'utf8'))),
]);

let output = template
  .replace('<!-- INLINE_STYLES -->', () => styles.map((css, index) => `<style data-source="${styleFiles[index]}">\n${css}</style>`).join('\n'))
  .replace('<!-- COURSE_CHAPTERS -->', () => chapters.join('\n'))
  .replace('<!-- INLINE_SCRIPTS -->', () => scripts.map((js, index) => `<script data-source="${scriptFiles[index]}">\n${js}</script>`).join('\n'));

const unresolvedMarkers = output.match(/<!-- (?:INLINE_STYLES|COURSE_CHAPTERS|INLINE_SCRIPTS) -->/g) || [];
if (unresolvedMarkers.length) {
  throw new Error(`Build failed: unresolved template markers: ${unresolvedMarkers.join(', ')}`);
}

await writeFile(join(root, 'index.html'), output, 'utf8');
console.log(`Built canonical index.html: ${chapterNames.length} chapters, ${output.length.toLocaleString()} characters.`);
