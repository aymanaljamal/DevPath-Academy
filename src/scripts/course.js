(() => {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHighlighting() {
    if (window.hljs) window.hljs.highlightAll();
  }

  function initSidebar() {
    const sidebar = qs('#sidebar');
    const toggle = qs('#sidebarToggle');
    const close = qs('#sidebarClose');
    const backdrop = qs('#sidebarBackdrop');
    if (!sidebar || !toggle) return;

    const setOpen = (open) => {
      sidebar.classList.toggle('open', open);
      backdrop?.classList.toggle('open', open);
      document.body.classList.toggle('sidebar-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      backdrop?.setAttribute('aria-hidden', String(!open));
      if (open && window.innerWidth <= 920) setTimeout(() => close?.focus(), 0);
    };

    toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
    close?.addEventListener('click', () => setOpen(false));
    backdrop?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setOpen(false);
    });
    qsa('.nav-link,.subnav-link').forEach(link => link.addEventListener('click', () => {
      if (window.innerWidth <= 920) setOpen(false);
    }));
    window.addEventListener('resize', () => { if (window.innerWidth > 920) setOpen(false); }, { passive: true });

    qsa('.nav-expand').forEach(button => {
      button.addEventListener('click', () => {
        const group = button.closest('.nav-chapter');
        const expanded = group.classList.toggle('expanded');
        button.setAttribute('aria-expanded', String(expanded));
      });
    });
  }

  function expandChapter(chapterId) {
    qsa('.nav-chapter').forEach(group => {
      const shouldExpand = group.dataset.chapter === chapterId;
      group.classList.toggle('expanded', shouldExpand);
      qs('.nav-expand', group)?.setAttribute('aria-expanded', String(shouldExpand));
    });
  }

  function setActive(chapterId, sectionId = null) {
    qsa('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.target === chapterId));
    qsa('.subnav-link').forEach(link => link.classList.toggle('active', !!sectionId && link.dataset.section === sectionId));
    expandChapter(chapterId);
    const active = qs('.subnav-link.active') || qs('.nav-link.active');
    active?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const chapterEls = qsa('.chapter');
    const sectionEls = qsa('.chapter h2[id]');
    let activeChapter = null;

    const chapterObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      activeChapter = visible.target.id;
      setActive(activeChapter, null);
    }, { rootMargin: '-12% 0px -72% 0px', threshold: [0,.05,.2] });
    chapterEls.forEach(el => chapterObserver.observe(el));

    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top))[0];
      if (!visible) return;
      const chapter = visible.target.closest('.chapter');
      if (!chapter) return;
      activeChapter = chapter.id;
      setActive(chapter.id, visible.target.id);
      if (history.replaceState) history.replaceState(null, '', '#' + visible.target.id);
    }, { rootMargin: '-16% 0px -68% 0px', threshold: [0,.01] });
    sectionEls.forEach(el => sectionObserver.observe(el));

    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
      const target = document.getElementById(hash);
      const chapter = target?.closest('.chapter');
      if (chapter) setActive(chapter.id, target.matches('h2') ? target.id : null);
    }
  }

  function initProgress() {
    const bar = qs('#readingProgressBar');
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      if (bar) bar.style.width = pct.toFixed(2) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initAnimations() {
    const targets = qsa('.chapter-title-card, .chapter > h2, .chapter-pager, .chapter-completion');
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    targets.forEach(el => el.classList.add('reveal-section'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => observer.observe(el));
  }

  function initTables() {
    qsa('.chapter table').forEach(table => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable table');
      wrapper.tabIndex = 0;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function languageName(code) {
    const cls = Array.from(code?.classList || []).find(c => c.startsWith('language-'));
    return cls ? cls.replace('language-', '') : 'code';
  }

  function initCodeCopy() {
    qsa('.chapter pre').forEach(pre => {
      let shell = pre.parentElement?.classList.contains('code-shell') ? pre.parentElement : null;
      if (!shell) {
        shell = document.createElement('div');
        shell.className = 'code-shell';
        if (pre.querySelector('code.language-text')) shell.classList.add('diagram-shell');
        pre.parentNode.insertBefore(shell, pre);
        shell.appendChild(pre);
      }
      let button = qs('.copy-code', shell);
      if (button) button.remove();
      let toolbar = qs('.code-toolbar', shell);
      if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';
        shell.insertBefore(toolbar, shell.firstChild);
      }
      const code = pre.querySelector('code');
      const label = document.createElement('span');
      label.textContent = languageName(code);
      toolbar.replaceChildren(label);
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy ' + label.textContent + ' example');
      toolbar.appendChild(button);
      button.addEventListener('click', async () => {
        const value = code?.innerText ?? pre.innerText;
        try {
          await navigator.clipboard.writeText(value);
          button.textContent = 'Copied!';
          button.classList.add('copied');
        } catch {
          const range = document.createRange(); range.selectNodeContents(code || pre);
          const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
          button.textContent = 'Selected';
        }
        setTimeout(() => { button.textContent = 'Copy'; button.classList.remove('copied'); }, 1500);
      });
    });
  }

  function initSearch() {
    const input = qs('#courseSearch');
    const panel = qs('#searchResults');
    if (!input || !panel) return;
    const items = [];
    qsa('.chapter').forEach((chapter, chapterIndex) => {
      const chapterTitle = qs('.chapter-title', chapter)?.textContent.trim() || `Chapter ${chapterIndex+1}`;
      items.push({ title: chapterTitle, chapter: `Chapter ${chapterIndex+1}`, id: chapter.id });
      qsa('h2[id],h3[id]', chapter).forEach(h => {
        let body = '';
        let node = h.nextElementSibling;
        while (node && !node.matches('h2,h3')) {
          body += ' ' + (node.textContent || '');
          node = node.nextElementSibling;
        }
        items.push({ title: h.textContent.trim(), chapter: chapterTitle, id: h.id, body: body.replace(/\s+/g, ' ').trim() });
      });
    });
    const render = query => {
      const q = query.trim().toLowerCase();
      panel.replaceChildren();
      if (!q) { panel.classList.remove('open'); return; }
      const matches = items.filter(item => (item.title + ' ' + item.chapter + ' ' + (item.body || '')).toLowerCase().includes(q)).slice(0, 10);
      if (!matches.length) {
        const empty = document.createElement('div'); empty.className = 'search-empty'; empty.textContent = 'No matching sections'; panel.appendChild(empty);
      } else {
        matches.forEach(item => {
          const a = document.createElement('a'); a.className = 'search-result'; a.href = '#' + item.id; a.setAttribute('role','option');
          const strong = document.createElement('strong'); strong.textContent = item.title;
          const span = document.createElement('span'); span.textContent = item.chapter;
          a.append(strong, span); panel.appendChild(a);
          a.addEventListener('click', () => { panel.classList.remove('open'); input.value = ''; });
        });
      }
      panel.classList.add('open');
    };
    input.addEventListener('input', e => render(e.target.value));
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { panel.classList.remove('open'); input.blur(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.course-search-wrap')) panel.classList.remove('open'); });
  }

  function initBackToTop() {
    const button = qs('#backToTop');
    if (!button) return;
    const update = () => button.classList.toggle('visible', window.scrollY > 700);
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
    update();
  }

  function initCompletion() {
    const key = 'react-course-completed-v1';
    let completed = new Set();
    try { completed = new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch {}
    const sync = () => {
      qsa('[data-complete]').forEach(btn => {
        const done = completed.has(btn.dataset.complete);
        btn.classList.toggle('is-complete', done);
        btn.setAttribute('aria-pressed', String(done));
        btn.textContent = done ? '✓ Chapter completed' : '✓ Mark chapter complete';
        qs(`.nav-chapter[data-chapter="${CSS.escape(btn.dataset.complete)}"]`)?.classList.toggle('completed', done);
      });
    };
    qsa('[data-complete]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.complete;
      completed.has(id) ? completed.delete(id) : completed.add(id);
      try { localStorage.setItem(key, JSON.stringify([...completed])); } catch {}
      sync();
    }));
    sync();
  }

  function initSmoothAnchors() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function initReactPlayLab() {
    const firstChapter = qs('#chapter-1');
    if (!firstChapter || qs('.react-play-lab')) return;
    const lab = document.createElement('section');
    lab.className = 'react-play-lab';
    lab.setAttribute('aria-labelledby', 'reactPlayLabTitle');
    lab.innerHTML = `<div class="react-lab-copy"><span>INTERACTIVE REACT LAB</span><h2 id="reactPlayLabTitle">Make the component respond</h2><p>Change props, update state, and watch React derive the interface. Nothing leaves your browser.</p><div class="react-lab-controls"><label>Card title<input id="reactLabTitle" value="My learning streak" maxlength="36"></label><label>Accent<select id="reactLabAccent"><option value="#149eca">React blue</option><option value="#b91c1c">Academy red</option><option value="#7c3aed">Purple</option><option value="#059669">Green</option></select></label><div class="react-lab-actions"><button id="reactLabDecrease" type="button" aria-label="Decrease count">−</button><output id="reactLabCount" aria-live="polite">1</output><button id="reactLabIncrease" type="button" aria-label="Increase count">+</button></div><button id="reactLabToggle" type="button" aria-pressed="false">Mark completed</button><button id="reactLabReset" type="button">Reset</button></div></div><div class="react-lab-preview" id="reactLabPreview" style="--lab-accent:#149eca"><small>LIVE COMPONENT</small><h3>My learning streak</h3><strong><span id="reactLabPreviewCount">1</span> day</strong><p id="reactLabStatus">Keep the state moving.</p><div><i></i><i></i><i></i><i></i><i></i></div></div><details class="react-lab-code"><summary>Show the React pattern</summary><pre><code class="language-jsx">function StreakCard({ title, accent }) {
  const [count, setCount] = useState(1);
  const [complete, setComplete] = useState(false);
  return &lt;article style={{ '--accent': accent }}&gt;...&lt;/article&gt;;
}</code></pre></details>`;
    const intro = qs('.chapter-intro', firstChapter) || qs('.chapter-title', firstChapter);
    intro?.insertAdjacentElement('afterend', lab);
    let count = 1, complete = false;
    const title = qs('#reactLabTitle'), accent = qs('#reactLabAccent'), preview = qs('#reactLabPreview'), countOut = qs('#reactLabCount'), previewCount = qs('#reactLabPreviewCount'), status = qs('#reactLabStatus'), toggle = qs('#reactLabToggle');
    const render = () => {
      qs('h3', preview).textContent = title.value.trim() || 'Untitled component';
      preview.style.setProperty('--lab-accent', accent.value);
      countOut.value = String(count); previewCount.textContent = String(count);
      qs('strong', preview).lastChild.textContent = count === 1 ? ' day' : ' days';
      preview.classList.toggle('is-complete', complete);
      status.textContent = complete ? 'Completed — state changed the UI.' : count >= 7 ? 'A full week! Derived UI unlocked.' : 'Keep the state moving.';
      toggle.textContent = complete ? 'Completed ✓' : 'Mark completed'; toggle.setAttribute('aria-pressed', String(complete));
      qsa('.react-lab-preview i', lab).forEach((bar,index)=>bar.classList.toggle('active',index < Math.min(5,count)));
    };
    title.addEventListener('input',render); accent.addEventListener('change',render);
    qs('#reactLabDecrease').addEventListener('click',()=>{count=Math.max(0,count-1);render();});
    qs('#reactLabIncrease').addEventListener('click',()=>{count=Math.min(30,count+1);render();});
    toggle.addEventListener('click',()=>{complete=!complete;render();});
    qs('#reactLabReset').addEventListener('click',()=>{count=1;complete=false;title.value='My learning streak';accent.value='#149eca';render();title.focus();});
    render();
  }

  function init() {
    initHighlighting(); initSidebar(); initProgress(); initAnimations(); initTables();
    initCodeCopy(); initSearch(); initBackToTop(); initCompletion(); initSmoothAnchors(); initScrollSpy(); initReactPlayLab();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
