(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const javaExamples =
    title => {
      const t = lower(title);
      if (t === 'classes and objects')
        return [
          [
            'Define and instantiate a class',
            'A class declares representation and behavior; new creates an object with its own state.',
            `final class Course {\n  private final String title;\n  Course(String title) { this.title = title; }\n  String title() { return title; }\n}\nvar java = new Course("Java");\nSystem.out.println(java.title());`,
            'Java'
          ],
          [
            'Compare object identity and value',
            'Two separately created objects have different identities unless value equality is implemented.',
            `var first = new Course("Java");\nvar second = new Course("Java");\nSystem.out.println(first == second);\nSystem.out.println(first.equals(second));`,
            'false\nfalse with Object.equals'
          ]
        ];
      if (t === 'constructors')
        return [
          [
            'Establish valid initial state',
            'A compact constructor validates before the object becomes observable.',
            `record Lesson(String title, int minutes) {\n  Lesson {\n    if (title.isBlank()) throw new IllegalArgumentException("title");\n    if (minutes <= 0) throw new IllegalArgumentException("minutes");\n  }\n}\nSystem.out.println(new Lesson("Constructors", 45));`,
            'Lesson[title=Constructors, minutes=45]'
          ],
          [
            'Delegate between constructors',
            'this(...) centralizes defaults and must be the first constructor statement.',
            `final class Enrollment {\n  final String status;\n  Enrollment() { this("PENDING"); }\n  Enrollment(String status) { this.status = java.util.Objects.requireNonNull(status); }\n}\nSystem.out.println(new Enrollment().status);`,
            'PENDING'
          ]
        ];
      if (t === 'encapsulation')
        return [
          [
            'Protect an invariant',
            'Expose an operation that validates a state transition instead of a public mutable field.',
            `final class Progress {\n  private int completed; private final int total;\n  Progress(int total) { if (total < 1) throw new IllegalArgumentException(); this.total=total; }\n  void completeOne() { if (completed == total) throw new IllegalStateException("complete"); completed++; }\n  double ratio() { return (double) completed / total; }\n}`,
            'Callers cannot create completed > total'
          ],
          [
            'Return an unmodifiable view',
            'Do not leak a mutable collection that bypasses class rules.',
            `final class Course {\n  private final java.util.List<String> lessons = new java.util.ArrayList<>();\n  void addLesson(String title) { if (title.isBlank()) throw new IllegalArgumentException(); lessons.add(title); }\n  java.util.List<String> lessons() { return java.util.List.copyOf(lessons); }\n}`,
            'The returned list cannot mutate internal state'
          ]
        ];
      if (t === 'inheritance')
        return [
          [
            'Extend a genuine is-a relationship',
            'A subclass inherits accessible behavior and may specialize an overridable operation.',
            `class Course { String format() { return "self-paced"; } }\nfinal class Workshop extends Course { @Override String format() { return "live"; } }\nCourse course = new Workshop();\nSystem.out.println(course.format());`,
            'live'
          ],
          [
            'Prefer composition for capabilities',
            'A course can contain a pricing policy without becoming a kind of policy.',
            `interface Pricing { int cents(); }\nrecord FixedPricing(int cents) implements Pricing {}\nrecord Course(Pricing pricing) {}\nSystem.out.println(new Course(new FixedPricing(2500)).pricing().cents());`,
            '2500'
          ]
        ];
      if (t === 'polymorphism')
        return [
          [
            'Dispatch through an interface',
            'The declared type supplies the contract while runtime type selects the implementation.',
            `interface Notification { void send(String text); }\nrecord EmailNotification() implements Notification { public void send(String text) { System.out.println("email:"+text); } }\nNotification channel = new EmailNotification();\nchannel.send("published");`,
            'email:published'
          ],
          [
            'Process heterogeneous implementations',
            'One loop calls the same operation without inspecting concrete types.',
            `static void notifyAll(java.util.List<Notification> channels, String text) {\n  channels.forEach(channel -> channel.send(text));\n}`,
            'Every implementation receives the same message contract'
          ]
        ];
      if (t === 'abstraction')
        return [
          [
            'Define an abstract template',
            'An abstract base can fix shared workflow while requiring one domain-specific step.',
            `abstract class Importer {\n  final int run(String source) { validate(source); return importRows(source); }\n  private void validate(String source) { if (source.isBlank()) throw new IllegalArgumentException(); }\n  protected abstract int importRows(String source);\n}`,
            'Subclasses implement importRows but cannot bypass validation'
          ],
          [
            'Depend on a domain abstraction',
            'Business logic names the capability it needs rather than a database class.',
            `interface ProgressRepository { void save(long learnerId, int completed); }\nrecord CompleteLesson(ProgressRepository repository) {\n  void handle(long learnerId, int completed) { repository.save(learnerId, completed); }\n}`,
            'Use-case code is storage-independent'
          ]
        ];
      if (t === 'interfaces')
        return [
          [
            'Declare a behavioral contract',
            'Interface methods are public; implementations provide the behavior.',
            `interface Slugger { String slug(String title); }\nfinal class LowercaseSlugger implements Slugger {\n  public String slug(String title) { return title.strip().toLowerCase().replace(' ', '-'); }\n}\nSystem.out.println(new LowercaseSlugger().slug("Java Interfaces"));`,
            'java-interfaces'
          ],
          [
            'Use a default method sparingly',
            'A default adds compatible shared behavior without state.',
            `interface Identified {\n  long id();\n  default String reference() { return getClass().getSimpleName()+":"+id(); }\n}\nrecord Lesson(long id) implements Identified {}`,
            'new Lesson(42).reference() returns Lesson:42'
          ]
        ];
      if (t === 'collections framework')
        return [
          [
            'Program to collection interfaces',
            'Choose List, Set, Queue, or Map from ordering, uniqueness, and lookup requirements.',
            `java.util.List<String> ordered = new java.util.ArrayList<>();\njava.util.Set<String> unique = new java.util.HashSet<>();\njava.util.Map<Long,String> byId = new java.util.HashMap<>();\nordered.add("Java"); unique.add("Java"); byId.put(42L,"Java");\nSystem.out.println(ordered+" "+unique+" "+byId.get(42L));`,
            '[Java] [Java] Java'
          ],
          [
            'Use immutable factories for fixed data',
            'Factory collections reject mutation and null elements.',
            `var levels = java.util.List.of("BEGINNER", "ADVANCED");\nSystem.out.println(levels.getFirst());\n// levels.add("EXPERT"); // UnsupportedOperationException`,
            'BEGINNER'
          ]
        ];
      if (t === 'arraylist and linkedlist')
        return [
          [
            'ArrayList favors indexed access',
            'A resizable array provides fast random reads and amortized append.',
            `java.util.List<String> lessons = new java.util.ArrayList<>();\nlessons.add("Variables"); lessons.add("Loops");\nlessons.add(1,"Conditions");\nSystem.out.println(lessons.get(2));`,
            'Loops'
          ],
          [
            'LinkedList supports deque operations',
            'Use it through Deque when frequent operations occur at both ends; traversal remains linear.',
            `java.util.Deque<String> queue = new java.util.LinkedList<>();\nqueue.addLast("lesson-1"); queue.addLast("lesson-2");\nSystem.out.println(queue.removeFirst());`,
            'lesson-1'
          ]
        ];
      if (t === 'hashset')
        return [
          [
            'Enforce uniqueness',
            'HashSet uses equals and hashCode and does not promise iteration order.',
            `var tags = new java.util.HashSet<String>();\nSystem.out.println(tags.add("java"));\nSystem.out.println(tags.add(new String("java")));\nSystem.out.println(tags.size());`,
            'true\nfalse\n1'
          ],
          [
            'Perform set algebra',
            'Copy before retaining or removing to avoid destroying the original input.',
            `var enrolled = java.util.Set.of(1L,2L,3L);\nvar completed = java.util.Set.of(2L,3L,4L);\nvar both = new java.util.HashSet<>(enrolled);\nboth.retainAll(completed);\nSystem.out.println(both);`,
            '[2, 3] in unspecified order'
          ]
        ];
      if (t === 'hashmap')
        return [
          [
            'Index values by key',
            'HashMap replaces a value for an equal existing key and permits no ordering assumption.',
            `var durations = new java.util.HashMap<String,Integer>();\ndurations.put("java",45); durations.put("sql",30);\ndurations.merge("java",15,Integer::sum);\nSystem.out.println(durations.getOrDefault("spring",0)+" "+durations.get("java"));`,
            '0 60'
          ],
          [
            'Group with computeIfAbsent',
            'Create a bucket only when its key first appears.',
            `var lessonsByCourse = new java.util.HashMap<String,java.util.List<String>>();\nlessonsByCourse.computeIfAbsent("java", ignored -> new java.util.ArrayList<>()).add("Generics");\nSystem.out.println(lessonsByCourse);`,
            '{java=[Generics]}'
          ]
        ];
      if (t === 'queue and stack')
        return [
          [
            'Use a queue for FIFO work',
            'Deque offers non-throwing offer and poll operations.',
            `java.util.Queue<String> jobs = new java.util.ArrayDeque<>();\njobs.offer("compile"); jobs.offer("test");\nSystem.out.println(jobs.poll()+" then "+jobs.poll());`,
            'compile then test'
          ],
          [
            'Use Deque as a stack',
            'push, peek, and pop replace the legacy Stack class.',
            `java.util.Deque<String> history = new java.util.ArrayDeque<>();\nhistory.push("course"); history.push("lesson");\nSystem.out.println(history.pop()+" -> "+history.peek());`,
            'lesson -> course'
          ]
        ];
      if (t === 'lambda expressions')
        return [
          [
            'Pass behavior as a value',
            'A lambda implements the single abstract method of a functional interface.',
            `java.util.function.Predicate<String> longTitle = title -> title.length() >= 8;\nSystem.out.println(longTitle.test("Generics"));`,
            'true'
          ],
          [
            'Capture effectively final state',
            'Captured local variables cannot be reassigned after capture.',
            `String prefix = "course:";\njava.util.function.Function<String,String> label = value -> prefix + value.toLowerCase();\nSystem.out.println(label.apply("JAVA"));`,
            'course:java'
          ]
        ];
      if (t === 'stream api')
        return [
          [
            'Compose a lazy pipeline',
            'Intermediate operations run only when a terminal operation requests results.',
            `var titles = java.util.List.of("Loops", "Streams", "SQL");\nvar result = titles.stream().filter(title -> title.length() >= 5).map(String::toUpperCase).sorted().toList();\nSystem.out.println(result);`,
            '[LOOPS, STREAMS]'
          ],
          [
            'Group and count',
            'Collectors can build a map from a classification function and downstream reduction.',
            `var counts = java.util.stream.Stream.of("java","sql","java")\n    .collect(java.util.stream.Collectors.groupingBy(java.util.function.Function.identity(), java.util.stream.Collectors.counting()));\nSystem.out.println(counts);`,
            '{java=2, sql=1} in unspecified order'
          ]
        ];
      if (t === 'optional')
        return [
          [
            'Model an absent lookup result',
            'Map a present value and supply a lazy fallback without null checks.',
            `java.util.Optional<String> title = repository.findTitle(42L);\nString label = title.map(String::toUpperCase).orElseGet(() -> "NOT FOUND");\nSystem.out.println(label);`,
            'Uppercase title or NOT FOUND'
          ],
          [
            'Do not use Optional for every field',
            'Convert absence to a domain error at the boundary that requires a value.',
            `Course course = repository.find(42L)\n    .orElseThrow(() -> new java.util.NoSuchElementException("course 42"));`,
            'A Course or a contextual exception'
          ]
        ];
      if (t === 'multithreading')
        return [
          [
            'Start and join a task',
            'join establishes that the task completed before its result is consumed.',
            `var result = new java.util.concurrent.atomic.AtomicInteger();\nThread worker = Thread.ofPlatform().start(() -> result.set(6 * 7));\nworker.join();\nSystem.out.println(result.get());`,
            '42'
          ],
          [
            'Protect a compound update',
            'AtomicInteger makes read-modify-write increment atomic across threads.',
            `var counter = new java.util.concurrent.atomic.AtomicInteger();\nvar threads = java.util.stream.IntStream.range(0,100).mapToObj(i -> Thread.startVirtualThread(counter::incrementAndGet)).toList();\nfor (var thread : threads) thread.join();\nSystem.out.println(counter.get());`,
            '100'
          ]
        ];
      if (t === 'concurrency utilities')
        return [
          [
            'Coordinate with a blocking queue',
            'Producer and consumer use a bounded handoff with back pressure.',
            `var queue = new java.util.concurrent.ArrayBlockingQueue<String>(10);\nqueue.put("lesson-42");\nSystem.out.println(queue.take());`,
            'lesson-42'
          ],
          [
            'Limit concurrent access',
            'A semaphore bounds expensive operations even when many tasks are scheduled.',
            `var permits = new java.util.concurrent.Semaphore(3);\npermits.acquire();\ntry { callRemoteService(); } finally { permits.release(); }`,
            'At most three guarded calls run concurrently'
          ]
        ];
      if (t === 'completablefuture')
        return [
          [
            'Compose asynchronous stages',
            'Transform a successful result without blocking the caller thread.',
            `var future = java.util.concurrent.CompletableFuture.supplyAsync(() -> loadCourse(42L))\n    .thenApply(Course::title)\n    .thenApply(String::toUpperCase);\nSystem.out.println(future.join());`,
            'The uppercase course title'
          ],
          [
            'Combine independent results',
            'thenCombine runs after both futures complete and propagates failure.',
            `var course = java.util.concurrent.CompletableFuture.supplyAsync(() -> loadCourse(42L));\nvar progress = java.util.concurrent.CompletableFuture.supplyAsync(() -> loadProgress(42L));\nvar view = course.thenCombine(progress, CourseView::new);`,
            'A future CourseView after both inputs'
          ]
        ];
      if (t === 'virtual threads')
        return [
          [
            'Create one virtual thread per task',
            'Virtual threads make blocking I/O tasks cheap to represent, not CPU work faster.',
            `try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {\n  var futures = java.util.stream.LongStream.rangeClosed(1,1000)\n      .mapToObj(id -> executor.submit(() -> httpClient.load(id))).toList();\n  for (var future : futures) consume(future.get());\n}`,
            'Up to one thousand blocking tasks with scoped executor lifetime'
          ],
          [
            'Preserve concurrency limits',
            'A semaphore still protects a downstream service from excessive simultaneous calls.',
            `var limit = new java.util.concurrent.Semaphore(20);\nThread.startVirtualThread(() -> {\n  limit.acquireUninterruptibly();\n  try { repository.load(42L); } finally { limit.release(); }\n});`,
            'A virtual task governed by a twenty-call limit'
          ]
        ];
      if (/^professional project structure$/.test(t))
        return [
          [
            'Layer by responsibility',
            'Keep domain code independent from adapters and application bootstrap.',
            `src/main/java/academy/\n  domain/Course.java\n  application/PublishCourse.java\n  ports/CourseRepository.java\n  adapters/jdbc/JdbcCourseRepository.java\n  bootstrap/Main.java`,
            'A dependency-oriented package tree'
          ],
          [
            'Test beside the same package',
            'Mirror production packages under test source roots.',
            `src/test/java/academy/\n  domain/CourseTest.java\n  application/PublishCourseTest.java\n  adapters/jdbc/JdbcCourseRepositoryIT.java`,
            'Unit and integration tests remain discoverable'
          ]
        ];
      if (/^records and sealed classes$/.test(t))
        return [
          [
            'Record data carrier',
            'The canonical constructor validates components and generated accessors expose them.',
            `record LessonSummary(long id,String title) {\n  LessonSummary { if(id<=0||title.isBlank()) throw new IllegalArgumentException(); }\n}\nSystem.out.println(new LessonSummary(42,"Records").title());`,
            'Records'
          ],
          [
            'Sealed result hierarchy',
            'Permitted subtypes make a switch exhaustive.',
            `sealed interface LoadResult permits Found,Missing {}\nrecord Found(String title) implements LoadResult {}\nrecord Missing(long id) implements LoadResult {}\nstatic String display(LoadResult result) {\n  return switch(result) { case Found f -> f.title(); case Missing m -> "Missing "+m.id(); };\n}`,
            'Every permitted result is handled'
          ]
        ];
      if (/variable|data type/.test(t))
        return [
          [
            'Primitive and reference values',
            'Declare representative values and inspect them.',
            `int lessons = 18;\ndouble completion = 0.75;\nboolean active = true;\nString course = "Java";\nSystem.out.printf("%s: %d, %.0f%%, %b%n", course, lessons, completion * 100, active);`,
            'Java: 18, 75%, true'
          ],
          [
            'Safe numeric conversion',
            'Widening preserves the integer value; narrowing is explicit.',
            `int learners = 120;\nlong exact = learners;\ndouble average = exact / 7.0;\nint displayed = (int) average;\nSystem.out.println(average + " -> " + displayed);`,
            '17.142857142857142 -> 17'
          ]
        ];
      if (/operator/.test(t))
        return [
          [
            'Arithmetic and comparison',
            'Calculate a score and compare it with a threshold.',
            `int correct = 8, total = 10;\ndouble percent = correct * 100.0 / total;\nboolean passed = percent >= 70 && total > 0;\nSystem.out.println(percent + "% " + passed);`,
            '80.0% true'
          ],
          [
            'Ternary and bit flags',
            'Choose a label and combine independent permissions.',
            `int READ = 1, WRITE = 2;\nint permissions = READ | WRITE;\nString access = (permissions & WRITE) != 0 ? "editor" : "viewer";\nSystem.out.println(access);`,
            'editor'
          ]
        ];
      if (/condition/.test(t))
        return [
          [
            'if chain',
            'Order mutually exclusive score bands from most restrictive condition to fallback.',
            `int score = 84;\nString grade;\nif (score >= 90) grade = "A";\nelse if (score >= 80) grade = "B";\nelse grade = "Needs practice";\nSystem.out.println(grade);`,
            'B'
          ],
          [
            'switch expression', 'Map a closed status set to a message.',
            `String status = "PUBLISHED";\nString message = switch (status) {\n  case "DRAFT" -> "Keep editing";\n  case "PUBLISHED" -> "Visible to learners";\n  default -> "Unknown status";\n};\nSystem.out.println(message);`,
            'Visible to learners'
          ]
        ];
      if (/loop/.test(t))
        return [
          [
            'for and enhanced for',
            'Use an index when position matters and enhanced for for values.',
            `String[] topics = {"types", "loops", "methods"};\nfor (int i = 0; i < topics.length; i++) System.out.println(i + ":" + topics[i]);\nfor (String topic : topics) System.out.print(topic + " ");`,
            '0:types ... types loops methods'
          ],
          [
            'while and do-while',
            'A while loop may skip; a do-while always performs its body once.',
            `int retries = 2;\nwhile (retries > 0) {\n  System.out.println("retry " + retries--);\n}\nint checks = 0;\ndo { checks++; } while (checks < 1);\nSystem.out.println("checks=" + checks);`,
            'retry 2\nretry 1\nchecks=1'
          ]
        ];
      if (/^arrays$/.test(t))
        return [
          [
            'Create, update, iterate',
            'Use length for bounds and update an element by index.',
            `int[] scores = {70, 82, 91};\nscores[1] = 85;\nfor (int score : scores) System.out.println(score);`,
            '70\n85\n91'
          ],
          [
            'Sort and binary search', 'Sort before using binarySearch.',
            `int[] ids = {42, 7, 19};\njava.util.Arrays.sort(ids);\nint index = java.util.Arrays.binarySearch(ids, 19);\nSystem.out.println(java.util.Arrays.toString(ids) + " index=" + index);`,
            '[7, 19, 42] index=1'
          ]
        ];
      if (/string/.test(t))
        return [
          [
            'Immutable transformations', 'String methods return new values.',
            `String raw = "  Java Course  ";\nString slug = raw.strip().toLowerCase().replace(" ", "-");\nSystem.out.println(slug);`,
            'java-course'
          ],
          [
            'Efficient assembly',
            'StringBuilder avoids many temporary strings in a loop.',
            `var csv = new StringBuilder();\nfor (String item : java.util.List.of("id", "title", "status")) {\n  if (!csv.isEmpty()) csv.append(',');\n  csv.append(item);\n}\nSystem.out.println(csv);`,
            'id,title,status'
          ]
        ];
      if (/method/.test(t))
        return [
          [
            'Parameters and return value',
            'A pure method returns a result without mutating caller state.',
            `static double completion(int done, int total) {\n  if (total <= 0) throw new IllegalArgumentException("total must be positive");\n  return done * 100.0 / total;\n}\nSystem.out.println(completion(7, 10));`,
            '70.0'
          ],
          [
            'Overloading',
            'Overloads share a name but have distinct parameter lists.',
            `static String label(String title) { return label(title, false); }\nstatic String label(String title, boolean done) {\n  return (done ? "✓ " : "○ ") + title;\n}\nSystem.out.println(label("Generics", true));`,
            '✓ Generics'
          ]
        ];
      if (/^(classes and objects|constructors|encapsulation)$/.test(t))
        return [
          [
            'Validated object state',
            'A constructor enforces invariants before an object becomes visible.',
            `final class Lesson {\n  private final String title;\n  Lesson(String title) {\n    if (title == null || title.isBlank()) throw new IllegalArgumentException("title");\n    this.title = title;\n  }\n  String title() { return title; }\n}\nSystem.out.println(new Lesson("Arrays").title());`,
            'Arrays'
          ],
          [
            'Behavior instead of exposed fields',
            'Methods preserve the progress invariant.',
            `final class Progress {\n  private int completed;\n  private final int total;\n  Progress(int total) { this.total = total; }\n  void completeOne() { if (completed < total) completed++; }\n  double percent() { return completed * 100.0 / total; }\n}`,
            'percent never exceeds 100'
          ]
        ];
      if (/^(inheritance|polymorphism|abstraction|interfaces)$/.test(t))
        return [
          [
            'Program to an interface',
            'Runtime dispatch selects the implementation.',
            `interface Formatter { String format(String title); }\nrecord PlainFormatter() implements Formatter {\n  public String format(String title) { return title; }\n}\nFormatter formatter = new PlainFormatter();\nSystem.out.println(formatter.format("Interfaces"));`,
            'Interfaces'
          ],
          [
            'Sealed abstraction',
            'A sealed interface makes all supported cases explicit.',
            `sealed interface Result permits Success, Failure {}\nrecord Success(String value) implements Result {}\nrecord Failure(String message) implements Result {}\nstatic String describe(Result r) {\n  return switch (r) { case Success s -> s.value(); case Failure f -> "Error: " + f.message(); };\n}`,
            'Exhaustive result handling'
          ]
        ];
      if (/^(collections framework|arraylist and linkedlist|hashset|hashmap|queue and stack)$/
              .test(t))
        return [
          [
            'Choose by behavior',
            'List preserves order, Set uniqueness, and Map key lookup.',
            `var order = new java.util.ArrayList<>(java.util.List.of("SQL", "Java"));\nvar unique = new java.util.LinkedHashSet<>(order);\nvar minutes = new java.util.HashMap<String,Integer>();\nminutes.put("SQL", 45);\nSystem.out.println(unique + " " + minutes.get("SQL"));`,
            '[SQL, Java] 45'
          ],
          [
            'Queue and stack semantics',
            'ArrayDeque supports FIFO queues and LIFO stacks.',
            `var deque = new java.util.ArrayDeque<String>();\ndeque.offer("first"); deque.offer("second");\nSystem.out.println(deque.poll());\ndeque.push("urgent");\nSystem.out.println(deque.pop());`,
            'first\nurgent'
          ]
        ];
      if (/^(lambda expressions|stream api|optional)$/.test(t))
        return [
          [
            'Lazy stream pipeline',
            'Intermediate operations run when the terminal operation requests values.',
            `var result = java.util.List.of("java", "sql", "react").stream()\n    .filter(name -> name.length() > 3)\n    .map(String::toUpperCase)\n    .sorted()\n    .toList();\nSystem.out.println(result);`,
            '[JAVA, REACT]'
          ],
          [
            'Optional result',
            'Transform an optional value and provide a deliberate fallback.',
            `var title = java.util.Optional.of("  Streams ")\n    .map(String::strip)\n    .filter(s -> !s.isEmpty())\n    .orElse("Untitled");\nSystem.out.println(title);`,
            'Streams'
          ]
        ];
      if (/^(multithreading|concurrency utilities|completablefuture|virtual threads)$/
              .test(t))
        return [
          [
            'Structured task result', 'Use an executor and always close it.',
            `try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {\n  var future = executor.submit(() -> "loaded on " + Thread.currentThread());\n  System.out.println(future.get());\n}`,
            'A result from a virtual thread'
          ],
          [
            'Atomic shared state',
            'AtomicInteger makes the read-modify-write increment atomic.',
            `var count = new java.util.concurrent.atomic.AtomicInteger();\nvar tasks = java.util.stream.IntStream.range(0, 100)\n    .mapToObj(i -> Thread.ofVirtual().start(count::incrementAndGet)).toList();\nfor (Thread task : tasks) task.join();\nSystem.out.println(count.get());`,
            '100'
          ]
        ];
      if (/jdbc/.test(t))
        return [
          [
            'Prepared query',
            'Bind values instead of concatenating user input.',
            `String sql = "SELECT id, title FROM lessons WHERE course_id = ? ORDER BY id";\ntry (var statement = connection.prepareStatement(sql)) {\n  statement.setLong(1, 42);\n  try (var rows = statement.executeQuery()) {\n    while (rows.next()) System.out.println(rows.getString("title"));\n  }\n}`,
            'Each matching lesson title'
          ],
          [
            'Atomic update',
            'Disable auto-commit for related changes and roll back on failure.',
            `connection.setAutoCommit(false);\ntry {\n  saveCourse(connection);\n  saveLessons(connection);\n  connection.commit();\n} catch (Exception error) {\n  connection.rollback();\n  throw error;\n}`,
            'Both writes commit or neither does'
          ]
        ];
      if (/introduction|setup/.test(t))
        return [
          [
            'Compile and run',
            'javac compiles source to bytecode and java launches the named class.',
            `public class HelloAcademy {\n  public static void main(String[] args) {\n    System.out.println("Java " + Runtime.version().feature());\n  }\n}\n// javac HelloAcademy.java\n// java HelloAcademy`,
            'Java followed by the installed feature version'
          ],
          [
            'Use JShell for exploration',
            'JShell evaluates small Java declarations without a project.',
            `// Run in jshell\nString course = "Java";\ncourse.toUpperCase();\n/exit`,
            '"JAVA"'
          ]
        ];
      if (/package|project structure/.test(t))
        return [
          [
            'Package declaration and import',
            'The directory and declared package should agree in normal builds.',
            `package academy.lessons;\n\nimport java.time.Duration;\n\npublic record Lesson(String title, Duration duration) {}`,
            'A compiled academy.lessons.Lesson type'
          ],
          [
            'Package-private helper',
            'Omitting an access modifier keeps a top-level helper inside its package.',
            `package academy.progress;\n\nfinal class Percentage {\n  static int of(int done, int total) { return done * 100 / total; }\n}`,
            'Only code in academy.progress can name Percentage'
          ]
        ];
      if (/access modifier/.test(t))
        return [
          [
            'Expose behavior, hide representation',
            'private state is reached through a public operation.',
            `public final class Enrollment {\n  private boolean completed;\n  public void complete() { completed = true; }\n  public boolean isCompleted() { return completed; }\n}`,
            'Callers cannot assign completed directly'
          ],
          [
            'Protected is not public API',
            'protected enables subclasses and same-package code; prefer composition for unrelated clients.',
            `abstract class BaseCourse {\n  protected final void validateTitle(String title) {\n    if (title.isBlank()) throw new IllegalArgumentException("title");\n  }\n}`,
            'Subclasses may call validateTitle'
          ]
        ];
      if (/static and final/.test(t))
        return [
          [
            'Class member and constant',
            'static belongs to the class; a constant reference is final.',
            `final class Limits {\n  static final int MAX_LESSONS = 500;\n  private Limits() {}\n}\nSystem.out.println(Limits.MAX_LESSONS);`,
            '500'
          ],
          [
            'Final reference versus mutable object',
            'final prevents reassignment, not mutation of the referenced list.',
            `final var topics = new java.util.ArrayList<String>();\ntopics.add("Java");\n// topics = new ArrayList<>(); // compile-time error\nSystem.out.println(topics);`,
            '[Java]'
          ]
        ];
      if (/enum/.test(t))
        return [
          [
            'Enum with behavior',
            'Each enum constant is a singleton instance of the enum type.',
            `enum Level {\n  BEGINNER(1), INTERMEDIATE(2), ADVANCED(3);\n  final int rank;\n  Level(int rank) { this.rank = rank; }\n}\nSystem.out.println(Level.ADVANCED.rank);`,
            '3'
          ],
          [
            'Safe parsing',
            'valueOf is exact and throws for unknown input; normalize and handle failure at boundaries.',
            `String input = " beginner ";\nLevel level = Level.valueOf(input.strip().toUpperCase());\nSystem.out.println(level);`,
            'BEGINNER'
          ]
        ];
      if (/exception/.test(t))
        return [
          [
            'Checked resource handling',
            'try-with-resources closes the reader even when reading fails.',
            `try (var reader = java.nio.file.Files.newBufferedReader(path)) {\n  System.out.println(reader.readLine());\n} catch (java.io.IOException error) {\n  System.err.println("Cannot read " + path + ": " + error.getMessage());\n}`,
            'First line or a contextual error'
          ],
          [
            'Preserve the cause',
            'Wrap at an abstraction boundary without discarding the original exception.',
            `try {\n  repository.save(lesson);\n} catch (java.sql.SQLException error) {\n  throw new IllegalStateException("Could not save lesson " + lesson.id(), error);\n}`,
            'A domain-context exception retaining the SQL cause'
          ]
        ];
      if (/generic/.test(t))
        return [
          [
            'Type-safe container',
            'A type parameter relates input and output types without casts.',
            `record Box<T>(T value) {}\nBox<String> title = new Box<>("Generics");\nSystem.out.println(title.value().toUpperCase());`,
            'GENERICS'
          ],
          [
            'PECS wildcard rule', 'Read from extends and write to super.',
            `static double sum(java.util.List<? extends Number> values) {\n  return values.stream().mapToDouble(Number::doubleValue).sum();\n}\nstatic void addDefaults(java.util.List<? super Integer> out) { out.add(0); }`,
            'Works with several compatible list element types'
          ]
        ];
      if (/date and time/.test(t))
        return [
          [
            'Instant versus local time',
            'Instant is a timeline point; ZonedDateTime renders it in a zone.',
            `var instant = java.time.Instant.parse("2026-08-12T12:00:00Z");\nvar local = instant.atZone(java.time.ZoneId.of("Asia/Hebron"));\nSystem.out.println(local);`,
            'The same instant rendered in Asia/Hebron'
          ],
          [
            'Duration versus Period',
            'Duration measures time; Period measures calendar dates.',
            `var start = java.time.LocalDate.of(2026, 1, 31);\nSystem.out.println(start.plusMonths(1));\nSystem.out.println(java.time.Duration.ofMinutes(90).toHoursPart());`,
            '2026-02-28\n1'
          ]
        ];
      if (/annotation|reflection/.test(t))
        return [
          [
            'Runtime annotation',
            'Retention controls whether reflection can see annotation metadata.',
            `@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)\n@interface Audited { String value(); }\n@Audited("course.publish") class Publisher {}\nSystem.out.println(Publisher.class.getAnnotation(Audited.class).value());`,
            'course.publish'
          ],
          [
            'Inspect declared methods',
            'Reflection discovers runtime structure but invocation errors are deferred to runtime.',
            `for (var method : String.class.getDeclaredMethods()) {\n  if (method.getName().equals("isBlank")) System.out.println(method);\n}`,
            'The String.isBlank method signature'
          ]
        ];
      if (/regular expression/.test(t))
        return [
          [
            'Compiled validation pattern',
            'Anchor the whole input when validating a slug.',
            `var slug = java.util.regex.Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");\nSystem.out.println(slug.matcher("java-generics").matches());`,
            'true'
          ],
          [
            'Named capture groups',
            'Extract structured values and quote untrusted literal text.',
            `var p = java.util.regex.Pattern.compile("(?<course>[A-Z]+)-(?<id>\\\\d+)");\nvar m = p.matcher("JAVA-42");\nif (m.matches()) System.out.println(m.group("course") + ":" + m.group("id"));`,
            'JAVA:42'
          ]
        ];
      if (/file handling|nio|path|channel/.test(t))
        return [
          [
            'Path and UTF-8 text',
            'Resolve paths structurally and let Files manage open and close.',
            `var directory = java.nio.file.Path.of("data");\nvar file = directory.resolve("lessons.txt");\njava.nio.file.Files.createDirectories(directory);\njava.nio.file.Files.writeString(file, "Arrays\\n", java.nio.charset.StandardCharsets.UTF_8);\nSystem.out.println(java.nio.file.Files.readString(file));`,
            'Arrays'
          ],
          [
            'Atomic replacement',
            'Write a sibling temporary file, then replace the target atomically when supported.',
            `var temp = java.nio.file.Files.createTempFile(file.getParent(), "lessons-", ".tmp");\njava.nio.file.Files.writeString(temp, "updated");\njava.nio.file.Files.move(temp, file, java.nio.file.StandardCopyOption.REPLACE_EXISTING, java.nio.file.StandardCopyOption.ATOMIC_MOVE);`,
            'Target is replaced as one filesystem operation'
          ]
        ];
      if (/serialization/.test(t))
        return [
          [
            'Prefer an explicit data format',
            'A record maps cleanly to JSON through a library and keeps the wire schema reviewable.',
            `record LessonDto(long id, String title) {}\nLessonDto dto = new LessonDto(42, "Serialization");\nString json = objectMapper.writeValueAsString(dto);\nSystem.out.println(json);`,
            '{"id":42,"title":"Serialization"}'
          ],
          [
            'Defensive deserialization',
            'Limit size and validate fields after parsing untrusted data.',
            `LessonDto dto = objectMapper.readValue(input, LessonDto.class);\nif (dto.id() <= 0 || dto.title().isBlank()) {\n  throw new IllegalArgumentException("invalid lesson payload");\n}`,
            'Invalid data is rejected before domain use'
          ]
        ];
      if (/network|http client/.test(t))
        return [
          [
            'Immutable HTTP request',
            'Set a timeout and request JSON explicitly.',
            `var request = java.net.http.HttpRequest.newBuilder(java.net.URI.create("https://api.example.test/lessons/42"))\n    .timeout(java.time.Duration.ofSeconds(3))\n    .header("Accept", "application/json")\n    .GET().build();\nvar response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.statusCode());`,
            'An HTTP status code'
          ],
          [
            'Asynchronous response',
            'Compose completion stages without blocking the initiating thread.',
            `client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString())\n    .thenApply(java.net.http.HttpResponse::body)\n    .thenAccept(System.out::println)\n    .exceptionally(error -> { System.err.println(error); return null; });`,
            'Body on success or a reported failure'
          ]
        ];
      if (/jvm memory|garbage/.test(t))
        return [
          [
            'Reachability, not scope alone',
            'Removing the last strong reference makes an object eligible, not immediately collected.',
            `var cache = new java.util.HashMap<Long, byte[]>();\ncache.put(42L, new byte[1_000_000]);\ncache.remove(42L);\n// Eligibility is automatic; System.gc() is only a request.`,
            'The removed array may be reclaimed later'
          ],
          [
            'Bound a cache',
            'Use an eviction policy instead of retaining every result forever.',
            `var cache = new java.util.LinkedHashMap<Long,String>(16, .75f, true) {\n  protected boolean removeEldestEntry(java.util.Map.Entry<Long,String> e) { return size() > 100; }\n};`,
            'At most 100 entries remain after insertion'
          ]
        ];
      if (/maven/.test(t))
        return [
          [
            'Declare a tested dependency',
            'Use dependencyManagement or a BOM for coordinated versions.',
            `<dependency>\n  <groupId>org.junit.jupiter</groupId>\n  <artifactId>junit-jupiter</artifactId>\n  <version>5.12.2</version>\n  <scope>test</scope>\n</dependency>`,
            'JUnit is available only to test compilation and execution'
          ],
          [
            'Reproducible lifecycle', 'Use the Maven Wrapper in CI.',
            `./mvnw --no-transfer-progress clean verify`,
            'Compile, tests, integration checks, and package phases run from a clean target'
          ]
        ];
      if (/gradle/.test(t))
        return [
          [
            'Java toolchain and dependency',
            'Pin the language toolchain and keep test dependencies scoped.',
            `java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }\ndependencies { testImplementation(platform("org.junit:junit-bom:5.12.2")); testImplementation("org.junit.jupiter:junit-jupiter") }\ntasks.test { useJUnitPlatform() }`,
            'Gradle resolves a Java 21 toolchain and runs JUnit Platform'
          ],
          [
            'Wrapper build',
            'Commit wrapper files and invoke the wrapper in automation.',
            `./gradlew clean test build --warning-mode=fail`,
            'A clean tested artifact or a non-zero exit'
          ]
        ];
      if (/java platform module/.test(t))
        return [
          [
            'Module descriptor',
            'Require dependencies and export only public API packages.',
            `module devpath.academy {\n  requires java.sql;\n  exports academy.api;\n}`,
            'academy.api is accessible to requiring modules'
          ],
          [
            'Service provider',
            'Declare a provider without exposing its implementation package.',
            `module devpath.postgres {\n  requires devpath.academy;\n  provides academy.api.CourseRepository with academy.postgres.PostgresCourseRepository;\n}`,
            'ServiceLoader can discover the repository'
          ]
        ];
      if (/junit/.test(t))
        return [
          [
            'Behavior test',
            'Arrange one scenario, call the public API, and assert its observable result.',
            `@org.junit.jupiter.api.Test\nvoid calculatesCompletion() {\n  var progress = new Progress(10);\n  progress.completeOne();\n  org.junit.jupiter.api.Assertions.assertEquals(10.0, progress.percent());\n}`,
            'The test passes when percent is 10.0'
          ],
          [
            'Parameterized boundary test',
            'Run the same invariant over several invalid values.',
            `@org.junit.jupiter.params.ParameterizedTest\n@org.junit.jupiter.params.provider.ValueSource(ints = {0, -1})\nvoid rejectsNonPositiveTotal(int total) {\n  org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class, () -> new Progress(total));\n}`,
            'Both invalid totals are rejected'
          ]
        ];
      if (/mockito/.test(t))
        return [
          [
            'Stub a collaborator',
            'Mock only the repository boundary and verify the returned behavior.',
            `var repository = org.mockito.Mockito.mock(CourseRepository.class);\norg.mockito.Mockito.when(repository.findTitle(42L)).thenReturn(java.util.Optional.of("Java"));\nvar service = new CourseService(repository);\norg.junit.jupiter.api.Assertions.assertEquals("Java", service.title(42L));`,
            'Service returns Java'
          ],
          [
            'Verify a meaningful side effect',
            'Verify the command once; do not mirror every implementation call.',
            `service.publish(42L);\norg.mockito.Mockito.verify(repository).markPublished(42L);\norg.mockito.Mockito.verifyNoMoreInteractions(repository);`,
            'The publication command is issued once'
          ]
        ];
      if (/solid/.test(t))
        return [
          [
            'Dependency inversion',
            'A use case depends on a repository port rather than a database class.',
            `interface CourseRepository { java.util.Optional<Course> find(long id); }\nfinal class PublishCourse {\n  private final CourseRepository repository;\n  PublishCourse(CourseRepository repository) { this.repository = repository; }\n}`,
            'Business code has no JDBC dependency'
          ],
          [
            'Interface segregation',
            'Separate read and write capabilities so clients receive only what they use.',
            `interface CourseReader { CourseView find(long id); }\ninterface CourseWriter { void save(Course course); }`,
            'Read-only clients cannot call save'
          ]
        ];
      if (/design pattern/.test(t))
        return [
          [
            'Strategy pattern',
            'Inject interchangeable behavior behind one contract.',
            `interface Pricing { java.math.BigDecimal price(Course course); }\nrecord StandardPricing() implements Pricing {\n  public java.math.BigDecimal price(Course course) { return course.basePrice(); }\n}`,
            'Pricing can vary without conditionals in Course'
          ],
          [
            'Factory method',
            'Centralize construction when validation and subtype choice belong together.',
            `static Notification create(Channel channel) {\n  return switch (channel) { case EMAIL -> new EmailNotification(); case PUSH -> new PushNotification(); };\n}`,
            'A supported Notification implementation'
          ]
        ];
      if (/clean code/.test(t))
        return [
          [
            'Extract an intention-revealing rule',
            'Name the business decision instead of commenting a boolean expression.',
            `boolean canPublish(Course course, User user) {\n  return course.hasLessons() && user.canEdit(course.id()) && !course.isArchived();\n}`,
            'A readable publication policy'
          ],
          [
            'Replace primitive arguments',
            'A value object validates once and prevents parameter-order mistakes.',
            `record DurationMinutes(int value) {\n  DurationMinutes { if (value < 1 || value > 480) throw new IllegalArgumentException(); }\n}\nvoid schedule(LessonId id, DurationMinutes duration) { ... }`,
            'Invalid durations cannot enter schedule'
          ]
        ];
      if (/advanced java/.test(t))
        return [
          [
            'Pattern matching over a sealed hierarchy',
            'The compiler checks exhaustive cases.',
            `sealed interface Command permits Publish, Archive {}\nrecord Publish(long id) implements Command {}\nrecord Archive(long id) implements Command {}\nstatic long id(Command command) {\n  return switch (command) { case Publish p -> p.id(); case Archive a -> a.id(); };\n}`,
            'Identifier from either command'
          ],
          [
            'Scoped resource ownership',
            'Keep an executor lifetime inside the operation that owns it.',
            `try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {\n  var results = ids.stream().map(id -> executor.submit(() -> load(id))).toList();\n  for (var result : results) consume(result.get());\n}`,
            'All submitted tasks complete before executor closure'
          ]
        ];
      if (/final java practice project/.test(t))
        return [
          [
            'Project application boundary',
            'Compose domain, repository, and delivery adapters in one bootstrap location.',
            `public static void main(String[] args) {\n  var dataSource = dataSourceFromEnvironment();\n  CourseRepository repository = new JdbcCourseRepository(dataSource);\n  var service = new CourseService(repository, java.time.Clock.systemUTC());\n  startHttpServer(new CourseController(service));\n}`,
            'A running project with explicit dependency composition'
          ],
          [
            'Project acceptance test',
            'Verify persistence and behavior through a realistic boundary.',
            `@Test void publishesPersistedCourse() {\n  long id = api.createCourse("Java").id();\n  api.addLesson(id, "Generics");\n  api.publish(id);\n  assertEquals("PUBLISHED", api.getCourse(id).status());\n}`,
            'End-to-end publication succeeds'
          ]
        ];
      return null;
    };
window.ACADEMY_LESSON_SPECS['java-essentials'] = {
  ...{
    context: 'Java programs',
    language: 'java',
    concepts: [
      [
        /variable|data type/,
        'A variable gives a typed name to a value; Java checks assignments at compile time and distinguishes primitive values from object references'
      ],
      [
        /operator/,
        'Operators form expressions for arithmetic, comparison, boolean logic, assignment, and bit manipulation; precedence controls grouping, not evaluation safety'
      ],
      [
        /condition|loop/,
        'Control-flow statements choose or repeat work; the condition must be boolean and every loop needs a deliberate termination argument'
      ],
      [
        /array/,
        'An array is a fixed-length, zero-indexed object whose component type is enforced at runtime'
      ],
      [
        /string/,
        'String is an immutable sequence of UTF-16 code units; repeated modification is better expressed with StringBuilder'
      ],
      [
        /method/,
        'A method names behavior behind a parameter and return-value contract; overload resolution happens at compile time'
      ],
      [
        /class|object|constructor/,
        'A class defines state and behavior while each object has its own identity; constructors establish valid initial state'
      ],
      [
        /encapsulation|access modifier/,
        'Encapsulation protects invariants by exposing intentional operations instead of writable representation'
      ],
      [
        /inheritance|polymorphism|abstraction|interface/,
        'Subtype polymorphism lets callers depend on a contract while runtime dispatch selects the concrete implementation'
      ],
      [
        /static|final/,
        'static members belong to the class, while final prevents reassignment, overriding, or inheritance according to where it is applied'
      ],
      [
        /enum/,
        'An enum models a closed set of named instances and can carry fields, methods, and interface implementations'
      ],
      [
        /exception/,
        'Exceptions separate a failure path from the normal return path; checked exceptions require declaration or handling'
      ],
      [
        /collection|arraylist|linkedlist|hashset|hashmap|queue|stack/,
        'The Collections Framework provides interfaces with different ordering, uniqueness, lookup, and mutation costs; choose from required behavior rather than habit'
      ],
      [
        /generic/,
        'Generics express compile-time relationships between types; type erasure preserves broad binary compatibility but removes most type arguments at runtime'
      ],
      [
        /lambda|stream|optional/,
        'Functional Java represents behavior as values and composes transformations; streams are lazy pipelines and Optional models an intentionally absent result'
      ],
      [
        /date|time/,
        'java.time uses immutable types and separates machine time, local calendar values, durations, periods, and time zones'
      ],
      [
        /record|sealed/,
        'Records provide transparent data carriers, while sealed hierarchies explicitly limit permitted subtypes'
      ],
      [
        /annotation|reflection/,
        'Annotations attach metadata; reflection inspects types dynamically but trades compile-time guarantees for flexibility'
      ],
      [
        /regular expression/,
        'A regular expression describes a text pattern; Java Pattern compiles it and Matcher applies it to input'
      ],
      [
        /file|nio|serialization/,
        'Java I/O moves data through streams or NIO abstractions; resources must be closed and serialized data must never be trusted blindly'
      ],
      [
        /network|http/,
        'The Java HTTP client builds immutable requests and returns synchronous or asynchronous responses with explicit body handlers'
      ],
      [
        /jvm|memory|garbage/,
        'The JVM stores object graphs on the managed heap and reclaims unreachable objects; reachability, allocation rate, and pause goals matter more than manual freeing'
      ],
      [
        /thread|concurr|completable|virtual/,
        'Concurrent code coordinates independently scheduled tasks; correctness requires visibility, atomicity, ordering, cancellation, and bounded resource use'
      ],
      [
        /jdbc/,
        'JDBC uses connections, prepared statements, result sets, and transactions to access relational databases through a standard API'
      ],
      [
        /maven|gradle/,
        'A build tool resolves declared dependencies and turns source into reproducible tested artifacts; wrapper files pin the tool version'
      ],
      [
        /module|package|project structure/,
        'Packages organize names; the module system adds explicit dependencies and exported API boundaries'
      ],
      [
        /solid|design pattern|clean code|advanced/,
        'Professional design keeps responsibilities cohesive, dependencies explicit, names intention-revealing, and complexity justified by change pressure'
      ],
      [
        /junit|mockito|unit test|mocking/,
        'Automated tests state observable behavior; JUnit runs assertions and lifecycle hooks, while Mockito replaces collaborators at a controlled boundary'
      ]
    ]
  },
  examples: javaExamples,
  guidanceRules: [
      [
        /variable|data type|operator/,
        [
          'Store validated course scores and completion values without silent truncation.',
          [
            'Relying on implicit numeric promotion without inspecting the result type.',
            'Comparing floating-point results for exact equality.',
            'Using null where a primitive, empty collection, or Optional communicates intent better.'
          ],
          [
            'Choose the narrowest type that represents the domain safely.',
            'Use parentheses when precedence is not immediately obvious.',
            'Check overflow, division, and conversion at input boundaries.'
          ]
        ]
      ],
      [
        /condition|loop/,
        [
          'Drive lesson eligibility and bounded retry workflows from explicit conditions.',
          [
            'Leaving a loop termination condition dependent on unchanged state.',
            'Using switch fall-through unintentionally.',
            'Mutating a collection while iterating it with an incompatible iterator.'
          ],
          [
            'Prefer the control structure that states the termination rule most clearly.',
            'Keep branch conditions mutually understandable and test their boundaries.',
            'Use break and continue sparingly because they complicate loop invariants.'
          ]
        ]
      ],
      [
        /array|string|collection|list|set|map|queue|stack/,
        [
          'Represent ordered curricula, unique tags, keyed progress, and work queues with the collection whose contract fits.',
          [
            'Choosing LinkedList for indexed access.',
            'Using mutable objects as hash keys and then changing equality-relevant fields.',
            'Assuming iteration order from HashMap or HashSet.'
          ],
          [
            'Program to List, Set, Map, or Deque interfaces.',
            'Return unmodifiable views when callers must not mutate ownership state.',
            'Measure before replacing a simple collection with a specialized one.'
          ]
        ]
      ],
      [
        /class|object|constructor|encapsulation|inheritance|polymorphism|abstraction|interface|record|sealed/,
        [
          'Model Course, Lesson, Progress, and publishing policies as objects with enforced invariants.',
          [
            'Exposing writable fields that allow invalid state.',
            'Using inheritance only to reuse code when no true subtype relationship exists.',
            'Calling overridable methods from constructors.'
          ],
          [
            'Make invalid states difficult to construct.',
            'Favor composition and small interfaces at change boundaries.',
            'Base equality and records on stable value semantics.'
          ]
        ]
      ],
      [
        /exception|file|nio|serialization|network|http/,
        [
          'Load curriculum files and call external services while preserving cleanup and diagnostic context.',
          [
            'Catching Exception and silently continuing.',
            'Forgetting try-with-resources for owned streams.',
            'Deserializing untrusted native Java object streams.'
          ],
          [
            'Catch only failures the layer can handle meaningfully.',
            'Preserve the original cause when translating exceptions.',
            'Set timeouts, validate sizes, and use explicit character encodings.'
          ]
        ]
      ],
      [
        /thread|concurr|future|virtual|jvm|memory/,
        [
          'Fetch independent lesson resources concurrently while keeping shared progress correct and capacity bounded.',
          [
            'Sharing mutable state without a happens-before relationship.',
            'Blocking virtual threads while holding scarce locks or permits.',
            'Creating unbounded tasks or queues.'
          ],
          [
            'Prefer immutable messages and structured ownership of tasks.',
            'Propagate cancellation and handle interruption correctly.',
            'Profile allocation, contention, and latency before tuning the JVM.'
          ]
        ]
      ],
      [
        /jdbc|maven|gradle|module|junit|mockito|solid|pattern|clean|project/,
        [
          'Build and test a maintainable Java service that persists Academy data and produces reproducible artifacts.',
          [
            'Concatenating SQL parameters.',
            'Mocking value objects or implementation details.',
            'Allowing build behavior to depend on an unpinned local tool.'
          ],
          [
            'Use prepared statements and explicit transaction boundaries.',
            'Use wrappers and reproducible dependency metadata.',
            'Test observable behavior with the smallest realistic boundary.'
          ]
        ]
      ]
    ]
};
})();
