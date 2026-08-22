(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const projectExamples = title => {
  const t = lower(title);
  if (/task manager/.test(t))
    return [
      [
        'REST resource contract',
        'Model status and optimistic version explicitly.',
        `POST /api/tasks\nContent-Type: application/json\n\n{"title":"Review SQL joins","dueDate":"2026-08-20"}\n\n201 Created\n{"id":42,"title":"Review SQL joins","status":"OPEN","version":0}`,
        'A created task with server-owned fields'
      ],
      [
        'Service transaction',
        'Validate the command and persist through a repository port.',
        `@Transactional\nTaskView create(CreateTask command, UserId owner) {\n  Task task = Task.create(owner, command.title(), command.dueDate(), clock.instant());\n  repository.save(task);\n  return mapper.toView(task);\n}`,
        'One valid task persisted atomically'
      ]
    ];
  if (/react api dashboard/.test(t))
    return [
      [
        'Explicit remote states',
        'Render loading, error, empty, and success independently.',
        `if (query.isPending) return <Spinner />;\nif (query.isError) return <ErrorPanel retry={query.refetch} />;\nif (query.data.length === 0) return <EmptyTasks />;\nreturn <TaskTable tasks={query.data} />;`,
        'One accessible UI state at a time'
      ],
      [
        'Mutation with cache refresh',
        'Invalidate the resource list only after a successful server update.',
        `const createTask = useMutation({\n  mutationFn: api.createTask,\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })\n});`,
        'New server data appears after refetch'
      ]
    ];
  if (/learning tracker/.test(t))
    return [
      [
        'Vertical slice schema',
        'Enforce one progress row per learner and lesson.',
        `CREATE TABLE progress (\n  learner_id BIGINT REFERENCES learners(id),\n  lesson_id BIGINT REFERENCES lessons(id),\n  completed_at TIMESTAMPTZ,\n  PRIMARY KEY (learner_id, lesson_id)\n);`,
        'Duplicate learner-lesson progress is impossible'
      ],
      [
        'End-to-end completion test',
        'Verify API persistence and refreshed UI behavior.',
        `test('completion survives reload', async ({ page }) => {\n  await page.goto('/courses/sql/select-statements');\n  await page.getByLabel('I completed this lesson').check();\n  await page.reload();\n  await expect(page.getByLabel('I completed this lesson')).toBeChecked();\n});`,
        'The persisted completion remains checked'
      ]
    ];
  return [
    [
      'Readiness probe', 'Separate process health from dependency readiness.',
      `GET /health/live -> 200 when the process can run\nGET /health/ready -> 200 only when required dependencies are usable`,
      'Orchestrators stop routing traffic before termination'
    ],
    [
      'Release checklist as executable gates',
      'Make critical readiness evidence repeatable.',
      `npm ci\nnpm run lint\nnpm test\nnpm run build\nnpm audit --omit=dev\ndocker build --pull -t academy:$GIT_SHA .`,
      'A versioned artifact only after every gate passes'
    ]
  ];
};
window.ACADEMY_LESSON_SPECS.projects = {
  ...{
    context: 'portfolio software projects',
    language: 'text',
    concepts: [
      [
        /task manager/,
        'A task API is a compact backend that still exercises resource modeling, validation, HTTP semantics, persistence, concurrency, security, and automated testing'
      ],
      [
        /dashboard/,
        'An API dashboard turns remote loading, empty, success, validation, and failure states into an accessible user workflow'
      ],
      [
        /learning tracker/,
        'A learning tracker integrates identity, a relational data model, APIs, client state, progress calculations, deployment, and observability as one product'
      ],
      [
        /production readiness/,
        'Production readiness is evidence that a system can be deployed, secured, observed, recovered, scaled, and operated by someone other than its author'
      ]
    ]
  },
  examples: projectExamples,
  guidanceRules: [
      [
        /task manager/,
        [
          'Deliver a secure task resource from HTTP request through validation, transaction, persistence, and response.',
          [
            'Allowing arbitrary status transitions.',
            'Returning persistence entities directly.',
            'Ignoring concurrent updates to the same task.'
          ],
          [
            'Define resource and error contracts first.',
            'Use optimistic versioning or another explicit concurrency policy.',
            'Test creation, update, authorization, validation, and not-found behavior.'
          ]
        ]
      ],
      [
        /dashboard/,
        [
          'Turn Academy API data into an accessible dashboard with explicit remote and mutation states.',
          [
            'Showing stale success data as though a failed refresh succeeded.',
            'Using color alone for status.',
            'Updating local state optimistically without rollback behavior.'
          ],
          [
            'Render loading, empty, error, and success distinctly.',
            'Use semantic tables, labels, focus states, and live announcements.',
            'Invalidate or reconcile cached server state after mutations.'
          ]
        ]
      ],
      [
        /learning tracker/,
        [
          'Integrate identity, course progress, API contracts, client state, database constraints, and deployment into one product slice.',
          [
            'Computing authoritative completion only in the browser.',
            'Allowing duplicate progress rows.',
            'Shipping without an end-to-end recovery and authorization test.'
          ],
          [
            'Enforce progress uniqueness in the database.',
            'Authorize every learner-scoped query.',
            'Prove that completion persists across reload, device, and deployment.'
          ]
        ]
      ],
      [
        /production readiness/,
        [
          'Demonstrate that the Academy system can be released, observed, secured, recovered, and rolled back by another operator.',
          [
            'Treating a successful build as production readiness.',
            'Using one health check for liveness and readiness.',
            'Keeping recovery instructions untested.'
          ],
          [
            'Automate quality, security, and artifact gates.',
            'Define service objectives, alerts, ownership, and runbooks.',
            'Rehearse backup restoration and rollback before launch.'
          ]
        ]
      ]
    ]
};
})();
