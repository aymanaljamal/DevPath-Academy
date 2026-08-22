(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['spring-boot'] = structure({
      title:'Spring Boot Project Structure',subtitle:'A layered API where dependency direction moves from controllers through services to repositories.',defaultPath:'academy-api/src/main/java/com/devpath/academy/AcademyApplication.java',
      tree:folder('academy-api','Spring Boot root','A Maven Spring Boot service with source, resources, tests, and deployment files.',[
        folder('src/main/java/com/devpath/academy','Application package','The root package allows component scanning to discover nested components.',[
          file('AcademyApplication.java','Spring Boot entry point','Bootstraps the application context and embedded server.',{language:'java',badge:'Entry Point',readBy:'JVM and Spring Boot',example:'@SpringBootApplication\npublic class AcademyApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(AcademyApplication.class, args);\n  }\n}'}),
          folder('controller','HTTP adapters','Maps requests, validates transport input, and returns HTTP responses.',[file('CourseController.java','REST controller','Exposes course endpoints and delegates use cases to a service.',{language:'java',imports:['CourseService.java'],layer:'Presentation'})]),
          folder('service','Use-case logic','Coordinates business rules and transaction boundaries.',[file('CourseService.java','Application service','Implements course use cases using repositories.',{language:'java',imports:['CourseRepository.java'],importedBy:['CourseController.java'],layer:'Application'})]),
          folder('repository','Persistence adapters','Spring Data contracts for querying and storing entities.',[file('CourseRepository.java','JPA repository','Defines database access for Course entities.',{language:'java',importedBy:['CourseService.java'],layer:'Infrastructure'})]),
          folder('model','Persistence models','JPA entities mapped to relational tables.',[file('Course.java','JPA entity','Maps course state and constraints to a table.',{language:'java',layer:'Domain/Persistence'})]),
          folder('dto','Transport contracts','Request and response shapes separate from persistence entities.',[file('CourseResponse.java','Response DTO','Defines the stable data returned to API clients.',{language:'java'})]),
          folder('config','Framework configuration','Security, serialization, documentation, and integration beans.',[])
        ]),
        folder('src/main/resources','Classpath resources','Runtime configuration, migrations, templates, and static resources.',[
          file('application.properties','Spring configuration','Configures ports, profiles, data sources, logging, and application behavior.',{language:'properties',readBy:'Spring Boot'}),
          folder('db/migration','Database migrations','Versioned Flyway migrations applied in order.',[file('V1__create_courses.sql','Schema migration','Creates initial relational structures.',{language:'sql',readBy:'Flyway'})])
        ]),
        folder('src/test/java','Spring tests','Unit, slice, and integration tests mirroring production packages.',[]),
        file('pom.xml','Maven descriptor','Declares Spring starters, test dependencies, plugins, and Java version.',{language:'xml',readBy:'Maven'}),
        file('Dockerfile','Container build','Packages the executable JAR into a container image.',{language:'dockerfile',readBy:'Docker'}),
        folder('target','Generated output','Compiled classes, reports, and the executable JAR.',[],{generated:true,commit:'Usually ignore'})
      ]),
      architecture:['HTTP Request','Controller','Service','Repository','Database','HTTP Response'],runtime:['java -jar','main()','Spring context','Embedded server','Routes ready'],
      quiz:[{question:'Where should transaction-oriented business coordination usually live?',options:['controller/','service/','repository/','resources/'],answer:'service/',explanation:'Services coordinate use cases; controllers should stay focused on HTTP translation.'}],
      evolution:[{label:'Small API',items:['controller/','service/','repository/']},{label:'Growing API',items:['dto/','config/','exception/','db/migration/']},{label:'Large system',items:['feature modules','domain boundaries','integration adapters']}]
    });
})();
