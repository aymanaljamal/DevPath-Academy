(() => {
  'use strict';

  const isStandaloneReactReader =
    /(?:^|\/)react\.html$/i.test(location.pathname);
  if (isStandaloneReactReader && location.hash.startsWith('#/')) {
    location.replace(new URL('index.html' + location.hash, location.href));
    return;
  }

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const languageAliases = {
    js: 'javascript',
    javascript: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    typescript: 'typescript',
    tsx: 'tsx',
    html: 'xml',
    xml: 'xml',
    css: 'css',
    json: 'json',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    console: 'bash',
    sql: 'sql',
    java: 'java',
    py: 'python',
    python: 'python',
    http: 'http',
    plaintext: 'text',
    plain: 'text',
    text: 'text',
  };

  function rawLanguage(code) {
    const cls = Array.from(code?.classList || [])
      .find(name => name.startsWith('language-'));
    return (cls?.slice('language-'.length) || 'text').toLowerCase();
  }

  function highlightCode(code) {
    if (!window.hljs) return;
    const raw = rawLanguage(code);
    const language = languageAliases[raw] || raw;
    if (language === 'text' || !window.hljs.getLanguage(language)) {
      code.classList.add('hljs', 'language-plain');
      return;
    }
    if (code.dataset.highlighted && code.querySelector('span')) return;
    code.removeAttribute('data-highlighted');
    code.classList.add(`language-${language}`);
    window.hljs.highlightElement(code);
  }

  const deferredBlocks = [];
  let deferredWork = 0;

  function drainDeferredBlocks(deadline) {
    deferredWork = 0;
    let processed = 0;
    while (deferredBlocks.length && processed < 4) {
      if (processed > 0 && deadline && !deadline.didTimeout &&
        deadline.timeRemaining() <= 4)
        break;
      const pre = deferredBlocks.shift();
      delete pre.dataset.codeBlockQueued;
      if (pre.isConnected && !pre.closest('.chapter[hidden]'))
        enhanceCodeBlock(pre);
      processed += 1;
    }
    if (deferredBlocks.length) scheduleDeferredBlocks();
  }

  function scheduleDeferredBlocks() {
    if (deferredWork) return;
    deferredWork = window.requestIdleCallback ?
      window.requestIdleCallback(drainDeferredBlocks, { timeout: 800 }) :
      window.setTimeout(() => drainDeferredBlocks(), 40);
  }

  const codeBlockObserver =
    'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        codeBlockObserver.unobserve(entry.target);
        if (!deferredBlocks.includes(entry.target))
          deferredBlocks.push(entry.target);
        scheduleDeferredBlocks();
      });
    }, { rootMargin: '180px 0px' }) : null;

  function deferCodeBlock(pre) {
    if (pre.dataset.codeBlockQueued) return;
    pre.dataset.codeBlockQueued = 'true';
    if (codeBlockObserver)
      codeBlockObserver.observe(pre);
    else {
      deferredBlocks.push(pre);
      scheduleDeferredBlocks();
    }
  }

  function initHighlighting(root = document) {
    initCodeBlocks(root);
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

    toggle.addEventListener(
      'click', () => setOpen(!sidebar.classList.contains('open')));
    close?.addEventListener('click', () => setOpen(false));
    backdrop?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setOpen(false);
    });
    qsa('.nav-link,.subnav-link')
      .forEach(link => link.addEventListener('click', () => {
        if (window.innerWidth <= 920) setOpen(false);
      }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 920) setOpen(false);
    }, { passive: true });

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
      qs('.nav-expand', group)
        ?.setAttribute('aria-expanded', String(shouldExpand));
    });
  }

  let activeChapterId = '';
  let activeSectionId = '';
  function setActive(chapterId, sectionId = null) {
    const nextSectionId = sectionId || '';
    if (activeChapterId === chapterId && activeSectionId === nextSectionId)
      return;
    activeChapterId = chapterId;
    activeSectionId = nextSectionId;
    qsa('.nav-link')
      .forEach(
        link => link.classList.toggle(
          'active', link.dataset.target === chapterId));
    qsa('.subnav-link')
      .forEach(
        link => link.classList.toggle(
          'active', !!sectionId && link.dataset.section === sectionId));
    expandChapter(chapterId);
    const active = qs('.subnav-link.active') || qs('.nav-link.active');
    const sidebar = qs('#sidebar');
    if (active && sidebar) {
      const top = active.offsetTop;
      const bottom = top + active.offsetHeight;
      if (top < sidebar.scrollTop)
        sidebar.scrollTop = Math.max(0, top - 24);
      else if (bottom > sidebar.scrollTop + sidebar.clientHeight)
        sidebar.scrollTop = bottom - sidebar.clientHeight + 24;
    }
    dispatchEvent(new CustomEvent('reactsectionchange', {
      detail: { chapterId, sectionId: sectionId || chapterId }
    }));
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting)
        .sort(
          (a, b) => Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top))[0];
      if (!visible) return;
      const chapter = visible.target.closest('.chapter');
      if (!chapter) return;
      setActive(chapter.id, visible.target.id);
      if (history.replaceState)
        history.replaceState(null, '', '#' + visible.target.id);
    }, { rootMargin: '-16% 0px -68% 0px', threshold: [0, .01] });
    let observedChapter = null;
    const observeChapter = chapter => {
      if (!chapter || chapter === observedChapter) return;
      sectionObserver.disconnect();
      observedChapter = chapter;
      setActive(chapter.id, null);
      qsa('h2[id]', chapter).forEach(el => sectionObserver.observe(el));
    };
    observeChapter(qs('.chapter:not([hidden])') || qs('.chapter'));
    addEventListener(
      'reactchapterprepare', event => observeChapter(event.detail.chapter));

    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
      const target = document.getElementById(hash);
      const chapter = target?.closest('.chapter');
      if (chapter) {
        observeChapter(chapter);
        setActive(chapter.id, target.matches('h2') ? target.id : null);
      }
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
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initAnimations(root = document) {
    const targets = qsa(
      '.chapter-title-card, .chapter > h2, .chapter-pager, .chapter-completion',
      root);
    // Course content must never depend on an observer to become visible.
    targets.forEach(el => el.classList.remove('reveal-section'));
  }

  function initTables(root = document) {
    qsa('.chapter table, table', root).forEach(table => {
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
    const raw = rawLanguage(code);
    const map = {
      js: 'JavaScript',
      jsx: 'JSX',
      ts: 'TypeScript',
      tsx: 'TSX',
      html: 'HTML',
      xml: 'XML',
      css: 'CSS',
      scss: 'SCSS',
      sass: 'Sass',
      json: 'JSON',
      bash: 'Bash',
      sh: 'Bash',
      shell: 'Shell',
      sql: 'SQL',
      java: 'Java',
      py: 'Python',
      python: 'Python',
      text: 'Plain text',
      plain: 'Plain text',
      http: 'HTTP',
      env: 'Environment',
      mermaid: 'Mermaid',
    };
    return map[raw.toLowerCase()] || raw.replace(/^\w/, s => s.toUpperCase());
  }

  function prepareCodeBlock(pre) {
    const code = pre.querySelector('code');
    if (!code || !pre.isConnected) return null;
    let shell = pre.parentElement?.classList.contains('code-shell') ?
      pre.parentElement :
      null;
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'code-shell';
      if (pre.querySelector('code.language-text'))
        shell.classList.add('diagram-shell');
      pre.parentNode.insertBefore(shell, pre);
      shell.appendChild(pre);
    }
    if (shell.dataset.codeShellReady) return { code, shell };
    let button = qs('.copy-code', shell);
    let toolbar = qs('.code-toolbar', shell);
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';
      shell.insertBefore(toolbar, shell.firstChild);
    }
    const label = document.createElement('span');
    label.className = 'code-language';
    const languageLabel = languageName(code);
    label.textContent = languageLabel;
    pre.dataset.language = languageLabel;
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = 'Copy';
      button.setAttribute('aria-live', 'polite');
      button.addEventListener('click', async () => {
        const value = code.textContent || '';
        try {
          await navigator.clipboard.writeText(value);
          button.textContent = '✓ Copied';
          button.classList.add('copied');
        } catch {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          button.textContent = 'Selected';
        }
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 1800);
      });
    }
    button.setAttribute('aria-label', 'Copy ' + languageLabel + ' example');
    toolbar.replaceChildren(label, button);
    shell.dataset.codeShellReady = 'true';
    return { code, shell };
  }

  function enhanceCodeBlock(pre) {
    const prepared = prepareCodeBlock(pre);
    if (!prepared) return;
    const { code, shell } = prepared;
    if (shell.dataset.codeBlockReady) {
      highlightCode(code);
      return;
    }
    shell.dataset.codeBlockReady = 'true';
    highlightCode(code);
  }

  function initCodeBlocks(root = document) {
    const blocks = root.matches?.('pre') ? [root] : qsa('pre', root);
    blocks.forEach(pre => {
      if (!pre.querySelector('code')) return;
      // Reserve the final block geometry before it reaches the viewport so
      // lazy syntax highlighting cannot shift the document while scrolling.
      prepareCodeBlock(pre);
      if (!pre.parentElement?.dataset.codeBlockReady) deferCodeBlock(pre);
    });
  }

  function enhanceCodeBlocksNow(root = document) {
    const blocks = root.matches?.('pre') ? [root] : qsa('pre', root);
    blocks.forEach(pre => {
      if (pre.querySelector('code')) enhanceCodeBlock(pre);
    });
  }

  const preparedChapters = new WeakSet();
  function prepareChapter(chapter) {
    if (!chapter) return;
    if (preparedChapters.has(chapter)) {
      initCodeBlocks(chapter);
      return;
    }
    preparedChapters.add(chapter);
    initAnimations(chapter);
    initTables(chapter);
    initCodeBlocks(chapter);
    dispatchEvent(new CustomEvent('reactchapterprepare', {
      detail: { chapter }
    }));
  }

  function showChapter(chapter) {
    if (!chapter) return;
    qsa('.chapter').forEach(item => {
      const hidden = item !== chapter;
      item.hidden = hidden;
      item.setAttribute('aria-hidden', String(hidden));
      if (hidden && codeBlockObserver) {
        qsa('[data-code-block-queued]', item).forEach(pre => {
          codeBlockObserver.unobserve(pre);
          delete pre.dataset.codeBlockQueued;
        });
      }
    });
    document.body.dataset.reactChapter = chapter.id;
    prepareChapter(chapter);
  }

  function showTarget(target) {
    const chapter = target?.closest('.chapter');
    if (chapter) showChapter(chapter);
    return chapter;
  }

  function navigateToTarget(target, smooth = true) {
    const currentChapter = qs('.chapter:not([hidden])');
    const targetChapter = target?.closest('.chapter');
    const changesChapter =
      Boolean(currentChapter && targetChapter && currentChapter !== targetChapter);
    showTarget(target);
    requestAnimationFrame(() => target.scrollIntoView({
      behavior: smooth && !changesChapter && !reducedMotion ? 'smooth' : 'auto',
      block: 'start'
    }));
  }

  window.ReactChapterReader = { showChapter, showTarget };

  function observeCodeBlocks() {
    const observer = new MutationObserver(records => {
      const roots = new Set();
      records.forEach(record => {
        const element = record.target.nodeType === Node.ELEMENT_NODE ?
          record.target :
          record.target.parentElement;
        const code =
          element?.matches?.('code') ? element : element?.closest?.('code');
        if (code?.closest('pre') && code.dataset.highlighted &&
          !code.querySelector('span')) {
          code.removeAttribute('data-highlighted');
          roots.add(
            code.closest('.code-shell') || code.closest('pre').parentElement);
        }
        record.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches?.('pre, code') || node.querySelector?.('pre code'))
            roots.add(node);
        });
        record.removedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE || !codeBlockObserver) return;
          if (node.matches?.('pre') && !node.isConnected)
            codeBlockObserver.unobserve(node);
          node.querySelectorAll?.('pre').forEach(
            pre => {
              if (!pre.isConnected) codeBlockObserver.unobserve(pre);
            });
        });
      });
      roots.forEach(root => initCodeBlocks(root));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.DevPathCodeBlocks = {
    // Academy lessons are rendered dynamically and contain only a handful of
    // examples, so color them immediately. The large standalone React reader
    // continues to use the incremental observer path above.
    enhance: enhanceCodeBlocksNow,
    highlight: highlightCode
  };

  function initSearch() {
    const input = qs('#courseSearch');
    const panel = qs('#searchResults');
    if (!input || !panel) return;
    const items = [];
    let indexed = false;
    const buildIndex = () => {
      if (indexed) return;
      indexed = true;
      qsa('.chapter').forEach((chapter, chapterIndex) => {
        const chapterTitle =
          qs('.chapter-title', chapter)?.textContent.trim() ||
          `Chapter ${chapterIndex + 1}`;
        items.push({
          title: chapterTitle,
          chapter: `Chapter ${chapterIndex + 1}`,
          id: chapter.id
        });
        qsa('h2[id],h3[id]', chapter).forEach(h => {
          let body = '';
          let node = h.nextElementSibling;
          while (node && !node.matches('h2,h3')) {
            body += ' ' + (node.textContent || '');
            node = node.nextElementSibling;
          }
          items.push({
            title: h.textContent.trim(),
            chapter: chapterTitle,
            id: h.id,
            body: body.replace(/\s+/g, ' ').trim()
          });
        });
      });
    };
    const render = query => {
      const q = query.trim().toLowerCase();
      panel.replaceChildren();
      if (!q) {
        panel.classList.remove('open');
        return;
      }
      buildIndex();
      const matches = items
        .filter(
          item => (item.title + ' ' + item.chapter + ' ' +
            (item.body || ''))
            .toLowerCase()
            .includes(q))
        .slice(0, 10);
      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'search-empty';
        empty.textContent = 'No matching sections';
        panel.appendChild(empty);
      } else {
        matches.forEach(item => {
          const a = document.createElement('a');
          a.className = 'search-result';
          a.href = '#' + item.id;
          a.setAttribute('role', 'option');
          const strong = document.createElement('strong');
          strong.textContent = item.title;
          const span = document.createElement('span');
          span.textContent = item.chapter;
          a.append(strong, span);
          panel.appendChild(a);
          a.addEventListener('click', () => {
            panel.classList.remove('open');
            input.value = '';
          });
        });
      }
      panel.classList.add('open');
    };
    input.addEventListener('input', e => render(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        panel.classList.remove('open');
        input.blur();
      }
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.course-search-wrap'))
        panel.classList.remove('open');
    });
  }

  function initBackToTop() {
    const button = qs('#backToTop');
    if (!button) return;
    const update = () =>
      button.classList.toggle('visible', window.scrollY > 700);
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener(
      'click',
      () => window.scrollTo(
        { top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
    update();
  }

  function initCompletion() {
    const key = 'react-course-completed-v1';
    let completed = new Set();
    try {
      completed = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch {
    }
    const sync = () => {
      qsa('[data-complete]').forEach(btn => {
        const done = completed.has(btn.dataset.complete);
        btn.classList.toggle('is-complete', done);
        btn.setAttribute('aria-pressed', String(done));
        btn.textContent =
          done ? '✓ Chapter completed' : '✓ Mark chapter complete';
        qs(`.nav-chapter[data-chapter="${CSS.escape(btn.dataset.complete)}"]`)
          ?.classList.toggle('completed', done);
      });
    };
    qsa('[data-complete]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.complete;
      completed.has(id) ? completed.delete(id) : completed.add(id);
      try {
        localStorage.setItem(key, JSON.stringify([...completed]));
      } catch {
      }
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
      navigateToTarget(target);
    });
  }

  function initReactPlayLab() {
    const firstChapter = qs('#chapter-1');
    if (!firstChapter || qs('.react-play-lab')) return;
    const lab = document.createElement('section');
    lab.className = 'react-play-lab';
    lab.setAttribute('aria-labelledby', 'reactPlayLabTitle');
    lab.innerHTML =
      `<div class="react-lab-copy"><span>INTERACTIVE REACT LAB</span><h2 id="reactPlayLabTitle">Make the component respond</h2><p>Change props, update state, and watch React derive the interface. Nothing leaves your browser.</p><div class="react-lab-controls"><label>Card title<input id="reactLabTitle" value="My learning streak" maxlength="36"></label><label>Accent<select id="reactLabAccent"><option value="#149eca">React blue</option><option value="#b91c1c">Academy red</option><option value="#7c3aed">Purple</option><option value="#059669">Green</option></select></label><div class="react-lab-actions"><button id="reactLabDecrease" type="button" aria-label="Decrease count">−</button><output id="reactLabCount" aria-live="polite">1</output><button id="reactLabIncrease" type="button" aria-label="Increase count">+</button></div><button id="reactLabToggle" type="button" aria-pressed="false">Mark completed</button><button id="reactLabReset" type="button">Reset</button></div></div><div class="react-lab-preview" id="reactLabPreview" style="--lab-accent:#149eca"><small>LIVE COMPONENT</small><h3>My learning streak</h3><strong><span id="reactLabPreviewCount">1</span> day</strong><p id="reactLabStatus">Keep the state moving.</p><div><i></i><i></i><i></i><i></i><i></i></div></div><details class="react-lab-code"><summary>Show the React pattern</summary><pre><code class="language-jsx">function StreakCard({ title, accent }) {
  const [count, setCount] = useState(1);
  const [complete, setComplete] = useState(false);
  return &lt;article style={{ '--accent': accent }}&gt;...&lt;/article&gt;;
}</code></pre></details>`;
    const intro = qs('.chapter-intro', firstChapter) ||
      qs('.chapter-title', firstChapter);
    intro?.insertAdjacentElement('afterend', lab);
    let count = 1, complete = false;
    const title = qs('#reactLabTitle'), accent = qs('#reactLabAccent'),
      preview = qs('#reactLabPreview'), countOut = qs('#reactLabCount'),
      previewCount = qs('#reactLabPreviewCount'),
      status = qs('#reactLabStatus'), toggle = qs('#reactLabToggle');
    const render = () => {
      qs('h3', preview).textContent =
        title.value.trim() || 'Untitled component';
      preview.style.setProperty('--lab-accent', accent.value);
      countOut.value = String(count);
      previewCount.textContent = String(count);
      qs('strong', preview).lastChild.textContent =
        count === 1 ? ' day' : ' days';
      preview.classList.toggle('is-complete', complete);
      status.textContent = complete ? 'Completed — state changed the UI.' :
        count >= 7 ? 'A full week! Derived UI unlocked.' :
          'Keep the state moving.';
      toggle.textContent = complete ? 'Completed ✓' : 'Mark completed';
      toggle.setAttribute('aria-pressed', String(complete));
      qsa('.react-lab-preview i', lab)
        .forEach(
          (bar, index) =>
            bar.classList.toggle('active', index < Math.min(5, count)));
    };
    title.addEventListener('input', render);
    accent.addEventListener('change', render);
    qs('#reactLabDecrease').addEventListener('click', () => {
      count = Math.max(0, count - 1);
      render();
    });
    qs('#reactLabIncrease').addEventListener('click', () => {
      count = Math.min(30, count + 1);
      render();
    });
    toggle.addEventListener('click', () => {
      complete = !complete;
      render();
    });
    qs('#reactLabReset').addEventListener('click', () => {
      count = 1;
      complete = false;
      title.value = 'My learning streak';
      accent.value = '#149eca';
      render();
      title.focus();
    });
    render();
  }

  function init() {
    const hashTarget = document.getElementById(
      decodeURIComponent(location.hash.slice(1)));
    const initialChapter = hashTarget?.closest('.chapter') || qs('.chapter');
    initSidebar();
    initProgress();
    showChapter(initialChapter);
    initSearch();
    initBackToTop();
    initCompletion();
    initSmoothAnchors();
    initScrollSpy();
    initReactPlayLab();
    observeCodeBlocks();
    if (hashTarget) requestAnimationFrame(() => {
      hashTarget.scrollIntoView({ block: 'start' });
    });
    addEventListener('hashchange', () => {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)));
      if (!target) return;
      navigateToTarget(target);
    });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else
    init();
})();
