import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const file = join(process.cwd(), 'index.html');
const html = await readFile(file, 'utf8');
const publicHtml = await readFile(join(process.cwd(), 'public', 'index.html'), 'utf8');
const count = pattern => [...html.matchAll(pattern)].length;
const assertions = [];
const check = (name, condition, detail = '') => {
  assertions.push({ name, passed: Boolean(condition), detail });
  if (!condition) process.exitCode = 1;
};

check('18 chapters', count(/<section\b[^>]*class=["'][^"']*\bchapter\b/gi) === 18);
check('Vercel public build matches root index', publicHtml === html);
check('416 major sections', count(/<h2\b[^>]*\bid=/gi) === 416);
check('555 code blocks', count(/<pre\b/gi) === 555);
check('26 tables', count(/<table\b/gi) === 26);
check('18 completion controls', count(/data-complete=["']chapter-/gi) === 18);

const domOnly = html
  .replace(/<pre\b[\s\S]*?<\/pre>/gi, '')
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '');
const ids = [...domOnly.matchAll(/\bid=["']([^"']+)/gi)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
check('No duplicate DOM IDs', duplicateIds.length === 0, duplicateIds.join(', '));

const sidebar = html.slice(0, html.indexOf('</nav>'));
const sidebarTargets = [...sidebar.matchAll(/\bhref=["']#([^"']+)/gi)].map(match => match[1]);
const idSet = new Set(ids);
const brokenSidebarTargets = sidebarTargets.filter(id => !idSet.has(id));
check('Sidebar anchors resolve', brokenSidebarTargets.length === 0, brokenSidebarTargets.join(', '));

for (const scriptName of ['course.js', 'learning-dashboard.js']) {
  const source = await readFile(join(process.cwd(), 'src', 'scripts', scriptName), 'utf8');
  try {
    new Function(source);
    check(`${scriptName} syntax`, true);
  } catch (error) {
    check(`${scriptName} syntax`, false, error.message);
  }
}

check('Notes JSON export exists', html.includes('function exportNotes()'));
check('Notes PDF export exists', html.includes('function exportNotesPdf()'));
check('Notes statistics exist', html.includes('noteStatWords'));
check('Import and restore exists', html.includes('function importProgress()'));
check('Learning analytics exists', html.includes('function renderDashboard()'));
check('Smart review exists', html.includes('function renderReview()'));
check('Final exam exists', html.includes('function renderExam()'));
check('Printable certificate exists', html.includes('function printCertificate()'));
check('PWA registration exists', html.includes("navigator.serviceWorker.register('./sw.js')"));
check('Command palette exists', html.includes('function openCommandPalette()'));
check('Bilingual UI exists', html.includes('function applyLanguage()'));
check('Study timer exists', html.includes('function setupStudyTimer()'));
check('Persistent highlights exist', html.includes('function highlightSelection()'));
check('Five highlight colors exist', ['yellow','green','blue','pink','purple'].every(color => html.includes(`<option value="${color}">`)));
check('Markdown notes export exists', html.includes('function exportNotesMarkdown()'));
check('Notes PDF has A4 print layout', html.includes('@page{size:A4;margin:17mm}') && html.includes('Personal Learning Notes'));
check('Certificate has A4 landscape layout', html.includes('@page{size:A4 landscape;margin:0}') && html.includes('CERTIFICATE OF COMPLETION'));
check('PDF popups use compatible opener isolation', (html.match(/popup\.opener=null/g) || []).length >= 2 && !html.includes("window.open('','_blank','noopener,noreferrer')"));
check('Persistence exists', html.includes("localStorage.setItem(APP_KEY"));
check('Creator credit exists', html.includes('github.com/aymanaljamal'));
for (const asset of ['manifest.webmanifest', 'sw.js', 'assets/course-icon.svg']) {
  try { await readFile(join(process.cwd(), asset), 'utf8'); check(`${asset} exists`, true); }
  catch { check(`${asset} exists`, false); }
}
for (const asset of ['manifest.webmanifest', 'sw.js', 'assets/course-icon.svg']) {
  try { await readFile(join(process.cwd(), 'public', asset), 'utf8'); check(`public/${asset} exists`, true); }
  catch { check(`public/${asset} exists`, false); }
}

for (const result of assertions) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` - ${result.detail}` : ''}`);
}
if (process.exitCode) throw new Error('Verification failed.');
console.log(`\nAll ${assertions.length} verification checks passed.`);
