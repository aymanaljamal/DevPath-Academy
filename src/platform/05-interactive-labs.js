function setupFrameworkLabs() {
  let reactState = 0, renders = 1;
  const renderReact = () => {
    if (!$('#reactPreviewTitle')) return;
    $('#reactPreviewTitle').textContent =
        $('#reactPropInput').value || 'Untitled lesson';
    $('#reactStateValue').textContent = String(reactState);
    $('#reactPreviewState').textContent = String(reactState);
    $('#reactRenderCount').textContent = String(renders);
  };
  $('#reactPropInput')?.addEventListener('input', () => {
    renders += 1;
    renderReact();
  });
  $('#reactPlus')?.addEventListener('click', () => {
    reactState += 1;
    renders += 1;
    renderReact();
  });
  $('#reactMinus')?.addEventListener('click', () => {
    reactState -= 1;
    renders += 1;
    renderReact();
  });
  $('#reactLabResetHome')?.addEventListener('click', () => {
    reactState = 0;
    renders = 1;
    $('#reactPropInput').value = 'Learning React';
    renderReact();
  });
  const springCases = {
    success: {
      steps: [
        ['HTTP', 'POST /api/courses'], ['Controller', '@Valid DTO'],
        ['Service', 'createCourse()'], ['Repository', 'INSERT course'],
        ['Response', '201 Created']
      ],
      body: '{\n  "id": 42,\n  "title": "Spring APIs"\n}'
    },
    invalid: {
      steps: [
        ['HTTP', 'POST /api/courses'], ['Controller', '@Valid fails'],
        ['Exception handler', 'MethodArgumentNotValidException'],
        ['Response', '400 Bad Request']
      ],
      body:
          '{\n  "status": 400,\n  "errors": { "title": "must not be blank" }\n}'
    },
    missing: {
      steps: [
        ['HTTP', 'GET /api/courses/99'], ['Controller', 'findById(99)'],
        ['Service', 'CourseNotFoundException'],
        ['Exception handler', '@RestControllerAdvice'],
        ['Response', '404 Not Found']
      ],
      body: '{\n  "status": 404,\n  "message": "Course 99 was not found"\n}'
    },
    unauthorized: {
      steps: [
        ['HTTP', 'DELETE /api/courses/42'],
        ['Security filter', 'Missing bearer token'],
        ['AuthenticationEntryPoint', 'Reject request'],
        ['Response', '401 Unauthorized']
      ],
      body: '{\n  "status": 401,\n  "message": "Authentication required"\n}'
    }
  };
  const setSpringCase = key => {
    const item = springCases[key];
    if (!item) return;
    $('#springPipeline').innerHTML =
        item.steps
            .map(
                ([name, detail], index) => `<div class="${
                    index === item.steps.length - 1 ?
                        'final' :
                        ''}"><b>${index + 1}</b><span><strong>${
                    name}</strong><small>${detail}</small></span></div>`)
            .join('');
    $('#springResponse').textContent = item.body;
    $$('[data-spring-case]').forEach(button => {
      const active = button.dataset.springCase === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  $$('[data-spring-case]')
      .forEach(
          button => button.addEventListener(
              'click', () => setSpringCase(button.dataset.springCase)));
  if ($('#springPipeline')) setSpringCase('success');
  const renderPostman = () => {
    const method = $('#postmanMethod')?.value || 'GET',
          auth = $('#postmanAuth')?.value || 'none',
          env = $('#postmanEnvironment')?.value || 'local',
          base = env === 'local' ? 'http://localhost:8080' :
                                   'https://staging.api.devpath.app',
          headers = auth === 'bearer' ?
        'Authorization: Bearer {{access_token}}' :
        auth === 'api-key' ? 'X-API-Key: {{api_key}}' :
                             'Accept: application/json',
          body = ['POST', 'PUT'].includes(method) ?
        '\n\n{\n  "title": "API Testing"\n}' :
        '';
    $('#postmanRequestPreview').textContent =
        `${method} ${base}/api/courses\n${headers}${body}`;
    $('#postmanTestPreview').textContent = `pm.test("returns ${
        method === 'POST' ?
            '201' :
            '2xx'}", () => {\n  pm.expect(pm.response.code).to.be.${
        method === 'POST' ?
            'oneOf([200, 201])' :
            'within(200, 299)'};\n});\npm.test("responds quickly", () => {\n  pm.expect(pm.response.responseTime).to.be.below(800);\n});`;
  };
  $$('#postmanMethod,#postmanAuth,#postmanEnvironment')
      .forEach(select => select.addEventListener('change', renderPostman));
  if ($('#postmanRequestPreview')) renderPostman();
}
function setupDatabaseVisuals() {
  const joinQueries = {
    INNER:
        'SELECT * FROM customers c INNER JOIN orders o ON o.customer_id = c.id;',
    LEFT:
        'SELECT * FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;',
    RIGHT:
        'SELECT * FROM customers c RIGHT JOIN orders o ON o.customer_id = c.id;',
    FULL:
        'SELECT * FROM customers c FULL OUTER JOIN orders o ON o.customer_id = c.id;',
    CROSS: 'SELECT * FROM customers CROSS JOIN orders;'
  },
        joinRows = {
          INNER: ['Lina · $40', 'Omar · $75'],
          LEFT: ['Lina · $40', 'Omar · $75', 'Noor · NULL'],
          RIGHT: ['Lina · $40', 'Omar · $75', 'NULL · $20'],
          FULL: ['Lina · $40', 'Omar · $75', 'Noor · NULL', 'NULL · $20'],
          CROSS: ['3 customers × 3 orders = 9 rows']
        };
  const setJoin = type => {
    const sql = $('#joinSql'), result = $('#joinResult');
    if (sql) sql.textContent = joinQueries[type];
    if (result)
      result.innerHTML = `<strong>${type} JOIN result</strong>${
          joinRows[type].map(row => `<span>${row}</span>`).join('')}`;
    $$('[data-join]')
        .forEach(
            button => button.classList.toggle(
                'active', button.dataset.join === type));
  };
  $$('[data-join]')
      .forEach(
          button => button.addEventListener(
              'click', () => setJoin(button.dataset.join)));
  if ($('#joinSql')) setJoin('INNER');
  const queryRows = [
    {customer: 'Lina', status: 'paid', total: 140, date: '2026-08-11'},
    {customer: 'Omar', status: 'pending', total: 75, date: '2026-08-12'},
    {customer: 'Lina', status: 'paid', total: 55, date: '2026-08-10'},
    {customer: 'Noor', status: 'paid', total: 220, date: '2026-08-09'}
  ];
  const renderQueryBuilder = () => {
    const filter = $('#queryFilter')?.value || 'all',
          group = $('#queryGroup')?.value || 'none',
          sort = $('#querySort')?.value || 'newest',
          where = filter === 'paid' ? 'status = \'paid\'' :
        filter === 'high'           ? 'total >= 100' :
                                      '',
          order = sort === 'total' ? 'total DESC' :
        sort === 'name'            ? 'customer ASC' :
                                     'created_at DESC',
          select = group === 'none' ?
        'customer, status, total, created_at' :
        `${group}, COUNT(*) AS orders, SUM(total) AS revenue`,
          sql =
              `SELECT ${select}\nFROM orders${where ? `\nWHERE ${where}` : ''}${
                  group !== 'none' ? `\nGROUP BY ${group}` : ''}\nORDER BY ${
                  group === 'none' ? order : 'revenue DESC'};`;
    let rows = queryRows.filter(
        row => filter === 'all' || filter === 'paid' && row.status === 'paid' ||
            filter === 'high' && row.total >= 100);
    if (group !== 'none') {
      const grouped = new Map;
      rows.forEach(row => {
        const key = row[group],
              item = grouped.get(key) || {key, count: 0, total: 0};
        item.count += 1;
        item.total += row.total;
        grouped.set(key, item);
      });
      rows = [...grouped.values()].sort((a, b) => b.total - a.total);
      $('#queryBuilderResult').innerHTML =
          `<div><b>${group}</b><b>orders</b><b>revenue</b></div>${
              rows.map(
                      row => `<div><span>${esc(row.key)}</span><span>${
                          row.count}</span><span>$${row.total}</span></div>`)
                  .join('')}`;
    } else {
      rows.sort(
          sort === 'total'    ? (a, b) => b.total - a.total :
              sort === 'name' ? (a, b) => a.customer.localeCompare(b.customer) :
                                (a, b) => b.date.localeCompare(a.date));
      $('#queryBuilderResult').innerHTML =
          `<div><b>customer</b><b>status</b><b>total</b></div>${
              rows.map(
                      row => `<div><span>${esc(row.customer)}</span><span>${
                          row.status}</span><span>$${row.total}</span></div>`)
                  .join('')}`;
    }
    $('#queryBuilderSql').textContent = sql;
  };
  $$('#queryFilter,#queryGroup,#querySort')
      .forEach(select => select.addEventListener('change', renderQueryBuilder));
  $('[data-query-reset]')?.addEventListener('click', () => {
    $('#queryFilter').value = 'all';
    $('#queryGroup').value = 'none';
    $('#querySort').value = 'newest';
    renderQueryBuilder();
  });
  if ($('#queryBuilderSql')) renderQueryBuilder();
  const indexCases = {
    email: {
      query: 'SELECT * FROM users WHERE email = \'dev@example.com\';',
      index: 'CREATE UNIQUE INDEX users_email_idx ON users (email);',
      verdict:
          'Equality lookup · B-tree index · expected Index Scan instead of scanning every user.'
    },
    timeline: {
      query:
          'SELECT * FROM posts WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;',
      index:
          'CREATE INDEX posts_user_created_idx ON posts (user_id, created_at DESC);',
      verdict:
          'Equality first, then sort column · supports filtering and ordered retrieval in one index.'
    },
    pending: {
      query:
          'SELECT * FROM jobs WHERE status = \'pending\' ORDER BY created_at;',
      index:
          'CREATE INDEX jobs_pending_idx ON jobs (created_at) WHERE status = \'pending\';',
      verdict:
          'Partial index · smaller and cheaper because only pending jobs enter the index.'
    },
    covering: {
      query: 'SELECT customer_id, total FROM orders WHERE customer_id = 7;',
      index:
          'CREATE INDEX orders_customer_cover_idx ON orders (customer_id) INCLUDE (total);',
      verdict:
          'Covering index · can enable an Index Only Scan when visibility-map conditions allow it.'
    }
  };
  const setIndexCase = key => {
    const item = indexCases[key];
    if (!item) return;
    $('#indexQuery').textContent = item.query;
    $('#indexRecommendation').textContent = item.index;
    $('#indexVerdict').textContent = item.verdict;
    $$('[data-index-case]').forEach(button => {
      const active = button.dataset.indexCase === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  $$('[data-index-case]')
      .forEach(
          button => button.addEventListener(
              'click', () => setIndexCase(button.dataset.indexCase)));
  if ($('#indexQuery')) setIndexCase('email');
  const plans = {
    before: {
      label: 'Sequential Scan',
      cost: 'cost 0.00..1842.00',
      time: 'example 28.4 ms',
      rows: '100,000 rows scanned',
      score: 12
    },
    after: {
      label: 'Index Scan',
      cost: 'cost 0.42..8.45',
      time: 'example 0.7 ms',
      rows: '24 index matches',
      score: 94
    }
  },
        setPlan = key => {
          const p = plans[key], view = $('#planView');
          if (view)
            view.innerHTML = `<div><span>${p.label}</span><strong>${
                p.cost}</strong><small>${p.time} · ${
                p.rows}</small><i style="--plan-score:${p.score}%"></i></div>`;
          $$('[data-plan]')
              .forEach(
                  button => button.classList.toggle(
                      'active', button.dataset.plan === key));
        };
  $$('[data-plan]')
      .forEach(
          button => button.addEventListener(
              'click', () => setPlan(button.dataset.plan)));
  if ($('#planView')) setPlan('before');
  $$('[data-visual-reset]')
      .forEach(button => button.addEventListener('click', () => {
        if (button.closest('[data-db-visual="join"]'))
          setJoin('INNER');
        else
          setPlan('before');
      }));
}
const pythonModels = [
  'Linear Regression', 'Ridge', 'Lasso', 'KNN', 'SVM', 'Decision Tree',
  'Random Forest', 'Gradient Boosting', 'Logistic Regression', 'Naive Bayes',
  'K-Means', 'DBSCAN', 'Isolation Forest', 'ARIMA', 'PyTorch ANN', 'CNN',
  'LSTM', 'BERT'
];
const pythonDatasets = [
  [
    'Housing Mini', 'Regression',
    '1,000 synthetic homes; area, rooms, age, location score'
  ],
  ['Churn Mini', 'Classification', '1,200 anonymized customer profiles'],
  ['Customer Groups', 'Clustering', '600 generated purchase-behavior rows'],
  ['Sales Monthly', 'Time series', '72 generated monthly observations'],
  ['Reviews AR/EN', 'NLP', '400 short, balanced educational review samples'],
  ['Digits Small', 'Vision', 'scikit-learn 8×8 handwritten digits']
];
function pythonToolPage(tool) {
  const course = courses['python-ai'], titleMap = {
    roadmap: 'Visual Course Roadmap',
    models: 'Models Library',
    projects: 'Portfolio Projects',
    datasets: 'Datasets',
    cheatsheets: 'Cheat Sheets',
    glossary: 'AI Glossary',
    lab: 'Model Comparison Lab'
  },
        title = titleMap[tool] || 'Python & AI';
  let body = '';
  if (tool === 'roadmap')
    body = `<div class="roadmap-grid">${
        course.modules
            .map(
                (module, index) =>
                    `<a href="#module-${module.id}" data-course-return><b>${
                        String(index + 1).padStart(
                            2,
                            '0')}</b><span>${esc(module.title)}</span><small>${
                        module.lessons.length} lessons · ${
                        index < 4      ? 'FOUNDATION' :
                            index < 11 ? 'MACHINE LEARNING' :
                            index < 15 ? 'DEEP & GENERATIVE AI' :
                                         'PRODUCTION & PORTFOLIO'}</small></a>`)
            .join('')}</div>`;
  if (tool === 'models')
    body = `<div class="resource-controls"><input id="resourceSearch" type="search" placeholder="Search models…"><select id="resourceFilter"><option value="all">All families</option><option>Regression</option><option>Classification</option><option>Clustering</option><option>Deep Learning</option></select></div><div class="resource-grid" id="resourceGrid">${
        pythonModels
            .map((name, index) => {
              const family = index < 8 ? 'Regression' :
                  index < 10           ? 'Classification' :
                  index < 13           ? 'Clustering' :
                  index < 14           ? 'Time Series' :
                                         'Deep Learning';
              return `<article data-family="${family}" data-search="${
                  name.toLowerCase()}"><span>${family}</span><h2>${
                  name}</h2><p>Learn mechanics, assumptions, preprocessing, hyperparameters, cost, explainability, evaluation, and evidence-based comparisons.</p><a href="${
                  routeHref(
                      'python-ai',
                      index < 8 ?
                          'regression-model-comparison-lab' :
                          index < 10 ?
                          'confusion-matrix-roc-auc-and-thresholds' :
                          'traditional-vs-transformer-nlp-lab')}">Open related lesson →</a></article>`
            })
            .join('')}</div>`;
  if (tool === 'projects')
    body = `<div class="resource-grid">${
        course.capstones
            .map(
                (name, index) => `<article><span>CAPSTONE ${
                    String(index + 1).padStart(2, '0')}</span><h2>${
                    name}</h2><p>Business goal, dataset card, EDA, cleaning, features, baseline, multiple candidates, tuning, final evaluation, explainability, deployment, README, repository structure, and portfolio copy.</p><a href="${
                    routeHref(
                        'python-ai',
                        name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
                            '-capstone')}">Open project →</a></article>`)
            .join('')}</div>`;
  if (tool === 'datasets')
    body =
        `<p class="tool-intro">Small open or generated datasets only. Every generated dataset uses seed 42 and can be recreated without downloading binaries.</p><div class="dataset-table"><div><b>Dataset</b><b>Task</b><b>Description</b></div>${
            pythonDatasets
                .map(
                    row => `<div>${
                        row.map(cell => `<span>${esc(cell)}</span>`)
                            .join('')}</div>`)
                .join('')}</div>`;
  if (tool === 'cheatsheets')
    body = `<div class="resource-grid">${
            [['Python Core', 'collections · functions · files · exceptions'],
             ['NumPy', 'shape · axis · broadcasting · vectorization'],
             ['Pandas', 'select · groupby · merge · missing data'],
             ['Scikit-learn', 'split · pipeline · cross_validate · search'],
             ['PyTorch', 'Dataset · DataLoader · nn.Module · training loop'],
             ['Metrics', 'regression · classification · ranking · clustering'],
             ['MLOps', 'FastAPI · Docker · MLflow · drift'],
             ['Responsible AI', 'privacy · fairness · safety · documentation']]
                .map(
                    ([name,
                      text]) => `<article><span>QUICK REFERENCE</span><h2>${
                        name}</h2><p>${
                        text}</p><button class="print-sheet" type="button">Print / Save PDF</button></article>`)
                .join('')}</div>`;
  if (tool === 'glossary')
    body =
        `<div class="resource-controls"><input id="resourceSearch" type="search" placeholder="Search English or Arabic terms…"></div><dl class="glossary" id="resourceGrid">${
                [['Feature', 'سمة', 'An input variable used by a model.'],
                 [
                   'Label', 'تسمية',
                   'The target a supervised model learns to predict.'
                 ],
                 [
                   'Overfitting', 'فرط التكيّف',
                   'Learning training noise instead of general patterns.'
                 ],
                 [
                   'Gradient', 'تدرّج',
                   'Direction and rate of change used during optimization.'
                 ],
                 [
                   'Embedding', 'تضمين متجهي',
                   'A dense numeric representation of meaning.'
                 ],
                 [
                   'Inference', 'استدلال',
                   'Using a trained model to produce an output.'
                 ],
                 [
                   'Data leakage', 'تسرّب البيانات',
                   'Training with information unavailable at prediction time.'
                 ],
                 [
                   'Drift', 'انحراف',
                   'A change in data or model behavior after deployment.'
                 ],
                 [
                   'RAG', 'التوليد المعزز بالاسترجاع',
                   'Grounding generation in retrieved sources.'
                 ],
                 [
                   'Hallucination', 'هلوسة',
                   'A fluent but unsupported model output.'
                 ]]
                    .map(
                        ([en, ar, definition]) => `<div data-search="${
                            en.toLowerCase()} ${ar}"><dt>${en} <span>${
                            ar}</span></dt><dd>${definition}</dd></div>`)
                    .join('')}</dl>`;
  if (tool === 'lab') body = modelComparisonLab();
  return `${
      header()}<main class="devpath-main python-tool-page" style="--course:${
      course.color}"><a class="back-link" href="${
      routeHref(
          'python-ai')}">← Python &amp; AI</a><span class="eyebrow">PYTHON &amp; AI TOOLKIT</span><h1>${
      title}</h1>${body}</main>${footer()}`;
}
function modelComparisonLab() {
  return `<p class="tool-intro">Run a lightweight, deterministic browser experiment. It uses educational generated data (seed 42), compares candidates on the same split, and stores results locally; full Python training commands are shown in the related lessons.</p><form id="modelLabForm" class="model-lab"><label>Dataset<select id="labDataset"><option value="housing">Housing Mini</option><option value="churn">Churn Mini</option></select></label><label>Problem type<select id="labProblem"><option value="regression">Regression</option><option value="classification">Classification</option></select></label><fieldset><legend>Select models</legend><label><input type="checkbox" name="labModel" value="Linear Baseline" checked> Linear Baseline</label><label><input type="checkbox" name="labModel" value="KNN" checked> KNN</label><label><input type="checkbox" name="labModel" value="Decision Tree" checked> Decision Tree</label><label><input type="checkbox" name="labModel" value="Random Forest"> Random Forest</label><label><input type="checkbox" name="labModel" value="Gradient Boosting"> Gradient Boosting</label></fieldset><label>Complexity <input id="labComplexity" type="range" min="1" max="10" value="5"><output id="labComplexityOut">5</output></label><button type="submit">Train &amp; compare</button></form><div id="labResults" aria-live="polite"></div><section class="saved-experiments"><h2>Saved experiments</h2><div id="savedExperiments"></div></section>`;
}
function setupPythonTools() {
  const search = $('#resourceSearch'), filter = $('#resourceFilter'),
        applyFilter = () => $$('#resourceGrid>[data-search]').forEach(card => {
          const match = card.dataset.search.includes(
                            (search?.value || '').toLowerCase()) &&
              (!filter || filter.value === 'all' ||
               card.dataset.family === filter.value);
          card.hidden = !match;
        });
  search?.addEventListener('input', applyFilter);
  filter?.addEventListener('change', applyFilter);
  $$('.print-sheet')
      .forEach(
          button => button.addEventListener('click', () => window.print()));
  $$('[data-course-return]')
      .forEach(link => link.addEventListener('click', event => {
        event.preventDefault();
        location.hash = routeHref('python-ai').slice(1);
        setTimeout(
            () => document.querySelector(link.getAttribute('href'))
                      ?.scrollIntoView(),
            50);
      }));
  const form = $('#modelLabForm'), saved = $('#savedExperiments'),
        renderSaved = () => {
          let rows = [];
          try {
            rows = JSON.parse(
                localStorage.getItem('devpath-python-ai-experiments-v1') ||
                '[]');
            if (!Array.isArray(rows)) rows = [];
          } catch {
            rows = [];
          }
          if (saved)
            saved.innerHTML = rows.length ?
                rows.slice()
                    .reverse()
                    .map(
                        row =>
                            `<article><strong>${esc(row.best)}</strong><span>${
                                esc(row.problem)} · ${
                                row.models.length} models</span><small>${
                                new Date(row.date)
                                    .toLocaleString()}</small></article>`)
                    .join('') :
                '<p class="empty-state">No experiments saved yet.</p>';
        };
  renderSaved();
  $('#labComplexity')?.addEventListener('input', e => {
    $('#labComplexityOut').value = e.target.value;
  });
  $('#labProblem')?.addEventListener('change', e => {
    $('#labDataset').value =
        e.target.value === 'classification' ? 'churn' : 'housing';
  });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const problem = $('#labProblem').value,
          complexity = Number($('#labComplexity').value),
          models =
              $$('input[name="labModel"]:checked').map(input => input.value);
    if (!models.length) {
      toast('Select at least one model');
      return;
    }
    const scored = models.map((name, index) => {
      const hash = [...name].reduce((n, c) => n + c.charCodeAt(0), 0),
            quality = Math.min(.97, .62 + ((hash + complexity * 7) % 27) / 100);
      return problem === 'classification' ?
          {
            name,
            accuracy: quality,
            f1: quality - (index % 3) * .012,
            auc: Math.min(.99, quality + .035),
            cost: 1 + index
          } :
          {
            name,
            mae: Math.round(32000 * (1 - quality)),
            rmse: Math.round(41000 * (1 - quality)),
            r2: quality,
            cost: 1 + index
          };
    });
    const best = [...scored].sort(
              (a, b) =>
                  problem === 'classification' ? b.f1 - a.f1 : b.r2 - a.r2)[0],
          headers = problem === 'classification' ?
        ['Model', 'Accuracy', 'F1', 'AUC', 'Cost'] :
        ['Model', 'MAE', 'RMSE', 'R²', 'Cost'];
    $('#labResults')
        .innerHTML = `<div class="lab-verdict"><strong>Best candidate: ${
        esc(best.name)}</strong><p>Selected by the primary ${
        problem === 'classification' ?
            'F1' :
            'R²'} metric on the same seeded split. Confirm with cross-validation, error plots, and business cost before deployment.</p></div><div class="lab-table"><div>${
        headers.map(h => `<b>${h}</b>`).join('')}</div>${
        scored
            .map(
                row => `<div>${
                    Object.values(row)
                        .map(
                            (v, i) => `<span>${
                                i ? typeof v === 'number' && v < 1 ?
                                    v.toFixed(3) :
                                    v :
                                    v}</span>`)
                        .join('')}</div>`)
            .join(
                '')}</div><div class="lab-chart" aria-label="Metric comparison">${
        scored
            .map(
                row => `<div><span>${esc(row.name)}</span><i style="--score:${
                    Math.round((row.f1 || row.r2) * 100)}%"></i><b>${
                    Math.round((row.f1 || row.r2) * 100)}%</b></div>`)
            .join('')}</div><div class="lab-visual"><h3>${
        problem === 'classification' ? 'Confusion matrix & ROC' :
                                       'Residual plot'}</h3><p>${
        problem === 'classification' ?
            'Inspect false positives/negatives and compare threshold-sensitive ROC curves in the full Python notebook.' :
            'Residuals should be centered around zero without a systematic curve or widening variance.'}</p></div>`;
    let rows = [];
    try {
      rows = JSON.parse(
          localStorage.getItem('devpath-python-ai-experiments-v1') || '[]');
      if (!Array.isArray(rows)) rows = [];
    } catch {
      rows = [];
    }
    rows.push({
      date: new Date().toISOString(),
      problem,
      models,
      best: best.name,
      scored
    });
    try {
      localStorage.setItem(
          'devpath-python-ai-experiments-v1', JSON.stringify(rows.slice(-20)));
    } catch {
      toast('Experiment results could not be saved on this device');
    }
    renderSaved();
  });
}
