(function () {
  'use strict';
  const clean = value =>
      value.replace(/\s+(Review|Assessment|Final Project|Project|Capstone)$/i, '')
          .trim();
  const lower = value => value.toLowerCase();
  const sentence = value => value.endsWith('.') ? value : `${value}.`;
  const escString = value => JSON.stringify(value);
const key = value =>
    lower(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const conceptCatalog = (title, summary, course, module) => {
  const t = lower(title),
        named = title.split(/,|\band\b|\bvs\.?\b|\//i)
                    .map(item => item.trim())
                    .filter(Boolean);
  const special = [
    [
      /operators/,
      [
        [
          'Arithmetic',
          'Use +, -, *, / and % for numeric calculations; integer division discards the fractional part.'
        ],
        [
          'Comparison and logical',
          'Comparison operators produce boolean values; && and || short-circuit their right operand.'
        ],
        [
          'Assignment and unary',
          'Compound assignments update a variable; unary operators include negation, logical NOT, and increment/decrement.'
        ],
        [
          'Bitwise and ternary',
          'Bitwise operators manipulate integer bits; condition ? a : b selects one expression.'
        ]
      ]
    ],
    [
      /conditions/,
      [
        [
          'if / else if / else',
          'Evaluate boolean branches from top to bottom; only the first matching branch runs.'
        ],
        [
          'switch',
          'Select among discrete values; modern Java switch expressions can yield a value.'
        ],
        [
          'Ternary expression',
          'Choose between two expressions when a compact conditional remains readable.'
        ]
      ]
    ],
    [
      /loops/,
      [
        [
          'for',
          'Use initialization, condition, and update when the iteration count or index matters.'
        ],
        [
          'while',
          'Repeat while a condition remains true; the body may execute zero times.'
        ],
        ['do-while', 'Run the body once before checking whether to repeat.'],
        [
          'Enhanced for',
          'Traverse array or Iterable values without managing an index.'
        ]
      ]
    ],
    [
      /data types/,
      [
        [
          'Primitive values',
          'Java primitives are boolean, byte, short, int, long, float, double, and char.'
        ],
        [
          'Reference values',
          'Classes, arrays, interfaces, records, and enums are reference types and may hold null.'
        ],
        [
          'Conversion',
          'Widening conversions are generally implicit; narrowing numeric conversions require a cast and may lose information.'
        ]
      ]
    ],
    [
      /arrays/,
      [
        [
          'Creation and access',
          'An array has a fixed length, zero-based indexes, and default-initialized elements.'
        ],
        [
          'Mutation and iteration',
          'Assign through an index and traverse with an indexed or enhanced for loop.'
        ],
        [
          'Utility operations',
          'Arrays provides sorting, searching, comparison, copying, and stream creation.'
        ]
      ]
    ],
    [
      /functions and scope|functions/,
      [
        [
          'Definition and return',
          'def creates a function object; return ends the call and supplies its result.'
        ],
        [
          'Parameters',
          'Python supports positional-only, positional-or-keyword, keyword-only, variadic, and default parameters.'
        ],
        [
          'Scope',
          'Name resolution follows LEGB; global and nonlocal explicitly rebind outer names.'
        ]
      ]
    ],
    [
      /list.*tuple.*set.*dictionar/,
      [
        [
          'List',
          'Mutable ordered sequence with index access and duplicate values.'
        ],
        [
          'Tuple',
          'Immutable sequence useful for fixed records and hashable groupings.'
        ],
        [
          'Set',
          'Mutable collection of unique hashable members with set algebra operations.'
        ],
        [
          'Dictionary',
          'Insertion-ordered mapping from unique hashable keys to values.'
        ]
      ]
    ],
    [
      /supervised.*unsupervised.*reinforcement/,
      [
        [
          'Supervised learning',
          'Learn a mapping from features to labeled targets for prediction.'
        ],
        [
          'Unsupervised learning',
          'Discover structure such as clusters or components without target labels.'
        ],
        [
          'Reinforcement learning',
          'Learn a policy from rewards produced by sequential actions.'
        ]
      ]
    ],
    [
      /ridge.*lasso.*elastic/,
      [
        [
          'Ridge',
          'L2 regularization shrinks all coefficients and handles correlated predictors smoothly.'
        ],
        [
          'Lasso',
          'L1 regularization can set coefficients exactly to zero, producing sparse models.'
        ],
        [
          'Elastic Net',
          'Combines L1 and L2 penalties to balance sparsity and stability.'
        ]
      ]
    ],
    [
      /accuracy.*precision.*recall.*f1/,
      [
        [
          'Accuracy',
          'Fraction of all predictions that are correct; misleading when classes are highly imbalanced.'
        ],
        [
          'Precision',
          'Of predicted positives, the fraction that is truly positive.'
        ],
        ['Recall', 'Of actual positives, the fraction the model finds.'],
        ['F1', 'Harmonic mean of precision and recall at a chosen threshold.']
      ]
    ],
    [
      /mae.*mse.*rmse/,
      [
        [
          'MAE',
          'Mean absolute error stays in target units and weights each absolute miss linearly.'
        ],
        [
          'MSE',
          'Mean squared error emphasizes large misses and has squared target units.'
        ],
        [
          'RMSE',
          'Square root of MSE restores target units while retaining large-error sensitivity.'
        ],
        [
          'R-squared',
          'Fraction of variance improved over predicting the target mean; it can be negative on test data.'
        ]
      ]
    ],
    [
      /inner|join types/,
      [
        ['INNER JOIN', 'Keep only row pairs that satisfy the join condition.'],
        [
          'LEFT/RIGHT JOIN',
          'Keep every row from the preserved side and fill unmatched columns with NULL.'
        ],
        ['FULL JOIN', 'Keep matched rows plus unmatched rows from both sides.'],
        [
          'CROSS JOIN',
          'Return the Cartesian product; use deliberately because row counts multiply.'
        ]
      ]
    ],
    [
      /create.*alter.*drop/,
      [
        [
          'CREATE',
          'Define a new schema object such as a table, view, or index.'
        ],
        [
          'ALTER',
          'Change an existing object while considering locks and dependent code.'
        ],
        [
          'DROP',
          'Remove an object; RESTRICT protects dependencies while CASCADE removes them too.'
        ]
      ]
    ],
    [
      /insert.*update.*delete/,
      [
        [
          'INSERT',
          'Add rows, optionally returning generated or normalized values.'
        ],
        ['UPDATE', 'Change columns only in rows matched by its predicate.'],
        ['DELETE', 'Remove matched rows while preserving table structure.']
      ]
    ],
    [
      /authentication.*authorization/,
      [
        [
          'Authentication',
          'Establish who a caller is from credentials or a verified token.'
        ],
        [
          'Authorization',
          'Decide whether that identity may perform a particular action on a resource.'
        ],
        [
          'Session or token lifecycle',
          'Issue, expire, refresh, revoke, and audit credentials deliberately.'
        ]
      ]
    ],
    [
      /cors.*csrf/,
      [
        [
          'CORS',
          'Browser-enforced rules determine which origins may read a cross-origin response.'
        ],
        [
          'CSRF',
          'A forged request abuses automatically attached credentials; tokens or same-site cookies mitigate it.'
        ]
      ]
    ],
    [
      /trend.*seasonality.*stationarity/,
      [
        ['Trend', 'Long-term movement in the series level.'],
        [
          'Seasonality',
          'Repeated structure tied to a known period such as weekday or month.'
        ],
        [
          'Stationarity',
          'Stable statistical behavior required by some classical models after transformation or differencing.'
        ]
      ]
    ],
    [
      /dropout.*batch normalization.*early stopping/,
      [
        [
          'Dropout',
          'Randomly zero activations during training to reduce co-adaptation.'
        ],
        [
          'Batch normalization',
          'Normalize mini-batch activations and learn scale and shift parameters.'
        ],
        [
          'Early stopping',
          'Stop when validation performance no longer improves and restore the best checkpoint.'
        ]
      ]
    ],
    [
      /encoders.*decoders.*bert.*gpt/,
      [
        [
          'Encoder',
          'Build bidirectional contextual representations for understanding tasks.'
        ],
        [
          'Decoder',
          'Generate tokens autoregressively while masking future positions.'
        ],
        [
          'Encoder-decoder',
          'Encode an input sequence and decode a conditioned output sequence.'
        ]
      ]
    ]
  ];
  const hit = special.find(([pattern]) => pattern.test(t));
  if (hit) return hit[1].map(([name, explanation]) => ({name, explanation}));
  if (named.length > 1)
    return named.slice(0, 4).map(
        (name, index) => ({
          name,
          explanation: index === 0 ?
              `${summary}. This part establishes the shared foundation for the other variations.` :
              `${name} must be evaluated separately: its syntax, guarantees, and failure behavior are not interchangeable with ${
                  named[0]}.`
        }));
  const secondary = course.id === 'python-ai' ?
      'Inputs, fitted state, and evaluation' :
      course.id === 'sql' || course.id === 'database-optimization' ?
      'Semantics, planner behavior, and operational cost' :
      course.id === 'spring-boot' ? 'Container or request lifecycle' :
      course.id === 'postman'     ? 'Request contract and automated assertion' :
      course.id === 'firebase-google-cloud' ?
                                'Managed-service boundary and security policy' :
      course.id === 'java-essentials' ?
                                'Compile-time rule and runtime behavior' :
                                'Acceptance evidence and operational handoff';
  return [
    {name: title, explanation: sentence(summary)}, {
      name: secondary,
      explanation: `Within ${module.title}, ${
          title} must be traced from concrete input through its ${
          secondary
              .toLowerCase()} to a verifiable result. The examples below show both the primary operation and a boundary or failure check.`
    }
  ];
}
  const defaultExamples = (course, title, language) => {
  const marker = key(`${course.id}-${title}`);
  if (language === 'java')
    return [
      [
        `${title}: foundation walkthrough`,
        'Compile and run a focused class whose name and output identify this lesson.',
        `final class ${
            marker.split('-')
                .map(x => x[0]?.toUpperCase() + x.slice(1))
                .join('')
                .slice(0, 55)} {\n  static String describe() { return ${
            escString(
                title)}; }\n  public static void main(String[] args) { System.out.println(describe()); }\n}`,
        title
      ],
      [
        `${title}: explicit failure check`,
        'Reject an invalid boundary instead of silently continuing.',
        `String value = ${
            escString(
                title)};\nif (value.isBlank()) throw new IllegalArgumentException("${
            marker} requires a value");\nSystem.out.println(value.length());`,
        String(title.length)
      ]
    ];
  if (language === 'sql')
    return [
      [
        `${title}: inspect the workload`,
        'Run a statement tied to the lesson and inspect actual database work.',
        `/* ${
            marker} */\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, title FROM lessons\nWHERE course_id = 42 ORDER BY id LIMIT 10;`,
        'A measured PostgreSQL execution plan'
      ],
      [
        `${title}: verify the result`,
        'Use an aggregate invariant to catch missing or duplicated rows.',
        `/* verify-${
            marker} */\nSELECT COUNT(*) AS rows, COUNT(DISTINCT id) AS unique_ids\nFROM lessons\nWHERE course_id = 42;`,
        'rows equals unique_ids when identifiers are not duplicated'
      ]
    ];
  if (language === 'javascript')
    return [
      [
        `${title}: integration workflow`,
        'Represent the lesson boundary with explicit inputs and an observable result.',
        `// ${marker}\nconst input = Object.freeze({ lesson: ${
            escString(
                title)}, enabled: true });\nconst result = { ...input, checkedAt: "2026-08-12" };\nconsole.log(result);`,
        'An immutable input and derived result'
      ],
      [
        `${title}: rejected input`,
        'Prove that the invalid path is handled deliberately.',
        `// validate-${
            marker}\nfunction validate(value) {\n  if (!value || typeof value !== "object") throw new TypeError("${
            marker}: object required");\n  return true;\n}\nconsole.log(validate({ topic: ${
            escString(title)} }));`,
        'true; invalid inputs throw TypeError'
      ]
    ];
  if (language === 'text')
    return [
      [
        `${title}: verification checklist`,
        'Define observable behavior before implementation.',
        `# ${
            marker}\nGiven a learner with valid access\nWhen the learner completes the primary workflow\nThen progress is saved once and visible after reload\nAnd unauthorized access is rejected`,
        'Four testable acceptance statements'
      ],
      [
        `${title}: delivery evidence`,
        'Record the minimum evidence expected at handoff.',
        `artifact: ${
            marker}\nevidence:\n  - automated test report\n  - deployment URL and revision\n  - rollback procedure\n  - security and accessibility review`,
        'A reviewable delivery checklist'
      ]
    ];
  return [
    [
      `${title}: guided implementation`,
      'Use a deterministic value and print the exact transformation.',
      `# ${marker}\nfrom hashlib import sha256\nvalue = ${
          escString(title)}\nprint(sha256(value.encode()).hexdigest()[:12])`,
      'A stable 12-character digest'
    ],
    [
      `${title}: boundary assertion`,
      'State and verify an invariant specific to the lesson input.',
      `# check-${marker}\nvalue = ${
          escString(
              title)}\nassert value and value == value.strip()\nprint(len(value.split()))`,
      'The number of words in the lesson title'
    ]
  ];
};

const inferLanguage = (fallback, code) => {
  const trimmed = code.trim();
  if (/^\{[\s\S]*"(?:hosting|emulators|rule)"\s*:/.test(trimmed)) return 'json';
  if (/^(GET|POST|PUT|PATCH|DELETE|HTTP\/)/.test(trimmed)) return 'http';
  if (/^(gcloud|firebase|newman|postman |python -m|\.\/|npm |docker |curl )/m
          .test(trimmed))
    return 'bash';
  // SQL commonly contains lines beginning with FROM. Detect it before the
  // Dockerfile grammar so database examples are not misclassified.
  if (/^(CREATE|SELECT|INSERT|UPDATE|DELETE|BEGIN|EXPLAIN|--|\/\*)/i.test(
          trimmed) &&
      fallback === 'sql')
    return 'sql';
  if (/^FROM\s|^WORKDIR\s|^COPY\s|^RUN\s|^USER\s|^CMD\s/m.test(trimmed))
    return 'dockerfile';
  if (/^(FROM |RUN useradd|ENTRYPOINT)/m.test(trimmed)) return 'dockerfile';
  if (/^(rules_version|service cloud\.|match \/|allow update:)/m.test(trimmed))
    return 'javascript';
  if (/^(spring\.|management\.|academy:|logging:|# application-)/m.test(
          trimmed))
    return trimmed.includes(':\n') ? 'yaml' : 'properties';
  if (/^(<dependency>|<project>)/.test(trimmed)) return 'xml';
  return fallback;
}

  window.DevPathLessonContent = {
    clean,
    lower,
    sentence,
    escString,
    key,
    conceptCatalog,
    defaultExamples,
    inferLanguage
  };
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
})();
