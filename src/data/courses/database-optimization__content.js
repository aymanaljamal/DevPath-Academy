(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const optimizationExamples = title => {
  const t = lower(title);
  if (/introduction to database performance/.test(t))
    return [
      [
        'Measure latency distribution',
        'Aggregate statement samples instead of trusting one fast execution.',
        `SELECT percentile_cont(ARRAY[0.5,0.95,0.99]) WITHIN GROUP (ORDER BY latency_ms)\nFROM query_samples WHERE fingerprint='lessons-by-course';`,
        'Median, p95, and p99 latency'
      ],
      [
        'Define workload evidence',
        'Capture rate, latency, rows, and buffers for the same query shape.',
        `SELECT calls,total_exec_time,mean_exec_time,rows,shared_blks_hit,shared_blks_read\nFROM pg_stat_statements\nORDER BY total_exec_time DESC LIMIT 10;`,
        'Statements consuming the most total execution time'
      ]
    ];
  if (/query execution lifecycle/.test(t))
    return [
      [
        'Observe parse-to-execute behavior',
        'Prepared statements can reuse a parsed statement while planning policy remains workload-dependent.',
        `PREPARE lessons_for_course(bigint) AS\nSELECT id,title FROM lessons WHERE course_id=$1 ORDER BY position;\nEXECUTE lessons_for_course(42);`,
        'Rows returned through a prepared statement'
      ],
      [
        'Separate planning from execution',
        'EXPLAIN ANALYZE reports both phases.',
        `EXPLAIN (ANALYZE, SUMMARY)\nSELECT count(*) FROM lessons WHERE published;`,
        'Planning Time and Execution Time lines'
      ]
    ];
  if (/query execution plans/.test(t))
    return [
      [
        'Read a plan bottom-up',
        'Child nodes produce rows consumed by parent nodes.',
        `EXPLAIN (COSTS, VERBOSE)\nSELECT c.title,count(l.id)\nFROM courses c LEFT JOIN lessons l ON l.course_id=c.id\nGROUP BY c.id,c.title;`,
        'Scan and join nodes feeding an Aggregate'
      ],
      [
        'Find estimate errors',
        'Compare estimated rows with actual rows at each node.',
        `EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM lessons WHERE published AND course_id=42;`,
        'Plan nodes containing rows estimates and actual rows'
      ]
    ];
  if (/explain and explain analyze/.test(t))
    return [
      [
        'Safe non-executing inspection',
        'Use EXPLAIN alone for a production mutation.',
        `EXPLAIN UPDATE lessons SET published=true WHERE course_id=42;`,
        'An update plan without changing rows'
      ],
      [
        'Rollback measured mutation',
        'ANALYZE executes the statement, so protect diagnostic writes.',
        `BEGIN;\nEXPLAIN (ANALYZE, BUFFERS) UPDATE lessons SET published=true WHERE course_id=42;\nROLLBACK;`,
        'Measured update work with no committed change'
      ]
    ];
  if (/^index fundamentals$/.test(t))
    return [
      [
        'Compare access paths',
        'Measure the selective predicate before creating an index.',
        `EXPLAIN (ANALYZE,BUFFERS) SELECT id FROM learners WHERE email='lina@example.test';\nCREATE UNIQUE INDEX learners_email_idx ON learners(email);\nEXPLAIN (ANALYZE,BUFFERS) SELECT id FROM learners WHERE email='lina@example.test';`,
        'A before-and-after access-path comparison'
      ],
      [
        'Inspect index usage counters',
        'Unused counts require workload context and sufficient observation time.',
        `SELECT relname,indexrelname,idx_scan,idx_tup_read,idx_tup_fetch\nFROM pg_stat_user_indexes ORDER BY idx_scan;`,
        'Per-index scan and tuple counters'
      ]
    ];
  if (/b-tree/.test(t))
    return [
      [
        'Equality and range access',
        'One B-tree supports equality, ordered ranges, and matching ORDER BY.',
        `CREATE INDEX lessons_duration_idx ON lessons(duration_minutes);\nSELECT id,title FROM lessons WHERE duration_minutes BETWEEN 30 AND 60 ORDER BY duration_minutes;`,
        'Rows in index-compatible duration order'
      ],
      [
        'Prefix pattern access',
        'A suitable operator class can support anchored text patterns under locale rules.',
        `CREATE INDEX courses_title_pattern_idx ON courses(title text_pattern_ops);\nSELECT id,title FROM courses WHERE title LIKE 'Data%';`,
        'Titles with the Data prefix'
      ]
    ];
  if (/composite/.test(t))
    return [
      [
        'Order columns by workload',
        'Place equality columns before the range/order column for this query shape.',
        `CREATE INDEX progress_learner_completed_idx ON progress(learner_id,completed_at DESC);\nSELECT lesson_id,completed_at FROM progress WHERE learner_id=7 ORDER BY completed_at DESC LIMIT 20;`,
        'A learner timeline index path'
      ],
      [
        'Demonstrate the leading-column rule',
        'A predicate only on the second column may not use this index effectively.',
        `EXPLAIN SELECT * FROM progress WHERE completed_at >= now()-interval '7 days';`,
        'Planner choice showing whether the composite index helps'
      ]
    ];
  if (/partial/.test(t))
    return [
      [
        'Index only active rows',
        'Make the query predicate imply the index predicate.',
        `CREATE INDEX lessons_unpublished_idx ON lessons(course_id,position)\nWHERE published=false;\nSELECT id FROM lessons WHERE course_id=42 AND published=false ORDER BY position;`,
        'A small index for draft lessons'
      ],
      [
        'Parameterized-predicate caveat',
        'Generic parameterized plans may not prove implication for every parameter.',
        `PREPARE by_status(boolean) AS SELECT id FROM lessons WHERE published=$1 AND course_id=42;\nEXPLAIN EXECUTE by_status(false);`,
        'Planner may not select the partial index'
      ]
    ];
  if (/covering/.test(t))
    return [
      [
        'Include projected columns',
        'INCLUDE stores non-key values without changing search ordering.',
        `CREATE INDEX lessons_course_position_cover ON lessons(course_id,position) INCLUDE(title,duration_minutes);\nSELECT title,duration_minutes FROM lessons WHERE course_id=42 ORDER BY position;`,
        'Potential index-only scan'
      ],
      [
        'Check heap fetches',
        'Visibility determines whether an index-only scan still visits heap pages.',
        `EXPLAIN (ANALYZE,BUFFERS) SELECT title,duration_minutes FROM lessons WHERE course_id=42 ORDER BY position;`,
        'Index Only Scan plus Heap Fetches count'
      ]
    ];
  if (/query rewriting/.test(t))
    return [
      [
        'Remove redundant row multiplication',
        'Replace join-plus-distinct with EXISTS for pure existence.',
        `SELECT c.id,c.title FROM courses c\nWHERE EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.published);`,
        'One row per course without DISTINCT'
      ],
      [
        'Make predicates sargable',
        'Compare a function on the column with an equivalent range.',
        `SELECT * FROM progress\nWHERE completed_at >= DATE '2026-08-12'\n  AND completed_at < DATE '2026-08-13';`,
        'A timestamp range usable by a plain completed_at index'
      ]
    ];
  if (/join optimization/.test(t))
    return [
      [
        'Index nested-loop lookup side',
        'Support repeated child lookups from a selective parent.',
        `CREATE INDEX lessons_course_id_idx ON lessons(course_id);\nEXPLAIN ANALYZE SELECT c.title,l.title FROM courses c JOIN lessons l ON l.course_id=c.id WHERE c.id=42;`,
        'A selective course lookup and indexed lesson lookup'
      ],
      [
        'Inspect hash-join sizing',
        'A large build side can spill when work_mem is insufficient.',
        `EXPLAIN (ANALYZE,BUFFERS)\nSELECT c.category,count(*) FROM courses c JOIN enrollments e ON e.course_id=c.id GROUP BY c.category;`,
        'Hash batches and memory usage when a hash join is chosen'
      ]
    ];
  if (/subquery optimization/.test(t))
    return [
      [
        'Use EXISTS for membership',
        'Stop after finding the first matching child.',
        `SELECT c.id,c.title FROM courses c\nWHERE EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id=c.id AND e.learner_id=7);`,
        'Courses with at least one matching enrollment'
      ],
      [
        'Expose correlated repetition',
        'loops greater than one reveals repeated inner execution.',
        `EXPLAIN ANALYZE SELECT c.id,(SELECT count(*) FROM lessons l WHERE l.course_id=c.id) FROM courses c;`,
        'A subplan with loops per outer row'
      ]
    ];
  if (/^database normalization$/.test(t))
    return [
      [
        'Remove repeating groups',
        'Store tags as rows with keys instead of comma-separated text.',
        `CREATE TABLE tags(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,name text UNIQUE NOT NULL);\nCREATE TABLE lesson_tags(lesson_id bigint REFERENCES lessons(id),tag_id bigint REFERENCES tags(id),PRIMARY KEY(lesson_id,tag_id));`,
        'Normalized many-to-many tagging'
      ],
      [
        'Protect the dependency', 'A unique key makes one fact appear once.',
        `ALTER TABLE courses ADD CONSTRAINT courses_slug_unique UNIQUE(slug);`,
        'Duplicate slugs are rejected'
      ]
    ];
  if (/^denormalization$/.test(t))
    return [
      [
        'Materialize a measured summary',
        'Refresh a precomputed read model after defining staleness tolerance.',
        `CREATE MATERIALIZED VIEW course_stats AS\nSELECT course_id,count(*) lessons,sum(duration_minutes) minutes FROM lessons GROUP BY course_id;\nREFRESH MATERIALIZED VIEW course_stats;`,
        'Precomputed course totals'
      ],
      [
        'Maintain a counter atomically',
        'Update duplicated state in the same transaction as its source event.',
        `BEGIN;\nINSERT INTO enrollments(learner_id,course_id) VALUES(7,42);\nUPDATE courses SET enrollment_count=enrollment_count+1 WHERE id=42;\nCOMMIT;`,
        'Enrollment and counter change together'
      ]
    ];
  if (/pagination optimization/.test(t))
    return [
      [
        'Keyset seek', 'Continue after a stable composite cursor.',
        `SELECT id,title,created_at FROM lessons\nWHERE (created_at,id) < (TIMESTAMPTZ '2026-08-12 10:00Z',900)\nORDER BY created_at DESC,id DESC LIMIT 25;`,
        'Next page without scanning an offset'
      ],
      [
        'Matching index', 'Use the exact filter and order prefix.',
        `CREATE INDEX lessons_created_id_idx ON lessons(created_at DESC,id DESC);`,
        'An index suited to the keyset query'
      ]
    ];
  if (/transactions and locking/.test(t))
    return [
      [
        'Lock in consistent order',
        'Sort identifiers before locking to reduce deadlock cycles.',
        `BEGIN;\nSELECT id FROM courses WHERE id IN (41,42) ORDER BY id FOR UPDATE;\nUPDATE courses SET updated_at=now() WHERE id IN (41,42);\nCOMMIT;`,
        'Both rows locked in ascending order'
      ],
      [
        'Find blockers',
        'pg_blocking_pids returns sessions blocking a waiting backend.',
        `SELECT pid,wait_event,pg_blocking_pids(pid) blockers,query\nFROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid))>0;`,
        'Waiting statements and blocker PIDs'
      ]
    ];
  if (/detecting slow queries/.test(t))
    return [
      [
        'Rank normalized statements',
        'Use total time for workload impact and mean time for per-call pain.',
        `SELECT queryid,calls,total_exec_time,mean_exec_time,rows\nFROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;`,
        'Top cumulative database consumers'
      ],
      [
        'Enable slow statement logging carefully',
        'Start with a threshold and avoid logging sensitive parameters.',
        `ALTER SYSTEM SET log_min_duration_statement='500ms';\nSELECT pg_reload_conf();`,
        'Statements slower than 500 ms are logged'
      ]
    ];
  if (/postgresql statistics/.test(t))
    return [
      [
        'Inspect column statistics',
        'Check distinctness and frequent values that guide estimates.',
        `SELECT attname,n_distinct,most_common_vals,most_common_freqs\nFROM pg_stats WHERE schemaname='public' AND tablename='lessons';`,
        'Planner statistics by lesson column'
      ],
      [
        'Raise a skewed column target',
        'Collect a larger sample only where estimates need it.',
        `ALTER TABLE lessons ALTER COLUMN course_id SET STATISTICS 500;\nANALYZE lessons(course_id);`,
        'Richer course_id statistics'
      ]
    ];
  if (/vacuum and analyze/.test(t))
    return [
      [
        'Inspect maintenance health',
        'Dead tuples and last maintenance timestamps reveal risk.',
        `SELECT relname,n_live_tup,n_dead_tup,last_autovacuum,last_autoanalyze\nFROM pg_stat_user_tables ORDER BY n_dead_tup DESC;`,
        'Tables with the most dead tuples'
      ],
      [
        'Manual targeted maintenance',
        'Use VERBOSE for diagnosis and avoid VACUUM FULL as routine maintenance.',
        `VACUUM (ANALYZE,VERBOSE) lessons;`,
        'Reclaimed reusable space and refreshed statistics'
      ]
    ];
  if (/connection pooling/.test(t))
    return [
      [
        'Bound application pool',
        'Budget connections across all application replicas.',
        `replicas=8; pool_per_replica=10; reserved_admin=20;\n-- Required server capacity: at least 8*10+20 = 100 connections`,
        'A connection capacity calculation'
      ],
      [
        'Observe saturation',
        'Waiting clients indicate the pool, transaction duration, or query workload needs attention.',
        `SELECT count(*) FILTER(WHERE state='active') active,count(*) FILTER(WHERE wait_event_type IS NOT NULL) waiting\nFROM pg_stat_activity;`,
        'Active and waiting backend counts'
      ]
    ];
  if (/caching strategies/.test(t))
    return [
      [
        'Cache-aside with versioned key',
        'Include schema/version context and define TTL.',
        `key = 'course:v3:' || course_id;\nvalue = cache.get(key);\nif value is null: value = database.load(course_id); cache.set(key,value,ttl=300);`,
        'Database load only on a cache miss'
      ],
      [
        'Invalidate after commit',
        'Publish invalidation only for a committed change.',
        `COMMIT;\nPUBLISH course.changed {"courseId":42,"version":9};\n-- consumers delete course:v3:42`,
        'Stale entry removed after change'
      ]
    ];
  if (/performance monitoring/.test(t))
    return [
      [
        'Correlate service and database signals',
        'Track latency, throughput, errors, saturation, and database waits together.',
        `SELECT wait_event_type,wait_event,count(*)\nFROM pg_stat_activity WHERE state='active' GROUP BY 1,2 ORDER BY 3 DESC;`,
        'Current active wait categories'
      ],
      [
        'Define an SLO alert',
        'Alert on sustained user impact rather than a single noisy sample.',
        `SLO: 99% of course reads < 300 ms over 30 days\nAlert: burn rate > 14.4 for 5 minutes AND > 6 for 1 hour`,
        'A multi-window burn-rate policy'
      ]
    ];
  if (/case study|review|assessment/.test(t))
    return [
      [
        'Baseline-to-result worksheet',
        'Record identical workload evidence before and after the change.',
        `metric,before,after\np95_ms,840,120\nshared_blocks_read,4200,180\nrows_returned,25,25`,
        'Correct results with lower latency and reads'
      ],
      [
        'Regression guard',
        'Keep the tuned query and threshold in an integration performance check.',
        `EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) SELECT id,title FROM lessons WHERE course_id=42 ORDER BY position LIMIT 25;\n-- Assert row count and review plan changes; avoid brittle exact-cost assertions.`,
        'A retained plan artifact and correctness check'
      ]
    ];
  return sqlExamples(title);
};
window.ACADEMY_LESSON_SPECS['database-optimization'] = {
  ...{
    context: 'PostgreSQL performance work',
    language: 'sql',
    concepts: [
      [
        /introduction|lifecycle/,
        'Database performance is elapsed time, throughput, resource use, and predictability under a representative workload; parsing, planning, waiting, and execution all contribute'
      ],
      [
        /execution plan|explain/,
        'EXPLAIN exposes the planner tree and estimates; EXPLAIN ANALYZE executes the statement and adds actual timing and row counts, so use it safely'
      ],
      [
        /index fundamental|b-tree/,
        'A B-tree maintains ordered keys for equality, range, prefix, and ordering access, trading faster qualifying reads for write and storage cost'
      ],
      [
        /composite/,
        'A multicolumn B-tree is most effective when leading columns match useful equality or range conditions; column order follows workload, not table order'
      ],
      [
        /partial/,
        'A partial index stores only rows satisfying a predicate, shrinking hot indexes when queries imply that same predicate'
      ],
      [
        /covering/,
        'INCLUDE columns can let an index supply projected values, but index-only scans still depend on visibility-map state'
      ],
      [
        /rewrit/,
        'Query rewriting removes unnecessary work while preserving semantics; compare plans and results on identical representative data'
      ],
      [
        /join optimization/,
        'Join performance depends on cardinality, join order, available indexes, memory, and whether nested-loop, hash, or merge join fits the inputs'
      ],
      [
        /subquery/,
        'Subqueries may be decorrelated or executed repeatedly; EXISTS often expresses existence without producing or deduplicating extra rows'
      ],
      [
        /normalization/,
        'Normalization separates facts to reduce update anomalies; constraints and keys make the decomposition meaningful'
      ],
      [
        /denormalization/,
        'Denormalization deliberately duplicates or precomputes data for a measured read bottleneck and therefore needs a consistency strategy'
      ],
      [
        /pagination/,
        'Offset pagination must visit skipped rows and can drift under writes; keyset pagination seeks from a stable, unique ordering key'
      ],
      [
        /transaction|locking/,
        'Locks protect concurrent changes but incompatible lock acquisition creates waiting and deadlocks; keep transactions short and acquire resources consistently'
      ],
      [
        /slow quer|statistics|vacuum|analyze|pool|cach|monitor/,
        'Operational tuning uses workload evidence: statement statistics, current waits, fresh planner statistics, vacuum health, bounded connections, cache behavior, and service-level signals'
      ],
      [
        /case study|review|assessment/,
        'A credible optimization records a baseline, identifies the dominant bottleneck, changes one justified variable, verifies correctness, and compares the same workload afterward'
      ]
    ]
  },
  examples: optimizationExamples,
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
