window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES['java-essentials'] = {
  id: 'java-essentials',
  slug: 'java-essentials',
  icon: 'J',
  color: '#e76f00',
  title: 'Complete Java',
  shortTitle: 'Java',
  description:
      'A complete Java path from first program to concurrency, JDBC, architecture, testing, and professional engineering practices.',
  level: 'Beginner to advanced',
  duration: '55–70 hours',
  modules: [
    {
      id: 'java-foundations',
      title: 'Java Foundations',
      lessons: [
        ['java-introduction-setup', 'Java Introduction and Setup'],
        ['variables-data-types', 'Variables and Data Types'],
        ['operators', 'Operators'], ['conditions', 'Conditions'],
        ['loops', 'Loops'], ['arrays', 'Arrays'], ['strings', 'Strings'],
        ['methods', 'Methods']
      ]
    },
    {
      id: 'object-oriented-java',
      title: 'Object-Oriented Java',
      lessons: [
        ['classes-objects', 'Classes and Objects'],
        ['constructors', 'Constructors'], ['encapsulation', 'Encapsulation'],
        ['inheritance', 'Inheritance'], ['polymorphism', 'Polymorphism'],
        ['abstraction', 'Abstraction'], ['interfaces', 'Interfaces'],
        ['packages', 'Packages'], ['access-modifiers', 'Access Modifiers'],
        ['static-final', 'Static and Final'], ['enums', 'Enums']
      ]
    },
    {
      id: 'robust-java',
      title: 'Robust Java Programs',
      lessons: [
        ['exception-handling', 'Exception Handling'],
        ['collections-framework', 'Collections Framework'],
        ['arraylist-linkedlist', 'ArrayList and LinkedList'],
        ['hashset', 'HashSet'], ['hashmap', 'HashMap'],
        ['queue-stack', 'Queue and Stack'], ['generics', 'Generics']
      ]
    },
    {
      id: 'functional-java',
      title: 'Modern and Functional Java',
      lessons: [
        ['lambda-expressions', 'Lambda Expressions'],
        ['stream-api', 'Stream API'], ['optional', 'Optional'],
        ['date-time-api', 'Date and Time API'],
        ['records-sealed-classes', 'Records and Sealed Classes'],
        ['annotations-reflection', 'Annotations and Reflection'],
        ['regular-expressions', 'Regular Expressions']
      ]
    },
    {
      id: 'io-concurrency',
      title: 'I/O, Runtime, and Concurrency',
      lessons: [
        ['file-handling', 'File Handling'],
        ['nio', 'NIO.2 Paths, Files, and Channels'],
        ['serialization', 'Serialization'],
        ['networking-http', 'Networking and the HTTP Client'],
        ['jvm-memory', 'JVM Memory and Garbage Collection'],
        ['multithreading', 'Multithreading'],
        ['concurrency', 'Concurrency Utilities'],
        ['completable-future', 'CompletableFuture'],
        ['virtual-threads', 'Virtual Threads']
      ]
    },
    {
      id: 'data-build',
      title: 'Data Access and Build Tools',
      lessons: [
        ['jdbc', 'JDBC'], ['maven', 'Maven'], ['gradle', 'Gradle'],
        ['packages-project-structure', 'Professional Project Structure']
      ]
    },
    {
      id: 'professional-java',
      title: 'Professional Java Engineering',
      lessons: [
        ['java-modules', 'Java Platform Module System'],
        ['solid-principles', 'SOLID Principles'],
        ['design-patterns', 'Design Patterns'], ['clean-code', 'Clean Code'],
        ['junit', 'Unit Testing with JUnit'],
        ['mockito', 'Mocking with Mockito'],
        ['advanced-java', 'Advanced Java Concepts']
      ]
    },
    {
      id: 'java-capstone',
      title: 'Java Capstone',
      lessons: [['final-java-project', 'Final Java Practice Project']]
    }
  ]
};
