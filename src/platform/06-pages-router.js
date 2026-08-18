function sourcesPage() {
  const officialCatalog = window.ACADEMY_SOURCE_CATALOG || {};
  const catalogGroups =
    Object.entries(officialCatalog)
      .map(
        ([courseId, links]) =>
          [courses[courseId]?.title || courseId,
          links.map(source => [source.title, source.url]), courseId])
      .sort(
        (a, b) => a[2] === 'nextjs' ? -1 :
          b[2] === 'nextjs' ? 1 :
            0);
  const groups = [
    [
      'React sources',
      [
        ['React Learn', 'https://react.dev/learn'],
        ['React API Reference', 'https://react.dev/reference/react'],
        ['React Router Documentation', 'https://reactrouter.com/'],
        [
          'Testing Library React',
          'https://testing-library.com/docs/react-testing-library/intro/'
        ],
        [
          'MDN JavaScript Guide',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
        ],
        ['Vite Guide', 'https://vite.dev/guide/']
      ]
    ],
    [
      'Java sources',
      [
        ['Learn Java', 'https://dev.java/learn/'],
        [
          'Java Language Specification', 'https://docs.oracle.com/javase/specs/'
        ],
        ['Java SE Documentation', 'https://docs.oracle.com/en/java/javase/'],
        ['Apache Maven Guides', 'https://maven.apache.org/guides/'],
        [
          'JUnit 5 User Guide',
          'https://junit.org/junit5/docs/current/user-guide/'
        ],
        ['Mockito', 'https://site.mockito.org/']
      ]
    ],
    [
      'Spring sources',
      [
        [
          'Spring Framework Reference',
          'https://docs.spring.io/spring-framework/reference/'
        ],
        [
          'Spring Boot Reference',
          'https://docs.spring.io/spring-boot/reference/'
        ],
        [
          'Spring Security Reference',
          'https://docs.spring.io/spring-security/reference/'
        ],
        [
          'Spring Data JPA Reference',
          'https://docs.spring.io/spring-data/jpa/reference/'
        ],
        [
          'Spring Cloud Reference',
          'https://docs.spring.io/spring-cloud/docs/current/reference/html/'
        ],
        ['Spring Guides', 'https://spring.io/guides']
      ]
    ],
    [
      'Data, delivery, and security',
      [
        ['PostgreSQL Documentation', 'https://www.postgresql.org/docs/'],
        ['Docker Documentation', 'https://docs.docker.com/'],
        ['OpenAPI Specification', 'https://spec.openapis.org/oas/latest.html'],
        ['OWASP Top 10', 'https://owasp.org/www-project-top-ten/']
      ]
    ]
  ];
  if (catalogGroups.length)
    return `${header()}<main class="devpath-main info-page sources-page"><a class="back-link" href="#/">← Home</a><span class="eyebrow">VERIFIED PRIMARY DOCUMENTATION</span><h1>Official learning sources</h1><p class="info-lead">${Object.values(officialCatalog)
        .reduce(
          (sum, list) => sum + list.length,
          0)} verified official and specification references, grouped by learning path. SQL and optimization lessons select the most relevant PostgreSQL source at lesson level.</p><section class="sources-hero"><article><small>WHY THIS PAGE EXISTS</small><h2>Trust the primary source first.</h2><p>Each course points to the official docs that define the APIs, syntax, and platform rules we teach. Next.js now gets a dedicated source set so the path feels current and anchored in the right references.</p></article><article><small>QUICK GUIDE</small><ul><li>Use the course card to jump into a path.</li><li>Use the source grid to verify a topic.</li><li>Favor official docs before tutorials or blog posts.</li></ul></article></section><div class="source-grid">${catalogGroups
        .map(
          ([title, links, courseId]) => `<section class="source-card${courseId === 'nextjs' ? ' is-featured' :
              ''}"><h2>${esc(title)}</h2>${links
              .map(
                ([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><span>${esc(label)}</span><small>${new URL(url).hostname}</small><b>↗</b></a>`)
              .join('')}</section>`)
        .join('')}</div></main>${footer()}`;
  return `${header()}<main class="devpath-main info-page sources-page"><a class="back-link" href="#/">← Home</a><span class="eyebrow">PRIMARY DOCUMENTATION</span><h1>Official learning sources</h1><p class="info-lead">References are separated by learning path so you can verify every topic against its official documentation.</p><section class="sources-hero"><article><small>WHY THIS PAGE EXISTS</small><h2>Trust the primary source first.</h2><p>Every path should be traceable to its official docs. If a path is missing here, it should not be considered complete.</p></article><article><small>QUICK GUIDE</small><ul><li>Use the course card to jump into a path.</li><li>Use the source grid to verify a topic.</li><li>Favor official docs before tutorials or blog posts.</li></ul></article></section><div class="source-grid">${groups
      .map(
        ([title,
          links]) => `<section class="source-card"><h2>${title}</h2>${links
            .map(
              ([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><span>${label}</span><small>${new URL(url).hostname}</small><b>↗</b></a>`)
            .join('')}</section>`)
      .join('')}</div></main>${footer()}`;
}
function aboutPage() {
  return `${header()}<main class="devpath-main info-page"><a class="back-link" href="#/">← Home</a><span class="eyebrow">ABOUT THE ACADEMY</span><h1>Built for developers who keep growing.</h1><p class="info-lead">DevPath Academy is a modular learning platform for React, Java, Spring Boot, projects, and future technologies. Every path shares progress, notes, bookmarks, search, responsive navigation, and a consistent lesson experience.</p><section class="creator-panel"><div class="creator-avatar">AA</div><div><small>CREATOR</small><h2>Ayman Aljamal · أيمن الجمل</h2><p>Designed and crafted as a practical path from fundamentals to professional software development.</p><a href="https://github.com/aymanaljamal" target="_blank" rel="noopener noreferrer">github.com/aymanaljamal ↗</a></div></section></main>${footer()}`;
}
function render() {
  const reactDocument = /(?:^|\/)react(?:\.html)?$/.test(location.pathname);
  if (reactDocument && location.hash.startsWith('#/')) {
    const home = location.protocol === 'file:' ?
      new URL(`index.html${location.hash}`, location.href).href :
      `${location.origin}/${location.hash}`;
    location.replace(home);
    return;
  }
  if (reactDocument) {
    setActiveMode(false);
    return;
  }
  applyTheme();
  applyLanguage();
  document.body.style.removeProperty('--course');
  const rawHash = decodeURIComponent(location.hash.slice(1));
  const isAppRoute = rawHash === '/' || rawHash === 'courses' ||
    rawHash === 'plan-builder' || rawHash.startsWith('/courses/') ||
    rawHash === '/sources' || rawHash === '/about';
  if (rawHash && !isAppRoute && !rawHash.startsWith('/')) {
    const anchorTarget = document.getElementById(rawHash);
    if (anchorTarget) {
      setActiveMode(false);
      requestAnimationFrame(
        () => anchorTarget.scrollIntoView({ block: 'start' }));
      return;
    }
    setActiveMode(true);
    $('#devpathApp').innerHTML = improvedHome();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  if (location.hash === '#/sources') {
    setActiveMode(true);
    $('#devpathApp').innerHTML = sourcesPage();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  if (location.hash === '#/about') {
    setActiveMode(true);
    $('#devpathApp').innerHTML = aboutPage();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  const pythonToolMatch = location.hash.match(
    /^#\/courses\/python-ai\/(roadmap|models|projects|datasets|cheatsheets|glossary|lab)$/);
  if (pythonToolMatch) {
    setActiveMode(true);
    document.body.style.setProperty(
      '--course', courses['python-ai']?.color || '#d4a017');
    $('#devpathApp').innerHTML = pythonToolPage(pythonToolMatch[1]);
    bind();
    window.scrollTo(0, 0);
    return;
  }
  const r = route();
  if (!location.hash || location.hash === '#/' ||
    location.hash === '#courses' || location.hash === '#plan-builder') {
    setActiveMode(true);
    $('#devpathApp').innerHTML = improvedHome();
    bind();
    if (location.hash === '#courses')
      setTimeout(() => $('.catalog-section')?.scrollIntoView(), 0);
    if (location.hash === '#plan-builder')
      setTimeout(
        () => $('#plan-builder')?.scrollIntoView({ behavior: 'smooth' }), 0);
    return;
  }
  if (!r.courseId) {
    setActiveMode(true);
    $('#devpathApp').innerHTML = notFoundPage();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  const course = r.courseId === 'react' ? reactCourse : courses[r.courseId];
  if (!course) {
    setActiveMode(true);
    $('#devpathApp').innerHTML = notFoundPage();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  setActiveMode(true);
  document.body.style.setProperty('--course', course.color);
  const lesson = r.lessonSlug ?
    flatLessons(course).find(l => l.slug === r.lessonSlug) :
    null;
  if (r.lessonSlug && !lesson) {
    $('#devpathApp').innerHTML = notFoundPage();
    bind();
    window.scrollTo(0, 0);
    return;
  }
  $('#devpathApp').innerHTML =
    lesson ? lessonPage(course, lesson) : coursePage(course);
  if (lesson)
    $('#devpathApp')
      .insertAdjacentHTML('beforeend', lessonToolbar(course, lesson));
  bind();
  window.scrollTo(0, 0);
}
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' &&
    document.body.classList.contains('devpath-mode')) {
    e.preventDefault();
    renderSearchDialog('search');
  }
});
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#chapter-"]');
  if (link && document.body.classList.contains('devpath-mode'))
    setActiveMode(false);
}, true);
addEventListener('hashchange', render);
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', render);
else
  render();
})();
