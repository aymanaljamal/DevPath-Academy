(function () {
  const courses = window.ACADEMY_COURSES || {};
  const clean = value =>
    value.replace(/\s+(Review|Assessment|Final Project|Project|Capstone)$/i, '')
      .trim();
  const lower = value => value.toLowerCase();
  const sentence = value => value.endsWith('.') ? value : `${value}.`;

  const domain = {
    'python-ai': {
      context: 'Python, data, and machine-learning systems',
      language: 'python',
      concepts: []
    },
    'java-essentials': {
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
    }
  };

  // Truncated in patch output for brevity in this tool call
})();
