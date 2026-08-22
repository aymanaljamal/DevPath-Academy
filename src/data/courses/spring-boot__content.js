(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const springExamples =
    title => {
      const t = lower(title);
      if (t === 'testing services')
        return [
          [
            'Unit-test service behavior',
            'Construct the service with a mocked port and assert its public result without loading Spring.',
            `@ExtendWith(MockitoExtension.class)\nclass CourseServiceTest {\n  @Mock CourseRepository repository; @InjectMocks CourseService service;\n  @Test void returnsStoredCourse() {\n    when(repository.findById(42L)).thenReturn(Optional.of(new Course(42L,"Spring")));\n    assertEquals("Spring",service.find(42L).title());\n  }\n}`,
            'A fast service unit test'
          ],
          [
            'Verify the command boundary',
            'Assert the meaningful persistence request rather than internal helper calls.',
            `@Test void publishesCourse() {\n  var course=new Course(42L,"Spring"); when(repository.findById(42L)).thenReturn(Optional.of(course));\n  service.publish(42L);\n  assertTrue(course.isPublished()); verify(repository).findById(42L);\n}`,
            'Publication behavior and repository interaction verified'
          ]
        ];
      if (t === 'integration testing')
        return [
          [
            'Exercise the complete application context',
            'Use a random port to test serialization, routing, services, and persistence together.',
            `@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass CourseApiIT {\n  @Autowired TestRestTemplate http;\n  @Test void createsCourse() {\n    var response=http.postForEntity("/api/courses",new CreateCourseRequest("Spring"),CourseResponse.class);\n    assertEquals(HttpStatus.CREATED,response.getStatusCode());\n  }\n}`,
            '201 through the real HTTP stack'
          ],
          [
            'Reset durable test state',
            'Use deterministic fixtures and cleanup so tests remain independent.',
            `@Sql(scripts="/test-data.sql",executionPhase=Sql.ExecutionPhase.BEFORE_TEST_METHOD)\n@Sql(scripts="/cleanup.sql",executionPhase=Sql.ExecutionPhase.AFTER_TEST_METHOD)\n@Test void listsSeededCourses() { ... }`,
            'Known database state before and after the test'
          ]
        ];
      if (t === 'database testing with testcontainers')
        return [
          [
            'Start the production database engine',
            'A PostgreSQL container catches dialect, constraint, and migration behavior an in-memory substitute misses.',
            `@Testcontainers\n@SpringBootTest\nclass CourseRepositoryIT {\n  @Container static PostgreSQLContainer<?> postgres=new PostgreSQLContainer<>("postgres:17-alpine");\n  @DynamicPropertySource static void database(DynamicPropertyRegistry r) {\n    r.add("spring.datasource.url",postgres::getJdbcUrl); r.add("spring.datasource.username",postgres::getUsername); r.add("spring.datasource.password",postgres::getPassword);\n  }\n}`,
            'Spring connects to an isolated PostgreSQL container'
          ],
          [
            'Prove a real constraint',
            'Persist duplicate business keys and assert the database rejects them.',
            `@Test void titleMustBeUnique() {\n  repository.saveAndFlush(new Course("SQL"));\n  assertThrows(DataIntegrityViolationException.class,()->repository.saveAndFlush(new Course("SQL")));\n}`,
            'A PostgreSQL uniqueness violation translated by Spring'
          ]
        ];
      if (t === 'spring boot deployment')
        return [
          [
            'Externalize runtime configuration',
            'Deploy one artifact and supply database and profile values from the environment.',
            `SPRING_PROFILES_ACTIVE=prod\nSPRING_DATASOURCE_URL=jdbc:postgresql://db.internal:5432/academy\nJAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75`,
            'Environment-specific settings without rebuilding'
          ],
          [
            'Stop gracefully',
            'Enable a shutdown window so in-flight requests finish before process termination.',
            `server.shutdown=graceful\nspring.lifecycle.timeout-per-shutdown-phase=30s`,
            'Up to thirty seconds for graceful lifecycle shutdown'
          ]
        ];
      if (t === 'monitoring with actuator')
        return [
          [
            'Expose a narrow management surface',
            'Publish health and info while keeping sensitive endpoints protected.',
            `management.endpoints.web.exposure.include=health,info\nmanagement.endpoint.health.probes.enabled=true\nmanagement.endpoint.health.show-details=when_authorized`,
            'Liveness/readiness health and authorized details'
          ],
          [
            'Add a domain health contributor',
            'Report dependency state without throwing from the health endpoint.',
            `@Component\nclass CatalogHealth implements HealthIndicator {\n  public Health health() { return catalog.ping()?Health.up().build():Health.down().withDetail("dependency","catalog").build(); }\n}`,
            'UP or DOWN catalog health component'
          ]
        ];
      if (t === 'observability with micrometer')
        return [
          [
            'Record a domain counter',
            'Use low-cardinality tags so the time-series count stays bounded.',
            `Counter published=Counter.builder("academy.course.published").tag("channel","api").register(registry);\npublished.increment();`,
            'academy.course.published_total increases'
          ],
          [
            'Time service work',
            'A Timer records count and latency distribution around one operation.',
            `Timer timer=Timer.builder("academy.course.load").publishPercentileHistogram().register(registry);\nCourse course=timer.record(()->repository.findById(id).orElseThrow());`,
            'Load duration contributes to a histogram'
          ]
        ];
      if (t === 'secrets and secure configuration')
        return [
          [
            'Import a mounted secret',
            'Spring config trees map file names to property names without embedding values in the image.',
            `spring.config.import=optional:configtree:/run/secrets/\nacademy.mail.password=\${mail-password}`,
            'mail-password read from a runtime-mounted file'
          ],
          [
            'Keep secrets out of logs',
            'Bind a secret property but never include it in toString or startup diagnostics.',
            `@ConfigurationProperties("academy.mail")\nrecord MailSecrets(String username, String password) {\n  @Override public String toString() { return "MailSecrets[username="+username+",password=REDACTED]"; }\n}`,
            'Secret value remains redacted'
          ]
        ];
      if (t === 'rate limiting')
        return [
          [
            'Limit by authenticated subject',
            'Reject excess requests with 429 and a retry hint at an edge or filter boundary.',
            `Bucket bucket=buckets.forUser(authentication.getName());\nConsumptionProbe probe=bucket.tryConsumeAndReturnRemaining(1);\nif (!probe.isConsumed()) { response.setStatus(429); response.setHeader("Retry-After",Long.toString(probe.getNanosToWaitForRefill()/1_000_000_000)); return; }`,
            'Allowed request or 429 with Retry-After'
          ],
          [
            'Separate limits by operation cost',
            'Give expensive exports a smaller budget than cached reads.',
            `Map<String,Bandwidth> policies=Map.of(\n  "course-read",Bandwidth.simple(120,Duration.ofMinutes(1)),\n  "report-export",Bandwidth.simple(5,Duration.ofMinutes(1)));`,
            'Two cost-aware rate policies'
          ]
        ];
      if (t === 'production best practices')
        return [
          [
            'Fail startup on invalid configuration',
            'Validated configuration prevents a partially working deployment.',
            `@ConfigurationProperties("academy")\n@Validated\nrecord AcademyProperties(@NotBlank String publicUrl,@DurationMin(seconds=1) Duration timeout) {}`,
            'Startup failure for a missing URL or unsafe timeout'
          ],
          [
            'Define release evidence',
            'Smoke tests prove health and one critical authenticated journey after deployment.',
            `curl --fail https://academy.example/actuator/health/readiness\ncurl --fail --header "Authorization: Bearer $TOKEN" https://academy.example/api/courses/42`,
            'Healthy dependency state and accessible critical endpoint'
          ]
        ];
      if (t === 'microservices introduction')
        return [
          [
            'Define a service boundary',
            'A course service owns its data and publishes a versioned contract instead of sharing tables.',
            `GET /api/v1/courses/42\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":42,"title":"Spring","version":3}`,
            'A versioned service-owned resource'
          ],
          [
            'Design for partial failure',
            'Every remote call needs a timeout, bounded retry policy, and user-visible fallback decision.',
            `var request=HttpRequest.newBuilder(courseUri).timeout(Duration.ofSeconds(2)).GET().build();\n// Retry only idempotent failures with jitter and an overall deadline.`,
            'A two-second call boundary'
          ]
        ];
      if (t === 'spring cloud basics')
        return [
          [
            'Import shared configuration',
            'Spring Cloud Config can add remote property sources while local defaults remain explicit.',
            `spring:\n  application:\n    name: course-service\n  config:\n    import: optional:configserver:http://config:8888`,
            'course-service configuration imported when server is available'
          ],
          [
            'Refresh only deliberate properties',
            'Place dynamically refreshed settings behind a configuration-properties boundary.',
            `@ConfigurationProperties("academy.features")\npublic record FeatureProperties(boolean recommendations) {}`,
            'One typed feature setting from the environment'
          ]
        ];
      if (t === 'api gateway')
        return [
          [
            'Route by path',
            'The gateway matches a public path and removes its external prefix before forwarding.',
            `spring:\n  cloud:\n    gateway:\n      routes:\n        - id: courses\n          uri: lb://course-service\n          predicates: [Path=/api/courses/**]\n          filters: [StripPrefix=1]`,
            'Matching requests routed to course-service'
          ],
          [
            'Apply cross-cutting policy once',
            'Authentication, request IDs, rate limits, and size limits belong at the edge while resource authorization remains downstream.',
            `return chain.filter(exchange.mutate().request(request.mutate().header("X-Request-Id",requestId).build()).build());`,
            'Downstream request carries one correlation ID'
          ]
        ];
      if (t === 'service discovery')
        return [
          [
            'Register and resolve a logical service',
            'Clients use the service name while discovery selects a healthy instance.',
            `@LoadBalanced @Bean\nRestClient.Builder loadBalancedRestClient() { return RestClient.builder(); }\n\nCourseView course=builder.build().get().uri("http://course-service/api/courses/{id}",id).retrieve().body(CourseView.class);`,
            'A request resolved to a registered course-service instance'
          ],
          [
            'Remove unhealthy instances',
            'Readiness must represent whether an instance can serve traffic, not merely whether its process exists.',
            `management.endpoint.health.probes.enabled=true\nmanagement.health.readinessstate.enabled=true`,
            'Discovery/load balancer can avoid unready instances'
          ]
        ];
      if (t === 'feign client')
        return [
          [
            'Declare an HTTP client contract',
            'The interface names method, path, parameter, and response without manual request construction.',
            `@FeignClient(name="course-service")\ninterface CourseClient {\n  @GetMapping("/api/courses/{id}") CourseView find(@PathVariable long id);\n}`,
            'A generated client backed by course-service discovery'
          ],
          [
            'Translate remote errors',
            'A custom ErrorDecoder preserves status and service context rather than returning null.',
            `class CourseErrorDecoder implements ErrorDecoder {\n  public Exception decode(String key, Response response) {\n    return response.status()==404 ? new RemoteCourseNotFound(key) : new RemoteCourseFailure(response.status());\n  }\n}`,
            'Typed remote failure from an HTTP response'
          ]
        ];
      if (t === 'resilience4j')
        return [
          [
            'Wrap a remote dependency',
            'Circuit breaker and time limiter contain repeated failures and latency.',
            `@CircuitBreaker(name="catalog",fallbackMethod="fallback")\n@TimeLimiter(name="catalog")\nCompletableFuture<CourseView> course(long id) { return client.findAsync(id); }`,
            'Remote result or declared fallback after policy'
          ],
          [
            'Configure bounded behavior',
            'Failure thresholds and open-state duration are operational policy, not magic defaults.',
            `resilience4j.circuitbreaker.instances.catalog.sliding-window-size=20\nresilience4j.circuitbreaker.instances.catalog.failure-rate-threshold=50\nresilience4j.circuitbreaker.instances.catalog.wait-duration-in-open-state=30s`,
            'Circuit opens after sufficient measured failures'
          ]
        ];
      if (t === 'messaging with rabbitmq and kafka')
        return [
          [
            'Publish a versioned event',
            'An event records identity, type, occurrence time, and stable payload schema.',
            `record CoursePublishedV1(UUID eventId,long courseId,Instant occurredAt) {}\nkafkaTemplate.send("course-events",Long.toString(event.courseId()),event);`,
            'Event keyed by course for partition ordering'
          ],
          [
            'Make consumption idempotent',
            'Persist the event identifier with the side effect so redelivery does not duplicate work.',
            `@KafkaListener(topics="course-events")\n@Transactional\nvoid consume(CoursePublishedV1 event) {\n  if (processed.existsById(event.eventId())) return;\n  searchIndex.add(event.courseId()); processed.save(new ProcessedEvent(event.eventId()));\n}`,
            'One indexing side effect across redelivery'
          ]
        ];
      if (t === 'entities')
        return [
          [
            'Map identity and invariants',
            'An entity needs stable identity, controlled construction, and field mappings compatible with the schema.',
            `@Entity @Table(name="courses")\nclass Course {\n  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;\n  @Column(nullable=false,length=120) private String title;\n  protected Course() {}\n  Course(String title) { rename(title); }\n  void rename(String value) { if (value.isBlank()) throw new IllegalArgumentException(); title=value; }\n}`,
            'A persistable Course entity with protected no-arg constructor'
          ],
          [
            'Use optimistic versioning',
            'A version column detects concurrent updates instead of silently losing one.',
            `@Version\nprivate long version;\n// A stale transaction raises OptimisticLockingFailureException at flush.`,
            'Concurrent stale update rejected'
          ]
        ];
      if (t === 'entity relationships')
        return [
          [
            'Map the owning side',
            'The lesson owns the foreign key; LAZY avoids loading its course until accessed.',
            `@ManyToOne(fetch=FetchType.LAZY,optional=false)\n@JoinColumn(name="course_id",nullable=false)\nprivate Course course;`,
            'lesson.course_id maps the association'
          ],
          [
            'Maintain both sides deliberately',
            'A helper keeps the in-memory aggregate consistent before persistence.',
            `@OneToMany(mappedBy="course",cascade=CascadeType.ALL,orphanRemoval=true)\nprivate final List<Lesson> lessons=new ArrayList<>();\nvoid addLesson(Lesson lesson) { lessons.add(lesson); lesson.assignTo(this); }`,
            'Course and Lesson references agree'
          ]
        ];
      if (t === 'repositories')
        return [
          [
            'Derive a focused query',
            'A repository interface exposes collection-like persistence operations for one aggregate.',
            `interface CourseRepository extends JpaRepository<Course,Long> {\n  Optional<Course> findBySlugAndPublishedTrue(String slug);\n  boolean existsByTitleIgnoreCase(String title);\n}`,
            'Generated queries from method names'
          ],
          [
            'Project only required columns',
            'Interface projection prevents loading a full mutable entity for a read view.',
            `interface CourseSummary { Long getId(); String getTitle(); }\nPage<CourseSummary> findByPublishedTrue(Pageable page);`,
            'A page of id/title projections'
          ]
        ];
      if (t === 'jpql')
        return [
          [
            'Query entities and associations',
            'JPQL names entity properties rather than database tables and columns.',
            `@Query("select new academy.CourseSummary(c.id,c.title,count(l)) from Course c left join c.lessons l where c.published=true group by c.id,c.title")\nList<CourseSummary> publishedSummaries();`,
            'DTO summaries generated by the persistence provider'
          ],
          [
            'Fetch to prevent N+1',
            'A fetch join loads one required collection in the same query; pagination needs separate care.',
            `@Query("select distinct c from Course c left join fetch c.lessons where c.id=:id")\nOptional<Course> findDetailed(@Param("id") long id);`,
            'One course with initialized lessons'
          ]
        ];
      if (t === 'native queries')
        return [
          [
            'Use database-specific SQL intentionally',
            'A native query is appropriate for PostgreSQL features JPQL cannot express cleanly.',
            `@Query(value="select * from courses where search_vector @@ websearch_to_tsquery('english',:query) order by ts_rank(search_vector,websearch_to_tsquery('english',:query)) desc",nativeQuery=true)\nList<Course> search(@Param("query") String query);`,
            'PostgreSQL full-text-ranked courses'
          ],
          [
            'Map an explicit projection',
            'Alias result columns to projection property names and test against the production dialect.',
            `interface CourseRank { Long getId(); String getTitle(); double getRank(); }`,
            'A typed read projection from native aliases'
          ]
        ];
      if (t === 'pagination and sorting')
        return [
          [
            'Request deterministic pages',
            'Append a unique tie-breaker so equal timestamps cannot move unpredictably.',
            `Pageable pageable=PageRequest.of(pageNumber,20,Sort.by(desc("createdAt"),desc("id")));\nPage<CourseSummary> page=repository.findByPublishedTrue(pageable);`,
            'A stable offset page and total metadata'
          ],
          [
            'Use a slice when no total is needed',
            'Slice avoids an extra count query and reports only whether another page exists.',
            `Slice<CourseSummary> slice=repository.findByPublishedTrueAndIdLessThan(cursor,PageRequest.of(0,20,Sort.by("id").descending()));\nSystem.out.println(slice.hasNext());`,
            'Twenty keyset-like rows and continuation flag'
          ]
        ];
      if (t === 'transactions')
        return [
          [
            'Place the boundary on a use case',
            'All repository changes commit together; runtime failure rolls them back by default.',
            `@Transactional\npublic void enroll(long learnerId,long courseId) {\n  Course course=courses.findById(courseId).orElseThrow();\n  if (enrollments.existsByLearnerIdAndCourseId(learnerId,courseId)) throw new AlreadyEnrolled();\n  enrollments.save(new Enrollment(learnerId,course));\n}`,
            'One enrollment or no committed changes'
          ],
          [
            'Make reads explicit',
            'Read-only transactions communicate intent and may enable provider optimizations.',
            `@Transactional(readOnly=true)\npublic CourseView view(long id) { return mapper.toView(repository.findById(id).orElseThrow()); }`,
            'A consistent read within the transaction'
          ]
        ];
      if (t === 'postgresql and mysql integration')
        return [
          [
            'Configure a pooled datasource',
            'Use the JDBC URL and pool limits appropriate to the selected driver and server capacity.',
            `spring.datasource.url=jdbc:postgresql://localhost:5432/academy\nspring.datasource.username=academy_app\nspring.datasource.hikari.maximum-pool-size=10\nspring.jpa.open-in-view=false`,
            'A ten-connection PostgreSQL pool and closed web-layer persistence context'
          ],
          [
            'Test dialect-sensitive behavior',
            'Run repository integration tests against the same database family used in production.',
            `@Container static PostgreSQLContainer<?> database=new PostgreSQLContainer<>("postgres:17-alpine");`,
            'Real PostgreSQL semantics in automated tests'
          ]
        ];
      if (t === 'database migrations with flyway and liquibase')
        return [
          [
            'Apply a forward Flyway migration',
            'Versioned SQL changes schema once and is checksummed after application.',
            `-- V3__add_course_slug.sql\nALTER TABLE courses ADD COLUMN slug text;\nUPDATE courses SET slug=lower(regexp_replace(title,'[^a-z0-9]+','-','g'));\nALTER TABLE courses ALTER COLUMN slug SET NOT NULL;\nCREATE UNIQUE INDEX courses_slug_uq ON courses(slug);`,
            'A reviewable schema migration'
          ],
          [
            'Keep ORM validation enabled',
            'Let migrations own DDL and make Hibernate fail if mappings drift.',
            `spring.jpa.hibernate.ddl-auto=validate\nspring.flyway.enabled=true`,
            'Startup validates mapping against migrated schema'
          ]
        ];
      if (t === 'spring mvc')
        return [
          [
            'Follow the MVC request flow',
            'DispatcherServlet selects a handler, resolves arguments, invokes it, and delegates response conversion.',
            `@RestController\nclass HealthController {\n  @GetMapping("/api/ping") Map<String,String> ping() { return Map.of("status","ok"); }\n}`,
            'DispatcherServlet serializes {"status":"ok"}'
          ],
          [
            'Configure content negotiation',
            'The Accept header selects a supported representation; unsupported media types receive 406.',
            `mvc.perform(get("/api/ping").accept(APPLICATION_JSON))\n  .andExpect(status().isOk()).andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON));`,
            '200 application/json'
          ]
        ];
      if (t === 'controllers')
        return [
          [
            'Keep controllers at the transport boundary',
            'A controller binds HTTP input, invokes one use case, and maps the result to a response DTO.',
            `@RestController\n@RequiredArgsConstructor\nclass CourseController {\n  private final FindCourse useCase;\n  @GetMapping("/api/courses/{id}") CourseResponse find(@PathVariable long id) { return useCase.handle(id); }\n}`,
            'Serialized CourseResponse'
          ],
          [
            'Avoid business rules in controllers',
            'The service remains callable from HTTP, messaging, or tests with the same command.',
            `@PostMapping("/api/courses/{id}/publish")\nResponseEntity<Void> publish(@PathVariable long id) { publisher.handle(new PublishCourse(id)); return ResponseEntity.noContent().build(); }`,
            '204 after the use case succeeds'
          ]
        ];
      if (t === 'request mapping')
        return [
          [
            'Map by method and path',
            'Specialized mapping annotations express HTTP semantics and avoid ambiguous handlers.',
            `@RequestMapping("/api/courses")\nclass CourseController {\n  @GetMapping("/{id}") CourseResponse find(@PathVariable long id) { ... }\n  @DeleteMapping("/{id}") ResponseEntity<Void> delete(@PathVariable long id) { ... }\n}`,
            'GET and DELETE routed to different methods'
          ],
          [
            'Constrain media types',
            'consumes and produces make representation support explicit.',
            `@PostMapping(consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)\nResponseEntity<CourseResponse> create(@RequestBody CreateCourseRequest input) { ... }`,
            '415 for unsupported request media type'
          ]
        ];
      if (t === 'request parameters and path variables')
        return [
          [
            'Bind resource identity and filters',
            'Path variables identify a resource; query parameters modify collection selection.',
            `@GetMapping("/api/courses/{courseId}/lessons")\nList<LessonResponse> lessons(@PathVariable long courseId,@RequestParam(defaultValue="false") boolean published) {\n  return query.find(courseId,published);\n}`,
            'Filtered lessons for one course'
          ],
          [
            'Parse optional parameters explicitly',
            'Optional distinguishes an absent filter from an empty or invalid value.',
            `@GetMapping("/api/courses")\nPage<CourseResponse> search(@RequestParam Optional<String> query,@RequestParam(defaultValue="0") @Min(0) int page) { ... }`,
            'Default first page with optional text query'
          ]
        ];
      if (t === 'request and response bodies')
        return [
          [
            'Deserialize a validated request',
            '@RequestBody delegates JSON conversion; @Valid applies Jakarta constraints after binding.',
            `record CreateCourseRequest(@NotBlank @Size(max=120) String title) {}\n@PostMapping("/api/courses")\nCourseResponse create(@Valid @RequestBody CreateCourseRequest input) { return service.create(input); }`,
            'DTO or 400 for malformed/invalid JSON'
          ],
          [
            'Control response metadata',
            'ResponseEntity sets status, headers, and body when defaults are insufficient.',
            `return ResponseEntity.created(URI.create("/api/courses/"+created.id()))\n    .eTag('"'+Long.toString(created.version())+'"').body(created);`,
            '201 with Location, ETag, and JSON body'
          ]
        ];
      if (t === 'dtos')
        return [
          [
            'Separate transport from persistence',
            'A record exposes the stable API fields without leaking entity relationships or lazy state.',
            `record CourseResponse(long id,String title,List<LessonSummary> lessons) {\n  static CourseResponse from(Course course) {\n    return new CourseResponse(course.id(),course.title(),course.lessons().stream().map(LessonSummary::from).toList());\n  }\n}`,
            'An immutable API representation'
          ],
          [
            'Use command-specific input',
            'Creation input omits server-owned identity and publication fields.',
            `record CreateCourseRequest(@NotBlank String title) {}\nrecord UpdateCourseRequest(@NotBlank String title,@NotNull Long version) {}`,
            'Distinct create and update contracts'
          ]
        ];
      if (t === 'rest api development')
        return [
          [
            'Design resource URIs',
            'Use nouns for resources and subordinate collections for containment.',
            `GET /api/courses/42\nGET /api/courses/42/lessons\nPOST /api/courses/42/lessons\nPATCH /api/lessons/7`,
            'A consistent resource-oriented surface'
          ],
          [
            'Return a predictable error format',
            'ProblemDetail gives clients status, title, detail, and extensible fields.',
            `var problem=ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,"Course is already published");\nproblem.setTitle("Invalid course state");\nproblem.setProperty("courseId",id);\nreturn problem;`,
            '409 application/problem+json with courseId'
          ]
        ];
      if (t === 'http methods and status codes')
        return [
          [
            'Match methods to semantics',
            'GET is safe, PUT is idempotent replacement, PATCH is partial change, and POST commonly creates or commands.',
            `@PutMapping("/api/courses/{id}")\nCourseResponse replace(@PathVariable long id,@Valid @RequestBody ReplaceCourseRequest input) { return service.replace(id,input); }`,
            'Repeated identical PUT requests converge on the same state'
          ],
          [
            'Choose status from the outcome',
            'Creation, no-body success, validation failure, absence, and conflict need distinct codes.',
            `return created ? ResponseEntity.created(location).body(body)\n               : ResponseEntity.status(HttpStatus.CONFLICT).build();`,
            '201 for creation or 409 for conflicting state'
          ]
        ];
      if (t === 'spring security')
        return [
          [
            'Build a deny-by-default filter chain',
            'Order public and protected matchers deliberately and authenticate every unmatched request.',
            `@Bean SecurityFilterChain security(HttpSecurity http) throws Exception {\n  return http.authorizeHttpRequests(auth->auth\n      .requestMatchers("/actuator/health/**").permitAll()\n      .requestMatchers(HttpMethod.GET,"/api/courses/**").hasAuthority("SCOPE_courses:read")\n      .anyRequest().authenticated())\n    .oauth2ResourceServer(oauth->oauth.jwt(Customizer.withDefaults())).build();\n}`,
            'A resource server with explicit authorization rules'
          ],
          [
            'Test protected access',
            'Security test support proves anonymous and authorized outcomes through the filter chain.',
            `mvc.perform(get("/api/courses/42")).andExpect(status().isUnauthorized());\nmvc.perform(get("/api/courses/42").with(jwt().authorities(new SimpleGrantedAuthority("SCOPE_courses:read"))))\n  .andExpect(status().isOk());`,
            '401 without a token and 200 with required scope'
          ]
        ];
      if (t === 'authentication and authorization')
        return [
          [
            'Separate identity from permission',
            'Authentication produces a principal; authorization evaluates the principal against an operation and resource.',
            `Authentication authentication=SecurityContextHolder.getContext().getAuthentication();\nif (!courseAccess.canView(authentication,courseId)) throw new AccessDeniedException("course");`,
            'Authenticated caller allowed or denied for one course'
          ],
          [
            'Authorize at the method boundary',
            'Method security protects use cases invoked from more than one controller route.',
            `@PreAuthorize("hasAuthority('course:publish') and @courseAccess.canEdit(authentication,#courseId)")\npublic void publish(long courseId) { ... }`,
            'Requires both permission and resource ownership'
          ]
        ];
      if (t === 'jwt authentication')
        return [
          [
            'Validate JWT provenance',
            'Resource servers must check signature, issuer, audience, expiry, and accepted algorithms.',
            `@Bean JwtDecoder decoder(RSAPublicKey key) {\n  NimbusJwtDecoder decoder=NimbusJwtDecoder.withPublicKey(key).signatureAlgorithm(SignatureAlgorithm.RS256).build();\n  decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(JwtValidators.createDefaultWithIssuer(issuer),new JwtClaimValidator<List<String>>("aud",aud->aud.contains("academy-api"))));\n  return decoder;\n}`,
            'Only RS256 tokens from the issuer for academy-api'
          ],
          [
            'Map claims to authorities',
            'Translate a scoped claim intentionally instead of trusting arbitrary role text.',
            `var converter=new JwtGrantedAuthoritiesConverter();\nconverter.setAuthoritiesClaimName("scope"); converter.setAuthorityPrefix("SCOPE_");`,
            'scope courses:read becomes SCOPE_courses:read'
          ]
        ];
      if (t === 'role-based access control')
        return [
          [
            'Map roles to capabilities',
            'Use roles for coarse job functions and authorities for concrete operations.',
            `@PreAuthorize("hasRole('INSTRUCTOR') and hasAuthority('course:write')")\npublic CourseResponse update(long id,UpdateCourse command) { ... }`,
            'Instructor role plus write capability required'
          ],
          [
            'Keep the hierarchy explicit',
            'A role hierarchy can inherit permissions, but must remain small and reviewed.',
            `@Bean RoleHierarchy hierarchy() {\n  return RoleHierarchyImpl.fromHierarchy("ROLE_ADMIN > ROLE_INSTRUCTOR\nROLE_INSTRUCTOR > ROLE_LEARNER");\n}`,
            'Admins inherit instructor and learner roles'
          ]
        ];
      if (t === 'cors and csrf')
        return [
          [
            'Allow specific browser origins',
            'CORS grants a browser origin/method/header combination and should not use wildcard credentials.',
            `@Bean CorsConfigurationSource cors() {\n  var config=new CorsConfiguration(); config.setAllowedOrigins(List.of("https://academy.example"));\n  config.setAllowedMethods(List.of("GET","POST","PUT","DELETE")); config.setAllowedHeaders(List.of("Authorization","Content-Type"));\n  var source=new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/api/**",config); return source;\n}`,
            'Approved browser preflights succeed'
          ],
          [
            'Keep CSRF for cookie credentials',
            'A browser session uses a readable CSRF cookie and sends its token in a custom header.',
            `http.csrf(csrf->csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));`,
            'State-changing cookie-authenticated requests require a matching token'
          ]
        ];
      if (t === 'oauth2')
        return [
          [
            'Use authorization code with PKCE',
            'A browser client redirects to the provider and exchanges a one-time code without a client secret.',
            `spring.security.oauth2.client.registration.academy.client-id=academy-web\nspring.security.oauth2.client.registration.academy.authorization-grant-type=authorization_code\nspring.security.oauth2.client.registration.academy.scope=openid,profile`,
            'OIDC login registration using authorization code'
          ],
          [
            'Call downstream with an authorized client',
            'The OAuth2 client manager obtains or refreshes a token for a named registration.',
            `OAuth2AuthorizeRequest request=OAuth2AuthorizeRequest.withClientRegistrationId("catalog").principal(authentication).build();\nOAuth2AuthorizedClient client=manager.authorize(request);\nheaders.setBearerAuth(client.getAccessToken().getTokenValue());`,
            'A downstream Authorization bearer token'
          ]
        ];
      if (/^testing controllers$/.test(t))
        return [
          [
            'MockMvc HTTP contract',
            'Send a request through MVC infrastructure without opening a port.',
            `@WebMvcTest(CourseController.class)\nclass CourseControllerTest {\n  @Autowired MockMvc mvc; @MockBean CourseService service;\n  @Test void returnsCourse() throws Exception {\n    when(service.find(42)).thenReturn(new CourseResponse(42,"Spring"));\n    mvc.perform(get("/api/courses/42")).andExpect(status().isOk()).andExpect(jsonPath("$.title").value("Spring"));\n  }\n}`,
            'A focused controller contract test'
          ],
          [
            'Invalid request',
            'Assert validation response and that the service was not invoked.',
            `mvc.perform(post("/api/courses").contentType(APPLICATION_JSON).content("{\\\"title\\\":\\\"\\\"}"))\n  .andExpect(status().isBadRequest());\nverifyNoInteractions(service);`,
            '400 without a service call'
          ]
        ];
      if (/^final production rest api project$/.test(t))
        return [
          [
            'Production endpoint slice',
            'Connect validation, service transaction, DTO mapping, and status semantics.',
            `@PostMapping("/api/courses")\nResponseEntity<CourseResponse> create(@Valid @RequestBody CreateCourseRequest input) {\n  CourseResponse result=useCase.create(input);\n  return ResponseEntity.created(URI.create("/api/courses/"+result.id())).body(result);\n}`,
            '201 with stable response DTO'
          ],
          [
            'End-to-end acceptance test',
            'Use real PostgreSQL and authentication to prove the deployed contract.',
            `given().auth().oauth2(instructorToken).contentType("application/json")\n  .body("{\\\"title\\\":\\\"Production Spring\\\"}")\n.when().post("/api/courses")\n.then().statusCode(201).header("Location",containsString("/api/courses/"));`,
            'Authenticated creation succeeds through the full stack'
          ]
        ];
      if (/^beans and bean lifecycle$/.test(t))
        return [
          [
            'Initialization callback',
            'Validate injected dependencies after construction.',
            `@Component\nclass SearchIndex {\n  @PostConstruct void initialize() { if (directory == null) throw new IllegalStateException("directory"); }\n}`,
            'Initialization runs once after dependency injection'
          ],
          [
            'Destruction callback',
            'Release owned resources during graceful context shutdown.',
            `@PreDestroy\nvoid shutdown() throws Exception { writer.close(); }`,
            'The index writer closes before the bean is destroyed'
          ]
        ];
      if (/^controller testing$/.test(t))
        return [
          [
            'MockMvc HTTP contract',
            'Send a request through MVC infrastructure without opening a network port.',
            `@WebMvcTest(CourseController.class)\nclass CourseControllerTest {\n  @Autowired MockMvc mvc; @MockBean CourseService service;\n  @Test void returns404() throws Exception {\n    when(service.find(99)).thenThrow(new CourseNotFound(99));\n    mvc.perform(get("/api/courses/99")).andExpect(status().isNotFound());\n  }\n}`,
            'The controller advice produces 404'
          ],
          [
            'Validate request rejection',
            'Malformed input must not invoke the service.',
            `mvc.perform(post("/api/courses").contentType(APPLICATION_JSON).content("{\\\"title\\\":\\\"\\\"}"))\n  .andExpect(status().isBadRequest());\nverifyNoInteractions(service);`,
            '400 and no service call'
          ]
        ];
      if (/inversion|dependency injection|bean|applicationcontext|component scanning|java-based|spring annotation/
              .test(t))
        return [
          [
            'Constructor-injected bean',
            'A required collaborator is explicit and the field can remain final.',
            `@org.springframework.stereotype.Service\nfinal class CourseService {\n  private final CourseRepository repository;\n  CourseService(CourseRepository repository) { this.repository = repository; }\n  Course find(long id) { return repository.findById(id).orElseThrow(); }\n}`,
            'CourseService is created when one CourseRepository bean is available'
          ],
          [
            'Explicit configuration',
            'Use @Bean when constructing third-party types or when creation needs code.',
            `@org.springframework.context.annotation.Configuration\nclass ClockConfiguration {\n  @org.springframework.context.annotation.Bean\n  java.time.Clock clock() { return java.time.Clock.systemUTC(); }\n}`,
            'One UTC Clock bean in the application context'
          ]
        ];
      if (/lifecycle/.test(t))
        return [
          [
            'Initialization and destruction',
            'Lifecycle callbacks run after injection and before bean destruction.',
            `@jakarta.annotation.PostConstruct\nvoid warmCache() { cache.load(); }\n@jakarta.annotation.PreDestroy\nvoid close() { cache.close(); }`,
            'Cache warms after construction and closes during shutdown'
          ],
          [
            'Prefer managed resources',
            'A @Bean destroy method can close a resource automatically.',
            `@Bean(destroyMethod = "close")\nExecutorService lessonExecutor() {\n  return Executors.newFixedThreadPool(8);\n}`,
            'Spring closes the executor with the context'
          ]
        ];
      if (/aspect/.test(t))
        return [
          [
            'Timed service boundary',
            'An aspect intercepts proxied public method calls matched by the pointcut.',
            `@Aspect @Component\nclass TimingAspect {\n  @Around("execution(* academy..*Service.*(..))")\n  Object time(ProceedingJoinPoint call) throws Throwable {\n    long start = System.nanoTime();\n    try { return call.proceed(); } finally { record(call.getSignature(), System.nanoTime()-start); }\n  }\n}`,
            'Duration recorded for matched service calls'
          ],
          [
            'Understand proxy limits',
            'Self-invocation bypasses proxy advice; move the boundary to another bean.',
            `@Service\nclass PublishingFacade {\n  private final AuditedPublisher publisher;\n  void publish(long id) { publisher.publish(id); }\n}`,
            'The collaborator call crosses the proxy boundary'
          ]
        ];
      if (/application event/.test(t))
        return [
          [
            'Publish a domain notification',
            'Publish after a successful state change without calling every observer directly.',
            `record CoursePublished(long courseId) {}\nservice.publish(id);\nevents.publishEvent(new CoursePublished(id));`,
            'In-process listeners receive CoursePublished'
          ],
          [
            'React after commit',
            'Avoid sending email for a transaction that later rolls back.',
            `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)\nvoid on(CoursePublished event) { mailer.announce(event.courseId()); }`,
            'Notification runs only after commit'
          ]
        ];
      if (/boot introduction|initializr|project structure|maven depend|first application/
              .test(t))
        return [
          [
            'Executable application',
            '@SpringBootApplication combines configuration, component scan, and auto-configuration.',
            `@SpringBootApplication\npublic class AcademyApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(AcademyApplication.class, args);\n  }\n}`,
            'An ApplicationContext and embedded server start'
          ],
          [
            'Focused starter dependency',
            'A starter brings a coherent feature dependency set.',
            `<dependency>\n  <groupId>org.springframework.boot</groupId>\n  <artifactId>spring-boot-starter-web</artifactId>\n</dependency>`,
            'Spring MVC, JSON support, validation integration, and embedded server dependencies'
          ]
        ];
      if (/properties|profiles|environment/.test(t))
        return [
          [
            'Typed configuration properties',
            'Bind related values to a validated immutable record.',
            `@ConfigurationProperties("academy.mail")\n@Validated\npublic record MailProperties(@NotBlank String from, @Min(1) int retries) {}`,
            'academy.mail.from and retries bind into one object'
          ],
          [
            'Profile-specific override',
            'Keep defaults in application.yml and environment differences in profile files.',
            `# application-prod.yml\nacademy:\n  mail:\n    retries: 5\nlogging:\n  level:\n    root: INFO`,
            'Values apply when the prod profile is active'
          ]
        ];
      if (/logging/.test(t))
        return [
          [
            'Parameterized logging',
            'Place values in fields without eagerly building strings.',
            `private static final Logger log = LoggerFactory.getLogger(CourseService.class);\nlog.info("course published courseId={} learnerId={}", courseId, learnerId);`,
            'A structured message without concatenation'
          ],
          [
            'Correlation context', 'Add and clear request context in a filter.',
            `try (MDC.MDCCloseable ignored = MDC.putCloseable("requestId", requestId)) {\n  filterChain.doFilter(request, response);\n}`,
            'Logs inside the request include requestId'
          ]
        ];
      if (/mvc|controller|request mapping|request parameter|path variable|request and response|dto|rest api|http method|status/
              .test(t))
        return [
          [
            'REST endpoint contract',
            'Bind a path value and return the documented status with a DTO.',
            `@RestController\n@RequestMapping("/api/courses")\nclass CourseController {\n  @GetMapping("/{id}")\n  ResponseEntity<CourseResponse> find(@PathVariable long id) {\n    return ResponseEntity.ok(service.find(id));\n  }\n}`,
            '200 JSON or translated not-found response'
          ],
          [
            'Creation response',
            'Return 201 and the URI of the created resource.',
            `@PostMapping\nResponseEntity<CourseResponse> create(@Valid @RequestBody CreateCourseRequest request) {\n  var created = service.create(request);\n  return ResponseEntity.created(URI.create("/api/courses/" + created.id())).body(created);\n}`,
            '201 Created with Location header'
          ]
        ];
      if (/validation|global exception/.test(t))
        return [
          [
            'Validate transport input',
            'Bean Validation rejects invalid request data before service work.',
            `record CreateLessonRequest(\n  @NotBlank @Size(max=120) String title,\n  @Min(1) @Max(480) int durationMinutes\n) {}`,
            '400 when bound with @Valid and constraints fail'
          ],
          [
            'Stable problem response', 'Translate domain errors centrally.',
            `@RestControllerAdvice\nclass ApiErrors {\n  @ExceptionHandler(LessonNotFound.class)\n  ProblemDetail missing(LessonNotFound error) {\n    var problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, error.getMessage());\n    problem.setTitle("Lesson not found");\n    return problem;\n  }\n}`,
            '404 application/problem+json'
          ]
        ];
      if (/jpa|entit|relationship|repositor|jpql|native quer|pagination|sorting|transaction|postgresql|mysql|migration/
              .test(t))
        return [
          [
            'Transactional repository use',
            'Load and change a managed entity inside the service transaction.',
            `@Transactional\npublic void publish(long id) {\n  Course course = repository.findById(id).orElseThrow(() -> new CourseNotFound(id));\n  course.publish();\n}`,
            'Dirty checking updates the row at commit'
          ],
          [
            'Page a stable ordering',
            'Pageable carries limit, offset, and sorting to the repository query.',
            `PageRequest page = PageRequest.of(0, 20, Sort.by("createdAt").descending().and(Sort.by("id").descending()));\nPage<CourseSummary> result = repository.findByPublishedTrue(page);`,
            'First twenty published courses with deterministic ties'
          ]
        ];
      if (/security|authentication|authorization|jwt|role|cors|csrf|oauth/.test(
              t))
        return [
          [
            'Declarative filter chain',
            'Require authentication by default and scope public endpoints explicitly.',
            `@Bean\nSecurityFilterChain security(HttpSecurity http) throws Exception {\n  return http.authorizeHttpRequests(auth -> auth\n      .requestMatchers("/actuator/health").permitAll()\n      .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("INSTRUCTOR")\n      .anyRequest().authenticated())\n    .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults())).build();\n}`,
            'JWT-authenticated access with role protection'
          ],
          [
            'Method ownership check',
            'Authorize against both a role and the target identifier.',
            `@PreAuthorize("hasRole('ADMIN') or @courseAccess.canEdit(authentication, #courseId)")\npublic void update(long courseId, UpdateCourse command) { ... }`,
            'Only administrators or authorized course editors enter the method'
          ]
        ];
      if (/file upload|download/.test(t))
        return [
          [
            'Bounded upload',
            'Validate content type and size before moving bytes to storage.',
            `@PostMapping(path="/{id}/image", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)\nvoid upload(@PathVariable long id, @RequestPart MultipartFile file) throws IOException {\n  if (file.isEmpty() || file.getSize() > 5_000_000) throw new InvalidUpload();\n  storage.save(id, file.getInputStream(), file.getContentType());\n}`,
            'Accepted file is streamed to storage'
          ],
          [
            'Download metadata',
            'Return a resource with explicit media type and safe filename.',
            `return ResponseEntity.ok()\n  .contentType(MediaType.APPLICATION_PDF)\n  .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")\n  .body(resource);`,
            'Browser downloads certificate.pdf'
          ]
        ];
      if (/caching/.test(t))
        return [
          [
            'Cache read result',
            'Key by the stable identifier and cache only reusable data.',
            `@Cacheable(cacheNames="courses", key="#id")\npublic CourseView find(long id) { return repository.fetchView(id); }`,
            'First call loads; later calls reuse cached CourseView'
          ],
          [
            'Evict after change',
            'Invalidate the same key when published data changes.',
            `@CacheEvict(cacheNames="courses", key="#id")\n@Transactional\npublic void rename(long id, String title) { repository.rename(id, title); }`,
            'The next read reloads the renamed value'
          ]
        ];
      if (/async|scheduling/.test(t))
        return [
          [
            'Scheduled job with fixed zone',
            'Choose a zone explicitly for calendar schedules.',
            `@Scheduled(cron="0 0 2 * * *", zone="UTC")\nvoid expireInvitations() { service.expireBefore(Instant.now(clock)); }`,
            'Runs daily at 02:00 UTC'
          ],
          [
            'Named asynchronous executor',
            'Return a future so failure and completion remain observable.',
            `@Async("mailExecutor")\nCompletableFuture<Void> sendDigest(long learnerId) {\n  mailer.send(learnerId);\n  return CompletableFuture.completedFuture(null);\n}`,
            'Caller receives an observable completion stage'
          ]
        ];
      if (/webflux/.test(t))
        return [
          [
            'Non-blocking handler',
            'Compose a Mono without calling block in the request path.',
            `@GetMapping("/{id}")\nMono<CourseResponse> find(@PathVariable long id) {\n  return repository.findById(id).map(mapper::toResponse)\n      .switchIfEmpty(Mono.error(new CourseNotFound(id)));\n}`,
            'One asynchronous response or error signal'
          ],
          [
            'Bound concurrency',
            'flatMap concurrency prevents unbounded downstream work.',
            `return Flux.fromIterable(ids)\n    .flatMap(client::fetchCourse, 8)\n    .collectList();`,
            'At most eight fetches in flight'
          ]
        ];
      if (/testing|testcontainers/.test(t))
        return [
          [
            'MVC slice test',
            'Load controller infrastructure and replace its service dependency.',
            `@WebMvcTest(CourseController.class)\nclass CourseControllerTest {\n  @Autowired MockMvc mvc;\n  @MockBean CourseService service;\n  @Test void returnsCourse() throws Exception {\n    when(service.find(42)).thenReturn(new CourseResponse(42,"Spring"));\n    mvc.perform(get("/api/courses/42")).andExpect(status().isOk()).andExpect(jsonPath("$.title").value("Spring"));\n  }\n}`,
            'Focused HTTP contract test passes'
          ],
          [
            'Real PostgreSQL integration',
            'Let Testcontainers provide a disposable database connection.',
            `@Testcontainers\n@SpringBootTest\nclass CourseRepositoryTest {\n  @Container static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");\n  @DynamicPropertySource static void properties(DynamicPropertyRegistry r) { r.add("spring.datasource.url", postgres::getJdbcUrl); }\n}`,
            'Repository tests run against PostgreSQL'
          ]
        ];
      if (/docker|deployment|actuator|observability|secret|rate limiting|production/
              .test(t))
        return [
          [
            'Layered container image',
            'Copy the built artifact into a small non-root runtime image.',
            `FROM eclipse-temurin:21-jre\nRUN useradd --system --uid 10001 spring\nUSER 10001\nCOPY target/academy.jar /app.jar\nENTRYPOINT ["java","-jar","/app.jar"]`,
            'A non-root executable image'
          ],
          [
            'Expose safe operational endpoints',
            'Publish health and metrics while protecting sensitive actuator endpoints.',
            `management.endpoints.web.exposure.include=health,info,prometheus\nmanagement.endpoint.health.probes.enabled=true\nmanagement.metrics.tags.application=academy-api`,
            'Health probes and tagged metrics'
          ]
        ];
      if (/microservice|cloud|gateway|discovery|feign|resilience|rabbit|kafka/
              .test(t))
        return [
          [
            'Resilient client boundary',
            'Apply time limiting and circuit breaking outside domain logic.',
            `@CircuitBreaker(name="catalog", fallbackMethod="fallback")\n@TimeLimiter(name="catalog")\nCompletableFuture<CourseView> fetch(long id) { return client.find(id); }`,
            'Fast failure and configured fallback after repeated errors'
          ],
          [
            'Idempotent message consumer',
            'Store the event ID with the state change in one transaction.',
            `@KafkaListener(topics="course-published")\n@Transactional\nvoid consume(CoursePublished event) {\n  if (processed.existsById(event.eventId())) return;\n  projections.apply(event);\n  processed.save(new ProcessedEvent(event.eventId()));\n}`,
            'Duplicate messages do not duplicate the projection'
          ]
        ];
      if (/modular monolith|clean architecture|final production/.test(t))
        return [
          [
            'Module-owned use case',
            'Expose an application port while keeping persistence behind an interface.',
            `public interface PublishCourse { void publish(CourseId id); }\ninterface CourseRepository { Optional<Course> find(CourseId id); void save(Course course); }`,
            'Domain and use case compile without Spring Data'
          ],
          [
            'Architecture dependency test',
            'Use an automated rule to stop adapters leaking into the domain.',
            `@AnalyzeClasses(packages="academy")\nclass ArchitectureTest {\n  @ArchTest static final ArchRule domainIsIndependent = noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAnyPackage("org.springframework..","jakarta.persistence..");\n}`,
            'Build fails on forbidden dependencies'
          ]
        ];
      if (/introduction to spring|framework architecture/.test(t))
        return [
          [
            'Container-managed application',
            'Register collaborating beans and retrieve the top-level use case.',
            `try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {\n  context.getBean(PublishCourse.class).publish(42L);\n}`,
            'The container constructs and wires PublishCourse'
          ],
          [
            'Framework layers',
            'Use Spring modules selectively instead of treating Spring as one monolith.',
            `// spring-context: bean container\n// spring-webmvc: servlet HTTP stack\n// spring-tx: transaction abstraction\n// spring-data-jpa: repository integration`,
            'A feature-to-module map'
          ]
        ];
      if (/email service/.test(t))
        return [
          [
            'Send a MIME message',
            'Build content with JavaMailSender and keep recipient input validated.',
            `MimeMessage message = sender.createMimeMessage();\nvar helper = new MimeMessageHelper(message, "UTF-8");\nhelper.setTo(recipient); helper.setSubject("Course published");\nhelper.setText("Your course is live", false);\nsender.send(message);`,
            'One outbound email request'
          ],
          [
            'Retry at a job boundary',
            'Persist delivery state so a restart does not lose or duplicate mail work.',
            `@Transactional\nvoid queueAnnouncement(long courseId) { outbox.save(EmailJob.pending(courseId)); }`,
            'A durable job committed with the course change'
          ]
        ];
      if (/websocket/.test(t))
        return [
          [
            'STOMP endpoint',
            'Expose a handshake endpoint and application destination prefix.',
            `@Configuration @EnableWebSocketMessageBroker\nclass SocketConfig implements WebSocketMessageBrokerConfigurer {\n  public void registerStompEndpoints(StompEndpointRegistry r) { r.addEndpoint("/ws"); }\n  public void configureMessageBroker(MessageBrokerRegistry r) { r.enableSimpleBroker("/topic"); r.setApplicationDestinationPrefixes("/app"); }\n}`,
            'Clients connect at /ws and subscribe under /topic'
          ],
          [
            'Broadcast progress',
            'Send a small DTO to subscribers after authorization and persistence.',
            `messaging.convertAndSend("/topic/courses/" + courseId, new ProgressMessage(learnerId, percent));`,
            'Subscribers receive a progress update'
          ]
        ];
      if (/graphql/.test(t))
        return [
          [
            'Query mapping',
            'Resolve a schema field through a typed controller method.',
            `@Controller\nclass CourseGraphql {\n  @QueryMapping Course course(@Argument long id) { return service.find(id); }\n}`,
            'The course query resolves by id'
          ],
          [
            'Avoid N+1 loading',
            'Batch child resolution by parent identifiers.',
            `@BatchMapping\nMap<Course,List<Lesson>> lessons(List<Course> courses) {\n  return repository.findByCourseIds(courses.stream().map(Course::id).toList());\n}`,
            'Lessons loaded in one batched repository call'
          ]
        ];
      if (/batch processing/.test(t))
        return [
          [
            'Chunk-oriented step',
            'Read, process, and write bounded chunks with restart metadata.',
            `@Bean Step importLessons(JobRepository jobs, PlatformTransactionManager tx, ItemReader<Row> reader, ItemWriter<Lesson> writer) {\n  return new StepBuilder("importLessons", jobs).<Row,Lesson>chunk(100, tx).reader(reader).processor(this::map).writer(writer).build();\n}`,
            'Rows committed in chunks of 100'
          ],
          [
            'Job parameter identity',
            'Pass an immutable input key so retries refer to the same job instance.',
            `new JobParametersBuilder().addString("source", file.toAbsolutePath().toString(), true).toJobParameters();`,
            'A stable identifying source parameter'
          ]
        ];
      if (/swagger|openapi/.test(t))
        return [
          [
            'Document response contracts',
            'Describe non-success responses that clients must handle.',
            `@Operation(summary="Find a course")\n@ApiResponses({ @ApiResponse(responseCode="200", description="Course found"), @ApiResponse(responseCode="404", description="Course missing") })\n@GetMapping("/{id}") CourseResponse find(@PathVariable long id) { return service.find(id); }`,
            'Generated OpenAPI operation with 200 and 404'
          ],
          [
            'Keep runtime docs protected',
            'Expose documentation only where policy permits.',
            `springdoc.api-docs.enabled=true\nspringdoc.swagger-ui.path=/docs`,
            'OpenAPI JSON plus Swagger UI at /docs'
          ]
        ];
      if (/configuration server/.test(t))
        return [
          [
            'Config client import',
            'Fail fast or mark import optional deliberately.',
            `spring.application.name=academy-api\nspring.config.import=configserver:https://config.internal\nspring.cloud.config.label=main`,
            'External configuration loaded for academy-api'
          ],
          [
            'Encrypt and rotate secrets elsewhere',
            'Keep Config Server for configuration while workload secrets come from a secret store.',
            `academy.features.new-reader=true\n# Database password is referenced from the deployment secret, not committed here.`,
            'Versioned non-secret feature configuration'
          ]
        ];
      return null;
    };
window.ACADEMY_LESSON_SPECS['spring-boot'] = {
  ...{
    context: 'Spring applications',
    language: 'java',
    concepts: [
      [
        /introduction to spring|architecture|inversion|dependency injection|bean|applicationcontext|component scanning|annotation|configuration/,
        'Spring manages an application graph in an ApplicationContext: bean definitions describe construction, dependency injection supplies collaborators, and lifecycle callbacks surround initialization and destruction'
      ],
      [
        /aspect|event/,
        'Cross-cutting behavior belongs at an explicit interception or event boundary; Spring AOP uses proxies while application events decouple in-process publishers from listeners'
      ],
      [
        /boot|initializr|project structure|maven depend|first application|properties|profiles|logging/,
        'Spring Boot selects sensible auto-configuration from the classpath and configuration properties, while starters and build plugins make a service executable and observable'
      ],
      [
        /mvc|controller|request mapping|request parameter|request and response|dto|rest api|http method|validation|exception/,
        'Spring MVC routes an HTTP request through filters and a DispatcherServlet to a controller; binding, validation, service work, serialization, and exception translation form the endpoint contract'
      ],
      [
        /jpa|entit|relationship|repositor|jpql|native quer|pagination|transaction|postgresql|mysql|migration/,
        'Spring Data JPA coordinates repositories with a persistence context; entity state, fetch strategy, transaction boundaries, generated SQL, and schema migrations determine correctness and performance'
      ],
      [
        /security|authentication|authorization|jwt|role|cors|csrf|oauth/,
        'Spring Security applies a filter chain before controller code; authentication establishes identity and authorization evaluates whether that identity may perform an operation'
      ],
      [
        /file|email|scheduling|caching|async|websocket|webflux|graphql|batch|openapi/,
        'Application services need explicit contracts for I/O, scheduling, back pressure, retries, idempotency, and failure reporting instead of hiding infrastructure work in controllers'
      ],
      [
        /testing|testcontainers/,
        'Spring tests range from plain unit tests to focused slices and full-context integration tests; the smallest test that proves the contract gives the clearest failure'
      ],
      [
        /docker|deployment|actuator|observability|secret|rate|production/,
        'A production service must package a repeatable runtime, externalize configuration, expose health and telemetry, protect secrets, limit load, and support safe rollback'
      ],
      [
        /microservice|cloud|gateway|discovery|feign|resilience|rabbit|kafka/,
        'Distributed services communicate through versioned HTTP or message contracts; timeouts, retries, circuit breakers, idempotency, tracing, and partial failure are core design concerns'
      ],
      [
        /monolith|clean architecture|final production/,
        'Architecture should make domain rules independent of delivery and persistence details, with dependency direction pointing toward stable business policy'
      ]
    ]
  },
  examples: springExamples,
  guidanceRules: [
      [
        /inversion|dependency|bean|context|component|configuration|aspect|event|spring framework|spring introduction/,
        [
          'Compose Academy application services in the Spring container with explicit dependencies and lifecycle ownership.',
          [
            'Using field injection and hiding required dependencies.',
            'Expecting proxy advice on self-invocation or private methods.',
            'Putting network work in initialization callbacks.'
          ],
          [
            'Use constructor injection for required collaborators.',
            'Keep configuration cohesive and fail fast on invalid properties.',
            'Publish events only when their transaction timing is understood.'
          ]
        ]
      ],
      [
        /mvc|controller|request|dto|rest|http method|validation|exception/,
        [
          'Expose versioned course and lesson HTTP contracts to the web client.',
          [
            'Binding persistence entities directly to public JSON.',
            'Returning 200 for every outcome.',
            'Trusting client identifiers, roles, or validation.'
          ],
          [
            'Use request and response DTOs with Bean Validation.',
            'Return precise status codes and RFC-style problem details.',
            'Keep controllers thin and test both valid and invalid contracts.'
          ]
        ]
      ],
      [
        /jpa|entity|relationship|repository|jpql|native|pagination|transaction|postgresql|mysql|migration/,
        [
          'Persist course aggregates and page stable lesson lists inside deliberate transactions.',
          [
            'Accessing lazy relationships after the persistence context closes.',
            'Using cascade remove across a relationship without checking ownership.',
            'Changing schema automatically in production without reviewed migrations.'
          ],
          [
            'Put transaction boundaries around use cases.',
            'Inspect generated SQL and prevent N+1 loading.',
            'Use deterministic sorting and forward-only migrations with recovery plans.'
          ]
        ]
      ],
      [
        /security|authentication|authorization|jwt|role|cors|csrf|oauth/,
        [
          'Protect instructor actions and learner data using authenticated principals and resource authorization.',
          [
            'Treating a valid JWT as sufficient authorization.',
            'Disabling CSRF without checking the credential transport model.',
            'Using permissive wildcard CORS with credentials.'
          ],
          [
            'Deny by default and authorize at URL plus method/resource boundaries.',
            'Validate issuer, audience, expiry, and signing algorithms.',
            'Use short-lived tokens and rotate server credentials.'
          ]
        ]
      ],
      [
        /test|mock|testcontainer/,
        [
          'Verify service rules, HTTP contracts, and PostgreSQL behavior at appropriately sized test layers.',
          [
            'Loading the complete context for every unit test.',
            'Mocking the class under test.',
            'Replacing PostgreSQL with an incompatible database for dialect-sensitive queries.'
          ],
          [
            'Use plain unit tests for domain behavior.',
            'Use slices for MVC or repository contracts.',
            'Use Testcontainers for infrastructure compatibility and deterministic cleanup.'
          ]
        ]
      ],
      [
        /docker|deploy|actuator|observability|secret|rate|production/,
        [
          'Operate the Academy API as a non-root container with health signals, metrics, secrets, and bounded traffic.',
          [
            'Embedding secrets in images or application files.',
            'Using liveness checks that fail during dependency outages and cause restart loops.',
            'Publishing every actuator endpoint publicly.'
          ],
          [
            'Build immutable images and externalize configuration.',
            'Separate liveness from readiness.',
            'Define dashboards and alerts from service objectives, not arbitrary metrics.'
          ]
        ]
      ],
      [
        /microservice|cloud|gateway|discovery|feign|resilience|rabbit|kafka|modular|clean architecture/,
        [
          'Coordinate Academy modules or services through explicit synchronous and asynchronous contracts.',
          [
            'Retrying non-idempotent operations blindly.',
            'Assuming a remote dependency is always available.',
            'Sharing database tables as an undocumented service API.'
          ],
          [
            'Set timeouts before retries and cap retry budgets.',
            'Use idempotency keys and durable message handling.',
            'Keep domain rules independent from transport and persistence frameworks.'
          ]
        ]
      ]
    ]
};
})();
