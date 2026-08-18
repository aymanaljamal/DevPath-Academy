import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import vm from 'node:vm';

import {
  platformSources, sharedScriptSources, styleSources
} from './source-manifest.mjs';

// Feature assertions should survive formatting-only source changes.
const nativeIncludes = String.prototype.includes;
let supplementalSource = '';
String.prototype.includes = function(search, ...args) {
  if (nativeIncludes.call(this, search, ...args) || typeof search !== 'string')
    return nativeIncludes.call(this, search, ...args);
  const normalize = value => String(value).replace(/\s+/g, '').replace(/"/g, "'");
  return nativeIncludes.call(
      `${normalize(this)}${normalize(supplementalSource)}`, normalize(search));
};

const file = join(process.cwd(), 'index.html');
const homeHtml = await readFile(file, 'utf8');
const html = await readFile(join(process.cwd(), 'react.html'), 'utf8');
const readme = await readFile(join(process.cwd(), 'README.md'), 'utf8');
const vercelConfig = await readFile(
    join(process.cwd(), 'vercel.json'), 'utf8');
const serviceWorker = await readFile(join(process.cwd(), 'sw.js'), 'utf8');
const publicHtml =
    await readFile(join(process.cwd(), 'public', 'index.html'), 'utf8');
const generatedRuntimeSource = (await Promise.all([
  'course-data.js', 'course-reader.js', 'learning-dashboard.js',
  'catalog-sources.js', 'catalog-relationships.js', 'platform-bundle.js'
].map(file => readFile(join(process.cwd(), 'assets', file), 'utf8')))).join('\n');
supplementalSource = (await Promise.all([
  ...platformSources, ...sharedScriptSources, ...styleSources
].map(file => readFile(join(process.cwd(), 'src', file), 'utf8')))).join('\n');
const count = pattern => [...html.matchAll(pattern)].length;
const assertions = [];
const check = (name, condition, detail = '') => {
  assertions.push({name, passed: Boolean(condition), detail});
  if (!condition) process.exitCode = 1;
};

check(
    '18 chapters',
    count(/<section\b[^>]*class=["'][^"']*\bchapter\b/gi) === 18);
check('Vercel public home matches root index', publicHtml === homeHtml);
check(
    'Vercel React build matches root reader',
    await readFile(join(process.cwd(), 'public', 'react.html'), 'utf8') ===
        html);
check(
    'Home excludes full React chapters',
    !/<section\b[^>]*class=["'][^"']*\bchapter\b/i.test(homeHtml));
// The offline-first bundle includes all curricula and interactive file labs.
check(
    'Home payload under 1 MB', Buffer.byteLength(homeHtml) < 1000000,
    `${Buffer.byteLength(homeHtml)} bytes`);
check(
    '417 major sections',
    [...`${html}\n${generatedRuntimeSource}`.matchAll(/<h2\b[^>]*\bid=/gi)].length -
            [...`${html}\n${generatedRuntimeSource}`.matchAll(
                /<h2\b[^>]*\bid=["'](?:pathPreviewTitle|playgroundTitle|journeyTitle|learningPulseTitle|planBuilderTitle|reactPlayLabTitle)["']/gi)].length ===
        417);
check(
    'HTML uses external runtime parts',
    homeHtml.includes('assets/devpath-bundle.css') &&
        homeHtml.includes('assets/course-data.js') &&
        homeHtml.includes('assets/course-reader.js') &&
        homeHtml.includes('assets/platform-bundle.js') &&
        !homeHtml.includes('<style data-source='));
check(
    'Academy loads the code-block enhancer before its dynamic platform',
    homeHtml.indexOf('assets/course-reader.js') > -1 &&
        homeHtml.indexOf('assets/course-reader.js') <
            homeHtml.indexOf('assets/platform-bundle.js') &&
        !homeHtml.includes('assets/learning-dashboard.js'));
check(
    'Home shell does not require React reader chrome',
    supplementalSource.includes("$('.page')?.toggleAttribute('hidden', active)") &&
        supplementalSource.includes(
            "$('.sidebar')?.toggleAttribute('hidden', active)"));
check(
    'Original 555 code blocks preserved', count(/<pre\b/gi) >= 555,
    `found ${count(/<pre\b/gi)}`);
check('26 tables', count(/<table\b/gi) === 26);
check('18 completion controls', count(/data-complete=["']chapter-/gi) === 18);

const domOnly = html.replace(/<pre\b[\s\S]*?<\/pre>/gi, '')
                    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
                    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
const ids = [...domOnly.matchAll(/\bid=["']([^"']+)/gi)].map(match => match[1]);
const duplicateIds =
    [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
check(
    'No duplicate DOM IDs', duplicateIds.length === 0, duplicateIds.join(', '));

const sidebar = html.slice(0, html.indexOf('</nav>'));
const sidebarTargets =
    [...sidebar.matchAll(/\bhref=["']#([^"']+)/gi)].map(match => match[1]);
const idSet = new Set(ids);
const brokenSidebarTargets = sidebarTargets.filter(id => !idSet.has(id));
check(
    'Sidebar anchors resolve', brokenSidebarTargets.length === 0,
    brokenSidebarTargets.join(', '));

const chapterDirectory = join(process.cwd(), 'src', 'content', 'chapters');
const chapterFiles = (await readdir(chapterDirectory))
                         .filter(name => /^chapter-\d{2}\.html$/.test(name))
                         .sort();
const chapterSources = await Promise.all(chapterFiles.map(
    name => readFile(join(chapterDirectory, name), 'utf8')));
const pagerProblems = [];
chapterSources.forEach((source, index) => {
  const chapterNumber = index + 1;
  const pagerTargets = new Map(
      [...source.matchAll(
          /class=["'][^"']*\bpager-card--(prev|next)\b[^"']*["'][^>]*href=["']#(chapter-\d+)["']/gi)]
          .map(match => [match[1].toLowerCase(), match[2]]));
  const expectedPrev = chapterNumber > 1 ? `chapter-${chapterNumber - 1}` : null;
  const expectedNext = chapterNumber < 18 ? `chapter-${chapterNumber + 1}` : null;
  const actualPrev = pagerTargets.get('prev') || null;
  const actualNext = pagerTargets.get('next') || null;
  if (actualPrev !== expectedPrev || actualNext !== expectedNext) {
    pagerProblems.push(
        `chapter-${chapterNumber}: prev=${actualPrev}, next=${actualNext}`);
  }
});
check(
    'All React chapter pagers form an exact 1–18 chain',
    chapterFiles.length === 18 && pagerProblems.length === 0,
    pagerProblems.join('; '));

const chapterIds = new Map(chapterSources.map((source, index) => [
  `chapter-${index + 1}`,
  new Set([...source.matchAll(/\bid=["']([^"']+)["']/gi)]
              .map(match => match[1]))
]));
const sidebarOwnershipProblems = [];
for (const match of sidebar.matchAll(
    /<a\b[^>]*class=["'][^"']*\bsubnav-link\b[^"']*["'][^>]*data-chapter=["'](chapter-\d+)["'][^>]*data-section=["']([^"']+)["'][^>]*>/gi)) {
  const [, chapter, section] = match;
  const href = match[0].match(/\bhref=["']#([^"']+)["']/i)?.[1];
  if (href !== section || !chapterIds.get(chapter)?.has(section)) {
    sidebarOwnershipProblems.push(`${chapter}/${section}`);
  }
}
check(
    'Every React sidebar section belongs to its declared chapter',
    sidebarOwnershipProblems.length === 0,
    sidebarOwnershipProblems.join(', '));

for (const scriptName of ['course.js', 'learning-dashboard.js']) {
  const source =
      await readFile(join(process.cwd(), 'src', 'scripts', scriptName), 'utf8');
  try {
    new Function(source);
    check(`${scriptName} syntax`, true);
  } catch (error) {
    check(`${scriptName} syntax`, false, error.message);
  }
}

check(
    'Academy branding exists',
    homeHtml.includes('DevPath Academy — Learn Modern Development') &&
        homeHtml.includes('DevPath Academy'));
check('Course catalog exists', homeHtml.includes('Choose where to grow next'));
const javaData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'java-essentials.js'),
    'utf8');
const springData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'spring-boot.js'), 'utf8');
const reactData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'react.js'), 'utf8');
const pythonAiData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'python-ai.js'), 'utf8');
const sqlData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'sql.js'), 'utf8');
const optimizationData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'database-optimization.js'),
    'utf8');
const cloudData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'firebase-google-cloud.js'),
    'utf8');
const courseSandbox = {window: {ACADEMY_COURSES: {}}};
vm.createContext(courseSandbox);
const courseDirectory = join(process.cwd(), 'src', 'data', 'courses');
for (const name of (await readdir(courseDirectory)).filter(name =>
  name.endsWith('.js')).sort()) {
  vm.runInContext(await readFile(join(courseDirectory, name), 'utf8'),
      courseSandbox, {filename: name});
}
const academyCourses = courseSandbox.window.ACADEMY_COURSES;
const courseLessonCount = course =>
  course.modules.reduce((total, module) => total + module.lessons.length, 0);
const lessonPairCount =
    source => [...source.matchAll(/\['[^']+','[^']+'\]/g)].length;
const structuredLessonCount =
    source => [...source.matchAll(/\['[^']+','[^']+'(?:,\{[^\]]*\})?\]/g)]
                  .length;
check('Complete React has 18 Academy lessons',
    courseLessonCount(academyCourses.react) === 18,
    `found ${courseLessonCount(academyCourses.react)}`);
const reactLessonSlugs = academyCourses.react.modules.flatMap(
    module => module.lessons.map(lesson => lesson[0]));
const expectedReactSlugs = Array.from({length: 18}, (_, index) =>
  `chapter-${index + 1}`);
check(
    'React curriculum and chapter files share one stable order',
    reactLessonSlugs.join('|') === expectedReactSlugs.join('|') &&
        chapterFiles.every((name, index) =>
          name === `chapter-${String(index + 1).padStart(2, '0')}.html`),
    reactLessonSlugs.join(', '));
check(
    'Complete Java has 54 lessons',
    courseLessonCount(academyCourses['java-essentials']) === 54,
    `found ${courseLessonCount(academyCourses['java-essentials'])}`);
check(
    'Spring and Spring Boot has 77 lessons',
    courseLessonCount(academyCourses['spring-boot']) === 77,
    `found ${courseLessonCount(academyCourses['spring-boot'])}`);
check(
    'Python AI path is registered',
    academyCourses['python-ai']?.titleAr ===
        'بايثون والذكاء الاصطناعي وتعلّم الآلة');
check(
    'Python AI has 17 stages',
    academyCourses['python-ai'].modules.length === 17,
    `found ${academyCourses['python-ai'].modules.length}`);
check(
    'Python AI uses PyTorch and reproducible seeds',
    pythonAiData.includes('framework:\'PyTorch\'') &&
        pythonAiData.includes('seed:42'));
check(
    'Python AI has nine capstones',
    pythonAiData.includes('capstones:[\'House Price Prediction\'') &&
        (pythonAiData.match(/Capstone'/g) || []).length >= 9);
check('Python AI course tools exist', [
  'Visual Course Roadmap', 'Models Library', 'Portfolio Projects', 'Datasets',
  'Cheat Sheets', 'AI Glossary', 'Model Comparison Lab'
].every(label => homeHtml.includes(label)));
check(
    'Model Comparison Lab persists locally',
    homeHtml.includes('devpath-python-ai-experiments-v1') &&
        homeHtml.includes('Train &amp; compare'));
check(
    'Python AI appears prominently on home',
    homeHtml.includes('Data &amp; AI') &&
        homeHtml.includes('data-filter="ai"'));
check('Python AI lesson requirements exist', [
  'LEARNING OBJECTIVES', 'TRY IT YOURSELF', 'SHORT QUIZ', 'COMMON MISTAKES',
  'LESSON SUMMARY', 'MODEL DOSSIER'
].every(label => homeHtml.includes(label)));
check(
    'Educational disease disclaimer exists',
    homeHtml.includes('not a medical device') &&
        homeHtml.includes('must never be treated as diagnosis'));
check(
    'SQL path has 23 lessons', courseLessonCount(academyCourses.sql) === 23,
    `found ${courseLessonCount(academyCourses.sql)}`);
check(
    'Database Optimization path has 25 lessons',
    courseLessonCount(academyCourses['database-optimization']) === 25,
    `found ${courseLessonCount(academyCourses['database-optimization'])}`);
check(
    'Database paths have bilingual metadata',
    sqlData.includes('titleAr:\'لغة SQL\'') &&
        optimizationData.includes('titleAr:\'تحسين أداء قواعد البيانات\''));
check(
    'Database curricula are adapter-ready',
    [sqlData, optimizationData].every(
        data => data.includes('schemaVersion:1') &&
            data.includes('source:\'static\'')));
check(
    'Database theme colors are correct',
    sqlData.includes('color:\'#0891b2\'') &&
        optimizationData.includes('color:\'#f59e0b\''));
check(
    'Database visuals are responsive',
    homeHtml.includes('@media(max-width:680px){.join-stage') &&
        homeHtml.includes('.er-diagram{grid-template-columns:1fr}'));
check(
    'Database visuals support reduced motion',
    homeHtml.includes(
        '@media(prefers-reduced-motion:reduce){.plan-view i{transition:none}'));
check(
    'Database visuals support dark surfaces',
    homeHtml.includes('.db-visual') &&
        homeHtml.includes('background:var(--dp-card)') &&
        homeHtml.includes('body[data-theme="dark"]'));
check(
    'Database visual controls have active and hover states',
    homeHtml.includes(
        '.visual-controls button.active,.visual-controls button:hover'));
check('SQL interactive query builder exists', [
  'data-db-visual="query-builder"', 'queryBuilderSql', 'renderQueryBuilder',
  'data-query-reset'
].every(value => homeHtml.includes(value)));
check('Optimization index advisor exists', [
  'data-db-visual="index-advisor"', 'indexRecommendation', 'setIndexCase',
  'jobs_pending_idx'
].every(value => homeHtml.includes(value)));
check(
    'Database labs are mobile responsive',
    homeHtml.includes(
        '.query-builder-controls,.index-advisor-grid{grid-template-columns:1fr}'));
check(
    'Creator metadata is complete',
    homeHtml.includes('name="author" content="Ayman Aljamal — أيمن الجمل"') &&
        homeHtml.includes(
            'name="creator" content="Ayman Aljamal — أيمن الجمل"'));
check(
    'Firebase Google Cloud path has 47 lessons',
    courseLessonCount(academyCourses['firebase-google-cloud']) === 47,
    `found ${courseLessonCount(academyCourses['firebase-google-cloud'])}`);
check(
    'Firebase Google Cloud path is bilingual',
    cloudData.includes('titleAr:\'فايربيس وخدمات جوجل السحابية\'') &&
        !/titleAr:''/.test(cloudData));
check(
    'Firebase Google Cloud has verified sources',
    homeHtml.includes('Firebase Documentation') &&
        homeHtml.includes('Cloud Run Documentation') &&
        homeHtml.includes('Cloud Architecture Framework'));
check(
    'Official sources page exists',
    homeHtml.includes('function sourcesPage()') &&
        homeHtml.includes('https://react.dev/learn') &&
        homeHtml.includes('https://docs.spring.io/spring-boot/reference/'));
check(
    'Creator and GitHub visible in footer',
    homeHtml.includes('Ayman Aljamal · أيمن الجمل') &&
        homeHtml.includes('github.com/aymanaljamal'));
check(
    'Course-aware persistence exists',
    homeHtml.includes('const STORE_KEY = \'java-spring-academy-v1\''));
check(
    'Legacy React migration exists',
    html.includes('const LEGACY_STATE_KEY = \'react-course-dashboard-v2\''));
check('Nested lesson routes exist', homeHtml.includes('/lessons/${lesson}'));
check(
    'Shared lesson toolbar exists',
    homeHtml.includes('function lessonToolbar(course,lesson)') &&
        homeHtml.includes('aria-label="Lesson tools"'));
check('Lesson toolbar has bookmark, note, and completion actions', [
  'data-toolbar-bookmark', 'data-toolbar-note', 'data-toolbar-complete'
].every(action => homeHtml.includes(action)));
check(
    'Lesson toolbar has previous and next navigation',
    homeHtml.includes('aria-label="Previous lesson"') &&
        homeHtml.includes('aria-label="Next lesson"'));
check(
    'Lesson PDF action uses browser print',
    homeHtml.includes('data-toolbar-print') &&
        homeHtml.includes('window.print()'));
check(
    'Lesson PDF has print layout',
    homeHtml.includes('@media print') && homeHtml.includes('.academy-toolbar'));
check(
    'React uses the shared Academy toolbar',
    html.includes('react-academy-toolbar') &&
        html.includes('id="completeCurrentChapter"') &&
        html.includes('id="printReactLesson"'));
check(
    'React interactive state lab exists',
    html.includes('react-play-lab') && html.includes('reactLabIncrease') &&
        html.includes('Mark completed'));
check('React render lab exists on Academy course page', [
  'react-render-lab', 'reactPropInput', 'reactRenderCount', 'setupFrameworkLabs'
].every(value => homeHtml.includes(value)));
check('Spring request pipeline lab exists', [
  'data-api-lab="spring"', 'data-spring-case="invalid"', 'springPipeline',
  'MethodArgumentNotValidException'
].every(value => homeHtml.includes(value)));
check('Postman request composer exists', [
  'data-api-lab="postman"', 'postmanMethod', 'postmanRequestPreview',
  'renderPostman'
].every(value => homeHtml.includes(value)));
const postmanData = await readFile(
    join(process.cwd(), 'src', 'data', 'courses', 'postman.js'), 'utf8');
check(
    'Postman path has 25 lessons',
    courseLessonCount(academyCourses.postman) === 25,
    `found ${courseLessonCount(academyCourses.postman)}`);
check(
    'Postman path is bilingual and sourced',
    postmanData.includes('titleAr:\'اختبار API باستخدام Postman\'') &&
        homeHtml.includes('Postman Learning Center'));
check(
    'React lab supports reset, mobile, RTL, and reduced motion',
    html.includes('reactLabReset') &&
        html.includes('@media(max-width:760px){.react-play-lab') &&
        html.includes('.language-ar .react-play-lab') &&
        html.includes(
            '@media(prefers-reduced-motion:reduce){.react-lab-preview'));
check(
    'Interactive home path explorer exists',
    homeHtml.includes('data-path-course=') &&
        homeHtml.includes('pathPreviewTitle') &&
        homeHtml.includes('--active-course'));
check(
    'Red global brand with course accents',
    homeHtml.includes('--dp-brand:#b91c1c') &&
        homeHtml.includes('--active-course'));
check(
    'React reader has shared Academy navigation',
    html.includes('class="react-site-header"') &&
        html.includes('index.html#/sources'));
check(
    'React clean URL redirects Academy hashes home',
    nativeIncludes.call(
        supplementalSource, "location.hash.startsWith('#/')") &&
        nativeIncludes.call(
            supplementalSource,
            "new URL('index.html' + location.hash, location.href)"));
check(
    'React reader excludes the duplicate Academy renderer',
    nativeIncludes.call(html, 'assets/course-reader.js') &&
        nativeIncludes.call(html, 'assets/learning-dashboard.js') &&
        !nativeIncludes.call(html, 'assets/course-data.js') &&
        !nativeIncludes.call(html, 'assets/catalog-sources.js') &&
        !nativeIncludes.call(html, 'assets/catalog-relationships.js') &&
        !nativeIncludes.call(html, 'assets/platform-bundle.js'));
check(
    'README documents the isolated React architecture',
    readme.includes('### React Reader Isolation') &&
        readme.includes('assets/course-reader.js') &&
        readme.includes('assets/learning-dashboard.js') &&
        readme.includes('It must not load `course-data.js`') &&
        readme.includes('561 lessons and experiences across 11 paths'));
check(
    'React chapter hashes stay in the reader',
    html.includes('if(reactDocument){setActiveMode(false);return;}'));
check(
    'Academy-wide advanced notes workspace exists',
    homeHtml.includes('notes-studio') &&
        homeHtml.includes('lessonNoteSubject') &&
        homeHtml.includes('note-stats'));
check(
    'Academy notes exports exist',
    homeHtml.includes('exportAcademyNotesPdf') &&
        homeHtml.includes('exportAcademyNotesJson'));
check(
    'Academy note count and bilingual controls exist',
    homeHtml.includes('nav-count') && homeHtml.includes('languageButton') &&
        homeHtml.includes('state.language===\'ar\''));
check(
    'Academy code uses one global highlighted CodeBlock system',
    [
      'assets/highlight.min.js',
      'assets/highlight-http.min.js',
      'window.DevPathCodeBlocks',
      '.code-shell .hljs-keyword',
      '.code-shell .hljs-string',
      '.code-shell .hljs-title.function_',
      '.code-shell .hljs-attr',
      '✓ Copied',
      'rootMargin: \'180px 0px\'',
      'requestIdleCallback',
    ].every(value => homeHtml.includes(value)) &&
        !homeHtml.includes('cdnjs.cloudflare.com/ajax/libs/highlight'));
check(
    'Code blocks share one high-contrast palette across themes and routes',
    [
      '--code-bg: #0D1117',
      '--code-raised: #161B22',
      '--code-border: #30363D',
      '--code-ink: #E6EDF3',
      '--code-muted: #9CA7B4',
      '.code-shell.diagram-shell',
      'color: var(--code-ink) !important',
      'background: var(--code-bg) !important',
    ].every(value => homeHtml.includes(value)) &&
        !homeHtml.includes('color: var(--diagram-ink, #075b75) !important'));
check('React initializes code and learning tools per active chapter', [
  'showChapter(initialChapter)', 'targetChapters',
  'let indexed = false', 'window.ReactChapterReader',
  'item.hidden = hidden', 'codeBlockObserver.unobserve(pre)',
  "sectionObserver.disconnect()", "qsa('h2[id]', chapter)",
  "$('.chapter:not([hidden])')", 'restoreHighlights(chapter)'
].every(value => supplementalSource.includes(value)));
check('React chapter activation keeps heavy work incremental', [
  'processed < 4', 'deferredBlocks.push(entry.target)',
  "!pre.closest('.chapter[hidden]')", 'quizReadyChapters.has(chapter)',
  'value.highlights', '.slice(-250)'
].every(value => supplementalSource.includes(value)));
check('React scrolling has one lightweight source of section state', [
  "dispatchEvent(new CustomEvent('reactsectionchange'",
  "addEventListener('reactsectionchange'", 'sidebar.scrollTop =',
  "el.classList.remove('reveal-section')"
].every(value => supplementalSource.includes(value)) &&
    !supplementalSource.includes(
        "$$('h2[id],h3[id]', chapter).filter(el =>"));
check(
    'React catalog tolerates malformed legacy completion storage',
    supplementalSource.includes('completedChapters.has(slug)') &&
        supplementalSource.includes('state.completed = record(state.completed)') &&
        supplementalSource.includes('state.bookmarks = stringList(state.bookmarks)') &&
        supplementalSource.includes('Object.entries(value)') &&
        !supplementalSource.includes(
            'localStorage.getItem(LEGACY_COMPLETE_KEY) ||\n                                    \'[]\')\n                                .includes(slug)'));
check('Offline readers do not wait for remote Google Fonts',
    !homeHtml.includes('fonts.googleapis.com') &&
        !html.includes('fonts.googleapis.com'));
check(
    'React course accent is blue',
    reactData.includes('color:\'#149eca\'') &&
        html.includes('body:not(.devpath-mode){--accent:#149eca') &&
        html.includes('.nav-chapter{--accent:#149eca!important}'));
check(
    'React previous and next icons are valid',
    html.includes('/^[A-Za-z]/.test(path)?path:`M${path}`'));
check(
    'All course toolbars expose dashboard and review',
    homeHtml.includes('data-toolbar-dashboard') &&
        homeHtml.includes('data-toolbar-review') &&
        homeHtml.includes('openCourseToolPanel'));
check(
    'Course boundaries keep previous and next visible',
    homeHtml.includes('class="toolbar-boundary" disabled') &&
        html.includes('$(\'#previousChapter\').disabled'));
check('Three interactive home tools exist', [
  'path-finder', 'challenge-machine', 'study-planner'
].every(name => homeHtml.includes(name)));
check('Personal learning pulse exists', [
  'learning-pulse', 'learningStreak', 'done today', 'smartReviewHome'
].every(name => homeHtml.includes(name)));
check('Personal roadmap builder exists', [
  'plan-builder', 'planBuilderForm', 'planGoal', 'planLevel', 'planHours',
  'setupPlanBuilder'
].every(name => homeHtml.includes(name)));
check('Roadmap covers full-stack backend data and database goals', [
  'fullstack', 'backend', 'data', 'database'
].every(goal => homeHtml.includes(`value="${goal}"`)));
check('Improved hero exposes useful academy proof', [
  'improved-hero', 'focused paths', 'practical lessons',
  'Build my learning plan'
].every(value => homeHtml.includes(value)));
check(
    'Plan builder hash routes to the home section',
    homeHtml.includes('location.hash===\'#plan-builder\'') &&
        homeHtml.includes('$(\'#plan-builder\')?.scrollIntoView'));
check(
    'Platform source is split into scalable feature fragments',
    platformSources.length === 7 &&
        homeHtml.includes('data-source="platform-bundle"'));
check('File Extensions course is registered with 12 chapters',
    academyCourses['file-extensions']?.modules.length === 12 &&
        courseLessonCount(academyCourses['file-extensions']) === 69);
check('Project Structure labs cover every supported path', [
  'react', 'nextjs', 'java-essentials', 'spring-boot', 'python-ai',
  'firebase-google-cloud', 'projects'
].every(value => courseSandbox.window.ACADEMY_PROJECT_STRUCTURES[value]));
check('Project file explorer supports deep links and accessible folders', [
  'data-tree-path', 'aria-expanded', '/file/', 'setupProjectStructure'
].every(value => homeHtml.includes(value)));
check('File extension explorer supports search filters and deep links', [
  'extensionSearch', 'data-extension-filter', '/extension/',
  'setupExtensionExplorer'
].every(value => homeHtml.includes(value)));
check('Project file experiences initialize with learner tools',
    homeHtml.includes('setupProjectFileExperiences()'));
check(
    'Daily activity is persisted on completion',
    homeHtml.includes('recordActivity(lesson.id)') &&
        homeHtml.includes('state.activity = record(state.activity)'));
check('Interactive journey studio exists', [
  'journey-studio', 'goal-roadmap', 'course-constellation', 'goalPath'
].every(name => homeHtml.includes(name)));
check(
    'Home file distribution map respects light and dark surfaces',
    homeHtml.includes('body[data-theme="dark"] .file-studio') &&
        homeHtml.includes(
            'color-mix(in srgb, var(--dp-brand) 8%, var(--dp-card))') &&
        !homeHtml.includes(
            'color-mix(in srgb, var(--dp-card) 92%, white), #fff'));
check('Journey studio connects learning goals', [
  'fullstack', 'backend', 'data', 'cloud', 'performance'
].every(goal => homeHtml.includes(`data-learning-goal="${goal}"`)));
check(
    'Journey studio is responsive and reduced-motion safe',
    homeHtml.includes('@media(max-width:900px){.journey-shell') &&
        homeHtml.includes(
            '@media(prefers-reduced-motion:reduce){.goal-path>a'));
check(
    'Home interactions have working handlers',
    homeHtml.includes('setupHomeInteractions') &&
        homeHtml.includes('data-find-path') &&
        homeHtml.includes('nextChallenge') && homeHtml.includes('weeklyHours'));
check(
    'Theme is shared between Academy and React',
    homeHtml.includes('devpath-academy-theme-v1') &&
        html.includes('devpath-academy-theme-v1'));
check(
    'Toolbars have course-aware morning and night themes',
    homeHtml.includes('.academy-toolbar::before') &&
        homeHtml.includes('body[data-theme="dark"] .academy-toolbar') &&
        homeHtml.includes('body[data-theme="light"] .course-card'));
check(
    'Night theme uses neutral charcoal and red brand',
    homeHtml.includes('--dp-bg:#0c0c0f') &&
        homeHtml.includes('rgba(185,28,28,.13)'));
check(
    'Night lesson summaries are burgundy, not legacy green',
    homeHtml.includes(
        '.devpath-mode[data-theme="dark"] .takeaways{background:#241719;border-color:#632c32}') &&
        !homeHtml.includes(
            '.devpath-mode[data-theme="dark"] .takeaways{background:#22342c}'));
check(
    'React brand is white at night',
    html.includes(
        'body[data-theme="dark"] .react-site-brand{color:#fff!important}'));
check(
    'Language is shared between Academy and React',
    homeHtml.includes('devpath-academy-language-v1') &&
        html.includes('devpath-academy-language-v1'));
check(
    'Every course toolbar has AR EN control',
    homeHtml.includes('data-toolbar-language') &&
        html.includes('language.id=\'languageToggle\''));
check(
    'Arabic layout has dedicated RTL styling',
    homeHtml.includes('.language-ar .react-site-header') &&
        homeHtml.includes('.language-ar .toolbar-actions'));

check('Notes JSON export exists', html.includes('function exportNotes()'));
check('Notes PDF export exists', html.includes('function exportNotesPdf()'));
check('Notes statistics exist', html.includes('noteStatWords'));
check('Import and restore exists', html.includes('function importProgress()'));
check('Learning analytics exists', html.includes('function renderDashboard()'));
check('Smart review exists', html.includes('function renderReview()'));
check('Final exam exists', html.includes('function renderExam()'));
check(
    'Printable certificate exists',
    html.includes('function printCertificate()'));
check(
    'PWA registration exists',
    html.includes('navigator.serviceWorker.register(\'./sw.js\')'));
check(
    'Mutable asset names revalidate instead of remaining stale for a year',
    vercelConfig.includes('public, max-age=0, must-revalidate') &&
        !vercelConfig.includes('max-age=31536000, immutable'));
check(
    'Service worker cache version matches the isolated React reader',
    serviceWorker.includes('devpath-academy-v19-react-reader') &&
        serviceWorker.includes("fetch(asset, {cache: 'reload'})") &&
        serviceWorker.includes(
            "fetch(event.request, {cache: 'no-cache'})"));
check('Command palette exists', html.includes('function openCommandPalette()'));
check('Bilingual UI exists', html.includes('function applyLanguage()'));
check('Study timer exists', html.includes('function setupStudyTimer()'));
check(
    'Persistent highlights exist',
    html.includes('function highlightSelection()'));
check('Five highlight colors exist', [
  'yellow', 'green', 'blue', 'pink', 'purple'
].every(color => html.includes(`<option value="${color}">`)));
check(
    'Markdown notes export exists',
    html.includes('function exportNotesMarkdown()'));
check(
    'Notes PDF has A4 print layout',
    html.includes('@page{size:A4;margin:17mm}') &&
        html.includes('Personal Learning Notes'));
check(
    'Certificate has A4 landscape layout',
    html.includes('@page{size:A4 landscape;margin:0}') &&
        html.includes('CERTIFICATE OF COMPLETION'));
check(
    'PDF popups use compatible opener isolation',
    ((html + generatedRuntimeSource).match(/popup\.opener=null/g) || []).length >= 2 &&
        !html.includes('window.open(\'\',\'_blank\',\'noopener,noreferrer\')'));
check('Persistence exists', html.includes('localStorage.setItem(APP_KEY'));
check('Creator credit exists', html.includes('github.com/aymanaljamal'));
for (const asset
         of ['manifest.webmanifest', 'sw.js', 'assets/course-icon.svg',
             'assets/course-icon-32.png', 'assets/course-icon-180.png',
             'assets/course-icon-192.png', 'assets/course-icon-512.png',
             'assets/course-icon-maskable-512.png']) {
  try {
    await readFile(join(process.cwd(), asset), 'utf8');
    check(`${asset} exists`, true);
  } catch {
    check(`${asset} exists`, false);
  }
}
for (const asset
         of ['manifest.webmanifest', 'sw.js', 'assets/course-icon.svg',
             'assets/course-icon-32.png', 'assets/course-icon-180.png',
             'assets/course-icon-192.png', 'assets/course-icon-512.png',
             'assets/course-icon-maskable-512.png']) {
  try {
    await readFile(join(process.cwd(), 'public', asset), 'utf8');
    check(`public/${asset} exists`, true);
  } catch {
    check(`public/${asset} exists`, false);
  }
}

try {
  const platformSource =
      (await Promise.all(platformSources.map(
           file => readFile(join(process.cwd(), 'src', file), 'utf8'))))
          .join('\n');
  new Function(platformSource);
  check(
      'Platform fragments assemble with valid syntax', true,
      `${platformSources.length} fragments`);
} catch (error) {
  check('Platform fragments assemble with valid syntax', false, error.message);
}
check(
    'Explicit application 404 state exists',
    homeHtml.includes('function notFoundPage()') &&
        homeHtml.includes('404 · PAGE NOT FOUND'));
check(
    'Unknown lessons render 404',
    homeHtml.includes('if(r.lessonSlug&&!lesson)'));
check(
    'Apple touch and sized favicons exist',
    homeHtml.includes('rel="apple-touch-icon"') &&
        homeHtml.includes('course-icon-32.png'));

for (const result of assertions) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name}${
      result.detail ? ` - ${result.detail}` : ''}`);
}
if (process.exitCode) throw new Error('Verification failed.');
console.log(`\nAll ${assertions.length} verification checks passed.`);
