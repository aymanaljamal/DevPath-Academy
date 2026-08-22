function improvedHome() {
    const recent =
        Object.entries(state.lastLesson)
            .slice(-3)
            .reverse()
            .map(([courseId, slug]) => {
                const course = courses[courseId],
                    lesson = course &&
                        flatLessons(course).find(item => item.slug === slug);
                return lesson ?
                    `<a href="${routeHref(courseId, slug)}"><strong>${esc(lesson.title)}</strong><small>${esc(course.title)} · ${esc(lesson.moduleTitle)}</small></a>` :
                    ''
            })
            .join('');
    const lessonTotal = catalog.reduce(
        (sum, course) => sum + courseProgress(course).total, 0),
        featured = catalog[0], featuredProgress = courseProgress(featured);
    return `${header()}<main class="devpath-main"><section class="catalog-hero improved-hero"><div class="hero-copy"><span class="hero-kicker">ONE ACADEMY · MANY DEVELOPMENT PATHS</span><h1>Learn by doing.<br><em>Ship what matters.</em></h1><p>Build a practical developer path across frontend, backend, APIs, data, cloud, SQL, and performance, with React refreshed and Next.js now standing beside it as the modern continuation path.</p><div class="hero-proof" aria-label="Academy overview"><span><strong>${catalog.length}</strong> focused paths</span><span><strong>${lessonTotal}</strong> practical lessons</span><span><strong>Next.js</strong> featured</span></div><div class="hero-search"><input id="homeSearchInput" placeholder="Search courses, modules, or lessons…" aria-label="Search all topics"><button id="heroSearch">Search</button></div><div class="hero-actions"><a class="primary-cta" href="#plan-builder">Build my learning plan ${icon(
        'next')}</a><a class="secondary-cta" href="#courses">Explore all paths</a></div></div><div class="path-explorer" style="--active-course:${featured
            .color}"><div class="path-orbit" role="tablist" aria-label="Explore learning paths">${catalog
            .map(
                (course, index) => `<button class="path-node${index === 0 ? ' active' : ''}" data-path-course="${course.id}" role="tab" aria-selected="${index ===
                    0}" title="${esc(course.title)}" style="--node-color:${course.color}">${technologyIcon(course)}<span>${esc(course.shortTitle || course.title)}</span></button>`)
            .join(
                '')}</div><article class="path-preview"><span id="pathPreviewLabel">INTERACTIVE PATH</span><div id="pathPreviewIcon" class="path-preview-icon">${technologyIcon(featured)}</div><h2 id="pathPreviewTitle">${esc(featured.title)}</h2><p id="pathPreviewDescription">${esc(featured
                    .description)}</p><div class="path-preview-stats"><span><strong id="pathPreviewLessons">${featuredProgress
            .total}</strong> lessons</span><span><strong id="pathPreviewProgress">${featuredProgress
            .percent}%</strong> complete</span></div><a id="pathPreviewLink" href="${routeHref(featured.id)}">Explore this path ${icon('next')}</a></article></div></section>${learningPulse()}${homeBuildStudio()}${homePlanBuilder()}${fileDistributionStudio()}<section class="home-insights"><article><span class="eyebrow">RECENTLY VISITED</span><div class="recent-list">${recent ||
        '<p class="empty-state">Open a lesson and it will appear here.</p>'}</div></article><article><span class="eyebrow">POPULAR SKILLS</span><div class="featured-list"><a href="${routeHref('react')}">Modern React architecture</a><a href="${routeHref('nextjs')}">Build with Next.js App Router</a><a href="${routeHref(
            'database-optimization')}">Read query execution plans</a></div></article><article><span class="eyebrow">LEARNING LOOP</span><div class="compact-roadmap"><b>1</b><span>Learn</span><i>→</i><b>2</b><span>Practice</span><i>→</i><b>3</b><span>Ship</span></div></article></section><section class="catalog-section"><div class="section-heading"><div><span class="eyebrow">LEARNING PATHS</span><h2>Choose where to grow next</h2></div><div class="course-filters" role="group" aria-label="Filter courses"><button class="active" data-filter="all">All</button><button data-filter="frontend">Frontend</button><button data-filter="backend">Backend</button><button data-filter="ai">AI &amp; Data</button><button data-filter="projects">Projects</button><button data-filter="foundations">Foundations</button></div></div><div class="course-grid">${catalog.map(courseCard).join('')}</div></section></main>${footer()}`;
}
function fileDistributionStudio() {
    return `<section class="file-studio" aria-labelledby="fileStudioTitle"><div class="section-heading"><div><span class="eyebrow">FILE DISTRIBUTION MAP</span><h2 id="fileStudioTitle">How the academy is organized</h2></div><p>Each course lives in its own file, while shared generation and UI stay in common layers.</p></div><div class="file-grid"><article class="file-stack react-stack"><small>React path</small><strong>Updated separately</strong><p>React keeps its own course file and benefits from the shared rendering engine, so the full 18 chapters stay stable while the presentation stays fresher.</p><div class="file-badges"><span>src/data/courses/react.js</span><span>src/content/chapters/</span><span>src/platform/</span></div></article><article class="file-stack"><small>Course files</small><strong>One path per file</strong><p>Each track is a standalone course definition, which makes adding or editing a path low-risk and easy to review.</p><div class="file-badges"><span>nextjs.js</span><span>spring-boot.js</span><span>python-ai.js</span></div></article><article class="file-stack"><small>Shared layers</small><strong>Reusable logic</strong><p>Common lesson helpers, catalog rendering, and UI interactions live in shared scripts so every path inherits the same platform behavior.</p><div class="file-badges"><span>_lesson-engine.js</span><span>02-home.js</span><span>devpath-platform.css</span></div></article></div></section>`;
}
function homePlanBuilder() {
    return `<section class="plan-builder" id="plan-builder" aria-labelledby="planBuilderTitle"><div class="plan-builder-intro"><span class="eyebrow">PERSONAL ROADMAP BUILDER</span><h2 id="planBuilderTitle">Turn your goal into a clear weekly plan.</h2><p>Choose what you want to build, tell us your starting point, and set a realistic weekly pace. Your roadmap updates instantly.</p><div class="plan-benefits"><span>${icon('check')} Ordered foundations</span><span>${icon('check')} Realistic timeline</span><span>${icon(
        'check')} Direct course paths</span></div></div><form class="plan-controls" id="planBuilderForm"><fieldset><legend>1. What is your goal?</legend><div class="plan-choice-grid"><label><input type="radio" name="planGoal" value="fullstack" checked><span>Full-stack app<small>React, APIs &amp; data</small></span></label><label><input type="radio" name="planGoal" value="backend"><span>Backend APIs<small>Java, Spring &amp; Postman</small></span></label><label><input type="radio" name="planGoal" value="data"><span>Data &amp; AI<small>Python, SQL &amp; optimization</small></span></label><label><input type="radio" name="planGoal" value="database"><span>Database expert<small>SQL &amp; performance</small></span></label></div></fieldset><div class="plan-control-row"><label>2. Your level<select id="planLevel"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>3. Hours per week<span class="plan-hours-output" id="planHoursOutput">6 hours</span><input id="planHours" type="range" min="2" max="20" value="6" step="1"></label></div></form><article class="plan-output" id="planOutput" aria-live="polite"></article></section>`;
}
function setupPlanBuilder() {
    const form = $('#planBuilderForm'), output = $('#planOutput');
    if (!form || !output) return;
    const paths = {
        fullstack: [
            'react', 'java-essentials', 'sql', 'spring-boot', 'postman', 'projects'
        ],
        backend: [
            'java-essentials', 'sql', 'spring-boot', 'postman',
            'database-optimization'
        ],
        data:
            ['python-ai', 'sql', 'database-optimization', 'firebase-google-cloud'],
        database: ['sql', 'database-optimization', 'spring-boot']
    },
        labels = {
            fullstack: 'Full-stack Builder',
            backend: 'Backend API Developer',
            data: 'Data & AI Builder',
            database: 'Database Performance Specialist'
        },
        levelStart = { beginner: 0, intermediate: 1, advanced: 2 };
    const render = () => {
        const goal = new FormData(form).get('planGoal') || 'fullstack',
            level = $('#planLevel').value, hours = Number($('#planHours').value),
            selected = paths[goal].slice(levelStart[level] || 0),
            estimatedHours = selected.reduce(
                (sum, id) =>
                    sum + Math.max(8, courseProgress(courses[id]).total * .75),
                0),
            weeks = Math.max(1, Math.ceil(estimatedHours / hours));
        $('#planHoursOutput').textContent = `${hours} hours`;
        output.innerHTML =
            `<div class="plan-output-head"><div><small>YOUR RECOMMENDED TRACK</small><h3>${labels[goal]}</h3></div><div><strong>${weeks}</strong><span>estimated weeks</span></div></div><div class="plan-route">${selected
                .map((id, index) => {
                    const course = courses[id];
                    return `<a href="${routeHref(id)}" style="--plan-color:${course.color}"><b>${String(index + 1).padStart(
                        2, '0')}</b><i>${technologyIcon(course)}</i><span>${esc(course.shortTitle || course.title)}</span><small>${courseProgress(course).total} lessons</small></a>`
                })
                .join('')}</div><p>At <strong>${hours} hours/week</strong>, focus on one path at a time and build a small project after every two stages.</p>`;
    };
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    render();
}
function learningPulse() {
    const last = Object.entries(state.lastLesson).at(-1),
        course = last && courses[last[0]],
        lesson =
            course && flatLessons(course).find(item => item.slug === last[1]),
        today = (state.activity[dayKey()] || []).length,
        done =
            catalog.reduce((sum, item) => sum + courseProgress(item).done, 0),
        continueHref = lesson ? routeHref(course.id, lesson.slug) :
            routeHref(catalog[0].id);
    return `<section class="learning-pulse" aria-labelledby="learningPulseTitle"><div><span class="eyebrow">YOUR LEARNING PULSE</span><h2 id="learningPulseTitle">Small steps, real momentum.</h2><p>${lesson ?
            `Continue <strong>${esc(lesson.title)}</strong> in ${esc(course.shortTitle || course.title)}.` :
            'Open a lesson and your personal learning pulse will start here.'}</p><div class="pulse-actions"><a class="primary-cta" href="${continueHref}">${lesson ? 'Continue learning' : 'Start a path'} ${icon(
                'next')}</a><button id="smartReviewHome" class="secondary-cta" type="button">Pick my next lesson</button></div></div><div class="pulse-stats"><article><strong>${learningStreak()}</strong><span>day streak</span></article><article><strong>${today}</strong><span>done today</span></article><article><strong>${done}</strong><span>lessons complete</span></article><article><strong>${overall()}%</strong><span>academy progress</span></article></div></section>`;
}
function homeBuildStudio() {
    const ar = state.language === 'ar', copy = ar ? {
        eyebrow: 'مختبر بناء مباشر',
        title: 'غيّر الفكرة وشاهد الواجهة تستجيب.',
        intro: 'جرّب props وstate ثم اختر مشروعًا لترى المسار الذي يحوّله إلى منتج حقيقي.',
        component: 'مكوّن React مباشر',
        cardTitle: 'عنوان البطاقة',
        accent: 'لون المكوّن',
        count: 'قيمة الـstate',
        complete: 'تحديد كمكتمل',
        run: 'تشغيل المكوّن',
        preview: 'معاينة مباشرة',
        status: 'استمر في البناء.',
        projects: 'ماذا ستبني؟',
        explore: 'استكشف مسار المشروع'
    } : {
        eyebrow: 'LIVE BUILD STUDIO',
        title: 'Change the idea. Watch the interface respond.',
        intro: 'Experiment with props and state, then inspect a project path that turns the concept into a real product.',
        component: 'Live React component',
        cardTitle: 'Card title',
        accent: 'Component accent',
        count: 'State value',
        complete: 'Mark completed',
        run: 'Run component',
        preview: 'Live preview',
        status: 'Keep building.',
        projects: 'What will you build?',
        explore: 'Explore project path'
    };
    return `<section class="build-studio" aria-labelledby="buildStudioTitle"><div class="section-heading build-studio-heading"><div><span class="eyebrow">${copy.eyebrow}</span><h2 id="buildStudioTitle">${copy.title}</h2></div><p>${copy.intro}</p></div><div class="build-studio-grid"><article class="component-lab"><div class="studio-label"><span>01</span><strong>${copy.component}</strong><i aria-hidden="true"></i></div><div class="component-workbench"><form class="component-controls" id="componentControls"><label>${copy.cardTitle}<input id="studioCardTitle" value="My learning streak" maxlength="38"></label><fieldset><legend>${copy.accent}</legend><div class="accent-options"><button class="active" data-studio-accent="#149eca" type="button" aria-label="React blue"></button><button data-studio-accent="#b91c1c" type="button" aria-label="Academy red"></button><button data-studio-accent="#7c3aed" type="button" aria-label="Purple"></button><button data-studio-accent="#059669" type="button" aria-label="Green"></button></div></fieldset><div class="state-control"><span>${copy.count}</span><div><button id="studioDecrease" type="button" aria-label="Decrease">−</button><output id="studioCount">3</output><button id="studioIncrease" type="button" aria-label="Increase">+</button></div></div><button class="studio-complete" id="studioComplete" type="button" aria-pressed="false">${copy.complete}</button><button class="studio-run" id="studioRun" type="button">${icon('react')}<span>${copy.run}</span></button></form><div class="component-output"><div class="live-preview-label"><span></span>${copy.preview}</div><div class="studio-preview" id="studioPreview" style="--studio-accent:#149eca"><small>STREAK COMPONENT</small><h3 id="studioPreviewTitle">My learning streak</h3><strong><span id="studioPreviewCount">3</span> days</strong><p id="studioPreviewStatus">${copy.status}</p><div class="studio-meter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div><pre class="studio-code" aria-label="Generated React code"><code id="studioCode"></code></pre></div></div></article><article class="project-showcase"><div class="studio-label"><span>02</span><strong>${copy.projects}</strong><i aria-hidden="true"></i></div><div class="project-tabs" role="tablist" aria-label="Project ideas"><button class="active" data-studio-project="dashboard" role="tab" aria-selected="true">Dashboard</button><button data-studio-project="api" role="tab" aria-selected="false">API</button><button data-studio-project="ai" role="tab" aria-selected="false">AI Lab</button></div><div class="project-visual" id="studioProjectVisual" data-project="dashboard" aria-hidden="true"><div class="project-window-bar"><i></i><i></i><i></i><span>devpath.app</span></div><div class="project-screen"><aside><b></b><b></b><b></b><b></b></aside><main><span></span><div><i></i><i></i><i></i></div><svg viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0 82 C45 72 58 28 105 48 S180 90 220 40 S270 18 300 28"/></svg></main></div></div><div class="project-copy"><small id="studioProjectKicker">FULL-STACK PROJECT</small><h3 id="studioProjectTitle">Learning Analytics Dashboard</h3><p id="studioProjectDescription">Track progress, streaks, notes, and course activity in one responsive workspace.</p><div class="project-stack" id="studioProjectStack"><span>React</span><span>State</span><span>Charts</span><span>Storage</span></div><a id="studioProjectLink" href="${routeHref('projects')}">${copy.explore} ${icon('next')}</a></div></article></div></section>`;
}
function setupBuildStudio() {
    const controls = $('#componentControls'), preview = $('#studioPreview');
    if (!controls || !preview) return;
    let count = 3, complete = false, accent = '#149eca';
    const renderComponent = () => {
        const title = $('#studioCardTitle').value.trim() || 'Untitled component';
        preview.style.setProperty('--studio-accent', accent);
        $('#studioPreviewTitle').textContent = title;
        $('#studioCount').textContent = String(count);
        $('#studioPreviewCount').textContent = String(count);
        preview.classList.toggle('is-complete', complete);
        $('#studioPreviewStatus').textContent = complete ?
            (state.language === 'ar' ? 'مكتمل — الـstate غيّرت الواجهة.' :
                'Completed — state changed the UI.') :
            count >= 7 ?
                (state.language === 'ar' ? 'أسبوع كامل! استمر.' :
                    'A full week. Keep the momentum.') :
                (state.language === 'ar' ? 'استمر في البناء.' : 'Keep building.');
        $('#studioComplete').classList.toggle('active', complete);
        $('#studioComplete').setAttribute('aria-pressed', String(complete));
        $$('.studio-meter i', preview).forEach(
            (bar, index) => bar.classList.toggle('active', index < Math.min(5, count)));
        $('#studioCode').textContent =
`function StreakCard() {
  const [count, setCount] = useState(${count});
  const [complete, setComplete] = useState(${complete});

  return <Card title="${title.replace(/["<>]/g, '')}"
    accent="${accent}" count={count} />;
}`;
    };
    $('#studioCardTitle').addEventListener('input', renderComponent);
    $$('[data-studio-accent]').forEach(button => button.addEventListener('click', () => {
        accent = button.dataset.studioAccent;
        $$('[data-studio-accent]').forEach(item =>
            item.classList.toggle('active', item === button));
        renderComponent();
    }));
    $('#studioDecrease').addEventListener('click', () => {
        count = Math.max(0, count - 1);
        renderComponent();
    });
    $('#studioIncrease').addEventListener('click', () => {
        count = Math.min(30, count + 1);
        renderComponent();
    });
    $('#studioComplete').addEventListener('click', () => {
        complete = !complete;
        renderComponent();
    });
    $('#studioRun').addEventListener('click', () => {
        preview.classList.remove('is-running');
        void preview.offsetWidth;
        preview.classList.add('is-running');
        setTimeout(() => preview.classList.remove('is-running'), 650);
    });
    const projects = {
        dashboard: {
            kicker: 'FULL-STACK PROJECT',
            title: 'Learning Analytics Dashboard',
            description:
                'Track progress, streaks, notes, and course activity in one responsive workspace.',
            stack: ['React', 'State', 'Charts', 'Storage'], course: 'projects'
        },
        api: {
            kicker: 'BACKEND PROJECT', title: 'Production Course API',
            description:
                'Design authenticated endpoints, validation, persistence, testing, and useful error contracts.',
            stack: ['Java', 'Spring Boot', 'SQL', 'Postman'], course: 'spring-boot'
        },
        ai: {
            kicker: 'AI & DATA PROJECT', title: 'Model Comparison Lab',
            description:
                'Train, compare, and explain models with reproducible data and an interactive results view.',
            stack: ['Python', 'PyTorch', 'SQL', 'Metrics'], course: 'python-ai'
        }
    };
    $$('[data-studio-project]').forEach(button => button.addEventListener('click', () => {
        const project = projects[button.dataset.studioProject];
        $$('[data-studio-project]').forEach(item => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-selected', String(active));
        });
        $('#studioProjectVisual').dataset.project = button.dataset.studioProject;
        $('#studioProjectKicker').textContent = project.kicker;
        $('#studioProjectTitle').textContent = project.title;
        $('#studioProjectDescription').textContent = project.description;
        $('#studioProjectStack').replaceChildren(...project.stack.map(name => {
            const chip = document.createElement('span');
            chip.textContent = name;
            return chip;
        }));
        $('#studioProjectLink').href = routeHref(project.course);
    }));
    renderComponent();
}
function homeInteractions() {
    return `<section class="home-playground" aria-labelledby="playgroundTitle"><div class="section-heading"><div><span class="eyebrow">INTERACTIVE LAB</span><h2 id="playgroundTitle">Make your next move</h2></div><p>Three quick tools that turn browsing into a learning decision.</p></div><div class="playground-grid"><article class="path-finder"><div class="playground-icon">${icon(
        'search')}</div><span>PATH FINDER</span><h3>What do you want to build?</h3><div class="finder-options" role="group" aria-label="Choose a learning goal"><button data-find-path="react">Interactive interfaces</button><button data-find-path="spring-boot">Production APIs</button><button data-find-path="java-essentials">Strong programming foundations</button><button data-find-path="projects">Portfolio projects</button></div><div class="finder-result" id="finderResult" aria-live="polite"><small>Choose a goal</small><strong>Your recommended path appears here.</strong></div></article><article class="challenge-machine"><div class="playground-icon">${icon(
            'projects')}</div><span>CHALLENGE DECK</span><h3>Draw a practical challenge</h3><div class="challenge-card" id="challengeCard"><small>CHALLENGE 01</small><strong>Build a lesson progress component that persists after refresh.</strong><p>Focus: state, storage, and accessible controls.</p></div><button class="playground-action" id="nextChallenge" type="button">${icon(
                'next')}<span>Draw another</span></button></article><article class="study-planner"><div class="playground-icon">${icon(
                    'notes')}</div><span>STUDY PLANNER</span><h3>Plan your weekly pace</h3><label for="weeklyHours"><span>Hours per week</span><strong id="weeklyHoursValue">6h</strong></label><input id="weeklyHours" type="range" min="2" max="20" value="6" step="1" aria-label="Hours per week" aria-describedby="weeklyHoursValue plannerWeeks"><div class="planner-result"><strong id="plannerWeeks">10</strong><span>weeks for a focused 60-hour path</span></div><div class="planner-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article></div></section>`;
}
function setupHomeInteractions() {
    const insights = $('.home-insights');
    if (!insights || $('.home-playground')) return;
    insights.insertAdjacentHTML('beforebegin', homeInteractions());
    $$('[data-find-path]')
        .forEach(button => button.addEventListener('click', () => {
            const course = courses[button.dataset.findPath],
                result = $('#finderResult');
            $$('[data-find-path]')
                .forEach(item => item.classList.toggle('active', item === button));
            result.style.setProperty('--result-color', course.color);
            result.innerHTML = `<small>RECOMMENDED PATH</small><strong>${esc(course.title)}</strong><a href="${routeHref(course.id)}">Open course ${icon('next')}</a>`;
        }));
    const challenges = [
        [
            'Build a lesson progress component that persists after refresh.',
            'State, storage, and accessible controls.'
        ],
        [
            'Design an API endpoint with validation and useful error responses.',
            'Contracts, validation, and failure paths.'
        ],
        [
            'Refactor repeated UI into three reusable components.',
            'Composition, props, and maintainability.'
        ],
        [
            'Model a course catalog with filtering and search.',
            'Collections, data flow, and performance.'
        ],
        [
            'Write tests for a bookmark toggle and saved note.',
            'Behavior, edge cases, and confidence.'
        ]
    ];
    let challengeIndex = 0;
    $('#nextChallenge')?.addEventListener('click', () => {
        challengeIndex = (challengeIndex + 1) % challenges.length;
        const card = $('#challengeCard'),
            [title, focus] = challenges[challengeIndex];
        card.classList.remove('swap');
        void card.offsetWidth;
        card.classList.add('swap');
        card.innerHTML = `<small>CHALLENGE ${String(challengeIndex + 1).padStart(2, '0')}</small><strong>${title}</strong><p>Focus: ${focus}</p>`;
    });
    const updatePlanner = () => {
        const hours = Number($('#weeklyHours')?.value || 6),
            weeks = Math.ceil(60 / hours);
        $('#weeklyHoursValue').textContent = `${hours}h`;
        $('#plannerWeeks').textContent = String(weeks);
        $$('.planner-bars i')
            .forEach(
                (bar, index) => bar.style.setProperty(
                    '--bar',
                    `${Math.min(100, (hours / 20 * 100) + (index * 4))}%`));
    };
    $('#weeklyHours')?.addEventListener('input', updatePlanner);
    updatePlanner();
}
function homeJourneyStudio() {
    const visible = catalog.filter(course => course.id !== 'projects');
    return `<section class="journey-studio journey-studio-alt" aria-labelledby="journeyTitle"><div class="section-heading"><div><span class="eyebrow">YOUR LEARNING UNIVERSE</span><h2 id="journeyTitle">Turn a goal into a roadmap</h2></div><p>Explore connected paths and continue from your strongest next step.</p></div><div class="journey-shell journey-shell-alt"><article class="goal-roadmap"><span>01 · CHOOSE A GOAL</span><div class="goal-chips" role="group" aria-label="Learning goal"><button class="active" data-learning-goal="fullstack">Full-stack</button><button data-learning-goal="backend">Backend</button><button data-learning-goal="data">AI &amp; Data</button><button data-learning-goal="cloud">Cloud</button><button data-learning-goal="performance">DB Performance</button></div><div class="goal-path" id="goalPath" aria-live="polite"></div><p id="goalReason"></p></article><article class="course-constellation course-constellation-alt"><span>02 · EXPLORE PROGRESS</span><div class="constellation-summary"><div class="constellation-core"><strong>${overall()}%</strong><span>Academy progress</span></div><div class="constellation-bars">${visible
            .map(course => {
                const p = courseProgress(course);
                return `<button type="button" data-constellation-course="${course.id}" style="--node:${course.color};--progress:${p.percent}%" aria-label="${esc(course.title)}, ${p.percent}% complete"><i>${technologyIcon(course)}</i><b>${esc(course.shortTitle)}</b><small>${p.percent}%</small><progress max="100" value="${p.percent}"></progress></button>`
            })
            .join(
                '')}</div></div><div class="constellation-detail" id="constellationDetail"><small>SELECT A PATH</small><strong>Choose a card to inspect your next move.</strong></div></article></div></section>`;
}
function setupJourneyStudio() {
    const playground = $('.home-playground');
    if (!playground || $('.journey-studio')) return;
    playground.insertAdjacentHTML('afterend', homeJourneyStudio());
    const
        maps = {
            fullstack: [
                'react', 'java-essentials', 'sql', 'spring-boot',
                'firebase-google-cloud', 'projects'
            ],
            backend: [
                'java-essentials', 'sql', 'spring-boot', 'database-optimization',
                'projects'
            ],
            data: [
                'python-ai', 'sql', 'database-optimization', 'firebase-google-cloud',
                'projects'
            ],
            cloud: ['react', 'spring-boot', 'firebase-google-cloud', 'projects'],
            performance: ['sql', 'database-optimization', 'spring-boot', 'projects']
        },
        reasons = {
            fullstack:
                'Frontend, APIs, data, and cloud delivery form one complete product path.',
            backend:
                'Build language foundations before APIs, relational data, and performance.',
            data:
                'Python and SQL combine modeling with reliable storage and cloud deployment.',
            cloud:
                'Applications become cloud-ready after frontend or backend foundations.',
            performance:
                'Query fluency comes before execution plans and production tuning.'
        };
    const render = goal => {
        $('#goalPath').innerHTML =
            maps[goal]
                .map(id => {
                    const course = courses[id], p = courseProgress(course);
                    return `<a href="${routeHref(id)}" style="--path-color:${course.color}"><i>${technologyIcon(course)}</i><span>${esc(course.shortTitle)}</span><small>${p.percent}%</small></a>`
                })
                .join('<b>→</b>');
        $('#goalReason').textContent = reasons[goal];
    };
    $$('[data-learning-goal]')
        .forEach(button => button.addEventListener('click', () => {
            $$('[data-learning-goal]')
                .forEach(item => item.classList.toggle('active', item === button));
            render(button.dataset.learningGoal);
        }));
    render('fullstack');
    $$('[data-constellation-course]')
        .forEach(button => button.addEventListener('click', () => {
            const course = courses[button.dataset.constellationCourse],
                p = courseProgress(course), detail = $('#constellationDetail');
            $$('[data-constellation-course]')
                .forEach(item => item.classList.toggle('active', item === button));
            detail.style.setProperty('--detail-color', course.color);
            detail.innerHTML = `<small>${p.done ? `${p.done} LESSONS COMPLETED` :
                    'READY TO BEGIN'}</small><strong>${esc(course.title)}</strong><p>${esc(course.description)}</p><a href="${routeHref(course.id)}">${p.done ? 'Continue' : 'Explore'} path ${icon('next')}</a>`;
        }));
}
function courseCard(course) {
    const p = courseProgress(course),
        type = course.category ||
            (course.id === 'react' ? 'frontend' :
                course.id === 'projects' ? 'projects' :
                    'backend');
    return `<article class="course-card" data-type="${type}" style="--course:${course.color}"><div class="course-card-top"><span class="tech-icon">${technologyIcon(course)}</span><span class="course-level">${course.level}</span></div><h3>${esc(course.title)}</h3><p>${esc(course.description)}</p><div class="course-meta"><span>${p.total} lessons</span><span>${course
            .duration}</span></div><div class="card-progress"><div><span>Progress</span><strong>${p.percent}%</strong></div><progress max="100" value="${p.percent}">${p.percent}%</progress></div><a href="${routeHref(course.id)}">${p.done ?
            'Continue course' :
            'Explore course'} <span aria-hidden="true">→</span></a></article>`;
}
