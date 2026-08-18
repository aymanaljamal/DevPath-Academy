(() => {
  'use strict';
  const APP_KEY = 'react-course-dashboard-v2';
  const COMPLETION_KEY = 'react-course-completed-v1';
  const SHARED_THEME_KEY = 'devpath-academy-theme-v1';
  const SHARED_LANGUAGE_KEY = 'devpath-academy-language-v1';
  const defaults = {
    version: 3,
    lastSection: 'chapter-1',
    bookmarks: [],
    notes: {},
    quizzes: {},
    review: [],
    study: {totalSeconds: 0, chapters: {}},
    highlights: [],
    exam: {best: 0, attempts: 0, passed: false},
    preferences: {
      theme: 'system',
      fontScale: 1,
      lineHeight: 1.7,
      focus: false,
      language: 'en',
      highlightColor: 'yellow'
    },
    updatedAt: null
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const cloneDefaults = () => JSON.parse(JSON.stringify(defaults));
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(APP_KEY) || 'null');
      return value && typeof value === 'object' ? {
        ...cloneDefaults(),
        ...value,
        preferences: {...defaults.preferences, ...value.preferences}
      } :
                                                  cloneDefaults();
    } catch {
      return cloneDefaults();
    }
  };
  let state = read();
  const save = () => {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(APP_KEY, JSON.stringify(state));
    } catch {
    }
  };
  const safeId = id => id && document.getElementById(id) ? id : 'chapter-1';
  const currentId = () => safeId(location.hash.slice(1) || state.lastSection);
  const titleFor = id => {
    const el = document.getElementById(id);
    if (!el) return id;
    if (el.classList.contains('chapter'))
      return $('.chapter-title', el)?.textContent.trim() || id;
    const clone = el.cloneNode(true);
    $$('.section-tools', clone).forEach(tool => tool.remove());
    return (clone.textContent || id).trim().replace(/\s+/g, ' ').slice(0, 140);
  };
  const chapterFor = id =>
      document.getElementById(id)?.closest('.chapter')?.id ||
      (id?.startsWith('chapter-') ? id : 'chapter-1');

  function toast(message) {
    const region = $('#courseToastRegion');
    if (!region) return;
    const item = document.createElement('div');
    item.className = 'toast';
    item.setAttribute('role', 'status');
    item.textContent = message;
    region.append(item);
    setTimeout(() => item.remove(), 2600);
  }
  function applyPreferences() {
    const pref = state.preferences;
    try {
      const shared = localStorage.getItem(SHARED_THEME_KEY);
      if (shared === 'light' || shared === 'dark') pref.theme = shared;
    } catch {
    }
    const dark = pref.theme === 'dark' ||
        (pref.theme === 'system' &&
         matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.setProperty(
        '--reader-scale',
        String(Math.min(1.25, Math.max(.9, Number(pref.fontScale) || 1))));
    document.documentElement.style.setProperty(
        '--reader-line',
        String(Math.min(2, Math.max(1.45, Number(pref.lineHeight) || 1.7))));
    document.body.classList.toggle('focus-reading', !!pref.focus);
    $('#themeToggle')?.setAttribute('aria-pressed', String(dark));
    $('#focusToggle')?.setAttribute('aria-pressed', String(!!pref.focus));
  }
  function completionSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(COMPLETION_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }
  function updateProgress() {
    const total = $$('.chapter').length || 1, done = completionSet().size,
          pct = Math.round(done / total * 100), text = $('#courseProgressText');
    if (text) {
      text.textContent = `${pct}% (${done}/${total})`;
      text.title = 'Completed chapters';
    }
    if ($('#reactToolbarPercent'))
      $('#reactToolbarPercent').textContent = `${pct}%`;
    if ($('#reactToolbarProgress')) $('#reactToolbarProgress').value = pct;
    const chapter = chapterFor(currentId()),
          completed = completionSet().has(chapter),
          complete = $('#completeCurrentChapter');
    complete?.classList.toggle('is-active', completed);
    complete?.setAttribute('aria-pressed', String(completed));
    const chapters = $$('.chapter'),
          chapterIndex = chapters.findIndex(item => item.id === chapter);
    if ($('#previousChapter'))
      $('#previousChapter').disabled = chapterIndex <= 0;
    if ($('#nextChapter'))
      $('#nextChapter').disabled =
          chapterIndex < 0 || chapterIndex >= chapters.length - 1;
    const continueButton = $('#continueLearning');
    if (continueButton)
      continueButton.textContent =
          state.lastSection && state.lastSection !== 'chapter-1' ?
          'Continue' :
          'Start course';
  }
  function jump(id) {
    const target = document.getElementById(safeId(id));
    if (!target) return;
    window.ReactChapterReader?.showTarget(target);
    state.lastSection = target.id;
    save();
    history.pushState(null, '', '#' + target.id);
    target.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ?
          'auto' :
          'smooth',
      block: 'start'
    });
    target.tabIndex = -1;
    target.focus({preventScroll: true});
    if (innerWidth <= 920) $('#sidebarClose')?.click();
  }
  function toggleBookmark(id = currentId()) {
    id = safeId(id);
    const index = state.bookmarks.indexOf(id);
    index >= 0 ? state.bookmarks.splice(index, 1) : state.bookmarks.push(id);
    save();
    syncBookmarkUI();
    renderBookmarks();
    toast(index >= 0 ? 'Bookmark removed' : 'Section bookmarked');
  }
  function syncBookmarkUI() {
    const active = state.bookmarks.includes(currentId());
    $('#bookmarkCurrent')?.classList.toggle('is-active', active);
    $('#bookmarkCurrent')?.setAttribute('aria-pressed', String(active));
    $$('.section-tool[data-bookmark]').forEach(b => {
      const on = state.bookmarks.includes(b.dataset.bookmark);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }
  function openDialog(dialog) {
    if (dialog?.showModal) dialog.showModal();
  }
  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }
  function renderBookmarks() {
    const list = $('#bookmarkList');
    if (!list) return;
    list.replaceChildren();
    if (!state.bookmarks.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No bookmarks yet.';
      list.append(empty);
      return;
    }
    state.bookmarks.filter(id => document.getElementById(id)).forEach(id => {
      const row = document.createElement('div');
      row.className = 'saved-item';
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = titleFor(id);
      link.addEventListener('click', e => {
        e.preventDefault();
        closeDialog($('#bookmarksDialog'));
        jump(id);
      });
      const meta = document.createElement('small');
      meta.textContent = titleFor(chapterFor(id));
      link.append(meta);
      const remove = document.createElement('button');
      remove.className = 'learning-action';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => toggleBookmark(id));
      row.append(link, remove);
      list.append(row);
    });
  }
  function noteRecord(id) {
    const value = state.notes[id];
    return typeof value === 'string' ?
        {subject: '', body: value} :
        value && typeof value === 'object' ?
        {subject: value.subject || '', body: value.body || ''} :
        {subject: '', body: ''};
  }
  function noteMeta(id) {
    const section = document.getElementById(id),
          chapter = section?.closest('.chapter');
    return {
      chapterId: chapter?.id || chapterFor(id),
      chapterTitle: $('.chapter-title', chapter)?.textContent.trim() ||
          titleFor(chapterFor(id)),
      sectionId: id,
      sectionTitle: titleFor(id)
    };
  }
  function renderNoteList() {
    const list = $('#noteList'), count = $('#noteCount'),
          ids =
              Object.keys(state.notes)
                  .filter(
                      id => document.getElementById(id) && noteRecord(id).body);
    if (count) count.textContent = String(ids.length);
    if (!list) return;
    list.replaceChildren();
    const chapters = new Set(ids.map(chapterFor)).size,
          words = ids.reduce(
              (sum, id) =>
                  sum + noteRecord(id).body.split(/\s+/).filter(Boolean).length,
              0),
          latest = ids.map(id => noteRecord(id).updatedAt)
                       .filter(Boolean)
                       .sort()
                       .at(-1);
    if ($('#noteStatTotal'))
      $('#noteStatTotal').textContent = String(ids.length);
    if ($('#noteStatChapters'))
      $('#noteStatChapters').textContent = String(chapters);
    if ($('#noteStatWords')) $('#noteStatWords').textContent = String(words);
    if ($('#noteStatUpdated'))
      $('#noteStatUpdated').textContent =
          latest ? new Date(latest).toLocaleDateString() : '—';
    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No notes saved yet.';
      list.append(empty);
    }
    ids.forEach(id => {
      const record = noteRecord(id), meta = noteMeta(id),
            button = document.createElement('button');
      button.type = 'button';
      button.className = 'note-list-item' +
          ($('#notesDialog')?.dataset.section === id ? ' active' : '');
      const strong = document.createElement('strong');
      strong.textContent = record.subject || meta.sectionTitle;
      const small = document.createElement('small');
      small.textContent = `${meta.chapterTitle} · ${meta.sectionTitle}`;
      button.append(strong, small);
      button.addEventListener('click', () => openNote(id));
      list.append(button);
    });
    const dock = $('#openNote'),
          notesLabel =
              state.preferences.language === 'ar' ? 'الملاحظات' : 'Notes';
    dock?.classList.toggle('has-notes', ids.length > 0);
    if (dock)
      dock.innerHTML = `${notesLabel}${
          ids.length ? ` <span class="note-count">${ids.length}</span>` : ''}`;
    $$('.section-tool[data-note]').forEach(button => {
      const has = !!noteRecord(button.dataset.note).body;
      button.classList.toggle('has-note', has);
      button.textContent = has ? 'Saved note' : 'Add note';
    });
  }
  function openNote(id = currentId()) {
    id = safeId(id);
    const dialog = $('#notesDialog'), area = $('#noteText'),
          subject = $('#noteSubject'), label = $('#noteSection'),
          record = noteRecord(id), meta = noteMeta(id);
    dialog.dataset.section = id;
    label.textContent = `${meta.chapterTitle} → ${meta.sectionTitle}`;
    subject.value = record.subject || meta.sectionTitle;
    area.value = record.body;
    renderNoteList();
    openDialog(dialog);
    setTimeout(() => subject.select(), 0);
  }
  function saveNote() {
    const dialog = $('#notesDialog'), id = dialog.dataset.section,
          value = $('#noteText').value.trim(),
          subject = $('#noteSubject').value.trim();
    if (value)
      state.notes[id] = {
        subject,
        body: value,
        updatedAt: new Date().toISOString()
      };
    else
      delete state.notes[id];
    save();
    renderNoteList();
    toast(value ? 'Note saved' : 'Empty note removed');
  }
  function exportNotes() {
    const notes =
        Object.keys(state.notes)
            .filter(id => document.getElementById(id) && noteRecord(id).body)
            .map(id => {
              const record = noteRecord(id), meta = noteMeta(id);
              return {
                subject: record.subject || meta.sectionTitle,
                note: record.body,
                chapter: {id: meta.chapterId, title: meta.chapterTitle},
                section: {id: meta.sectionId, title: meta.sectionTitle},
                updatedAt: record.updatedAt || null
              };
            });
    const payload = {
      application: 'The Complete React Developer Course',
      type: 'personal-notes',
      exportedAt: new Date().toISOString(),
      totalNotes: notes.length,
      notes
    };
    const blob = new Blob(
              [JSON.stringify(payload, null, 2)], {type: 'application/json'}),
          url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'react-course-notes.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`${notes.length} notes exported`);
  }
  function exportNotesPdf() {
    const rows =
        Object.keys(state.notes)
            .filter(id => document.getElementById(id) && noteRecord(id).body)
            .map(id => ({record: noteRecord(id), meta: noteMeta(id)}));
    if (!rows.length) {
      toast('Add a note before exporting');
      return;
    }
    const escape = value => String(value).replace(/[&<>"']/g, ch => ({
                                                                '&': '&amp;',
                                                                '<': '&lt;',
                                                                '>': '&gt;',
                                                                '"': '&quot;',
                                                                '\'': '&#39;'
                                                              }[ch]));
    const chapters = new Set(rows.map(x => x.meta.chapterId)).size,
          words = rows.reduce(
              (n, x) => n + x.record.body.split(/\s+/).filter(Boolean).length,
              0),
          popup = window.open('', '_blank');
    if (!popup) {
      toast('Allow pop-ups to export PDF');
      return;
    }
    popup.opener = null;
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>React Course Notes</title><style>@page{size:A4;margin:17mm}*{box-sizing:border-box}body{font:11pt/1.55 Arial,sans-serif;color:#202028;margin:0}.cover{min-height:245mm;display:grid;align-content:center;border-left:7px solid #b91c1c;padding:25mm}.cover h1{font-size:32pt;margin:0 0 8mm}.cover p{color:#666}.stats{display:flex;gap:10mm;margin-top:12mm}.stat strong{display:block;color:#b91c1c;font-size:20pt}.note{break-inside:avoid;page-break-inside:avoid;border:1px solid #ddd;border-radius:8px;padding:7mm;margin:0 0 7mm}.note h2{font-size:16pt;margin:0 0 3mm;color:#991b1b}.meta{font-size:9pt;color:#666;border-bottom:1px solid #eee;padding-bottom:3mm;margin-bottom:4mm}.body{white-space:pre-wrap}footer{position:fixed;bottom:0;font-size:8pt;color:#888}@media print{.cover{page-break-after:always}}</style></head><body><section class="cover"><small>THE COMPLETE REACT DEVELOPER COURSE</small><h1>Personal Learning Notes</h1><p>Prepared by Ayman Aljamal</p><div class="stats"><div class="stat"><strong>${
        rows.length}</strong>Notes</div><div class="stat"><strong>${
        chapters}</strong>Chapters</div><div class="stat"><strong>${
        words}</strong>Words</div></div></section>${
        rows.map(
                ({record, meta}, i) => `<article class="note"><h2>${i + 1}. ${
                    escape(
                        record.subject ||
                        meta.sectionTitle)}</h2><div class="meta"><b>Chapter:</b> ${
                    escape(
                        meta.chapterTitle)} &nbsp; | &nbsp; <b>Section:</b> ${
                    escape(meta.sectionTitle)}<br><b>Section ID:</b> ${
                    escape(meta.sectionId)}${
                    record.updatedAt ?
                        ` &nbsp; | &nbsp; <b>Updated:</b> ${
                            escape(
                                new Date(record.updatedAt).toLocaleString())}` :
                        ''}</div><div class="body">${
                    escape(record.body)}</div></article>`)
            .join(
                '')}<footer>github.com/aymanaljamal · React Course Notes</footer><script>addEventListener('load',()=>setTimeout(()=>print(),250))<\/script></body></html>`);
    popup.document.close();
    toast('PDF report opened - choose Save as PDF');
  }
  function exportData() {
    const payload = {
      application: 'The Complete React Developer Course',
      schemaVersion: 3,
      exportedAt: new Date().toISOString(),
      completedChapters: [...completionSet()],
      state: {...state, quizScores: state.quizzes}
    };
    const blob = new Blob(
              [JSON.stringify(payload, null, 2)], {type: 'application/json'}),
          url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'react-course-progress.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Progress exported');
  }
  function resetData() {
    if (!confirm(
            'Reset all course progress, bookmarks, notes, quiz scores, and reading preferences? This cannot be undone.'))
      return;
    try {
      localStorage.removeItem(APP_KEY);
      localStorage.removeItem(COMPLETION_KEY);
    } catch {
    }
    location.reload();
  }
  function createDock() {
    const icon = path =>
        `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${
            /^[A-Za-z]/.test(path) ?
                path :
                `M${path}`}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const dock = document.createElement('nav');
    dock.className = 'learning-dock academy-toolbar react-academy-toolbar';
    dock.setAttribute('aria-label', 'Lesson tools');
    dock.innerHTML = `<div class="toolbar-progress"><span>React</span><strong id="reactToolbarPercent">0%</strong><progress id="reactToolbarProgress" max="100" value="0"></progress></div><div class="toolbar-actions"><button id="previousChapter" type="button" aria-label="Previous chapter" title="Previous chapter">${
        icon(
            '15 18 9 12 15 6')}</button><button id="nextChapter" type="button" aria-label="Next chapter" title="Next chapter">${
        icon(
            '9 18 15 12 9 6')}</button><button id="bookmarkCurrent" type="button" aria-label="Bookmark current section" aria-pressed="false" title="Bookmark">${
        icon(
            '6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17l-6-4-6 4z')}<span>Bookmark</span></button><button id="openNote" type="button" title="Notes">${
        icon(
            '4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4z')}<span>Notes</span></button><button id="completeCurrentChapter" type="button" aria-pressed="false" title="Complete chapter">${
        icon(
            '5 12 10 17 19 7')}<span>Complete</span></button><button id="printReactLesson" type="button" title="Save as PDF">${
        icon(
            '7 3h10v5H7zM6 17H4v-7h16v7h-2M7 14h10v7H7z')}<span>PDF</span></button><button id="themeToggle" type="button" aria-label="Toggle dark mode" aria-pressed="false" title="Theme">${
        icon(
            '21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z')}<span>Theme</span></button><button id="openDashboard" type="button" title="Dashboard">${
        icon(
            '4 13h6v7H4zM14 4h6v16h-6zM4 4h6v5H4z')}<span>Dashboard</span></button><button id="openReview" type="button" data-secondary title="Review">${
        icon(
            '4 4h16v16H4zM8 9h8M8 13h6')}<span>Review</span></button><button id="continueLearning" type="button" hidden>Continue</button><button id="openBookmarks" type="button" hidden>Bookmarks</button><label class="highlight-color-wrap" hidden><select id="highlightColor" aria-label="Highlight color"><option value="yellow">Yellow</option><option value="green">Green</option><option value="blue">Blue</option><option value="pink">Pink</option><option value="purple">Purple</option></select></label><button id="highlightSelection" type="button" hidden>Highlight</button><span id="studyTimeChip" hidden>0m</span><button id="openSettings" type="button" hidden>Preferences</button><button id="openHelp" type="button" hidden>Help</button></div>`;
    const language = document.createElement('button');
    language.id = 'languageToggle';
    language.type = 'button';
    language.title = 'Arabic / English';
    language.innerHTML = `${
        icon(
            'M4 5h16M7 9h10M9 5c0 7 6 11 11 12M15 5c0 7-6 11-11 12M12 19h8')}<span>${
        state.preferences.language === 'ar' ? 'EN' : 'AR'}</span>`;
    $('#themeToggle', dock).before(language);
    document.body.append(dock);
    $('#continueLearning').addEventListener('click', () => jump(currentId()));
    $('#bookmarkCurrent').addEventListener('click', () => toggleBookmark());
    $('#openBookmarks').addEventListener('click', () => {
      renderBookmarks();
      openDialog($('#bookmarksDialog'));
    });
    $('#openNote').addEventListener('click', () => openNote());
    const moveChapter = delta => {
      const chapters = $$('.chapter'),
            current = document.getElementById(chapterFor(currentId()))
                          ?.closest('.chapter'),
            index = Math.max(0, chapters.indexOf(current)),
            target = chapters[index + delta];
      if (target) jump(target.id);
    };
    $('#previousChapter').addEventListener('click', () => moveChapter(-1));
    $('#nextChapter').addEventListener('click', () => moveChapter(1));
    $('#completeCurrentChapter').addEventListener('click', () => {
      const chapter = chapterFor(currentId()),
            control = $(`[data-complete="${chapter}"]`);
      control?.click();
      setTimeout(updateProgress, 0);
    });
    $('#printReactLesson').addEventListener('click', () => window.print());
    $('#languageToggle').addEventListener('click', () => {
      state.preferences.language =
          state.preferences.language === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem(SHARED_LANGUAGE_KEY, state.preferences.language);
      } catch {
      }
      save();
      applyLanguage();
    });
    $('#themeToggle').addEventListener('click', () => {
      const dark = document.body.dataset.theme === 'dark';
      state.preferences.theme = dark ? 'light' : 'dark';
      try {
        localStorage.setItem(SHARED_THEME_KEY, state.preferences.theme);
      } catch {
      }
      save();
      applyPreferences();
    });
    $('#openSettings').addEventListener('click', () => {
      syncPreferenceForm();
      openDialog($('#preferencesDialog'));
    });
  }
  function dialogShell(id, title, content, actions = '') {
    const d = document.createElement('dialog');
    d.id = id;
    d.className = 'learning-dialog';
    d.innerHTML = `<div class="dialog-card"><div class="dialog-head"><h2>${
        title}</h2><button class="dialog-close" type="button" aria-label="Close">×</button></div><div class="dialog-body">${
        content}</div>${
        actions ? `<div class="dialog-actions">${actions}</div>` : ''}</div>`;
    d.addEventListener('click', e => {
      if (e.target === d) closeDialog(d);
    });
    $('.dialog-close', d).addEventListener('click', () => closeDialog(d));
    document.body.append(d);
    return d;
  }
  function createDialogs() {
    const notes = dialogShell(
        'notesDialog', 'Personal notes',
        '<div class="note-stats"><div class="note-stat"><strong id="noteStatTotal">0</strong><span>Notes</span></div><div class="note-stat"><strong id="noteStatChapters">0</strong><span>Chapters</span></div><div class="note-stat"><strong id="noteStatWords">0</strong><span>Words</span></div><div class="note-stat"><strong id="noteStatUpdated">—</strong><span>Last update</span></div></div><div class="notes-workspace"><div class="note-editor"><p id="noteSection"></p><label for="noteSubject">Note subject (suggested from section)</label><input id="noteSubject" list="noteSubjectSuggestions" maxlength="160" placeholder="Example: useEffect cleanup pattern"><datalist id="noteSubjectSuggestions"></datalist><label for="noteText">Note content</label><textarea id="noteText" maxlength="12000" placeholder="Write your private note…"></textarea></div><aside class="notes-index" aria-label="Saved notes"><div class="notes-index-head"><h3>All saved notes</h3><span class="note-count" id="noteCount">0</span></div><div class="note-list" id="noteList"></div></aside></div>',
        '<button class="learning-action" id="exportNotesPdf" type="button">Export PDF</button><button class="learning-action" id="exportNotes" type="button">Export JSON</button><button class="learning-action" data-close type="button">Close</button><button class="learning-action primary" id="saveNote" type="button">Save note</button>');
    $('[data-close]', notes)
        .addEventListener('click', () => closeDialog(notes));
    $('#saveNote').addEventListener('click', saveNote);
    $('#exportNotes').addEventListener('click', exportNotes);
    $('#exportNotesPdf').addEventListener('click', exportNotesPdf);
    const suggestions = $('#noteSubjectSuggestions');
    $$('.chapter h2[id],.chapter h3[id]').forEach(h => {
      const option = document.createElement('option');
      option.value = h.textContent.trim();
      suggestions.append(option);
    });
    dialogShell(
        'bookmarksDialog', 'Bookmarks',
        '<div class="saved-list" id="bookmarkList"></div>');
    const prefs = dialogShell(
        'preferencesDialog', 'Reading preferences',
        '<div class="preference-grid"><div><label for="themePreference">Theme</label><select id="themePreference"><option value="system">Use system setting</option><option value="light">Light</option><option value="dark">Dark</option></select></div><div><label for="fontScale">Text size</label><select id="fontScale"><option value="0.9">Compact</option><option value="1">Default</option><option value="1.12">Large</option><option value="1.25">Extra large</option></select></div><div><label for="lineHeight">Line spacing</label><select id="lineHeight"><option value="1.5">Tight</option><option value="1.7">Default</option><option value="1.9">Relaxed</option></select></div><div><label for="languagePreference">Interface language</label><select id="languagePreference"><option value="en">English</option><option value="ar">العربية</option></select></div><div><label><input id="focusPreference" type="checkbox"> Focus reading mode</label></div></div><div class="import-zone"><strong>Restore a previous backup</strong><p>Import a valid course progress JSON file. Existing local data will be replaced after confirmation.</p><input id="importProgressFile" type="file" accept="application/json,.json"></div>',
        '<button class="learning-action" id="exportProgress" type="button">Export Progress</button><button class="learning-action" id="importProgress" type="button">Import / Restore</button><button class="learning-action" id="resetCourse" type="button">Reset Course Data</button><button class="learning-action primary" id="savePreferences" type="button">Apply</button>');
    $('#savePreferences').addEventListener('click', () => {
      state.preferences.theme = $('#themePreference').value;
      state.preferences.fontScale = Number($('#fontScale').value);
      state.preferences.lineHeight = Number($('#lineHeight').value);
      state.preferences.language = $('#languagePreference').value;
      state.preferences.focus = $('#focusPreference').checked;
      try {
        localStorage.setItem(SHARED_LANGUAGE_KEY, state.preferences.language);
      } catch {
      }
      save();
      applyPreferences();
      applyLanguage();
      closeDialog(prefs);
      toast('Preferences saved');
    });
    $('#exportProgress').addEventListener('click', exportData);
    $('#resetCourse').addEventListener('click', resetData);
  }
  function syncPreferenceForm() {
    $('#themePreference').value = state.preferences.theme;
    $('#fontScale').value = String(state.preferences.fontScale);
    $('#lineHeight').value = String(state.preferences.lineHeight);
    $('#languagePreference').value = state.preferences.language || 'en';
    $('#focusPreference').checked = !!state.preferences.focus;
  }
  function addSectionTools(root = document) {
    $$('.chapter > h2[id]', root).forEach(h => {
      if ($('.section-tools', h)) return;
      const wrap = document.createElement('span');
      wrap.className = 'section-tools';
      const bookmark = document.createElement('button');
      bookmark.type = 'button';
      bookmark.className = 'section-tool';
      bookmark.dataset.bookmark = h.id;
      bookmark.setAttribute('aria-label', 'Bookmark ' + h.textContent.trim());
      bookmark.textContent = 'Bookmark';
      bookmark.addEventListener('click', () => toggleBookmark(h.id));
      const note = document.createElement('button');
      note.type = 'button';
      note.className = 'section-tool';
      note.dataset.note = h.id;
      note.setAttribute('aria-label', 'Add note for ' + h.textContent.trim());
      note.textContent = 'Add note';
      note.addEventListener('click', () => openNote(h.id));
      wrap.append(bookmark, note);
      h.append(wrap);
    });
  }
  function addQuizzes() {
    $$('.chapter').forEach((chapter, index) => {
      if ($('.chapter-quiz', chapter)) return;
      const headings = $$('h2[id]', chapter);
      if (!headings.length) return;
      const correct = headings[0].textContent.trim();
      const distractors =
          $$('.chapter h2[id]')
              .filter(h => !chapter.contains(h))
              .map(h => h.textContent.trim())
              .filter((x, i, a) => x !== correct && a.indexOf(x) === i);
      const options = [
        correct,
        distractors[(index * 7) % Math.max(1, distractors.length)] ||
            'A different course topic',
        distractors[(index * 11 + 3) % Math.max(1, distractors.length)] ||
            'Another course topic'
      ].sort(() => .5 - Math.random());
      const box = document.createElement('section');
      box.className = 'chapter-quiz';
      box.dataset.quiz = chapter.id;
      const saved = state.quizzes[chapter.id];
      box.innerHTML =
          `<h3>Chapter knowledge check</h3><p>Which topic appears in this chapter?</p><div class="quiz-options">${
              options
                  .map(
                      (o, i) => `<label><input type="radio" name="quiz-${
                          index + 1}" value="${i}" data-correct="${
                          o === correct}"><span></span></label>`)
                  .join(
                      '')}</div><button class="learning-action primary" type="button">Check answer</button> <span class="quiz-score">${
              saved ? `Best: ${saved.best}/1 · Attempts: ${saved.attempts}` :
                      ''}</span><p class="quiz-result" aria-live="polite"></p>`;
      $$('.quiz-options label', box)
          .forEach((label, i) => $('span', label).textContent = options[i]);
      $('button', box).addEventListener('click', () => {
        const selected = $('input:checked', box),
              result = $('.quiz-result', box);
        if (!selected) {
          result.textContent = 'Choose an answer first.';
          return;
        }
        const score = selected.dataset.correct === 'true' ? 1 : 0,
              old = state.quizzes[chapter.id] || {best: 0, attempts: 0};
        state.quizzes[chapter.id] = {
          best: Math.max(old.best, score),
          attempts: old.attempts + 1,
          lastScore: score,
          updatedAt: new Date().toISOString()
        };
        save();
        result.textContent = score ?
            'Correct — nice work.' :
            'Not quite. Review the chapter headings and try again.';
        $('.quiz-score', box).textContent =
            `Best: ${state.quizzes[chapter.id].best}/1 · Attempts: ${
                state.quizzes[chapter.id].attempts}`;
      });
      const completion = $('.chapter-completion', chapter);
      chapter.insertBefore(box, completion || null);
    });
  }
  function addCreativeQuizzes(root = document) {
    const esc = value => String(value).replace(/[&<>"']/g, ch => ({
                                                             '&': '&amp;',
                                                             '<': '&lt;',
                                                             '>': '&gt;',
                                                             '"': '&quot;',
                                                             '\'': '&#39;'
                                                           }[ch]));
    const allChapters = $$('.chapter');
    const targetChapters = root.matches?.('.chapter') ? [root] :
        $$('.chapter', root);
    const allTopics = $$('.chapter h2[id]').map(h => h.textContent.trim());
    targetChapters.forEach(chapter => {
      const index = allChapters.indexOf(chapter);
      $('.chapter-quiz', chapter)?.remove();
      const headings = $$('h2[id]', chapter);
      if (headings.length < 2) return;
      const chapterTitle = $('.chapter-title', chapter)?.textContent.trim() ||
          `Chapter ${index + 1}`;
      const first = headings[0].textContent.trim();
      const last = headings.at(-1).textContent.trim();
      const middle =
          headings[Math.floor(headings.length / 2)].textContent.trim();
      const otherChapterA =
          $('.chapter-title', allChapters[(index + 5) % allChapters.length])
              ?.textContent.trim() ||
          'Another chapter';
      const otherChapterB =
          $('.chapter-title', allChapters[(index + 9) % allChapters.length])
              ?.textContent.trim() ||
          'A different chapter';
      const foreignTopic = allTopics[(index * 17 + 23) % allTopics.length];
      const questionSets = [
        {
          title: 'Spot the signal',
          prompt: 'Which concept belongs inside this chapter?',
          options: [
            {text: middle, correct: true}, {text: foreignTopic, correct: false},
            {text: otherChapterA, correct: false}
          ]
        },
        {
          title: 'Decode the concept map',
          prompt: 'Choose the hub that correctly connects these chapter ideas.',
          map: [first, middle, last],
          options: [
            {text: chapterTitle, correct: true},
            {text: otherChapterA, correct: false},
            {text: otherChapterB, correct: false}
          ]
        },
        {
          title: 'Build the learning path',
          prompt:
              'Which route follows the chapter from its opening topic to its final topic?',
          options: [
            {text: `${first} → ${last}`, correct: true},
            {text: `${last} → ${first}`, correct: false},
            {text: `${foreignTopic} → ${middle}`, correct: false}
          ]
        }
      ];
      const box = document.createElement('section');
      box.className = 'chapter-quiz';
      box.dataset.quiz = chapter.id;
      const saved = state.quizzes[chapter.id];
      box.innerHTML = `<div class="quiz-intro"><span class="quiz-badge" aria-hidden="true">◇</span><div><h3>Creative chapter challenge</h3><p>Three visual questions to connect the ideas—not just memorize them.</p></div></div>${
          questionSets
              .map(
                  (q, qi) => `<fieldset class="creative-question"><legend>${
                      qi + 1}. ${esc(q.title)}</legend><p>${esc(q.prompt)}</p>${
                      q.map ?
                          `<div class="concept-map" aria-hidden="true"><span class="concept-hub">?</span>${
                              q.map
                                  .map(
                                      x => `<span class="concept-node">${
                                          esc(x)}</span>`)
                                  .join('')}</div>` :
                          ''}<div class="quiz-options visual">${
                      q.options.sort(() => .5 - Math.random())
                          .map(
                              (o, oi) =>
                                  `<label><input type="radio" name="creative-${
                                      index + 1}-${qi + 1}" value="${
                                      oi}" data-correct="${o.correct}"><span>${
                                      esc(o.text)}</span></label>`)
                          .join('')}</div></fieldset>`)
              .join(
                  '')}<button class="learning-action primary quiz-submit" type="button">Check all 3 answers</button> <span class="quiz-score">${
          saved ?
              `Best: ${saved.best}/3 · Attempts: ${saved.attempts}` :
              'Best: 0/3'}</span><p class="quiz-result" aria-live="polite"></p>`;
      $('.quiz-submit', box).addEventListener('click', () => {
        const groups = $$('.creative-question', box),
              selected = groups.map(g => $('input:checked', g)),
              result = $('.quiz-result', box);
        if (selected.some(x => !x)) {
          result.textContent = 'Answer all three shapes first.';
          return;
        }
        const score = selected.filter(x => x.dataset.correct === 'true').length,
              old = state.quizzes[chapter.id] || {best: 0, attempts: 0};
        state.quizzes[chapter.id] = {
          best: Math.max(old.best, score),
          attempts: old.attempts + 1,
          lastScore: score,
          total: 3,
          updatedAt: new Date().toISOString()
        };
        if (score < 3) {
          const existing =
              state.review.find(item => item.chapterId === chapter.id);
          const dueAt =
              new Date(
                  Date.now() +
                  (existing ? Math.min(7, existing.intervalDays * 2) : 1) *
                      86400000)
                  .toISOString();
          state.review =
              state.review.filter(item => item.chapterId !== chapter.id);
          state.review.push({
            chapterId: chapter.id,
            dueAt,
            intervalDays: existing ? Math.min(7, existing.intervalDays * 2) : 1,
            lastScore: score
          });
        } else
          state.review =
              state.review.filter(item => item.chapterId !== chapter.id);
        save();
        result.textContent = score === 3 ?
            'Perfect connection — 3/3!' :
            score === 2 ?
            'Great pattern recognition — 2/3. One more link to revisit.' :
            score === 1 ?
            'You found one connection — review the chapter map and try again.' :
            'Use the chapter headings as your map, then try once more.';
        $('.quiz-score', box).textContent =
            `Best: ${state.quizzes[chapter.id].best}/3 · Attempts: ${
                state.quizzes[chapter.id].attempts}`;
      });
      const completion = $('.chapter-completion', chapter);
      chapter.insertBefore(box, completion || null);
    });
  }
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600),
          minutes = Math.floor((seconds % 3600) / 60);
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
  function importProgress() {
    const file = $('#importProgressFile')?.files?.[0];
    if (!file) {
      toast('Choose a JSON backup first');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        if (payload.application !== 'The Complete React Developer Course')
          throw new Error('Not a React Course backup');
        if (!confirm('Replace all current course data with this backup?'))
          return;
        const incoming = payload.state || payload;
        state = {
          ...cloneDefaults(),
          ...incoming,
          lastSection: safeId(incoming.lastSection),
          bookmarks: Array.isArray(incoming.bookmarks) ?
              incoming.bookmarks.filter(id => document.getElementById(id)) :
              [],
          notes: incoming.notes && typeof incoming.notes === 'object' ?
              incoming.notes :
              {},
          quizzes: incoming.quizScores || incoming.quizzes || {},
          review: Array.isArray(incoming.review) ? incoming.review : [],
          study: incoming.study && typeof incoming.study === 'object' ?
              incoming.study :
              defaults.study,
          highlights: Array.isArray(incoming.highlights) ? incoming.highlights :
                                                           [],
          exam: incoming.exam && typeof incoming.exam === 'object' ?
              incoming.exam :
              defaults.exam,
          preferences: {...defaults.preferences, ...incoming.preferences}
        };
        localStorage.setItem(APP_KEY, JSON.stringify(state));
        localStorage.setItem(
            COMPLETION_KEY,
            JSON.stringify(
                Array.isArray(payload.completedChapters) ?
                    payload.completedChapters :
                    []));
        location.reload();
      } catch (error) {
        toast(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
  }
  function exportNotesMarkdown() {
    const ids =
        Object.keys(state.notes)
            .filter(id => document.getElementById(id) && noteRecord(id).body);
    if (!ids.length) {
      toast('No notes to export');
      return;
    }
    const content = [
      `# React Course Personal Notes`, ``, `Created by Ayman Aljamal`,
      `Exported: ${new Date().toLocaleString()}`, ``, ...ids.flatMap(id => {
        const note = noteRecord(id), meta = noteMeta(id);
        return [
          `## ${note.subject || meta.sectionTitle}`, ``,
          `- Chapter: ${meta.chapterTitle}`,
          `- Section: ${meta.sectionTitle} (${meta.sectionId})`,
          note.updatedAt ?
              `- Updated: ${new Date(note.updatedAt).toLocaleString()}` :
              '',
          ``, note.body, ``, `---`, ``
        ];
      })
    ].join('\n');
    const blob = new Blob([content], {type: 'text/markdown'}),
          url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'react-course-notes.md';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast('Markdown notes exported');
  }
  function dashboardData() {
    const completed = completionSet().size,
          totalChapters = $$('.chapter').length,
          quizEntries = Object.values(state.quizzes),
          quizAvg = quizEntries.length ?
        Math.round(
            quizEntries.reduce(
                (n, q) => n + (q.best / (q.total || 3)) * 100, 0) /
            quizEntries.length) :
        0,
          noteCount =
              Object.keys(state.notes).filter(id => noteRecord(id).body).length;
    return {
      completed,
      totalChapters,
      quizAvg,
      noteCount,
      studySeconds: state.study?.totalSeconds || 0,
      bookmarks: state.bookmarks.length,
      review: state.review.length
    };
  }
  function renderDashboard() {
    const d = dashboardData(), body = $('#dashboardBody');
    if (!body) return;
    const chapters = $$('.chapter').map(ch => {
      const q = state.quizzes[ch.id],
            seconds = state.study?.chapters?.[ch.id] || 0;
      return {
        title: $('.chapter-title', ch)?.textContent.trim() || ch.id,
        score: q ? Math.round(q.best / (q.total || 3) * 100) : 0,
        seconds
      };
    });
    body.innerHTML = `<div class="dashboard-grid"><div class="metric-card"><strong>${
        d.completed}/${
        d.totalChapters}</strong><span>Chapters complete</span></div><div class="metric-card"><strong>${
        d.quizAvg}%</strong><span>Quiz average</span></div><div class="metric-card"><strong>${
        formatDuration(
            d.studySeconds)}</strong><span>Study time</span></div><div class="metric-card"><strong>${
        d.noteCount}</strong><span>Personal notes</span></div><div class="metric-card"><strong>${
        d.bookmarks}</strong><span>Bookmarks</span></div><div class="metric-card"><strong>${
        d.review}</strong><span>Review queue</span></div><div class="metric-card"><strong>${
        state.highlights
            .length}</strong><span>Highlights</span></div><div class="metric-card"><strong>${
        state.exam.best ||
        0}%</strong><span>Final exam best</span></div></div><h3>Chapter performance</h3><div class="analytics-bars">${
        chapters
            .map(
                ch => `<div class="analytics-row"><span>${
                    ch.title.slice(
                        0,
                        22)}</span><div class="analytics-track"><div class="analytics-fill" style="width:${
                    ch.score}%"></div></div><strong>${
                    ch.score}%</strong></div>`)
            .join('')}</div>`;
  }
  function renderReview() {
    const list = $('#reviewList');
    if (!list) return;
    list.replaceChildren();
    const items =
        [...state.review].sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    if (!items.length) {
      list.innerHTML =
          '<div class="empty-state">Your review queue is clear. Wrong quiz answers will appear here automatically.</div>';
      return;
    }
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'review-card';
      const info = document.createElement('div'),
            title = document.createElement('strong'),
            meta = document.createElement('small');
      title.textContent = titleFor(item.chapterId);
      meta.textContent = `Last score: ${item.lastScore}/3 · ${
          new Date(item.dueAt) <= new Date() ?
              'Due now' :
              `Due ${new Date(item.dueAt).toLocaleDateString()}`}`;
      info.append(title, meta);
      const button = document.createElement('button');
      button.className = 'learning-action primary';
      button.textContent = 'Review';
      button.addEventListener('click', () => {
        closeDialog($('#reviewDialog'));
        jump(item.chapterId);
        setTimeout(
            () => $('.chapter-quiz', document.getElementById(item.chapterId))
                      ?.scrollIntoView({behavior: 'smooth'}),
            300);
      });
      card.append(info, button);
      list.append(card);
    });
  }
  function renderExam() {
    const form = $('#examForm');
    if (!form) return;
    const chapters = $$('.chapter').slice(0, 10);
    form.replaceChildren();
    chapters.forEach((chapter, index) => {
      const
          title = $('.chapter-title', chapter).textContent.trim(),
          correct = $('h2[id]', chapter).textContent.trim(),
          otherA =
              $('h2[id]', $$('.chapter')[(index + 5) % 18]).textContent.trim(),
          otherB =
              $('h2[id]', $$('.chapter')[(index + 11) % 18]).textContent.trim(),
          options =
              [
                {text: correct, right: true}, {text: otherA, right: false},
                {text: otherB, right: false}
              ].sort(() => .5 - Math.random()),
          field = document.createElement('fieldset');
      field.className = 'exam-question';
      field.innerHTML = `<legend>${index + 1}. Which topic belongs to ${
          title}?</legend><div class="exam-options">${
          options
              .map(
                  (o, i) =>
                      `<label><input type="radio" name="exam-${index}" value="${
                          i}" data-correct="${o.right}"> ${o.text}</label>`)
              .join('')}</div>`;
      form.append(field);
    });
    $('#examResult').textContent = state.exam.attempts ?
        `Best score: ${state.exam.best}%` :
        'Pass with 80% or higher to unlock your certificate.';
  }
  function submitExam() {
    const fields = $$('.exam-question', $('#examForm')),
          selected = fields.map(f => $('input:checked', f));
    if (selected.some(x => !x)) {
      toast('Answer every exam question');
      return;
    }
    const score =
        selected.filter(x => x.dataset.correct === 'true').length * 10;
    state.exam = {
      best: Math.max(state.exam.best || 0, score),
      attempts: (state.exam.attempts || 0) + 1,
      lastScore: score,
      passed: score >= 80 || state.exam.passed,
      updatedAt: new Date().toISOString()
    };
    save();
    $('#examResult').textContent = score >= 80 ?
        `Passed with ${score}%! Your certificate is unlocked.` :
        `Score: ${score}%. Review weak chapters and try again.`;
    $('#printCertificate').disabled = !state.exam.passed;
    renderDashboard();
  }
  function printCertificate() {
    if (!state.exam.passed) {
      toast('Pass the final exam first');
      return;
    }
    const name = $('#certificateName').value.trim();
    if (!name) {
      toast('Enter the learner name');
      return;
    }
    const popup = window.open('', '_blank');
    if (!popup) {
      toast('Allow pop-ups to print the certificate');
      return;
    }
    popup.opener = null;
    const date = new Date().toLocaleDateString();
    popup.document.write(
        `<!doctype html><html><head><meta charset="utf-8"><title>React Course Certificate</title><style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Georgia,serif;color:#18181b}.certificate{width:297mm;height:210mm;padding:18mm;background:linear-gradient(135deg,#fff 0 70%,#fef2f2);border:8mm solid #b91c1c;display:grid;place-items:center;text-align:center}.inner{width:100%;height:100%;border:2px solid #b91c1c;display:grid;place-items:center;padding:15mm}.eyebrow{letter-spacing:.25em;color:#b91c1c;font:bold 10pt Arial}.title{font-size:38pt;margin:6mm}.name{font-size:30pt;border-bottom:2px solid #b91c1c;padding:0 15mm 3mm}.course{font-size:19pt}.meta{display:flex;justify-content:space-between;width:80%;margin-top:12mm}.signature{font-weight:bold;color:#991b1b}</style></head><body><main class="certificate"><div class="inner"><div><div class="eyebrow">CERTIFICATE OF COMPLETION</div><h1 class="title">React Developer Course</h1><p>This certifies that</p><div class="name">${
            name.replace(
                /[&<>]/g,
                '')}</div><p class="course">successfully completed The Complete React Developer Course</p><p>Final assessment: ${
            state.exam.best}%</p><div class="meta"><span>${
            date}<br>Date</span><span class="signature">Ayman Aljamal<br>Course Creator</span></div></div></div></main><script>addEventListener('load',()=>print())<\/script></body></html>`);
    popup.document.close();
  }
  function applyLanguage() {
    try {
      const shared = localStorage.getItem(SHARED_LANGUAGE_KEY);
      if (shared === 'ar' || shared === 'en')
        state.preferences.language = shared;
    } catch {
    }
    const ar = state.preferences.language === 'ar';
    document.body.classList.toggle('language-ar', ar);
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.body.dir = ar ? 'rtl' : 'ltr';
    const labels = ar ? {
      continueLearning: 'متابعة',
      openBookmarks: 'المفضلة',
      openNote: 'الملاحظات',
      openDashboard: 'لوحة التقدم',
      openReview: 'المراجعة',
      highlightSelection: 'تظليل',
      openSettings: 'الإعدادات'
    } :
                        {
                          continueLearning: 'Continue',
                          openBookmarks: 'Bookmarks',
                          openNote: 'Notes',
                          openDashboard: 'Dashboard',
                          openReview: 'Review',
                          highlightSelection: 'Highlight',
                          openSettings: 'Preferences'
                        };
    Object.entries(labels).forEach(([id, label]) => {
      const el = $('#' + id), span = el?.querySelector('span');
      if (span) span.textContent = label;
    });
    const languageLabel = $('#languageToggle span');
    if (languageLabel) languageLabel.textContent = ar ? 'EN' : 'AR';
    const navLabels = ar ?
        ['الرئيسية', 'الكورسات', 'المصادر', 'عن الأكاديمية', 'GitHub'] :
        ['Home', 'Courses', 'Sources', 'About', 'GitHub'];
    $$('.react-site-header nav a').forEach((link, index) => {
      if (navLabels[index]) link.textContent = navLabels[index];
    });
    const titles = ar ? {
      notesDialog: 'الملاحظات الشخصية',
      bookmarksDialog: 'المفضلة',
      preferencesDialog: 'إعدادات القراءة',
      dashboardDialog: 'إحصائيات التعلم',
      reviewDialog: 'المراجعة الذكية',
      highlightsDialog: 'النصوص المظللة',
      examDialog: 'الامتحان النهائي',
      commandDialog: 'لوحة الأوامر',
      helpDialog: 'طريقة استخدام المفضلة'
    } :
                        {
                          notesDialog: 'Personal notes',
                          bookmarksDialog: 'Bookmarks',
                          preferencesDialog: 'Reading preferences',
                          dashboardDialog: 'Learning analytics',
                          reviewDialog: 'Smart review queue',
                          highlightsDialog: 'Saved highlights',
                          examDialog: 'Final course exam',
                          commandDialog: 'Command palette',
                          helpDialog: 'How bookmarks work'
                        };
    Object.entries(titles).forEach(([id, title]) => {
      const h = $('.dialog-head h2', $('#' + id));
      if (h) h.textContent = title;
    });
    const search = $('#courseSearch');
    if (search)
      search.placeholder =
          ar ? 'ابحث في الفصول والأقسام…' : 'Search chapters & sections…';
    renderNoteList();
  }
  function findSectionForNode(node) {
    const el = node.nodeType === 1 ? node : node.parentElement;
    const heading = el?.closest('h2[id],h3[id]');
    if (heading) return heading.id;
    let current = el;
    while (current && !current.id) current = current.parentElement;
    const chapter = el?.closest('.chapter');
    const headings = chapter ? $$('h2[id],h3[id]', chapter)
                                   .filter(
                                       h => h.compareDocumentPosition(el) &
                                           Node.DOCUMENT_POSITION_FOLLOWING) :
                               [];
    return headings.at(-1)?.id || chapter?.id || currentId();
  }
  function applyOneHighlight(item) {
    const root = document.getElementById(chapterFor(item.sectionId));
    if (!root ||
        $('.course-highlight[data-highlight-id="' + CSS.escape(item.id) + '"]'))
      return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n =>
          n.parentElement.closest('pre,code,script,style,mark,.section-tools') ?
          NodeFilter.FILTER_REJECT :
          n.nodeValue.includes(item.quote) ? NodeFilter.FILTER_ACCEPT :
                                             NodeFilter.FILTER_SKIP
    });
    const node = walker.nextNode();
    if (!node) return;
    const start = node.nodeValue.indexOf(item.quote),
          range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, start + item.quote.length);
    const mark = document.createElement('mark');
    mark.className = 'course-highlight';
    mark.dataset.highlightId = item.id;
    mark.dataset.color = item.color || 'yellow';
    range.surroundContents(mark);
  }
  function restoreHighlights() {
    state.highlights.forEach(applyOneHighlight);
  }
  function updateHighlightColorUI(color) {
    const select = $('#highlightColor'), colors = {
      yellow: '#fde68a',
      green: '#bbf7d0',
      blue: '#bfdbfe',
      pink: '#fbcfe8',
      purple: '#ddd6fe'
    };
    if (select) select.style.background = colors[color] || colors.yellow;
  }
  function highlightSelection() {
    const selection = getSelection(), quote = selection?.toString().trim();
    if (!quote || quote.length < 2) {
      toast('Select course text first, choose a color, then press Highlight');
      return;
    }
    if (quote.length > 500) {
      toast('Select 500 characters or fewer');
      return;
    }
    const range = selection.getRangeAt(0),
          chapter = (range.commonAncestorContainer.nodeType === 1 ?
                         range.commonAncestorContainer :
                         range.commonAncestorContainer.parentElement)
                        .closest?.('.chapter');
    if (!chapter) {
      toast('Highlight text inside a course chapter');
      return;
    }
    const color = $('#highlightColor')?.value ||
        state.preferences.highlightColor || 'yellow';
    state.preferences.highlightColor = color;
    const item = {
      id: `hl-${Date.now()}`,
      sectionId: findSectionForNode(range.startContainer),
      quote,
      color,
      createdAt: new Date().toISOString()
    };
    state.highlights.push(item);
    save();
    try {
      const mark = document.createElement('mark');
      mark.className = 'course-highlight';
      mark.dataset.highlightId = item.id;
      mark.dataset.color = item.color;
      range.surroundContents(mark);
    } catch {
      applyOneHighlight(item);
    }
    selection.removeAllRanges();
    toast(`${color} highlight saved`);
  }
  function renderHighlights() {
    const list = $('#highlightList');
    if (!list) return;
    list.replaceChildren();
    if (!state.highlights.length) {
      list.innerHTML =
          '<div class="empty-state">Select text, choose a color, and press Highlight.</div>';
      return;
    }
    state.highlights.forEach(item => {
      const row = document.createElement('div');
      row.className = 'highlight-item';
      row.dataset.color = item.color || 'yellow';
      const quote = document.createElement('blockquote');
      quote.textContent = item.quote;
      const meta = document.createElement('small');
      meta.textContent =
          `${titleFor(item.sectionId)} · ${item.color || 'yellow'}`;
      const remove = document.createElement('button');
      remove.className = 'learning-action';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        state.highlights = state.highlights.filter(x => x.id !== item.id);
        save();
        $(`[data-highlight-id="${CSS.escape(item.id)}"]`)
            ?.replaceWith(document.createTextNode(item.quote));
        renderHighlights();
      });
      row.append(quote, meta, remove);
      list.append(row);
    });
  }
  function setupStudyTimer() {
    state.study = state.study || {totalSeconds: 0, chapters: {}};
    let last = Date.now();
    setInterval(() => {
      if (document.hidden) return;
      const now = Date.now(),
            delta = Math.min(15, Math.round((now - last) / 1000));
      last = now;
      if (delta <= 0) return;
      const chapter = chapterFor(currentId());
      state.study.totalSeconds = (state.study.totalSeconds || 0) + delta;
      state.study.chapters[chapter] =
          (state.study.chapters[chapter] || 0) + delta;
      save();
      const chip = $('#studyTimeChip');
      if (chip) chip.textContent = formatDuration(state.study.totalSeconds);
    }, 10000);
    document.addEventListener('visibilitychange', () => {
      last = Date.now();
    });
    const chip = $('#studyTimeChip');
    if (chip) chip.textContent = formatDuration(state.study.totalSeconds || 0);
  }
  function commandItems() {
    return [
      {label: 'Continue Learning', action: () => jump(currentId())}, {
        label: 'Open Dashboard',
        action: () => {
          renderDashboard();
          openDialog($('#dashboardDialog'));
        }
      },
      {label: 'Open Notes', action: () => openNote()}, {
        label: 'Open Bookmarks',
        action: () => {
          renderBookmarks();
          openDialog($('#bookmarksDialog'));
        }
      },
      {
        label: 'Smart Review Queue',
        action: () => {
          renderReview();
          openDialog($('#reviewDialog'));
        }
      },
      {
        label: 'Final Exam',
        action: () => {
          renderExam();
          openDialog($('#examDialog'));
        }
      },
      {
        label: 'Saved Highlights',
        action: () => {
          renderHighlights();
          openDialog($('#highlightsDialog'));
        }
      },
      {label: 'Toggle Dark Mode', action: () => $('#themeToggle').click()},
      {label: 'Reading Preferences', action: () => $('#openSettings').click()},
      ...$$('.chapter')
          .map(ch => ({
                 label: `Go to: ${$('.chapter-title', ch).textContent.trim()}`,
                 action: () => jump(ch.id)
               }))
    ];
  }
  function renderCommands(query = '') {
    const list = $('#commandList');
    if (!list) return;
    list.replaceChildren();
    commandItems()
        .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 14)
        .forEach(item => {
          const button = document.createElement('button');
          button.className = 'command-item';
          button.type = 'button';
          button.innerHTML = `<span>${item.label}</span><kbd>Enter</kbd>`;
          button.addEventListener('click', () => {
            closeDialog($('#commandDialog'));
            item.action();
          });
          list.append(button);
        });
  }
  function openCommandPalette() {
    renderCommands();
    openDialog($('#commandDialog'));
    setTimeout(() => $('#commandInput').focus(), 0);
  }
  function createAdvancedDialogs() {
    dialogShell(
        'dashboardDialog', 'Learning analytics',
        '<div id="dashboardBody"></div>',
        '<button class="learning-action" id="openFinalExam" type="button">Final Exam</button><button class="learning-action primary" data-close-dashboard type="button">Close</button>');
    dialogShell(
        'reviewDialog', 'Smart review queue', '<div id="reviewList"></div>');
    dialogShell(
        'highlightsDialog', 'Saved highlights',
        '<div class="highlight-list" id="highlightList"></div>');
    const exam = dialogShell(
        'examDialog', 'Final course exam',
        '<form id="examForm"></form><div class="exam-result" id="examResult" aria-live="polite"></div><label for="certificateName">Learner name for certificate</label><input class="certificate-name" id="certificateName" placeholder="Your full name" autocomplete="name" aria-label="Learner name for certificate">',
        '<button class="learning-action" id="submitExam" type="button">Submit Exam</button><button class="learning-action primary" id="printCertificate" type="button">Print Certificate PDF</button>');
    const command = dialogShell(
        'commandDialog', 'Command palette',
        '<input class="command-input" id="commandInput" placeholder="Search commands and chapters…" autocomplete="off" aria-label="Search commands and chapters"><div class="command-list" id="commandList" aria-live="polite"></div>');
    dialogShell(
        'helpDialog', 'How bookmarks work',
        '<div class="bookmark-guide"><div class="guide-step"><span class="guide-number">1</span><div><strong>Save the current section</strong><p>Use the Bookmark button in the top toolbar or beside a section heading.</p></div></div><div class="guide-step"><span class="guide-number">2</span><div><strong>Find saved sections</strong><p>Open Bookmarks to see every saved section with its chapter.</p></div></div><div class="guide-step"><span class="guide-number">3</span><div><strong>Return or remove</strong><p>Select a bookmark to jump to it. Use Remove when you no longer need it. Bookmarks survive refresh and are included in progress exports.</p></div></div></div>');
    $('[data-close-dashboard]')
        .addEventListener('click', () => closeDialog($('#dashboardDialog')));
    $('#openFinalExam').addEventListener('click', () => {
      closeDialog($('#dashboardDialog'));
      renderExam();
      openDialog(exam);
    });
    $('#submitExam').addEventListener('click', submitExam);
    $('#printCertificate').addEventListener('click', printCertificate);
    $('#printCertificate').disabled = !state.exam.passed;
    $('#commandInput', command)
        .addEventListener('input', e => renderCommands(e.target.value));
    $('#commandInput', command).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('.command-item', $('#commandList'))?.click();
      }
    });
    const noteActions = $('.dialog-actions', $('#notesDialog'));
    const md = document.createElement('button');
    md.className = 'learning-action';
    md.id = 'exportNotesMarkdown';
    md.type = 'button';
    md.textContent = 'Export Markdown';
    md.addEventListener('click', exportNotesMarkdown);
    noteActions.prepend(md);
  }
  function initAdvanced() {
    $('#openDashboard').addEventListener('click', () => {
      renderDashboard();
      openDialog($('#dashboardDialog'));
    });
    $('#openReview').addEventListener('click', () => {
      renderReview();
      openDialog($('#reviewDialog'));
    });
    $('#highlightColor').value = state.preferences.highlightColor || 'yellow';
    updateHighlightColorUI($('#highlightColor').value);
    $('#highlightColor').addEventListener('change', e => {
      state.preferences.highlightColor = e.target.value;
      updateHighlightColorUI(e.target.value);
      save();
    });
    $('#highlightSelection').addEventListener('click', highlightSelection);
    $('#openHelp')
        .addEventListener('click', () => openDialog($('#helpDialog')));
    $('#importProgress').addEventListener('click', importProgress);
    restoreHighlights();
    setupStudyTimer();
    applyLanguage();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http'))
      navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  function trackReadingPosition() {
    let timer = 0;
    const update = () => {
      timer = 0;
      const candidates =
          $$('.chapter[id],.chapter h2[id],.chapter h3[id]').filter(el => {
            const r = el.getBoundingClientRect();
            return r.top <= innerHeight * .35 && r.bottom > 0;
          });
      const target = candidates.at(-1);
      if (target && target.id && target.id !== state.lastSection) {
        state.lastSection = target.id;
        save();
        syncBookmarkUI();
      }
    };
    addEventListener('scroll', () => {
      if (!timer) timer = requestAnimationFrame(update);
    }, {passive: true});
    addEventListener('hashchange', () => {
      const id = safeId(location.hash.slice(1));
      state.lastSection = id;
      save();
      syncBookmarkUI();
    });
    update();
  }
  function keyboardAccess() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    });
  }
  function completionBridge() {
    document.addEventListener('click', e => {
      if (e.target.closest('[data-complete]')) setTimeout(updateProgress, 0);
    });
  }
  function init() {
    state.lastSection = safeId(state.lastSection);
    try {
      const sharedLanguage = localStorage.getItem(SHARED_LANGUAGE_KEY);
      if (sharedLanguage === 'ar' || sharedLanguage === 'en')
        state.preferences.language = sharedLanguage;
      else
        localStorage.setItem(
            SHARED_LANGUAGE_KEY, state.preferences.language || 'en');
    } catch {
    }
    createDialogs();
    createDock();
    createAdvancedDialogs();
    const enhanceChapter = chapter => {
      if (!chapter) return;
      addSectionTools(chapter);
      addCreativeQuizzes(chapter);
      syncBookmarkUI();
    };
    const enhanceCurrentChapter = () => {
      const id = safeId(location.hash.slice(1));
      enhanceChapter(
          document.getElementById(chapterFor(id))?.closest('.chapter') ||
          $('.chapter'));
    };
    enhanceCurrentChapter();
    addEventListener('hashchange', enhanceCurrentChapter);
    addEventListener(
        'reactchapterprepare', event => enhanceChapter(event.detail.chapter));
    applyPreferences();
    renderBookmarks();
    renderNoteList();
    syncBookmarkUI();
    updateProgress();
    trackReadingPosition();
    keyboardAccess();
    completionBridge();
    initAdvanced();
    const scheme = matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener?.('change', () => {
      if (state.preferences.theme === 'system') applyPreferences();
    });
    const region = document.createElement('div');
    region.id = 'courseToastRegion';
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init, {once: true});
  else
    init();
})();
