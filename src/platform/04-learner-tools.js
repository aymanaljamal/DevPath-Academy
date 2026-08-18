function notesStats() {
  const rows = Object.entries(state.notes)
                   .map(([id, value]) => ({id, ...noteRecord(value)}))
                   .filter(row => row.body),
        words = rows.reduce(
            (sum, row) => sum + row.body.split(/\s+/).filter(Boolean).length,
            0),
        paths = new Set(rows.map(row => row.id.split(':')[0])).size;
  return {rows, words, paths};
}
function noteDialog(lesson, note) {
  const stats = notesStats(), record = noteRecord(note),
        entries = new Map(allLessonEntries().map(item => [item.id, item]));
  return `<dialog id="lessonNoteDialog" class="devpath-dialog notes-studio"><form method="dialog"><button class="dialog-x" value="cancel" aria-label="Close">×</button><span class="eyebrow">${
      t('personalNotes').toUpperCase()}</span><h2>${
      esc(lesson.title)}</h2><div class="note-stats"><div><strong>${
      stats.rows.length}</strong><span>${t('notes')}</span></div><div><strong>${
      stats.paths}</strong><span>${t('courses')}</span></div><div><strong>${
      stats
          .words}</strong><span>Words</span></div></div><div class="notes-workspace"><div class="note-editor"><label for="lessonNoteSubject">${
      t('noteSubject')}</label><input id="lessonNoteSubject" maxlength="160" value="${
      esc(record.subject || lesson.title)}"><label for="lessonNoteText">${
      t('noteContent')}</label><textarea id="lessonNoteText" maxlength="12000" placeholder="Capture an insight, question, or code idea…">${
      esc(record.body)}</textarea></div><aside class="notes-index"><strong>${
      t('allNotes')}</strong><div>${
      stats.rows.length ?
          stats.rows
              .map(row => {
                const item = entries.get(row.id);
                return item ?
                    `<a href="${item.href}"><b>${
                        esc(row.subject ||
                            item.title)}</b><small>${esc(item.courseTitle)} · ${
                        esc(item.moduleTitle)}</small></a>` :
                    ''
              })
              .join('') :
          `<p>${
              t('noNotes')}</p>`}</div></aside></div><div class="note-dialog-actions"><button id="exportAcademyNotesPdf" type="button">${
      icon('print')}<span>${
      t('exportPdf')}</span></button><button id="exportAcademyNotesJson" type="button">${
      icon('projects')}<span>${
      t('exportJson')}</span></button><button value="cancel">${
      t('cancel')}</button><button id="saveLessonNote" value="default">${
      t('saveNote')}</button></div></form></dialog>`;
}
function exportAcademyNotesJson() {
  const stats = notesStats(),
        entries = new Map(allLessonEntries().map(item => [item.id, item])),
        notes = stats.rows.map(row => ({
                                 ...row,
                                 lesson: entries.get(row.id)?.title,
                                 course: entries.get(row.id)?.courseTitle
                               }));
  const blob = new Blob(
            [JSON.stringify(
                {
                  application: 'DevPath Academy',
                  exportedAt: new Date().toISOString(),
                  notes
                },
                null, 2)],
            {type: 'application/json'}),
        url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url;
  a.download = 'devpath-academy-notes.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportAcademyNotesPdf() {
  const stats = notesStats(),
        entries = new Map(allLessonEntries().map(item => [item.id, item]));
  if (!stats.rows.length) {
    toast(t('noNotes'));
    return;
  }
  const popup = window.open('', '_blank');
  if (!popup) {
    toast('Allow pop-ups to export PDF');
    return;
  }
  popup.opener = null;
  popup.document.write(`<!doctype html><html lang="${state.language}" dir="${
      state.language === 'ar' ?
          'rtl' :
          'ltr'}"><head><meta charset="utf-8"><title>DevPath Academy Notes</title><style>@page{size:A4;margin:17mm}body{font:11pt/1.6 Arial;color:#201b1b}.cover{min-height:245mm;display:grid;align-content:center;border-left:7px solid #b91c1c;padding:24mm}.cover h1{font-size:30pt}.note{break-inside:avoid;border:1px solid #ddd;border-radius:9px;padding:7mm;margin-bottom:7mm}.note h2{color:#b91c1c}.meta{color:#666;border-bottom:1px solid #eee;padding-bottom:3mm}.body{white-space:pre-wrap}</style></head><body><section class="cover"><small>DEVPATH ACADEMY</small><h1>${
      t('personalNotes')}</h1><p>${stats.rows.length} ${t('notes')} · ${
      stats.words} words</p></section>${
      stats.rows
          .map((row, index) => {
            const item = entries.get(row.id);
            return `<article class="note"><h2>${index + 1}. ${
                esc(row.subject || item?.title ||
                    row.id)}</h2><p class="meta">${
                esc(item?.courseTitle || '')} · ${
                esc(item?.moduleTitle ||
                    '')}</p><div class="body">${esc(row.body)}</div></article>`
          })
          .join(
              '')}<script>addEventListener('load',()=>setTimeout(()=>print(),250))<\/script></body></html>`);
  popup.document.close();
}
function footer() {
  return `<footer class="devpath-footer"><a class="devpath-logo" href="#/">${
      icon(
          'brand',
          'brand-icon')}<span>DevPath Academy</span></a><p>One extensible home for every development path.</p><div class="footer-creator"><span>Designed &amp; crafted by</span><strong>Ayman Aljamal · أيمن الجمل</strong><a href="https://github.com/aymanaljamal" target="_blank" rel="noopener noreferrer">${
      icon('github')}<span>github.com/aymanaljamal</span></a></div></footer>`;
}
function renderSearchDialog(mode = 'search') {
  const lessonEntries = catalog.flatMap(
      course => flatLessons(course).map(
          l => ({
            ...l,
            type: l.kind === 'project-structure' ? 'experience' :
                course.id === 'react'            ? 'chapter' :
                                                   'lesson',
            courseTitle: course.title,
            color: course.color,
            href: course.id === 'react' && l.kind !== 'project-structure' ?
                `react.html#${l.slug}` :
                routeHref(course.id, l.slug)
          })));
  const discoveryEntries = catalog.flatMap(
      course =>
          [{
            id: `course:${course.id}`,
            title: course.title,
            moduleTitle: 'Learning path',
            courseTitle: course.title,
            courseId: course.id,
            type: 'course',
            color: course.color,
            href: routeHref(course.id),
            keywords: course.description
          },
           ...(course.modules || [])
               .map(module => ({
                      id: `module:${course.id}:${module.id}`,
                      title: module.title,
                      moduleTitle: 'Module',
                      courseTitle: course.title,
                      courseId: course.id,
                      type: 'module',
                      color: course.color,
                      href: routeHref(course.id),
                      keywords: module.lessons.map(item => item[1]).join(' ')
                    }))]);
  const projectFileEntries =
      Object.entries(projectStructures).flatMap(([courseId, structure]) => {
        const course = courses[courseId],
              lesson = course &&
            flatLessons(course).find(item => item.kind === 'project-structure');
        if (!course || !lesson) return [];
        return treeNodes(structure.tree)
            .map(item => ({
                   id: `project-file:${courseId}:${item.path}`,
                   title: item.node.name,
                   moduleTitle: structure.title,
                   courseTitle: course.title,
                   type: item.node.type,
                   color: course.color,
                   href: `${routeHref(courseId, lesson.slug)}/file/${
                       encodeURIComponent(item.path)}`,
                   keywords: `${item.node.role} ${item.node.description} ${
                       item.node.readBy || ''} ${item.path}`
                 }));
      });
  const extensionEntries = extensionCatalog.map(
      item => ({
        id: `extension:${item.key}`,
        title: item.extension,
        moduleTitle: item.fullName,
        courseTitle: courses['file-extensions']?.title || 'File Extensions',
        type: 'file type',
        color: courses['file-extensions']?.color || '#2563eb',
        href: extensionHref(item.key),
        keywords: `${item.category} ${item.purpose} ${
            item.technologies.join(' ')} ${item.readers.join(' ')}`
      }));
  const all = [
    ...discoveryEntries, ...lessonEntries, ...projectFileEntries,
    ...extensionEntries
  ];
  const entries = mode === 'bookmarks' ?
      lessonEntries.filter(l => state.bookmarks.includes(l.id)) :
      mode === 'notes' ? lessonEntries.filter(l => state.notes[l.id]) :
                         all;
  const title = mode === 'bookmarks' ? 'Bookmarks' :
      mode === 'notes'               ? 'Notes' :
                                       'Search DevPath Academy';
  const dialog = document.createElement('dialog');
  dialog.className = 'devpath-dialog global-dialog';
  dialog.innerHTML =
      `<form method="dialog"><button class="dialog-x" value="cancel">×</button><h2>${
          title}</h2>${
          mode === 'search' ?
              '<input id="globalSearchInput" type="search" placeholder="Search courses, modules, and lessons…" autocomplete="off">' :
              ''}<div id="globalResults" class="global-results"></div></form>`;
  document.body.append(dialog);
  const results = $('#globalResults', dialog), render = q => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const match = entries
                      .filter(l => {
                        const haystack =
                            (l.title + ' ' + l.moduleTitle + ' ' +
                             l.courseTitle + ' ' + (l.keywords || ''))
                                .toLowerCase();
                        return words.every(word => haystack.includes(word));
                      })
                      .slice(0, 40);
    results.innerHTML = match.length ?
        match
            .map(
                l => `<a href="${l.href}" style="--course:${
                    l.color}"><i></i><span><strong>${
                    esc(l.title)}</strong><small>${esc(l.courseTitle)} · ${
                    esc(l.moduleTitle)}${
                    mode === 'notes' ?
                        `<br>${
                            esc((state.notes[l.id]?.body || state.notes[l.id] ||
                                 '').slice(0, 100))}` :
                        ''}</small></span><em>${l.type || 'lesson'}</em></a>`)
            .join('') :
        `<div class="empty-state">No ${
            mode === 'search' ? 'matching courses, modules, or lessons' :
                                mode} yet.</div>`;
  };
  render('');
  $('#globalSearchInput', dialog)
      ?.addEventListener('input', e => render(e.target.value));
  dialog.addEventListener('click', e => {
    if (e.target.closest('a')) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
  setTimeout(() => $('#globalSearchInput', dialog)?.focus(), 0);
}
function openCourseToolPanel(mode, course) {
  const lessons = flatLessons(course),
        done = new Set(state.completed[course.id] || []),
        bookmarks = lessons.filter(item => state.bookmarks.includes(item.id)),
        notes = lessons.filter(item => state.notes[item.id]),
        remaining = lessons.filter(item => !done.has(item.id)),
        progress = courseProgress(course), isReview = mode === 'review';
  const dialog = document.createElement('dialog');
  dialog.className = 'devpath-dialog course-tool-dialog';
  dialog
      .innerHTML = `<form method="dialog"><button class="dialog-x" value="cancel" aria-label="Close">×</button><span class="eyebrow">${
      isReview ? 'SMART REVIEW' : 'LEARNING DASHBOARD'}</span><h2>${
      esc(course.title)}</h2><div class="tool-panel-stats"><div><strong>${
      progress.percent}%</strong><span>Progress</span></div><div><strong>${
      done.size}</strong><span>Completed</span></div><div><strong>${
      bookmarks.length}</strong><span>Bookmarks</span></div><div><strong>${
      notes
          .length}</strong><span>Notes</span></div></div><div class="tool-panel-list"><strong>${
      isReview ? 'Continue with these lessons' : 'Course activity'}</strong>${
      (isReview ? remaining.slice(0, 8) :
                  lessons
                      .filter(
                          item => done.has(item.id) ||
                              state.bookmarks.includes(item.id) ||
                              state.notes[item.id])
                      .slice(-8)
                      .reverse())
          .map(
              item => `<a href="${routeHref(course.id, item.slug)}"><span>${
                  esc(item.title)}</span><small>${
                  done.has(item.id)        ? 'Completed' :
                      state.notes[item.id] ? 'Has note' :
                      state.bookmarks.includes(item.id) ?
                                             'Bookmarked' :
                                             'Recommended'}</small></a>`)
          .join('') ||
      '<p class="empty-state">No activity yet. Start the first lesson to build your dashboard.</p>'}</div></form>`;
  document.body.append(dialog);
  dialog.addEventListener('click', event => {
    if (event.target.closest('a')) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}
function bind() {
  setupPlanBuilder();
  setupHomeInteractions();
  setupJourneyStudio();
  setupPythonTools();
  setupDatabaseVisuals();
  setupFrameworkLabs();
  setupProjectFileExperiences();
  $('#mobileMenu')?.addEventListener('click', e => {
    const nav = $('#mainNav'), open = nav.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
  $('#themeButton')?.addEventListener('click', e => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(SHARED_THEME_KEY, state.theme);
    } catch {
    }
    save();
    applyTheme();
    e.currentTarget.innerHTML =
        `${icon(state.theme === 'dark' ? 'sun' : 'moon')}<span>${
            state.theme === 'dark' ? 'Light' : 'Night'}</span>`;
  });
  $('#globalSearchButton')
      ?.addEventListener('click', () => renderSearchDialog('search'));
  $('#notFoundSearch')
      ?.addEventListener('click', () => renderSearchDialog('search'));
  $('#heroSearch')?.addEventListener('click', () => {
    const query = $('#homeSearchInput')?.value || '';
    renderSearchDialog('search');
    if (query) {
      setTimeout(() => {
        const input = $('#globalSearchInput');
        if (input) {
          input.value = query;
          input.dispatchEvent(new Event('input'));
        }
      }, 0);
    }
  });
  $('#homeSearchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') $('#heroSearch').click();
  });
  $('#smartReviewHome')?.addEventListener('click', () => {
    const preferred = Object.keys(state.lastLesson).reverse(), ordered = [
      ...preferred,
      ...catalog.map(item => item.id).filter(id => !preferred.includes(id))
    ];
    for (const id of ordered) {
      const course = courses[id], done = new Set(state.completed[id] || []),
            next =
                course && flatLessons(course).find(item => !done.has(item.id));
      if (next) {
        location.hash = routeHref(id, next.slug);
        return;
      }
    }
    toast('Everything is complete — amazing work!');
  });
  $('#allBookmarksButton')
      ?.addEventListener('click', () => renderSearchDialog('bookmarks'));
  $('#allNotesButton')
      ?.addEventListener('click', () => renderSearchDialog('notes'));
  $('#languageButton')?.addEventListener('click', () => {
    state.language = state.language === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem(SHARED_LANGUAGE_KEY, state.language);
    } catch {
    }
    save();
    applyLanguage();
    render();
  });
  $$('.course-filters button')
      .forEach(button => button.addEventListener('click', () => {
        $$('.course-filters button')
            .forEach(b => b.classList.toggle('active', b === button));
        $$('.course-card')
            .forEach(
                card => card.hidden = button.dataset.filter !== 'all' &&
                    card.dataset.type !== button.dataset.filter);
      }));
  $$('[data-path-course]')
      .forEach(button => button.addEventListener('click', () => {
        const course = courses[button.dataset.pathCourse];
        if (!course) return;
        const progress = courseProgress(course), explorer = $('.path-explorer');
        $$('[data-path-course]').forEach(node => {
          const active = node === button;
          node.classList.toggle('active', active);
          node.setAttribute('aria-selected', String(active));
        });
        if (explorer)
          explorer.style.setProperty('--active-course', course.color);
        $('#pathPreviewIcon').innerHTML = technologyIcon(course);
        $('#pathPreviewTitle').textContent = course.title;
        $('#pathPreviewDescription').textContent = course.description;
        $('#pathPreviewLessons').textContent = String(progress.total);
        $('#pathPreviewProgress').textContent = `${progress.percent}%`;
        $('#pathPreviewLink').href = routeHref(course.id);
      }));
  const r = route(), course = courses[r.courseId],
        lesson =
            course && flatLessons(course).find(l => l.slug === r.lessonSlug);
  if (lesson) {
    const bookmarkButton = $('#lessonBookmark');
    if (bookmarkButton)
      bookmarkButton.innerHTML = `${icon('bookmark')}<span>Bookmark</span>`;
    bookmarkButton?.addEventListener('click', e => {
      const i = state.bookmarks.indexOf(lesson.id);
      i >= 0 ? state.bookmarks.splice(i, 1) : state.bookmarks.push(lesson.id);
      save();
      e.currentTarget.classList.toggle('is-active', i < 0);
      e.currentTarget.setAttribute('aria-pressed', String(i < 0));
      toast(i >= 0 ? 'Bookmark removed' : 'Lesson bookmarked');
    });
    $('#lessonComplete')?.addEventListener('change', e => {
      const list = new Set(state.completed[course.id] || []);
      if (e.target.checked) {
        list.add(lesson.id);
        recordActivity(lesson.id);
      } else
        list.delete(lesson.id);
      state.completed[course.id] = [...list];
      save();
      toast(e.target.checked ? 'Lesson completed' : 'Completion removed');
    });
    $('#lessonNote')
        ?.addEventListener('click', () => $('#lessonNoteDialog').showModal());
    $('#saveLessonNote')?.addEventListener('click', e => {
      e.preventDefault();
      const body = $('#lessonNoteText').value.trim(),
            subject = $('#lessonNoteSubject').value.trim();
      if (body)
        state.notes[lesson.id] = {
          subject,
          body,
          updatedAt: new Date().toISOString()
        };
      else
        delete state.notes[lesson.id];
      save();
      $('#lessonNoteDialog').close();
      render();
      toast(body ? 'Note saved' : 'Empty note removed');
    });
    $('#exportAcademyNotesJson')?.addEventListener('click', e => {
      e.preventDefault();
      exportAcademyNotesJson();
    });
    $('#exportAcademyNotesPdf')?.addEventListener('click', e => {
      e.preventDefault();
      exportAcademyNotesPdf();
    });
  }
  if (lesson) {
    const lessons = flatLessons(course),
          lessonIndex = lessons.findIndex(item => item.id === lesson.id),
          actions = $('.academy-toolbar .toolbar-actions'),
          bookmarkTool = $('[data-toolbar-bookmark]');
    if (actions && !actions.querySelector('[aria-label="Previous lesson"]'))
      actions.insertAdjacentHTML(
          'afterbegin',
          `<button class="toolbar-boundary" disabled aria-label="Previous lesson" title="First lesson">${
              icon('previous')}</button>`);
    if (actions && !actions.querySelector('[aria-label="Next lesson"]'))
      bookmarkTool?.insertAdjacentHTML(
          'beforebegin',
          `<button class="toolbar-boundary" disabled aria-label="Next lesson" title="Last lesson">${
              icon('next')}</button>`);
    const themeTool = $('[data-toolbar-theme]');
    if (themeTool && !$('[data-toolbar-dashboard]'))
      themeTool.insertAdjacentHTML(
          'beforebegin',
          `<button data-toolbar-dashboard title="Course dashboard">${
              icon(
                  'projects')}<span>Dashboard</span></button><button data-toolbar-review title="Smart review">${
              icon('search')}<span>Review</span></button>`);
    const syncTools = () => {
      const bookmarked = state.bookmarks.includes(lesson.id),
            done = (state.completed[course.id] || []).includes(lesson.id),
            bookmark = $('[data-toolbar-bookmark]'),
            complete = $('[data-toolbar-complete]');
      bookmark?.classList.toggle('is-active', bookmarked);
      bookmark?.setAttribute('aria-pressed', String(bookmarked));
      complete?.classList.toggle('is-active', done);
      complete?.setAttribute('aria-pressed', String(done));
      if (complete)
        complete.innerHTML =
            `${icon('check')}<span>${done ? 'Completed' : 'Complete'}</span>`;
      const progress = courseProgress(course);
      if ($('.toolbar-progress strong'))
        $('.toolbar-progress strong').textContent = `${progress.percent}%`;
      if ($('.toolbar-progress progress'))
        $('.toolbar-progress progress').value = progress.percent;
    };
    $('[data-toolbar-bookmark]')?.addEventListener('click', () => {
      $('#lessonBookmark')?.click();
      syncTools();
    });
    $('[data-toolbar-note]')
        ?.addEventListener('click', () => $('#lessonNote')?.click());
    $('[data-toolbar-complete]')?.addEventListener('click', () => {
      const checkbox = $('#lessonComplete');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
        syncTools();
      }
    });
    $('[data-toolbar-theme]')?.addEventListener('click', e => {
      $('#themeButton')?.click();
      e.currentTarget.innerHTML =
          `${icon(state.theme === 'dark' ? 'sun' : 'moon')}<span>Theme</span>`;
    });
    $('[data-toolbar-print]')?.addEventListener('click', () => window.print());
    $('[data-toolbar-dashboard]')
        ?.addEventListener(
            'click', () => openCourseToolPanel('dashboard', course));
    $('[data-toolbar-review]')
        ?.addEventListener(
            'click', () => openCourseToolPanel('review', course));
    $('#lessonBookmark')?.addEventListener('click', syncTools);
    $('#lessonComplete')?.addEventListener('change', syncTools);
  }
  if (lesson) {
    const themeTool = $('[data-toolbar-theme]');
    if (themeTool && !$('[data-toolbar-language]'))
      themeTool.insertAdjacentHTML(
          'beforebegin',
          `<button data-toolbar-language title="Arabic / English">${
              icon('projects')}<span>${
              state.language === 'ar' ? 'EN' : 'AR'}</span></button>`);
    const labels = [
      ['[data-toolbar-bookmark]', 'bookmarks'],
      ['[data-toolbar-note]', 'notes'],
      [
        '[data-toolbar-complete]',
        (state.completed[course.id] || []).includes(lesson.id) ? 'completed' :
                                                                 'complete'
      ],
      ['[data-toolbar-dashboard]', 'dashboard'],
      ['[data-toolbar-review]', 'review'], ['[data-toolbar-theme]', 'theme']
    ];
    labels.forEach(([selector, key]) => {
      const span = $(selector + ' span');
      if (span) span.textContent = t(key);
    });
    $('[data-toolbar-language]')?.addEventListener('click', () => {
      state.language = state.language === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem(SHARED_LANGUAGE_KEY, state.language);
      } catch {
      }
      save();
      render();
    });
  }
  window.DevPathCodeBlocks?.enhance($('.lesson-content') || document);
}
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
