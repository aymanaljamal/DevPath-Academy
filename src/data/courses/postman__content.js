(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const postmanExamples = title => {
  const t = lower(title);
  if (t === 'environments and secret values')
    return [
      [
        'Switch deploy targets',
        'Use the same request with environment-specific baseUrl and non-secret identifiers.',
        `GET {{baseUrl}}/api/courses/{{courseId}}\nAccept: application/json`,
        'The selected environment supplies host and course ID'
      ],
      [
        'Read a secret from Vault',
        'Vault-backed values are not exported with collections or environments.',
        `const token = await pm.vault.get("academy-api-token");\npm.request.headers.upsert({ key: "Authorization", value: "Bearer " + token });`,
        'Authorization header assembled at runtime without a shared token value'
      ]
    ];
  if (t === 'variables and scope')
    return [
      [
        'Observe scope resolution',
        'A local value overrides data, environment, collection, and global scopes for the current request.',
        `pm.collectionVariables.set("courseId", "42");\npm.environment.set("courseId", "84");\npm.variables.set("courseId", "126");\nconsole.log(pm.variables.get("courseId"));`,
        '126'
      ],
      [
        'Write to an intentional scope',
        'Persist a created identifier in the environment only when later requests in that deploy target need it.',
        `const body=pm.response.json();\npm.expect(body.id).to.exist;\npm.environment.set("createdCourseId",String(body.id));`,
        'createdCourseId available to later requests in the environment'
      ]
    ];
  if (/introduction/.test(t))
    return [
      [
        'Send a saved request',
        'A request records the method, URL, and expected media type.',
        `GET {{baseUrl}}/api/lessons/42 HTTP/1.1\nAccept: application/json`,
        '200 with one lesson representation'
      ],
      [
        'Add a first contract test',
        'Use the post-response script to check behavior, not only connectivity.',
        `pm.test("returns one lesson", () => {\n  pm.response.to.have.status(200);\n  pm.expect(pm.response.json()).to.include.keys("id", "title");\n});`,
        'The request run reports a passing test'
      ]
    ];
  if (/anatomy|params|headers|body/.test(t))
    return [
      [
        'Compose an HTTP request',
        'The query filters, headers describe representation, and JSON body carries resource state.',
        `POST {{baseUrl}}/api/lessons?notify=true HTTP/1.1\nAuthorization: Bearer {{accessToken}}\nContent-Type: application/json\nAccept: application/json\n\n{"title":"HTTP anatomy","durationMinutes":30}`,
        '201 Created with a Location header'
      ],
      [
        'Inspect each response part',
        'Assert status, content type, header, and parsed body separately.',
        `pm.test("created response contract", () => {\n  pm.response.to.have.status(201);\n  pm.expect(pm.response.headers.get("Content-Type")).to.match(/^application\\/json/);\n  pm.expect(pm.response.headers.has("Location")).to.be.true;\n  pm.expect(pm.response.json().title).to.eql("HTTP anatomy");\n});`,
        'Four contract assertions pass'
      ]
    ];
  if (/methods|status|idempotency/.test(t))
    return [
      [
        'Compare method semantics',
        'GET is safe; PUT targets a known resource and should be idempotent.',
        `PUT {{baseUrl}}/api/lessons/42 HTTP/1.1\nContent-Type: application/json\n\n{"title":"Updated lesson","published":true}`,
        'Repeated identical PUT requests leave the same resource state'
      ],
      [
        'Accept the documented status set',
        'A deletion may return content or no content depending on the contract.',
        `pm.test("delete completed", () => {\n  pm.expect(pm.response.code).to.be.oneOf([200, 204]);\n  if (pm.response.code === 204) pm.expect(pm.response.text()).to.eql("");\n});`,
        '200 or 204 according to the API contract'
      ]
    ];
  if (/response.*timing/.test(t))
    return [
      [
        'Inspect diagnostic metadata',
        'Log request ID only when troubleshooting and avoid secret headers.',
        `console.log({\n  status: pm.response.code,\n  milliseconds: pm.response.responseTime,\n  requestId: pm.response.headers.get("X-Request-Id")\n});`,
        'A status, measured client time, and correlation ID'
      ],
      [
        'Use a justified timing threshold',
        'Treat response-time checks as environment-specific service goals.',
        `pm.test("meets staging latency budget", () => {\n  pm.expect(pm.response.responseTime).to.be.below(800);\n});`,
        'Fails when the observed time is 800 ms or more'
      ]
    ];
  if (/^collections and folders$/.test(t))
    return [
      [
        'Collection-level authorization',
        'Reuse inherited authorization without copying it into each request.',
        `// Collection pre-request script\npm.request.headers.upsert({\n  key: "X-Client-Version",\n  value: pm.collectionVariables.get("clientVersion")\n});`,
        'Every child request receives X-Client-Version'
      ],
      [
        'Folder-level scenario setup',
        'Initialize data only for the workflow folder.',
        `if (!pm.iterationData.has("courseId")) {\n  pm.variables.set("courseId", "42");\n}`,
        'courseId is available to requests in the run'
      ]
    ];
  if (/^(variables and scope|environments and secret values)$/.test(t))
    return [
      [
        'Resolve scoped values',
        'Use environment values for deploy targets and local values for temporary overrides.',
        `const base = pm.environment.get("baseUrl");\nconst course = pm.collectionVariables.get("courseId");\nconst temporary = pm.variables.get("requestId");\nconsole.log({ base, course, temporary });`,
        'The resolved values at their intended scopes'
      ],
      [
        'Keep credentials out of exports',
        'Read a secret from Postman Vault and place only the runtime token in the header.',
        `const token = await pm.vault.get("academy-access-token");\npm.request.headers.upsert({ key: "Authorization", value: "Bearer " + token });`,
        'Authorization is created at runtime; the secret is not a shared variable'
      ]
    ];
  if (/dynamic|test data/.test(t))
    return [
      [
        'Generate unique data',
        'Dynamic variables create values when the request is resolved.',
        `{\n  "email": "{{$randomEmail}}",\n  "displayName": "Learner {{$randomFirstName}}"\n}`,
        'A different realistic payload per resolution'
      ],
      [
        'Persist a generated key for this request',
        'Use a local variable to reuse one generated value consistently.',
        `const key = pm.variables.replaceIn("{{$guid}}");\npm.variables.set("idempotencyKey", key);\npm.request.headers.upsert({ key: "Idempotency-Key", value: key });`,
        'One UUID reused through the request'
      ]
    ];
  if (/chaining/.test(t))
    return [
      [
        'Capture an identifier',
        'Validate the creation response before saving its ID.',
        `const body = pm.response.json();\npm.test("created lesson has id", () => {\n  pm.expect(body.id).to.be.a("number");\n});\npm.collectionVariables.set("lessonId", String(body.id));`,
        'lessonId is available to the next request'
      ],
      [
        'Clean up the created resource',
        'Reference the captured ID in a later request.',
        `DELETE {{baseUrl}}/api/lessons/{{lessonId}} HTTP/1.1\nAuthorization: Bearer {{accessToken}}`,
        '204 No Content, then the variable can be unset'
      ]
    ];
  if (/^post-response tests$/.test(t))
    return [
      [
        'Assert a nested response',
        'Check types and values after parsing JSON once.',
        `pm.test("published lesson contract", () => {\n  const lesson = pm.response.json();\n  pm.expect(lesson).to.have.property("published", true);\n  pm.expect(lesson.tags).to.be.an("array").that.includes("api");\n});`,
        'The test appears by name in the run report'
      ],
      [
        'Test an error response',
        'Negative responses need stable machine-readable fields.',
        `pm.test("validation error is actionable", () => {\n  pm.response.to.have.status(422);\n  pm.expect(pm.response.json()).to.deep.include({ code: "VALIDATION_FAILED" });\n});`,
        '422 with the documented error code'
      ]
    ];
  if (/pre-request/.test(t))
    return [
      [
        'Sign a timestamped request',
        'Derive a signature immediately before sending.',
        `const timestamp = new Date().toISOString();\nconst payload = pm.request.body?.raw || "";\nconst signature = CryptoJS.HmacSHA256(timestamp + payload, pm.environment.get("signingSecret")).toString();\npm.request.headers.upsert({ key: "X-Timestamp", value: timestamp });\npm.request.headers.upsert({ key: "X-Signature", value: signature });`,
        'Fresh signature headers on every send'
      ],
      [
        'Refresh only when expired',
        'Inspect token expiry and request a refresh rather than refreshing unconditionally.',
        `const expiresAt = Number(pm.environment.get("expiresAt") || 0);\nif (Date.now() >= expiresAt) {\n  pm.execution.setNextRequest("Refresh access token");\n}`,
        'Runner branches to refresh only after expiry'
      ]
    ];
  if (/json schema/.test(t))
    return [
      [
        'Define required response shape',
        'JSON Schema separates structural checks from individual value assertions.',
        `const schema = {\n  type: "object", required: ["id", "title", "published"], additionalProperties: false,\n  properties: { id: {type:"integer", minimum:1}, title:{type:"string", minLength:1}, published:{type:"boolean"} }\n};\npm.test("matches lesson schema", () => pm.response.to.have.jsonSchema(schema));`,
        'Schema validation passes for a valid lesson'
      ],
      [
        'Model a list response',
        'Validate every array item and its nullable field.',
        `const schema = { type:"array", items:{ type:"object", required:["id","completedAt"], properties:{ id:{type:"integer"}, completedAt:{type:["string","null"]} } } };\npm.test("progress list schema", () => pm.response.to.have.jsonSchema(schema));`,
        'Every item satisfies the same contract'
      ]
    ];
  if (/collection runner/.test(t))
    return [
      [
        'Iterate a data file',
        'Reference iteration fields through pm.iterationData.',
        `[\n  {"score":69,"expected":422},\n  {"score":70,"expected":201},\n  {"score":100,"expected":201}\n]`,
        'Three runner iterations around the boundary'
      ],
      [
        'Control workflow order',
        'Use setNextRequest only in collection runs and terminate explicitly.',
        `if (pm.response.code === 201) pm.execution.setNextRequest("Delete created lesson");\nelse pm.execution.setNextRequest(null);`,
        'Successful iterations clean up; failures stop'
      ]
    ];
  if (/ci pipelines/.test(t))
    return [
      [
        'Pipeline test step',
        'Use the current Postman CLI for new collection formats and publish a JUnit report.',
        `postman collection run postman/collections/academy \\\n+  --environment ci.postman_environment.json \\\n+  --reporters cli,junit --reporter-junit-export test-results/postman.xml`,
        'The CI job fails on a request or assertion failure'
      ],
      [
        'Separate staging credentials',
        'Use staging secrets before a distinct approved deployment job.',
        `$env:API_BASE_URL=$env:STAGING_URL\n$env:API_ACCESS_TOKEN=$env:STAGING_TOKEN\npostman collection run postman/collections/academy --bail failure`,
        'API tests receive only staging credentials'
      ]
    ];
  if (/negative|boundary/.test(t))
    return [
      [
        'Boundary data table',
        'Use runner data to exercise values just below, at, and above limits.',
        `const name = "score " + pm.iterationData.get("score") + " -> " + pm.iterationData.get("expected");\npm.test(name, () => {\n  pm.expect(pm.response.code).to.eql(Number(pm.iterationData.get("expected")));\n});`,
        'One named assertion per data row'
      ],
      [
        'Reject missing authorization',
        'Verify both status and challenge semantics.',
        `pm.test("anonymous request is rejected", () => {\n  pm.response.to.have.status(401);\n  pm.expect(pm.response.headers.get("WWW-Authenticate")).to.match(/^Bearer/);\n});`,
        '401 with a Bearer challenge'
      ]
    ];
  if (/runner|newman|ci/.test(t))
    return [
      [
        'Run deterministically from CLI',
        'Pass files and reporters explicitly; the exit code gates automation.',
        `newman run academy.postman_collection.json \\\n  -e staging.postman_environment.json \\\n  -d boundary-cases.json \\\n  --bail --reporters cli,junit \\\n  --reporter-junit-export reports/postman.xml`,
        'Exit 0 only when requests and tests pass'
      ],
      [
        'CI secret injection',
        'Provide secrets from the CI store rather than committing environment values.',
        `newman run academy.postman_collection.json \\\n  --env-var "baseUrl=$API_BASE_URL" \\\n  --env-var "accessToken=$API_ACCESS_TOKEN" \\\n  --color off`,
        'A portable run using masked CI values'
      ]
    ];
  if (/collection runner/.test(t))
    return [
      [
        'Iterate a data file',
        'Reference iteration fields through pm.iterationData.',
        `[\n  {"score":69,"expected":422},\n  {"score":70,"expected":201},\n  {"score":100,"expected":201}\n]`,
        'Three runner iterations around the boundary'
      ],
      [
        'Control workflow order',
        'Use setNextRequest only in collection runs and terminate explicitly.',
        `if (pm.response.code === 201) pm.execution.setNextRequest("Delete created lesson");\nelse pm.execution.setNextRequest(null);`,
        'Successful iterations clean up; failures stop'
      ]
    ];
  if (/ci pipelines/.test(t))
    return [
      [
        'Pipeline test step',
        'Install dependencies and publish a machine-readable report.',
        `npm ci\nnpx newman run academy.postman_collection.json --environment ci.postman_environment.json --reporters cli,junit`,
        'The CI job fails on a request or assertion failure'
      ],
      [
        'Separate staging credentials',
        'Use staging secrets before a distinct approved deployment job.',
        `$env:API_BASE_URL=$env:STAGING_URL\n$env:API_ACCESS_TOKEN=$env:STAGING_TOKEN\nnpm run test:api`,
        'API tests receive only staging credentials'
      ]
    ];
  if (/openapi/.test(t))
    return [
      [
        'Import a contract operation',
        'An OpenAPI operation becomes a request with parameter and schema metadata.',
        `paths:\n  /lessons/{id}:\n    get:\n      operationId: getLesson\n      parameters:\n        - in: path\n          name: id\n          required: true\n          schema: { type: integer, minimum: 1 }`,
        'A generated GET /lessons/:id request'
      ],
      [
        'Detect contract drift',
        'Assert the response media type and schema represented by the API definition.',
        `pm.test("operation contract", () => {\n  pm.response.to.have.status(200);\n  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");\n});`,
        'A focused synchronization check'
      ]
    ];
  if (/mock/.test(t))
    return [
      [
        'Match a saved example',
        'Mocks choose examples from method, path, parameters, and headers.',
        `GET {{mockUrl}}/api/lessons/42 HTTP/1.1\nx-mock-response-name: Published lesson`,
        'The specifically named saved example'
      ],
      [
        'Simulate an error contract',
        'Store a 404 example so clients can build failure UI before the API exists.',
        `HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{"code":"LESSON_NOT_FOUND","message":"Lesson 42 does not exist"}`,
        'A deterministic 404 mock response'
      ]
    ];
  if (/monitor/.test(t))
    return [
      [
        'Monitor a health journey',
        'Use public or dedicated low-privilege credentials and lightweight assertions.',
        `pm.test("service is healthy", () => {\n  pm.response.to.have.status(200);\n  pm.expect(pm.response.json().status).to.eql("UP");\n});`,
        'A scheduled pass or actionable alert'
      ],
      [
        'Record a useful failure', 'Log a correlation ID, never the token.',
        `if (pm.response.code >= 500) {\n  console.error("request failed", pm.response.headers.get("X-Request-Id"));\n}`,
        'A diagnostic ID in monitor logs'
      ]
    ];
  if (/security hygiene/.test(t))
    return [
      [
        'Prevent secret leakage',
        'Fail a run if a shared variable contains a token-shaped value.',
        `for (const item of pm.collectionVariables.values.all()) {\n  pm.test("shared variable is not a bearer token: " + item.key, () => {\n    pm.expect(String(item.value || "")).not.to.match(/^eyJ[A-Za-z0-9_-]+\\./);\n  });\n}`,
        'A named failure for any token-like collection value'
      ],
      [
        'Use least-privilege runtime credentials',
        'Inject a short-lived token and clear local overrides after the request.',
        `pm.request.headers.upsert({ key:"Authorization", value:"Bearer " + pm.environment.get("accessToken") });\npm.test("token not echoed", () => pm.expect(pm.response.text()).not.to.include(pm.environment.get("accessToken")));`,
        'Authorization sent but not reflected'
      ]
    ];
  if (/examples.*documentation/.test(t))
    return [
      [
        'Save a representative example',
        'Give the response a scenario name and include headers that affect clients.',
        `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":42,"title":"Postman","published":true}`,
        'A reusable Published lesson example'
      ],
      [
        'Document the request contract',
        'Explain variables and failure behavior beside the saved request.',
        `### Get lesson\nReturns one lesson by numeric ID.\n- 200: representation returned\n- 401: valid Bearer token missing\n- 404: lesson does not exist\nExample: GET {{baseUrl}}/api/lessons/42`,
        'Readable collection documentation'
      ]
    ];
  if (/workspace/.test(t))
    return [
      [
        'Workspace folder design',
        'Organize by resource and scenario rather than by team member.',
        `Academy API/\n  Auth/Sign in\n  Courses/Create course\n  Courses/Get course\n  Courses/Publish course\n  Cleanup/Delete test course`,
        'A reviewable workflow-oriented collection'
      ],
      [
        'Portable smoke run',
        'Use variables and cleanup so another developer can run from a clean workspace.',
        `newman run academy.postman_collection.json -e local.postman_environment.json --folder "Courses" --bail`,
        'The Courses workflow passes without manual state'
      ]
    ];
  if (/review|assessment/.test(t))
    return [
      [
        'Contract review run',
        'Execute success, validation, authentication, not-found, and cleanup folders.',
        `newman run academy.postman_collection.json \\\n  -e assessment.postman_environment.json \\\n  --folder "Success" --folder "Validation" --folder "Security" --folder "Cleanup" \\\n  --reporters cli,junit`,
        'A report covering positive and negative contracts'
      ],
      [
        'Assessment invariant',
        'Fail when the collection contains an unresolved variable.',
        `pm.test("URL contains no unresolved variables", () => {\n  pm.expect(pm.request.url.toString()).not.to.match(/{{[^}]+}}/);\n});`,
        'Every request resolves its runtime inputs'
      ]
    ];
  return null;
};
window.ACADEMY_LESSON_SPECS.postman = {
  ...{
    context: 'API testing workflows',
    language: 'javascript',
    concepts: [
      [
        /introduction/,
        'Postman is an API collaboration client: a saved request combines method, URL, headers, authorization, body, scripts, examples, and documentation'
      ],
      [
        /request and response|methods|status|idempotency|params|headers|body|response|timing/, 'HTTP exchanges a method, target, headers, and optional representation for a status code, headers, and optional response body; semantics matter more than button clicks'
      ],
      [
        /collection|folder/,
        'Collections group reusable requests and folders organize scenarios, authorization, scripts, documentation, and runner order'
      ],
      [
        /variable|environment|secret/,
        'Postman resolves variables by scope and precedence; environments separate deploy targets, while secret values require vault or CI secret handling'
      ],
      [
        /dynamic|test data|chaining/,
        'Scripts can create data and capture a response value for a later request, turning independent calls into a reproducible workflow'
      ],
      [
        /post-response|pre-request|schema|negative|boundary/,
        'Pre-request scripts prepare inputs; post-response tests assert observable contracts including status, headers, schema, values, and failure behavior'
      ],
      [
        /runner|newman|ci/,
        'Collection Runner executes workflows interactively; the current Postman CLI automates modern collections in CI, while Newman remains appropriate for existing Collection v2.1 JSON workflows and does not support the v3 format'
      ],
      [
        /openapi|mock|examples|documentation|monitor/,
        'API definitions and saved examples align producers and consumers; mocks unblock clients and monitors run lightweight checks on a schedule'
      ],
      [
        /security|token/,
        'Credentials are test inputs, not collection content: keep them out of exports and logs, use least privilege, rotate them, and scope sharing deliberately'
      ],
      [
        /workspace|review|assessment/,
        'A maintainable API workspace proves success and failure paths, uses portable variables, avoids secrets, and can run unattended from a clean environment'
      ]
    ]
  },
  examples: postmanExamples,
  guidanceRules: [
      [
        /http|method|status|param|header|body|response|timing/,
        [
          'Specify and verify the Academy API request/response contract from the client perspective.',
          [
            'Sending a body with the wrong Content-Type.',
            'Checking only status while ignoring response shape.',
            'Treating client-observed response time as server execution time.'
          ],
          [
            'Assert method semantics, status, media type, and meaningful fields.',
            'Save representative success and error examples.',
            'Use environment-appropriate latency budgets.'
          ]
        ]
      ],
      [
        /collection|folder|variable|environment|dynamic|chaining|secret/,
        [
          'Build a portable Academy workspace that moves data safely through a multi-request workflow.',
          [
            'Storing tokens in collection variables or exported environments.',
            'Depending on local variables another runner cannot reproduce.',
            'Capturing a response field before asserting it exists.'
          ],
          [
            'Use the narrowest variable scope.',
            'Name environments by deploy target and keep secrets in Vault or CI.',
            'Clean up data created by chained tests.'
          ]
        ]
      ],
      [
        /test|script|schema|negative|boundary|runner|newman|ci/,
        [
          'Run positive and negative Academy API contracts unattended in local and CI environments.',
          [
            'Writing assertions that never fail.',
            'Using fixed test data that collides across parallel runs.',
            'Ignoring Newman exit codes in CI.'
          ],
          [
            'Give every assertion a diagnostic name.',
            'Generate or isolate data and always clean up.',
            'Publish machine-readable reports and fail the pipeline on contract regression.'
          ]
        ]
      ],
      [
        /openapi|mock|example|documentation|monitor|security|workspace|review|assessment/,
        [
          'Align API consumers, documentation, mocks, monitoring, and security around one reviewed contract.',
          [
            'Allowing examples to drift from the API definition.',
            'Using production credentials in a monitor.',
            'Treating a mock response as evidence the backend works.'
          ],
          [
            'Synchronize contract changes deliberately.',
            'Use low-privilege monitoring identities.',
            'Review saved examples for realistic status, headers, and bodies.'
          ]
        ]
      ]
    ]
};
})();
