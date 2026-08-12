(() => {
  'use strict';
  const STORE_KEY = 'java-spring-academy-v1';
  const PREVIOUS_STORE_KEY = 'devpath-learning-v1';
  const LEGACY_STATE_KEY = 'react-course-dashboard-v2';
  const LEGACY_COMPLETE_KEY = 'react-course-completed-v1';
  const SHARED_THEME_KEY = 'devpath-academy-theme-v1';
  const SHARED_LANGUAGE_KEY = 'devpath-academy-language-v1';
  const courses = window.ACADEMY_COURSES || {};
  const $ = (selector, root=document) => root.querySelector(selector);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon = (name, className='ui-icon') => {
    const paths={
      brand:'<path d="M4 17V11a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v3"/><path d="m12 14 5 .1-.1 4.9"/><circle cx="4" cy="19" r="1.7"/><circle cx="10.5" cy="6" r="1.4"/><circle cx="17" cy="19" r="1.7"/>',
      menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      bookmark:'<path d="M6 4h12v17l-6-4-6 4V4Z"/>',notes:'<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
      github:'<path d="M15 22v-4c.1-1-.4-2-1-2.5 3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.3 4 5.3 5.3 0 0 0 19.1.1S17.9-.3 15 1.6a13.4 13.4 0 0 0-6 0C6.1-.3 4.9.1 4.9.1A5.3 5.3 0 0 0 4.7 4a5.7 5.7 0 0 0-1.5 4.2c0 5.7 3.5 6.9 6.8 7.3-.5.4-.8 1-1 1.6-.2.6-.2 1.3-.1 1.9v3"/><path d="M9 19c-3 .9-3-1.5-4-2"/>',
      moon:'<path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      check:'<path d="m5 12 4 4L19 6"/>',print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',previous:'<path d="m15 18-6-6 6-6"/>',next:'<path d="m9 18 6-6-6-6"/>',
      react:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
      java:'<path d="M7 8h10v6a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z"/><path d="M17 10h1a3 3 0 0 1 0 6h-2M9 3c0 2 2 2 2 4M13 2c0 2 2 2 2 4"/>',
      spring:'<path d="M20 4C11 3 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M6 19c3-5 7-8 12-11"/>',
      projects:'<path d="M4 5h16v14H4z"/><path d="m8 10 3 2-3 2M13 15h4"/>',python:'<path d="M12 3c-5 0-5 2-5 4v3h7v1H6c-3 0-4 2-4 5s2 5 5 5h3v-4c0-3 2-5 5-5h4c2 0 3-2 3-5s-2-4-5-4h-5Z"/><circle cx="15" cy="6" r="1"/><path d="M12 21c5 0 5-2 5-4v-3h-7v-1h8c3 0 4-2 4-5"/><circle cx="9" cy="18" r="1"/>'
    };
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.projects}</svg>`;
  };
  const technologyIcon = course => course.id==='postman'?'<span class="postman-mark" aria-hidden="true">P</span>':icon(course.id==='java-essentials'?'java':course.id==='spring-boot'?'spring':course.id==='react'?'react':course.id==='python-ai'?'python':'projects','tech-svg');
  const applyTheme = () => { document.body.dataset.theme=state.theme||'light';document.documentElement.style.colorScheme=state.theme||'light'; };
  const flatLessons = course => course.modules.flatMap(module => module.lessons.map(([slug,title,meta={}]) => ({id:`${course.id}:${slug}`,slug,title,titleAr:meta.titleAr,moduleId:module.id,moduleTitle:module.title,moduleTitleAr:module.titleAr,courseId:course.id,...meta})));
  const readState = () => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || localStorage.getItem(PREVIOUS_STORE_KEY) || '{}'); } catch {}
    let sharedTheme=null,sharedLanguage=null;try{sharedTheme=localStorage.getItem(SHARED_THEME_KEY);sharedLanguage=localStorage.getItem(SHARED_LANGUAGE_KEY);}catch{}
    const state = {version:1,completed:{},bookmarks:[],notes:{},lastLesson:{},activity:{},theme:sharedTheme||'light',language:'en',...saved};
    if(sharedTheme==='light'||sharedTheme==='dark')state.theme=sharedTheme;
    if(sharedLanguage==='ar'||sharedLanguage==='en')state.language=sharedLanguage;
    else try{localStorage.setItem(SHARED_LANGUAGE_KEY,state.language);}catch{}
    state.completed ||= {}; state.bookmarks ||= []; state.notes ||= {}; state.lastLesson ||= {}; state.activity ||= {};
    return state;
  };
  let state = readState();
  const translations={en:{home:'Home',courses:'Courses',sources:'Sources',about:'About',search:'Search',bookmarks:'Bookmarks',notes:'Notes',night:'Night',light:'Light',overall:'overall',personalNotes:'Personal notes',noteSubject:'Note subject',noteContent:'Note content',saveNote:'Save note',cancel:'Cancel',exportPdf:'Export PDF',exportJson:'Export JSON',allNotes:'All saved notes',noNotes:'No notes saved yet.',complete:'Complete',completed:'Completed',theme:'Theme',dashboard:'Dashboard',review:'Review'},ar:{home:'الرئيسية',courses:'الكورسات',sources:'المصادر',about:'عن الأكاديمية',search:'بحث',bookmarks:'المحفوظات',notes:'الملاحظات',night:'ليلي',light:'فاتح',overall:'الإجمالي',personalNotes:'ملاحظاتي',noteSubject:'عنوان الملاحظة',noteContent:'نص الملاحظة',saveNote:'حفظ الملاحظة',cancel:'إلغاء',exportPdf:'تصدير PDF',exportJson:'تصدير JSON',allNotes:'كل الملاحظات المحفوظة',noNotes:'لا توجد ملاحظات محفوظة بعد.',complete:'إكمال',completed:'مكتمل',theme:'الثيم',dashboard:'لوحة التقدم',review:'المراجعة'}};
  const t=key=>translations[state.language]?.[key]||translations.en[key]||key;
  const applyLanguage=()=>{document.documentElement.lang=state.language||'en';document.body.dir=state.language==='ar'?'rtl':'ltr';document.body.classList.toggle('language-ar',state.language==='ar');};
  applyTheme();
  applyLanguage();
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify({...state,updatedAt:new Date().toISOString()})); } catch {} };
  const migrateLegacy = () => {
    if (state.legacyReactImported) return;
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_STATE_KEY) || 'null');
      const complete = JSON.parse(localStorage.getItem(LEGACY_COMPLETE_KEY) || '[]');
      if (legacy) {
        (legacy.bookmarks || []).forEach(id => { const key=`react:${id}`; if(!state.bookmarks.includes(key)) state.bookmarks.push(key); });
        Object.entries(legacy.notes || {}).forEach(([id,note]) => { state.notes[`react:${id}`] ||= note; });
      }
      if (complete.length) state.completed.react = [...new Set([...(state.completed.react || []), ...complete.map(id => `react:${id}`)])];
      state.legacyReactImported = true; save();
    } catch {}
  };
  migrateLegacy();

  const reactCourse = courses.react;
  const preferredOrder=['react','java-essentials','spring-boot','postman','python-ai','firebase-google-cloud','sql','database-optimization','projects'];
  const catalog=[...preferredOrder.map(id=>courses[id]),...Object.values(courses).filter(course=>!preferredOrder.includes(course.id))].filter(Boolean);
  const legacyCompleted = () => { try { return new Set(JSON.parse(localStorage.getItem(LEGACY_COMPLETE_KEY)||'[]')); } catch { return new Set(); } };
  const courseProgress = course => {
    if (course.id === 'react') {
      let done=[]; try { done=JSON.parse(localStorage.getItem(LEGACY_COMPLETE_KEY)||'[]'); } catch {}
      const academyDone=new Set(state.completed.react||[]),total=flatLessons(course).length;
      const merged=Math.max(done.length,[...academyDone].filter(id=>id.startsWith('react:')).length);
      return {done:merged,total,percent:Math.round(merged/total*100)};
    }
    const lessons=flatLessons(course), done=new Set(state.completed[course.id] || []);
    return {done:lessons.filter(l=>done.has(l.id)).length,total:lessons.length,percent:lessons.length?Math.round(lessons.filter(l=>done.has(l.id)).length/lessons.length*100):0};
  };
  const overall = () => { const values=catalog.map(courseProgress); const done=values.reduce((n,p)=>n+p.done,0),total=values.reduce((n,p)=>n+p.total,0); return Math.round(done/total*100)||0; };
  const dayKey=date=>{const d=date||new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const recordActivity=lessonId=>{const today=dayKey(),items=new Set(state.activity[today]||[]);items.add(lessonId);state.activity[today]=[...items];};
  const learningStreak=()=>{let streak=0,cursor=new Date();while((state.activity[dayKey(cursor)]||[]).length){streak+=1;cursor.setDate(cursor.getDate()-1);}return streak;};
  const route = () => {
    const match=location.hash.match(/^#\/courses\/([^/]+)(?:\/lessons\/([^/]+))?/);
    return match ? {courseId:decodeURIComponent(match[1]),lessonSlug:match[2]&&decodeURIComponent(match[2])} : {courseId:null,lessonSlug:null};
  };
  const routeHref = (course, lesson) => `#/courses/${course}${lesson?`/lessons/${lesson}`:''}`;
  const setActiveMode = active => { document.body.classList.toggle('devpath-mode',active); $('#devpathApp').hidden=!active; $('.page').hidden=active; $('.sidebar').hidden=active; $('.learning-dock')?.toggleAttribute('hidden',active); };
  const toast = message => { let el=$('#devpathToast'); if(!el){el=document.createElement('div');el.id='devpathToast';el.className='devpath-toast';document.body.append(el);} el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800); };

  function notFoundPage(){return `${header()}<main class="devpath-main info-page not-found-page"><a class="back-link" href="#/">← Home</a><span class="eyebrow">404 · PAGE NOT FOUND</span><h1>This learning path does not exist.</h1><p class="info-lead">The address may be outdated or incomplete. Return home, browse the course catalog, or search all lessons.</p><div class="not-found-actions"><a class="primary-cta" href="#/">Back to academy</a><a class="secondary-cta" href="#courses">Browse courses</a><button class="secondary-cta" id="notFoundSearch" type="button">Search lessons</button></div></main>${footer()}`;}

  function header() {
    const noteCount=Object.values(state.notes).filter(note=>(note?.body||note||'').trim?.()).length;
    return `<header class="devpath-header"><a class="devpath-logo" href="#/">${icon('brand','brand-icon')}<span>DevPath Academy</span></a><button class="mobile-menu" id="mobileMenu" type="button" aria-label="Open navigation" aria-expanded="false">${icon('menu')}</button><nav id="mainNav" aria-label="Main navigation"><a href="#/">${t('home')}</a><a href="#courses">${t('courses')}</a><a href="#/sources">${t('sources')}</a><a href="#/about">${t('about')}</a><button id="globalSearchButton" type="button" aria-label="Search lessons">${icon('search')}<span>${t('search')}</span><kbd>Ctrl K</kbd></button><button id="allBookmarksButton" type="button">${icon('bookmark')}<span>${t('bookmarks')}</span></button><button id="allNotesButton" type="button">${icon('notes')}<span>${t('notes')}</span>${noteCount?`<b class="nav-count">${noteCount}</b>`:''}</button><button id="languageButton" type="button" aria-label="Change language">${icon('projects')}<span>${state.language==='ar'?'EN':'AR'}</span></button><button id="themeButton" type="button" aria-label="Toggle night theme">${icon(state.theme==='dark'?'sun':'moon')}<span>${state.theme==='dark'?t('light'):t('night')}</span></button><a href="https://github.com/aymanaljamal" target="_blank" rel="noopener noreferrer">${icon('github')}<span>GitHub</span></a></nav><div class="overall-progress" title="Overall completion"><span>${overall()}%</span><small>${t('overall')}</small></div></header>`;
  }
