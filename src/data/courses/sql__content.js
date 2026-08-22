(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const sqlExamples = title => {
  const t = lower(title);
  if (t === 'introduction to databases')
    return [
      [
        'Create a durable relation',
        'A database stores typed facts and enforces rules beyond one process lifetime.',
        `CREATE TABLE courses (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL,\n  published boolean NOT NULL DEFAULT false\n);`,
        'CREATE TABLE'
      ],
      [
        'Ask a declarative question',
        'SQL describes the desired rows while PostgreSQL chooses the physical plan.',
        `SELECT id, title\nFROM courses\nWHERE published\nORDER BY id;`,
        'Published courses in identifier order'
      ]
    ];
  if (t === 'relational database concepts')
    return [
      [
        'Model related facts',
        'Separate courses and lessons, then relate each lesson through a key.',
        `CREATE TABLE lessons (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  course_id bigint NOT NULL REFERENCES courses(id),\n  title text NOT NULL\n);`,
        'CREATE TABLE'
      ],
      [
        'Combine relations through a predicate',
        'A join reconstructs the course-to-lesson view without duplicating course titles in every lesson row.',
        `SELECT c.title AS course, l.title AS lesson\nFROM courses AS c\nJOIN lessons AS l ON l.course_id = c.id;`,
        'One row per matched lesson'
      ]
    ];
  if (t === 'tables, rows, and columns')
    return [
      [
        'Define columns from domains',
        'Each column carries one attribute with a type and nullability rule.',
        `CREATE TABLE learners (\n  learner_id bigint GENERATED ALWAYS AS IDENTITY,\n  display_name text NOT NULL,\n  joined_at timestamptz NOT NULL DEFAULT now(),\n  PRIMARY KEY (learner_id)\n);`,
        'CREATE TABLE'
      ],
      [
        'Inspect table metadata',
        'information_schema exposes column names, types, and nullability portably.',
        `SELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_schema='public' AND table_name='learners'\nORDER BY ordinal_position;`,
        'Four metadata rows'
      ]
    ];
  if (t === 'sql data types')
    return [
      [
        'Choose types by meaning',
        'Use numeric for exact money, timestamptz for instants, and jsonb only for genuinely flexible attributes.',
        `CREATE TABLE course_offers (\n  course_id bigint PRIMARY KEY REFERENCES courses(id),\n  price numeric(10,2) NOT NULL CHECK (price >= 0),\n  opens_at timestamptz NOT NULL,\n  metadata jsonb NOT NULL DEFAULT '{}'::jsonb\n);`,
        'CREATE TABLE'
      ],
      [
        'Use explicit casts at boundaries',
        'Casting exposes conversion failure rather than relying on ambiguous implicit coercion.',
        `SELECT '2026-08-12T09:00:00+03:00'::timestamptz AS opens_at,\n       '49.90'::numeric(10,2) AS price;`,
        'One typed timestamp and exact decimal'
      ]
    ];
  if (t === 'primary and foreign keys')
    return [
      [
        'Enforce identity and reference integrity',
        'The primary key rejects duplicates and the foreign key rejects orphaned progress.',
        `CREATE TABLE progress (\n  learner_id bigint REFERENCES learners(learner_id),\n  lesson_id bigint REFERENCES lessons(id),\n  completed_at timestamptz,\n  PRIMARY KEY (learner_id, lesson_id)\n);`,
        'CREATE TABLE'
      ],
      [
        'Choose deletion behavior explicitly',
        'RESTRICT protects referenced learning history unless cleanup is intentionally ordered.',
        `ALTER TABLE progress\n  DROP CONSTRAINT progress_lesson_id_fkey,\n  ADD CONSTRAINT progress_lesson_fk FOREIGN KEY (lesson_id)\n    REFERENCES lessons(id) ON DELETE RESTRICT;`,
        'ALTER TABLE'
      ]
    ];
  if (t === 'create, alter, and drop')
    return [
      [
        'Evolve schema transactionally',
        'Create a column, backfill it, then enforce not-null only after every row satisfies it.',
        `BEGIN;\nALTER TABLE lessons ADD COLUMN position integer;\nUPDATE lessons SET position = id WHERE position IS NULL;\nALTER TABLE lessons ALTER COLUMN position SET NOT NULL;\nCOMMIT;`,
        'ALTER TABLE and UPDATE committed together'
      ],
      [
        'Protect dependencies on removal',
        'RESTRICT refuses a drop when another object depends on the target.',
        `DROP TABLE old_course_imports RESTRICT;`,
        'DROP TABLE or a dependency error'
      ]
    ];
  if (t === 'insert, update, and delete')
    return [
      [
        'Return changed data',
        'RETURNING avoids a second query for generated and normalized values.',
        `INSERT INTO courses (title)\nVALUES ('SQL Fundamentals')\nRETURNING id, title, published;`,
        'The inserted course row'
      ],
      [
        'Guard mutations with predicates',
        'Preview the exact predicate and return every affected identifier.',
        `UPDATE lessons\nSET title = trim(title)\nWHERE title <> trim(title)\nRETURNING id, title;`,
        'Only whitespace-normalized lessons'
      ]
    ];
  if (t === 'constraints')
    return [
      [
        'Encode domain invariants',
        'CHECK, UNIQUE, and NOT NULL protect data no matter which client writes it.',
        `CREATE TABLE assessments (\n  assessment_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  lesson_id bigint NOT NULL REFERENCES lessons(id),\n  attempt smallint NOT NULL CHECK (attempt > 0),\n  score numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),\n  UNIQUE (lesson_id, attempt)\n);`,
        'CREATE TABLE'
      ],
      [
        'Add a large-table check safely',
        'NOT VALID avoids scanning existing rows during lock acquisition; VALIDATE checks them later.',
        `ALTER TABLE lessons ADD CONSTRAINT positive_duration\n  CHECK (duration_minutes > 0) NOT VALID;\nALTER TABLE lessons VALIDATE CONSTRAINT positive_duration;`,
        'Validated duration invariant'
      ]
    ];
  if (t === 'subqueries')
    return [
      [
        'Use EXISTS for membership',
        'A correlated EXISTS stops after the first matching row and does not multiply courses.',
        `SELECT c.id, c.title\nFROM courses AS c\nWHERE EXISTS (\n  SELECT 1 FROM lessons AS l\n  WHERE l.course_id=c.id AND l.published\n);`,
        'Courses with at least one published lesson'
      ],
      [
        'Use a scalar subquery deliberately',
        'A scalar subquery must return at most one value.',
        `SELECT l.title, l.duration_minutes,\n       (SELECT avg(duration_minutes) FROM lessons) AS overall_average\nFROM lessons AS l\nORDER BY l.id;`,
        'Each lesson beside one overall average'
      ]
    ];
  if (t === 'views')
    return [
      [
        'Create a stable query interface',
        'A view packages joins and filtering but stores no rows by itself.',
        `CREATE VIEW published_lesson_catalog AS\nSELECT l.id, l.title, c.title AS course\nFROM lessons l JOIN courses c ON c.id=l.course_id\nWHERE l.published AND c.published;`,
        'CREATE VIEW'
      ],
      [
        'Query through the view',
        'Permissions may expose the curated projection instead of base-table internals.',
        `GRANT SELECT ON published_lesson_catalog TO academy_reader;\nSELECT * FROM published_lesson_catalog ORDER BY course, id;`,
        'Authorized published catalog rows'
      ]
    ];
  if (t === 'stored procedures')
    return [
      [
        'Define a transaction-controlling procedure',
        'PostgreSQL procedures are invoked with CALL and suit administrative workflows.',
        `CREATE PROCEDURE archive_old_drafts(cutoff timestamptz)\nLANGUAGE SQL\nAS $$\n  UPDATE courses SET archived=true\n  WHERE NOT published AND updated_at < cutoff;\n$$;`,
        'CREATE PROCEDURE'
      ],
      [
        'Call with a typed argument',
        'The caller supplies the cutoff explicitly and inspects effects separately.',
        `CALL archive_old_drafts(now() - interval '180 days');\nSELECT count(*) FROM courses WHERE archived;`,
        'CALL followed by archived row count'
      ]
    ];
  if (t === 'database security')
    return [
      [
        'Grant least privilege',
        'An application role receives only the table operations required by its use cases.',
        `CREATE ROLE academy_app LOGIN;\nGRANT USAGE ON SCHEMA public TO academy_app;\nGRANT SELECT, INSERT, UPDATE ON courses, lessons, progress TO academy_app;\nREVOKE DELETE ON courses, lessons FROM academy_app;`,
        'Scoped role privileges'
      ],
      [
        'Parameterize values in application code',
        'Placeholders keep input as data and avoid SQL injection.',
        `SELECT id, title\nFROM courses\nWHERE owner_id = $1 AND title ILIKE $2\nORDER BY id;`,
        'A prepared statement contract with two bound values'
      ]
    ];
  if (/practical project/.test(t))
    return [
      [
        'Create the project schema',
        'Constraints establish one course, ordered lessons, and unique learner progress records.',
        `BEGIN;\nCREATE TABLE academy_course(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,title text NOT NULL UNIQUE);\nCREATE TABLE academy_lesson(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,course_id bigint NOT NULL REFERENCES academy_course(id),position integer NOT NULL,title text NOT NULL,UNIQUE(course_id,position));\nCOMMIT;`,
        'Two related project tables'
      ],
      [
        'Prove a project query',
        'Return completion percentages while preserving learners with no completed lessons.',
        `SELECT p.learner_id,l.course_id,\n       count(*) FILTER (WHERE p.completed_at IS NOT NULL)::numeric / count(*) AS completion\nFROM progress p JOIN academy_lesson l ON l.id=p.lesson_id\nGROUP BY p.learner_id,l.course_id;`,
        'Completion ratio per learner and course'
      ]
    ];
  if (/course review|final assessment/.test(t))
    return [
      [
        'Review through a transaction',
        'Combine mutation, constraint, query, and rollback knowledge in a safe rehearsal.',
        `BEGIN;\nINSERT INTO courses(title) VALUES ('Assessment') RETURNING id;\nSAVEPOINT inserted_course;\nUPDATE courses SET published=true WHERE title='Assessment';\nSELECT id,title FROM courses WHERE published ORDER BY id;\nROLLBACK;`,
        'Evidence produced without retaining rehearsal data'
      ],
      [
        'Read an execution plan',
        'Explain the likely access path before executing the assessment query.',
        `EXPLAIN (ANALYZE, BUFFERS)\nSELECT l.id,l.title\nFROM lessons l\nWHERE l.course_id=42\nORDER BY l.position\nLIMIT 20;`,
        'Actual plan, rows, timing, and buffers'
      ]
    ];
  if (/select/.test(t))
    return [
      [
        'Projection and alias', 'Return only columns the caller needs.',
        `SELECT id, title, duration_minutes AS minutes\nFROM lessons;`,
        'One row per lesson'
      ],
      [
        'Computed column',
        'Derive a display value without changing stored data.',
        `SELECT title, duration_minutes / 60.0 AS hours\nFROM lessons\nORDER BY hours DESC;`,
        'Lessons ordered by calculated hours'
      ]
    ];
  if (/where/.test(t))
    return [
      [
        'Boolean predicates', 'Combine filters and handle NULL explicitly.',
        `SELECT id, title\nFROM lessons\nWHERE published = true\n  AND duration_minutes BETWEEN 20 AND 60\n  AND archived_at IS NULL;`,
        'Published, active lessons in the duration range'
      ],
      [
        'Safe pattern search', 'Escape or bind user input in application code.',
        `SELECT id, title\nFROM lessons\nWHERE title ILIKE 'sql%'\nORDER BY title;`,
        'Titles beginning with SQL, case-insensitively'
      ]
    ];
  if (/order by/.test(t))
    return [
      [
        'Deterministic ordering',
        'Add a unique tie-breaker after the business sort key.',
        `SELECT id, title, created_at\nFROM lessons\nORDER BY created_at DESC, id DESC;`,
        'Newest lessons with stable ties'
      ],
      [
        'NULL placement', 'Choose where missing values appear.',
        `SELECT learner_id, completed_at\nFROM progress\nORDER BY completed_at DESC NULLS LAST, learner_id;`,
        'Completed records before incomplete records'
      ]
    ];
  if (/aggregate/.test(t))
    return [
      [
        'Aggregate rows', 'COUNT(*) counts rows; AVG ignores NULL inputs.',
        `SELECT COUNT(*) AS lessons,\n       ROUND(AVG(duration_minutes), 1) AS avg_minutes\nFROM lessons;`,
        'One summary row'
      ],
      [
        'Filtered aggregate',
        'Compute conditional counts without separate queries.',
        `SELECT COUNT(*) FILTER (WHERE published) AS published,\n       COUNT(*) FILTER (WHERE NOT published) AS drafts\nFROM lessons;`,
        'Published and draft counts'
      ]
    ];
  if (/group by|having/.test(t))
    return [
      [
        'Group then filter groups',
        'WHERE filters rows; HAVING filters aggregate groups.',
        `SELECT course_id, COUNT(*) AS lesson_count\nFROM lessons\nWHERE published\nGROUP BY course_id\nHAVING COUNT(*) >= 10\nORDER BY lesson_count DESC;`,
        'Courses with at least ten published lessons'
      ],
      [
        'Group on expression',
        'Repeat the grouping expression or use a subquery.',
        `SELECT date_trunc('month', completed_at) AS month, COUNT(*)\nFROM progress\nGROUP BY date_trunc('month', completed_at)\nORDER BY month;`,
        'Monthly completion totals'
      ]
    ];
  if (/join/.test(t))
    return [
      [
        'Inner join', 'Match lessons to an existing course.',
        `SELECT c.title AS course, l.title AS lesson\nFROM courses AS c\nJOIN lessons AS l ON l.course_id = c.id\nORDER BY c.title, l.position;`,
        'Only matched courses and lessons'
      ],
      [
        'Left join with zero counts', 'Preserve courses that have no lessons.',
        `SELECT c.id, c.title, COUNT(l.id) AS lessons\nFROM courses AS c\nLEFT JOIN lessons AS l ON l.course_id = c.id\nGROUP BY c.id, c.title;`,
        'Every course, including zero-lesson courses'
      ]
    ];
  if (/index|b-tree|composite|partial|covering/.test(t))
    return [
      [
        'Workload-matched index',
        'Match equality, ordering, and projection needs.',
        `CREATE INDEX lessons_course_position_idx\nON lessons (course_id, position)\nINCLUDE (title);`,
        'CREATE INDEX'
      ],
      [
        'Verify planner use',
        'Compare estimates and actual work on representative data.',
        `EXPLAIN (ANALYZE, BUFFERS)\nSELECT title FROM lessons\nWHERE course_id = 42\nORDER BY position\nLIMIT 20;`,
        'An execution plan with actual rows and buffers'
      ]
    ];
  if (/transaction|locking/.test(t))
    return [
      [
        'Atomic transfer', 'Lock the target row before deriving a new value.',
        `BEGIN;\nSELECT completed FROM progress\nWHERE learner_id = 7 AND course_id = 42\nFOR UPDATE;\nUPDATE progress SET completed = completed + 1\nWHERE learner_id = 7 AND course_id = 42;\nCOMMIT;`,
        'The read and increment share one transaction'
      ],
      [
        'Inspect blockers',
        'Join lock and activity views to find waiting sessions.',
        `SELECT a.pid, a.query, l.locktype, l.granted\nFROM pg_stat_activity a\nJOIN pg_locks l USING (pid)\nWHERE NOT l.granted;`,
        'Currently waiting locks'
      ]
    ];
  if (/explain|plan|performance|optimization|slow/.test(t))
    return [
      [
        'Estimated plan', 'Inspect the plan without executing the query.',
        `EXPLAIN (COSTS, VERBOSE)\nSELECT * FROM lessons WHERE course_id = 42;`,
        'Planner nodes, costs, and estimated rows'
      ],
      [
        'Measured plan',
        'Execute safely and compare estimates with actual rows.',
        `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)\nSELECT id, title FROM lessons\nWHERE course_id = 42 ORDER BY id LIMIT 25;`,
        'Actual rows, loops, buffers, planning and execution time'
      ]
    ];
  return null;
};
window.ACADEMY_LESSON_SPECS.sql = {
  ...{
    context: 'PostgreSQL databases',
    language: 'sql',
    concepts: [
      [
        /introduction|relational/,
        'A relational database stores facts in typed relations and uses declarative SQL, constraints, keys, and transactions to preserve and query them'
      ],
      [
        /table|row|column|data type/,
        'A table defines named typed columns; each row is one fact and each column should have a domain that rejects invalid representations'
      ],
      [
        /primary|foreign key/,
        'A primary key uniquely identifies each row and a foreign key requires referenced values to exist, making relationships enforceable'
      ],
      [
        /create|alter|drop/,
        'DDL changes schema objects; PostgreSQL runs most DDL transactionally, but dependencies and locks make production sequencing important'
      ],
      [
        /insert|update|delete/,
        'Data-changing statements affect every matching row and can return changed values; predicates, constraints, and transaction boundaries prevent accidental corruption'
      ],
      [
        /constraint/,
        'Constraints encode invariants in the database so every writer—not only one application path—must obey them'
      ],
      [
        /transaction/,
        'A transaction commits related changes atomically or rolls them back; isolation defines which concurrent effects a transaction may observe'
      ],
      [
        /select|where|order|aggregate|group|having/,
        'A SELECT declares a result; filtering happens before grouping, HAVING filters groups, and ORDER BY is the only guarantee of output order'
      ],
      [
        /join/,
        'A join combines row sources through a predicate; inner and outer joins differ in whether unmatched rows survive'
      ],
      [
        /subquer/,
        'A subquery supplies a scalar, row set, or existence test to an outer statement; correlation can cause repeated work'
      ],
      [
        /view/,
        'A view stores a query interface rather than copied rows, centralizing a stable projection or security boundary'
      ],
      [
        /index/,
        'An index is an auxiliary search structure that can reduce reads but consumes storage and adds work to writes'
      ],
      [
        /procedure/,
        'A PostgreSQL procedure executes server-side commands and may control transactions when invoked with CALL, unlike a function used inside expressions'
      ],
      [
        /security/,
        'Database security combines authenticated roles, least-privilege grants, safe parameter binding, protected transport, auditing, and secure backups'
      ],
      [
        /project|review|assessment/,
        'Production SQL work begins with invariants and representative queries, then validates results, concurrency, plans, privileges, migrations, and recovery'
      ]
    ]
  },
  examples: sqlExamples,
  guidanceRules: [
      [
        /table|column|type|key|constraint|normalization|definition/,
        [
          'Model Academy facts with types, keys, and constraints that reject invalid states for every writer.',
          [
            'Encoding multiple facts in a delimited text column.',
            'Choosing an unconstrained text type for a finite domain without validation.',
            'Adding a foreign key without planning validation and locking on a large table.'
          ],
          [
            'Name constraints and indexes predictably.',
            'Choose types from the domain and expected operations.',
            'Apply schema changes transactionally or through staged online migrations.'
          ]
        ]
      ],
      [
        /select|where|order|aggregate|group|join|subquer|view|pagination|rewrit/,
        [
          'Return deterministic Academy result sets with correct filtering, grouping, joining, and pagination semantics.',
          [
            'Assuming row order without ORDER BY.',
            'Turning a LEFT JOIN into an inner join with a misplaced WHERE predicate.',
            'Using OFFSET for deep, frequently changing feeds.'
          ],
          [
            'Select only required columns.',
            'Use unique tie-breakers in ordering.',
            'Verify NULL behavior and row cardinality before optimizing.'
          ]
        ]
      ],
      [
        /index|b-tree|plan|explain|performance|slow|statistics/,
        [
          'Diagnose Academy query work with plans and add workload-specific indexes only when evidence supports them.',
          [
            'Reading cost as milliseconds.',
            'Running EXPLAIN ANALYZE on a dangerous write outside a rollback plan.',
            'Creating overlapping indexes without measuring write and cache cost.'
          ],
          [
            'Compare estimated and actual rows.',
            'Measure the same representative workload before and after.',
            'Keep statistics current and remove only indexes proven unnecessary over a full workload cycle.'
          ]
        ]
      ],
      [
        /transaction|lock|vacuum|pool|cache|monitor|case study|review|assessment|security|procedure/,
        [
          'Operate the Academy database safely under concurrency, maintenance, connection, and recovery constraints.',
          [
            'Keeping transactions open during user think time.',
            'Increasing connection limits instead of fixing saturation.',
            'Caching data without ownership, TTL, and invalidation rules.'
          ],
          [
            'Keep transactions short and acquire locks consistently.',
            'Budget pooled connections across replicas.',
            'Monitor waits, dead tuples, hit ratios, and service-level latency together.'
          ]
        ]
      ]
    ]
};
})();
