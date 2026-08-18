const projectStructures = window.ACADEMY_PROJECT_STRUCTURES || {};
const extensionCatalog = window.ACADEMY_FILE_EXTENSIONS || [];

function treeNodes(root, path = '') {
    const current = path ? `${path}/${root.name}` : root.name;
    return [
        { node: root, path: current },
        ...(root.children || []).flatMap(child => treeNodes(child, current))
    ];
}
function treeIcon(node, open = false) {
    return node.type === 'folder' ?
        `<span class="pf-folder-icon" aria-hidden="true">${open ? '▾' : '▸'}</span>` :
        `<span class="pf-file-icon" aria-hidden="true">${/json|package/i.test(node.name) ? '{ }' :
            /\.jsx|\.tsx|\.js|\.ts|\.java|\.py/.test(node.name) ?
                '&lt;/&gt;' :
                /\.env|config|properties/i.test(node.name) ? '⚙' :
                    '·'}</span>`;
}
function projectTreeNode(node, path = '', depth = 0) {
    const current = path ? `${path}/${node.name}` : node.name,
        id = `tree-${current.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        open = depth < 2;
    if (node.type === 'folder')
        return `<div class="pf-tree-branch" data-depth="${depth}"><button type="button" class="pf-tree-row" data-tree-path="${esc(current)}" data-trealder aria-expanded="${open}" aria-controls="${id}">${treeIcon(node, open)}<span>${esc(node.name)}/</span>${node.generated ? '<small>generated</small>' :
                ''}</button><div class="pf-tree-children${open ? ' is-open' : ''}" id="${id}"><div>${(node.children || [])
                .map(child => projectTreeNode(child, current, depth + 1))
                .join('') ||
            '<span class="pf-empty-folder">Empty in this example</span>'}</div></div></div>`;
    return `<button type="button" class="pf-tree-row pf-file-row" data-tree-path="${esc(current)}">${treeIcon(node)}<span>${esc(node.name)}</span>${node.badge ? `<small>${esc(node.badge)}</small>` : ''}</button>`;
}
function nodeBadges(node) {
    return [node.badge, node.generated ? 'Generated' : null, node.commit]
        .filter(Boolean)
        .slice(0, 3)
        .map(label => `<span>${esc(label)}</span>`)
        .join('');
}
function nodeDetails(node, path, mode = 'beginner') {
    const technical = mode === 'technical';
    const description = technical ?
        `${node.description} This ${node.type} participates in the ${node.layer ||
        node.role} boundary and should keep its dependency direction explicit.` :
        node.description;
    const connections = [
        ...(node.importedBy || []).map(item => `Imported by ${item}`),
        ...(node.imports || []).map(item => `Imports ${item}`)
    ];
    return `<div class="pf-detail-enter"><div class="pf-detail-head"><div><small>${node.type === 'folder' ?
            'FOLDER' :
            'FILE'} · ${esc(node.role)}</small><h2>${esc(node.name)}${node.type === 'folder' ? '/' : ''}</h2></div><div class="pf-badges">${nodeBadges(node)}</div></div><p class="pf-detail-lead">${esc(description)}</p><div class="pf-answer-grid"><article><small>WHY IT EXISTS</small><p>${esc(node.why ||
                `It gives ${node.role
                    .toLowerCase()} a clear, discoverable home instead of mixing unrelated responsibilities.`)}</p></article><article><small>WHO READS IT</small><p>${esc(node.readBy || node.readers ||
                        `${node.type === 'folder' ?
                            'Developers and project tooling' :
                            'The application, build tools, or developers depending on context'}`)}</p></article><article><small>USUAL LOCATION</small><p>${esc(node.location ||
                                path)}</p></article><article><small>CAN I RENAME IT?</small><p>${esc(node.rename)}</p></article><article><small>REQUIRED?</small><p>${node.required ?
            'Yes for this sample architecture.' :
            'Not universally; it depends on the selected architecture and tooling.'}</p></article><article><small>SHOULD GIT TRACK IT?</small><p>${esc(node.commit)}</p></article></div>${connections.length ?
            `<div class="pf-relations"><small>CONNECTIONS</small>${connections.map(item => `<span>${esc(item)}</span>`)
                .join('')}</div>` :
            ''}<div class="pf-delete"><small>CAN I DELETE THIS?</small><p>${esc(node.delete)}</p></div>${node.example ?
            `<div class="pf-file-example"><small>REALISTIC EXAMPLE</small><pre><code class="language-${esc(node.language ||
                'text')}">${esc(node.example)}</code></pre></div>` :
            ''}</div>`;
}
function flowMarkup(items, type) {
    return `<div class="pf-flow-track" data-flow-type="${type}">${items
            .map(
                (item, index) =>
                    `<button type="button" data-flow-index="${index}"><small>${String(index + 1).padStart(
                        2,
                        '0')}</small><strong>${esc(item)}</strong></button>`)
            .join('<i aria-hidden="true">→</i>')}</div>`;
}
function projectStructureLessonSections(course, lesson) {
    const data = projectStructures[lesson.structureId || course.id];
    if (!data)
        return `<section class="lesson-section"><h2>Project structure unavailable</h2><p>This path does not yet define a sample architecture.</p></section>`;
    return `<section class="project-structure-studio" id="lesson-objectives" data-project-structure="${esc(lesson.structureId ||
        course
            .id)}"><div class="pf-principle"><span>PROJECT STRUCTURE</span><h2>${esc(data.title)}</h2><p>${esc(data.subtitle)} This is a common maintainable approach, not the only correct structure. Team size, framework conventions, architecture, and complexity should shape the final design.</p></div><div class="pf-mode" role="group" aria-label="Explanation depth"><button class="active" type="button" data-pf-mode="beginner">Beginner explanation</button><button type="button" data-pf-mode="technical">Technical explanation</button></div><section class="pf-evolution" id="lesson-concepts"><div><small>STRUCTURE EVOLUTION</small><h2>Grow the folders when the problem grows.</h2><p>Do not over-engineer a small project. Add boundaries when real change pressure makes them useful.</p></div><div class="pf-evolution-tabs" role="tablist">${data.evolution
            .map(
                (stage,
                    index) => `<button type="button" role="tab" aria-selected="${index ===
                    0}" class="${index === 0 ? 'active' : ''}" data-evolution="${index}">${esc(stage.label)}</button>`)
            .join('')}</div><div class="pf-evolution-view" aria-live="polite">${data.evolution[0]
            .items.map(item => `<span>${esc(item)}</span>`)
            .join(
                '')}</div></section><section class="pf-workspace" id="lesson-example"><div class="pf-explorer"><div class="pf-panel-bar"><span>PROJECT EXPLORER</span><small>${treeNodes(data.tree)
            .length} items</small></div><div class="pf-tree" role="tree">${projectTreeNode(
                data.tree)}</div></div><article class="pf-details" aria-live="polite"></article></section><section class="pf-architecture" id="lesson-real-world"><div class="pf-section-copy"><small>ANIMATED CONNECTION FLOW</small><h2>How the files collaborate</h2><p>Select a file above to highlight its architectural position.</p></div>${flowMarkup(
                    data.architecture,
                    'architecture')}</section><section class="pf-runtime"><div class="pf-section-copy"><small>HOW THE APP STARTS</small><h2>Follow the runtime one step at a time.</h2></div>${flowMarkup(
                        data.runtime,
                        'runtime')}<div class="pf-flow-controls"><button type="button" data-runtime-action="previous">← Previous</button><button type="button" data-runtime-action="play">▶ Play flow</button><button type="button" data-runtime-action="next">Next →</button><button type="button" data-runtime-action="restart">Restart</button></div><p class="pf-flow-status" aria-live="polite">Ready to trace the startup flow.</p></section><section class="pf-quiz" id="lesson-questions"><small>WHERE SHOULD I PUT THIS?</small><h2>Choose the maintainable boundary.</h2><div class="pf-quiz-list">${data.quiz
            .map(
                (question, index) => `<article data-pf-question="${index}"><p>${esc(question.question)}</p><div>${question.options
                        .map(
                            option => `<button type="button" data-answer="${esc(option)}">${esc(option)}</button>`)
                        .join('')}</div><output></output></article>`)
            .join(
                '')}</div></section><section class="takeaways" id="lesson-summary"><span>PROJECT STRUCTURE PRINCIPLE</span><ul><li>There is no universal folder structure for every team and application.</li><li>Entry points, dependency direction, generated files, secrets, and Git policy should be explicit.</li><li>Start small, then introduce boundaries when they make change safer and easier to understand.</li></ul></section></section>`;
}

function extensionHref(key) {
    return `${routeHref('file-extensions', 'explore-file-types')}/extension/${encodeURIComponent(key)}`;
}
function extensionCard(item) {
    return `<button type="button" class="extension-card" data-extension-key="${esc(item.key)}" data-category="${esc(item.category)}" data-search="${esc(`${item.extension} ${item.fullName} ${item.purpose} ${item.technologies.join(' ')}`
        .toLowerCase())}"><strong>${esc(item.extension)}</strong><span>${esc(item.fullName)}</span><small>${esc(item.category)}</small></button>`;
}
function extensionDetails(item) {
    return `<div class="extension-detail-enter"><div class="extension-detail-title"><div><small>${esc(item.category)} · ${esc(item.fullName)}</small><h2>${esc(item.extension)}</h2></div>${item.badge ? `<span>${esc(item.badge)}</span>` : ''}</div>${item.warning ? `<p class="extension-warning">${esc(item.warning)}</p>` :
            ''}<p class="extension-purpose">${esc(item.purpose)}</p><div class="extension-facts"><article><small>COMMONLY USED BY</small><p>${esc(item.technologies.join(
                ' · '))}</p></article><article><small>WHO READS IT</small><p>${esc(item.readers.join(
                    ' · '))}</p></article><article><small>TYPICAL LOCATION</small><p>${esc(item.locations.join(
                        ' · '))}</p></article><article><small>GIT GUIDANCE</small><p>${esc(item.commit)}</p></article></div><div class="extension-related"><small>RELATED</small>${item.related.map(value => `<span>${esc(value)}</span>`)
            .join(
                '')}</div><div class="pf-file-example"><small>EXAMPLE</small><pre><code class="language-${esc(item.language || 'text')}">${esc(item.example)}</code></pre></div><p class="extension-open-note"><strong>Opening is not executing.</strong> A text editor can display source, while the listed runtime or tool interprets, compiles, builds, or executes it.</p></div>`;
}
function fileExtensionsLanding() {
    const featured =
        ['jsx', 'tsx', 'json', 'env', 'sql', 'java', 'py', 'dockerfile']
            .map(key => extensionCatalog.find(item => item.key === key))
            .filter(Boolean);
    return `<section class="file-extension-landing"><div><span class="eyebrow">FILE EXTENSIONS</span><h2>Every file tells you something.</h2><p>Learn what a filename means, who reads it, where it belongs, what happens if it disappears, and whether Git should track it.</p><a class="primary-cta" href="${routeHref(
        'file-extensions',
        'explore-file-types')}">Open the visual explorer →</a></div><div class="extension-marquee" aria-label="Featured file types">${featured
            .map(
                (item, index) =>
                    `<a href="${extensionHref(item.key)}" style="--delay:${index}"><strong>${esc(item.extension)}</strong><small>${esc(item.category)}</small></a>`)
            .join('')}</div></section>`;
}
const anatomySamples = {
    'App.test.jsx': ['App', 'test', 'jsx'],
    'Button.module.css': ['Button', 'module', 'css'],
    'vite.config.js': ['vite', 'config', 'js'],
    '.env.production': ['.env', 'production', 'environment variant']
};
const comparisons = [
    ['js', 'jsx'], ['ts', 'tsx'], ['json', 'yaml'], ['css', 'scss'],
    ['java', 'class'], ['sql', 'db'], ['env', 'env-example'],
    ['package-json', 'package-lock']
];
function extensionExplorerExperience() {
    const categories =
        ['All', ...new Set(extensionCatalog.map(item => item.category))],
        first = extensionCatalog.find(item => item.key === 'jsx') ||
            extensionCatalog[0];
    return `<section class="extension-explorer" id="lesson-objectives"><div class="extension-explorer-head"><div><span>VISUAL FILE EXTENSION EXPLORER</span><h2>Explore files by purpose, not by guesswork.</h2></div><label><span>${icon(
        'search')}</span><input id="extensionSearch" type="search" placeholder="Search .jsx, Dockerfile, database, React…"></label></div><div class="extension-filters" role="group" aria-label="File categories">${categories
            .map(
                (category, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-extension-filter="${esc(category)}">${esc(category)}</button>`)
            .join(
                '')}</div><div class="extension-workspace"><div class="extension-grid" aria-live="polite">${extensionCatalog.map(extensionCard)
            .join('')}</div><article class="extension-details">${extensionDetails(
                first)}</article></div><p class="extension-result-count" aria-live="polite">${extensionCatalog
            .length} file types</p></section><section class="filename-anatomy" id="lesson-concepts"><div class="pf-section-copy"><small>ANATOMY OF A FILE NAME</small><h2>The final suffix matters, but conventions add meaning.</h2><p>A leading dot can mean “hidden,” middle segments can describe tests or modules, and exact filenames such as Dockerfile need no extension.</p></div><div class="anatomy-picker">${Object.keys(anatomySamples)
            .map(
                (name, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-anatomy-file="${esc(name)}">${esc(name)}</button>`)
            .join(
                '')}</div><div class="anatomy-visual" aria-live="polite"></div></section><section class="file-reader-map" id="lesson-real-world"><div class="pf-section-copy"><small>WHO READS THIS FILE?</small><h2>Files become useful through a reader.</h2></div><div>${[['package.json', 'npm'], ['vite.config.js', 'Vite'],
        ['.gitignore', 'Git'], ['Dockerfile', 'Docker'],
        ['tsconfig.json', 'TypeScript'],
        ['application.properties', 'Spring Boot']]
            .map(
                ([name, reader]) =>
                    `<article><strong>${esc(name)}</strong><i>→</i><span>${esc(reader)}</span></article>`)
            .join(
                '')}</div></section><section class="file-comparison"><div class="pf-section-copy"><small>COMPARISON MODE</small><h2>Similar names, different contracts.</h2></div><div class="comparison-tabs">${comparisons
            .map(
                ([a, b], index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-comparison="${a}:${b}">${esc(extensionCatalog.find(item => item.key === a)
                    ?.extension ||
                    a)} vs ${esc(extensionCatalog.find(item => item.key === b)
                        ?.extension ||
                        b)}</button>`)
            .join(
                '')}</div><div class="comparison-view"></div></section><section class="extension-matching" id="lesson-practice"><div class="pf-section-copy"><small>CLICK-TO-MATCH</small><h2>Match each file to the tool that reads it.</h2></div><div class="matching-board"><div>${['package.json', '.gitignore', 'Dockerfile', 'tsconfig.json',
            'vite.config.js']
            .map(
                value => `<button type="button" data-match-file="${esc(value)}">${esc(value)}</button>`)
            .join('')}</div><div>${['Docker', 'Vite', 'npm', 'Git', 'TypeScript']
            .map(
                value => `<button type="button" data-match-reader="${esc(value)}">${esc(value)}</button>`)
            .join(
                '')}</div></div><output class="matching-status">Select a file, then its reader.</output></section><section class="extension-quiz pf-quiz" id="lesson-questions"><small>KNOWLEDGE CHECK</small><h2>Can you identify the right project file?</h2><div class="pf-quiz-list">${[{
            question: 'Which file usually contains npm dependencies?',
            options:
                ['vite.config.js', 'package.json', 'index.html', '.gitignore'],
            answer: 'package.json',
            explanation:
                'package.json is the npm manifest; the lockfile records exact resolved versions.'
        },
        {
            question:
                'Which file should not normally contain committed production secrets?',
            options: ['README.md', '.env', 'package.json', 'index.html'],
            answer: '.env',
            explanation:
                'Real environment secrets belong outside Git in managed deployment configuration.'
        },
        {
            question: 'Which suffix combines TypeScript and JSX?',
            options: ['.ts', '.jsx', '.tsx', '.js'],
            answer: '.tsx',
            explanation:
                '.tsx enables JSX syntax while preserving TypeScript checks.'
        }]
            .map(
                (question, index) => `<article data-extension-question="${index}" data-answer="${esc(question.answer)}" data-explanation="${esc(question.explanation)}"><p>${esc(question.question)}</p><div>${question.options
                        .map(
                            option => `<button type="button" data-answer="${esc(option)}">${esc(option)}</button>`)
                        .join('')}</div><output></output></article>`)
            .join(
                '')}</div></section><section class="takeaways" id="lesson-summary"><span>READ PROJECTS WITH CONFIDENCE</span><ul><li>An extension is one clue; exact filename, directory, content, and reader complete the meaning.</li><li>Hidden, generated, binary, configuration, and source files have different Git and security expectations.</li><li>Opening a file is not the same as compiling, interpreting, building, or executing it.</li></ul></section>`;
}
function conceptExtra(title) {
    if (/Hidden|\.env|leading dot/i.test(title))
        return `<section class="hidden-file-visual"><strong>.env</strong><span>Leading dot</span><i>→</i><p>Hidden-file convention on Unix-like systems. It is not simply an “env extension.”</p></section>`;
    if (/Git Data|Working Tree/i.test(title))
        return `<section class="pf-architecture">${flowMarkup(
            [
                'Working directory', 'Staging area', 'Local repository',
                'Remote repository'
            ],
            'git')}</section>`;
    if (/Markdown/i.test(title))
        return `<section class="markdown-preview"><pre><code class="language-markdown"># Heading\n## Section\n**Bold** and \`code\`</code></pre><article><h2>Heading</h2><h3>Section</h3><p><strong>Bold</strong> and <code>code</code></p></article></section>`;
    if (/Multiple-Dot|Extensions Deep|jsx vs|tsx vs|module formats/i.test(title))
        return `<section class="filename-anatomy"><div class="anatomy-visual">${Object.entries(anatomySamples)
                .map(
                    ([name,
                        parts]) => `<article><strong>${esc(name)}</strong><span>${parts.map(part => esc(part)).join(' → ')}</span></article>`)
                .join('')}</div></section>`;
    if (/Can You Read a Project/i.test(title)) return finalFileChallenge();
    return '';
}
function finalFileChallenge() {
    const questions = [
        [
            'Which file probably starts the React UI?',
            ['App.jsx', '.env', 'README.md'], 'App.jsx'
        ],
        [
            'Which file stores environment configuration?',
            ['styles.css', '.env', 'vite.config.js'], '.env'
        ],
        [
            'Which file defines npm dependencies?',
            ['package.json', 'api.js', 'README.md'], 'package.json'
        ],
        [
            'Which file configures Vite?',
            ['README.md', 'vite.config.js', '.gitignore'], 'vite.config.js'
        ],
        [
            'Which file documents the project?', ['README.md', '.env', 'App.jsx'],
            'README.md'
        ]
    ];
    return `<section class="final-file-challenge"><div><small>FINAL INTERACTIVE CHALLENGE</small><h2>Can you read a project?</h2><pre><code class="language-text">my-app/\n├── src/\n│   ├── App.jsx\n│   ├── api.js\n│   └── styles.css\n├── .env\n├── package.json\n├── vite.config.js\n└── README.md</code></pre></div><div class="final-question-list">${questions
            .map(
                ([question, options, answer], index) =>
                    `<article data-final-question data-answer="${esc(answer)}"><p>${index + 1}. ${esc(question)}</p>${options
                        .map(
                            option => `<button type="button" data-answer="${esc(option)}">${esc(option)}</button>`)
                        .join('')}</article>`)
            .join('')}<output class="final-score">0 / ${questions.length}</output></div></section>`;
}
function fileExtensionLessonSections(lesson) {
    if (lesson.slug === 'explore-file-types')
        return extensionExplorerExperience();
    const item =
        extensionCatalog.find(entry => entry.key === lesson.extensionKey),
        extra = conceptExtra(lesson.title);
    if (item)
        return `<section class="extension-lesson-card" id="lesson-objectives">${extensionDetails(
            item)}</section><section class="file-reader-map" id="lesson-concepts"><div class="pf-section-copy"><small>FILE FLOW</small><h2>From source to reader</h2></div>${flowMarkup(
                [
                    item.extension, item.readers[0],
                    item.technologies[0] || 'Application', 'Observable result'
                ],
                'file')}</section>${extra}<section class="lesson-section" id="lesson-questions"><span class="section-label">CHECK YOUR UNDERSTANDING</span><h2>Explain the contract</h2><ol><li>Who reads ${esc(item.extension)} and at what stage?</li><li>Is it source, configuration, data, documentation, deployment, or binary output?</li><li>Should this project normally commit it, ignore it, or decide based on contents?</li></ol></section><section class="takeaways" id="lesson-summary"><span>${esc(item.extension)} SUMMARY</span><ul><li>${esc(item.purpose)}</li><li>Typical readers: ${esc(item.readers.join(', '))}.</li><li>Git guidance: ${esc(item.commit)}.</li></ul></section>`;
    return `<section class="lesson-section file-concept-lesson" id="lesson-objectives"><span class="section-label">PROJECT FILE CONCEPT</span><h2>${esc(lesson
        .title)}</h2><p>Read a project file through four signals: its complete filename, its location, its contents, and the tool or runtime that reads it. The final suffix alone is not enough.</p><div class="pf-answer-grid"><article><small>WHAT IS IT?</small><p>A named sequence of bytes interpreted through a format, convention, or exact filename.</p></article><article><small>WHY DOES IT EXIST?</small><p>To preserve source, configuration, data, documentation, generated output, or executable information.</p></article><article><small>CAN IT BE RENAMED?</small><p>Only when every reader, import, command, and convention is updated consistently.</p></article><article><small>SHOULD GIT TRACK IT?</small><p>Track valuable reproducible source and configuration; exclude secrets, caches, dependencies, and replaceable output unless the workflow says otherwise.</p></article></div></section>${extra}<section class="takeaways" id="lesson-summary"><span>KEY IDEA</span><ul><li>Filename conventions communicate intent to both people and tools.</li><li>Text vs binary and source vs generated are independent distinctions.</li><li>Security and reproducibility determine whether a file belongs in Git.</li></ul></section>`;
}

function setupProjectStructure() {
    const studio = $('[data-project-structure]');
    if (!studio) return;
    const data = projectStructures[studio.dataset.projectStructure],
        nodes = treeNodes(data.tree), details = $('.pf-details', studio);
    let mode = 'beginner', runtimeStep = -1, runtimeTimer = 0;
    const selectPath = path => {
        const entry = nodes.find(item => item.path === path) || nodes[0];
        $$('[data-tree-path]', studio).forEach(button => {
            const active = button.dataset.treePath === entry.path;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        details.innerHTML = nodeDetails(entry.node, entry.path, mode);
        window.DevPathCodeBlocks?.enhance(details);
        $$('[data-flow-type="architecture"] button', studio)
            .forEach(
                button => button.classList.toggle(
                    'is-related',
                    entry.path.includes(
                        button.querySelector('strong').textContent.replace(
                            /\/$/, '')) ||
                    entry.node.name ===
                    button.querySelector('strong').textContent));
        const base = routeHref(route().courseId, route().lessonSlug);
        history.replaceState(
            null, '', `${base}/file/${encodeURIComponent(entry.path)}`);
    };
    $$('[data-tree-folder]', studio)
        .forEach(button => button.addEventListener('click', () => {
            const children =
                document.getElementById(button.getAttribute('aria-controls')),
                open = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(open));
            children.classList.toggle('is-open', open);
            button.querySelector('.pf-folder-icon').textContent = open ? '▾' : '▸';
            selectPath(button.dataset.treePath);
        }));
    $$('.pf-file-row', studio)
        .forEach(
            button => button.addEventListener(
                'click', () => selectPath(button.dataset.treePath)));
    $$('[data-pf-mode]', studio)
        .forEach(button => button.addEventListener('click', () => {
            mode = button.dataset.pfMode;
            $$('[data-pf-mode]', studio)
                .forEach(item => item.classList.toggle('active', item === button));
            const active = $('[data-tree-path].active', studio);
            selectPath(active?.dataset.treePath || data.defaultPath);
        }));
    $$('[data-evolution]', studio)
        .forEach(button => button.addEventListener('click', () => {
            const stage = data.evolution[Number(button.dataset.evolution)];
            $$('[data-evolution]', studio).forEach(item => {
                item.classList.toggle('active', item === button);
                item.setAttribute('aria-selected', String(item === button));
            });
            $('.pf-evolution-view', studio).innerHTML =
                stage.items.map(item => `<span>${esc(item)}</span>`).join('');
        }));
    const runtimeButtons = $$('[data-flow-type="runtime"] button', studio),
        status = $('.pf-flow-status', studio);
    const setRuntime = step => {
        runtimeStep = Math.max(-1, Math.min(runtimeButtons.length - 1, step));
        runtimeButtons.forEach(
            (button, index) =>
                button.classList.toggle('active', index === runtimeStep));
        status.textContent = runtimeStep < 0 ?
            'Ready to trace the startup flow.' :
            `Step ${runtimeStep + 1}: ${data.runtime[runtimeStep]}`;
    };
    const stop = () => {
        clearInterval(runtimeTimer);
        runtimeTimer = 0;
        const play = $('[data-runtime-action="play"]', studio);
        if (play) play.textContent = '▶ Play flow';
    };
    $$('[data-runtime-action]', studio)
        .forEach(button => button.addEventListener('click', () => {
            const action = button.dataset.runtimeAction;
            if (action === 'restart') {
                stop();
                setRuntime(-1);
            }
            if (action === 'previous') {
                stop();
                setRuntime(runtimeStep - 1);
            }
            if (action === 'next') {
                stop();
                setRuntime(runtimeStep + 1);
            }
            if (action === 'play') {
                if (runtimeTimer) {
                    stop();
                    return;
                }
                button.textContent = 'Ⅱ Pause';
                setRuntime(
                    runtimeStep < runtimeButtons.length - 1 ? runtimeStep + 1 : 0);
                runtimeTimer = setInterval(() => {
                    if (runtimeStep >= runtimeButtons.length - 1) {
                        stop();
                        return;
                    }
                    setRuntime(runtimeStep + 1);
                }, 750);
            }
        }));
    $$('.pf-quiz-list article', studio)
        .forEach(
            (article, index) =>
                $$('[data-answer]', article)
                    .forEach(button => button.addEventListener('click', () => {
                        const question = data.quiz[index],
                            correct = button.dataset.answer === question.answer;
                        $$('[data-answer]', article).forEach(item => {
                            item.disabled = true;
                            item.classList.toggle(
                                'correct', item.dataset.answer === question.answer);
                            item.classList.toggle(
                                'wrong', item === button && !correct);
                        });
                        $('output', article).textContent =
                            `${correct ? 'Correct.' : 'Not quite.'} ${question.explanation}`;
                    })));
    const deep = decodeURIComponent(
        (location.hash.match(/\/file\/([^?]+)/) || [])[1] || '');
    selectPath(nodes.some(item => item.path === deep) ? deep : data.defaultPath);
}
function renderAnatomy(name) {
    const parts = anatomySamples[name], view = $('.anatomy-visual');
    if (!view || !parts) return;
    view.innerHTML = `<div class="anatomy-name">${parts
            .map(
                (part, index) =>
                    `<span style="--part:${index}">${esc(part)}</span>`)
            .join('<b>.</b>')}</div><div class="anatomy-labels">${parts
            .map(
                (part, index) => `<span><i></i>${index === 0 ? 'Base filename' :
                        index === parts.length - 1 ?
                            'Actual extension or final qualifier' :
                            'Convention / qualifier'}</span>`)
            .join('')}</div>`;
}
function renderComparison(pair) {
    const [a, b] = pair.split(':').map(
        key => extensionCatalog.find(item => item.key === key)),
        view = $('.comparison-view');
    if (!a || !b || !view) return;
    view.innerHTML =
        [a, b]
            .map(
                item => `<article><small>${esc(item.category)}</small><h3>${esc(item.extension)}</h3><strong>${esc(item.fullName)}</strong><p>${esc(item.purpose)}</p><span>Reader: ${esc(item.readers[0])}</span></article>`)
            .join('<i aria-hidden="true">≠</i>');
}
function setupExtensionExplorer() {
    const explorer = $('.extension-explorer');
    if (!explorer) return;
    let filter = 'All';
    const cards = $$('.extension-card', explorer),
        search = $('#extensionSearch', explorer),
        details = $('.extension-details', explorer),
        count = $('.extension-result-count', explorer);
    const apply = () => {
        const query = (search.value || '').trim().toLowerCase();
        let shown = 0;
        cards.forEach(card => {
            const visible = (filter === 'All' || card.dataset.category === filter) &&
                (!query || card.dataset.search.includes(query));
            card.hidden = !visible;
            if (visible) shown += 1;
        });
        count.textContent = `${shown} file type${shown === 1 ? '' : 's'}`;
    };
    const select = key => {
        const item = extensionCatalog.find(entry => entry.key === key);
        if (!item) return;
        cards.forEach(
            card =>
                card.classList.toggle('active', card.dataset.extensionKey === key));
        details.innerHTML = extensionDetails(item);
        window.DevPathCodeBlocks?.enhance(details);
        history.replaceState(null, '', extensionHref(key));
    };
    cards.forEach(
        card => card.addEventListener(
            'click', () => select(card.dataset.extensionKey)));
    search.addEventListener('input', apply);
    $$('[data-extension-filter]', explorer)
        .forEach(button => button.addEventListener('click', () => {
            filter = button.dataset.extensionFilter;
            $$('[data-extension-filter]', explorer)
                .forEach(item => item.classList.toggle('active', item === button));
            apply();
        }));
    $$('[data-anatomy-file]')
        .forEach(button => button.addEventListener('click', () => {
            $$('[data-anatomy-file]')
                .forEach(item => item.classList.toggle('active', item === button));
            renderAnatomy(button.dataset.anatomyFile);
        }));
    $$('[data-comparison]')
        .forEach(button => button.addEventListener('click', () => {
            $$('[data-comparison]')
                .forEach(item => item.classList.toggle('active', item === button));
            renderComparison(button.dataset.comparison);
        }));
    const matchMap = {
        'package.json': 'npm',
        '.gitignore': 'Git',
        'Dockerfile': 'Docker',
        'tsconfig.json': 'TypeScript',
        'vite.config.js': 'Vite'
    };
    let selectedFile = '';
    $$('[data-match-file]')
        .forEach(button => button.addEventListener('click', () => {
            selectedFile = button.dataset.matchFile;
            $$('[data-match-file]')
                .forEach(item => item.classList.toggle('active', item === button));
            $('.matching-status').textContent =
                `Now choose who reads ${selectedFile}.`;
        }));
    $$('[data-match-reader]')
        .forEach(button => button.addEventListener('click', () => {
            if (!selectedFile) {
                $('.matching-status').textContent = 'Select a file first.';
                return;
            }
            const correct = matchMap[selectedFile] === button.dataset.matchReader;
            button.classList.add(correct ? 'correct' : 'wrong');
            $('.matching-status').textContent = correct ?
                `Correct: ${button.dataset.matchReader} reads ${selectedFile}.` :
                `Try again: ${button.dataset.matchReader} does not primarily read ${selectedFile}.`;
            if (correct) {
                $(`[data-match-file="${CSS.escape(selectedFile)}"]`)
                    .classList.add('matched');
                selectedFile = '';
            }
        }));
    $$('[data-extension-question]')
        .forEach(
            article =>
                $$('[data-answer]', article)
                    .forEach(button => button.addEventListener('click', () => {
                        const correct =
                            button.dataset.answer === article.dataset.answer;
                        $$('[data-answer]', article).forEach(item => {
                            item.disabled = true;
                            item.classList.toggle(
                                'correct',
                                item.dataset.answer === article.dataset.answer);
                            item.classList.toggle(
                                'wrong', item === button && !correct);
                        });
                        $('output', article).textContent =
                            `${correct ? 'Correct.' : 'Not quite.'} ${article.dataset.explanation}`;
                    })));
    renderAnatomy('App.test.jsx');
    renderComparison('js:jsx');
    const deep = decodeURIComponent(
        (location.hash.match(/\/extension\/([^/]+)/) || [])[1] || 'jsx');
    select(extensionCatalog.some(item => item.key === deep) ? deep : 'jsx');
}
function setupFinalFileChallenge() {
    const challenge = $('.final-file-challenge');
    if (!challenge) return;
    const questions = $$('[data-final-question]', challenge);
    questions.forEach(
        article =>
            $$('[data-answer]', article)
                .forEach(button => button.addEventListener('click', () => {
                    const correct =
                        button.dataset.answer === article.dataset.answer;
                    $$('[data-answer]', article).forEach(item => {
                        item.disabled = true;
                        item.classList.toggle(
                            'correct',
                            item.dataset.answer === article.dataset.answer);
                        item.classList.toggle('wrong', item === button && !correct);
                    });
                    article.dataset.correct = String(correct);
                    const score =
                        questions.filter(item => item.dataset.correct === 'true')
                            .length;
                    $('.final-score', challenge).textContent =
                        `${score} / ${questions.length}${score === questions.length ?
                            ' · You can now read a modern project.' :
                            ''}`;
                })));
}
function setupProjectFileExperiences() {
    setupProjectStructure();
    setupExtensionExplorer();
    setupFinalFileChallenge();
}
