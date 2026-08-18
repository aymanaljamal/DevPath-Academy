import {copyFile, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {minify} from 'terser';

import {generatedAssets, platformSources, sharedScriptSources, styleSources} from './source-manifest.mjs';

const root = process.cwd();
const src = join(root, 'src');
const courseDataFiles = (await readdir(join(src, 'data', 'courses')))
                            .filter(name => name.endsWith('.js'))
                            .sort();

const [homeTemplate, reactTemplate] = await Promise.all([
  readFile(join(src, 'home.template.html'), 'utf8'),
  readFile(join(src, 'react.template.html'), 'utf8'),
]);
const chapterNames = (await readdir(join(src, 'content', 'chapters')))
                         .filter(name => /^chapter-\d{2}\.html$/.test(name))
                         .sort();
if (chapterNames.length !== 18)
  throw new Error(`Build requires 18 chapters, found ${chapterNames.length}`);
const compactCss = css => css.replace(/\/\*[\s\S]*?\*\//g, '')
                              .replace(/\s+/g, ' ')
                              .replace(/\s*([{}:;,>])\s*/g, '$1')
                              .trim();

let [styles, scripts, courseData, chapters] = await Promise.all([
  Promise.all(styleSources.map(name => readFile(join(src, name), 'utf8'))),
  Promise.all([
    ...sharedScriptSources.map(name => readFile(join(src, name), 'utf8')),
    Promise.all(platformSources.map(name => readFile(join(src, name), 'utf8')))
        .then(parts => parts.join('\n')),
  ]),
  Promise.all([
    ...courseDataFiles.map(
        name => readFile(join(src, 'data', 'courses', name), 'utf8')),
  ]),
  Promise.all(chapterNames.map(
      name => readFile(join(src, 'content', 'chapters', name), 'utf8'))),
]);

const minifyJavaScript = async source => {
  const result = await minify(
      source,
      {compress: {passes: 2}, mangle: false, format: {comments: false}});
  if (!result.code) throw new Error('JavaScript minification returned no code');
  return result.code;
};
scripts = await Promise.all(scripts.map(minifyJavaScript));
courseData = await Promise.all(courseData.map(minifyJavaScript));

const runtimeAssets = [
  ['course-reader.js', sharedScriptSources[0], scripts[0]],
  ['learning-dashboard.js', sharedScriptSources[1], scripts[1]],
  ['catalog-sources.js', sharedScriptSources[2], scripts[2]],
  ['catalog-relationships.js', sharedScriptSources[3], scripts[3]],
  ['platform-bundle.js', 'platform-bundle', scripts[4]],
];
const generatedBundles = [
  ['devpath-bundle.css', styles.map(compactCss).join('\n')],
  ['course-data.js', courseData.join('\n')],
  ...runtimeAssets.map(([name, , content]) => [name, content]),
];

const assemble =
    (template, chapterHtml, selectedRuntimeAssets, includeCourseData = true) =>
        template
            .replace(
                '<!-- INLINE_STYLES -->',
                '<link rel="stylesheet" href="assets/devpath-bundle.css" data-source="style-bundle">')
            .replace('<!-- COURSE_CHAPTERS -->', () => chapterHtml)
            .replace(
                '<!-- COURSE_DATA -->',
                includeCourseData ?
                    '<script src="assets/course-data.js" data-source="course-data"></script>' :
                    '')
            .replace(
                '<!-- INLINE_SCRIPTS -->',
                () => selectedRuntimeAssets
                          .map(
                              ([name, source]) => `<script src="assets/${
                                  name}" data-source="${source}"></script>`)
                          .join('\n'))
            .replace(/^[ \t]+$/gm, '');

// The Academy renders lesson code blocks dynamically, so it needs the shared
// code-block enhancer even though the legacy React chapters remain excluded.
const homeRuntimeAssets = [runtimeAssets[0], ...runtimeAssets.slice(2)];
const output = assemble(homeTemplate, '', homeRuntimeAssets);
// The standalone React reader owns its navigation, learning dashboard, and
// persistence. Loading the Academy router and every curriculum here creates a
// second renderer on the same document and makes deep chapters unnecessarily
// expensive.
const reactRuntimeAssets = runtimeAssets.slice(0, 2);
const reactOutput =
    assemble(reactTemplate, chapters.join('\n'), reactRuntimeAssets, false)
        .replace(
            '<title>DevPath Academy — Learn Modern Development</title>',
            '<title>React Developer Course | DevPath Academy</title>');

const unresolvedMarkers =
    (output + reactOutput)
        .match(
            /<!-- (?:INLINE_STYLES|COURSE_CHAPTERS|COURSE_DATA|INLINE_SCRIPTS) -->/g) ||
    [];
if (unresolvedMarkers.length) {
  throw new Error(`Build failed: unresolved template markers: ${
      unresolvedMarkers.join(', ')}`);
}

const publicDir = join(root, 'public');
const extraHighlightLanguages = ['http', 'dockerfile', 'properties'];
await rm(publicDir, {recursive: true, force: true});
await mkdir(join(publicDir, 'assets'), {recursive: true});
await mkdir(join(root, 'assets'), {recursive: true});
await Promise.all([
  writeFile(join(root, 'index.html'), output, 'utf8'),
  writeFile(join(root, 'react.html'), reactOutput, 'utf8'),
  writeFile(join(publicDir, 'index.html'), output, 'utf8'),
  writeFile(join(publicDir, 'react.html'), reactOutput, 'utf8'),
  ...generatedBundles.flatMap(
      ([name, content]) =>
          [writeFile(join(root, 'assets', name), content, 'utf8'),
           writeFile(join(publicDir, 'assets', name), content, 'utf8'),
]),
  copyFile(
      join(root, 'manifest.webmanifest'),
      join(publicDir, 'manifest.webmanifest')),
  copyFile(join(root, 'sw.js'), join(publicDir, 'sw.js')),
  copyFile(
      join(
          root, 'node_modules', '@highlightjs', 'cdn-assets',
          'highlight.min.js'),
      join(root, 'assets', 'highlight.min.js')),
  copyFile(
      join(
          root, 'node_modules', '@highlightjs', 'cdn-assets',
          'highlight.min.js'),
      join(publicDir, 'assets', 'highlight.min.js')),
  ...extraHighlightLanguages.flatMap(
      language => [
        copyFile(
            join(
                root, 'node_modules', '@highlightjs', 'cdn-assets',
                'languages', `${language}.min.js`),
            join(root, 'assets', `highlight-${language}.min.js`)),
        copyFile(
            join(
                root, 'node_modules', '@highlightjs', 'cdn-assets',
                'languages', `${language}.min.js`),
            join(publicDir, 'assets', `highlight-${language}.min.js`))
      ]),
  copyFile(
      join(
          root, 'node_modules', '@highlightjs', 'cdn-assets', 'styles',
          'github-dark.min.css'),
      join(root, 'assets', 'highlight-github-dark.min.css')),
  copyFile(
      join(
          root, 'node_modules', '@highlightjs', 'cdn-assets', 'styles',
          'github-dark.min.css'),
      join(publicDir, 'assets', 'highlight-github-dark.min.css')),
  ...generatedAssets.map(
      name => copyFile(
          join(root, 'assets', name), join(publicDir, 'assets', name))),
]);
console.log(`Built index.html shell (${
    output.length.toLocaleString()} chars), React reader (${
    reactOutput.length.toLocaleString()} chars), and ${
    generatedBundles.length} external runtime assets.`);
