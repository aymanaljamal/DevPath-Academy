(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['java-essentials'] = structure({
      title:'Java Project Structure',subtitle:'A conventional Maven application with production code, tests, resources, and reproducible builds.',defaultPath:'academy-cli/src/main/java/com/devpath/academy/App.java',
      tree:folder('academy-cli','Maven project root','The build boundary for Java source, tests, resources, and dependencies.',[
        folder('src','Source roots','Separates production and test inputs.',[
          folder('main','Production inputs','Code and resources packaged into the application artifact.',[
            folder('java','Java source root','Package folders beneath this directory match Java package names.',[
              folder('com/devpath/academy','Application package','Reverse-domain package namespace for application classes.',[
                file('App.java','Application entry class','Contains the main method that starts the Java program.',{language:'java',badge:'Entry Point',readBy:'javac and JVM',example:'public final class App {\n  public static void main(String[] args) {\n    System.out.println("DevPath Academy");\n  }\n}'}),
                folder('model','Domain models','Classes representing stable application concepts.',[file('Course.java','Domain model','Represents a course and protects its invariants.',{language:'java'})]),
                folder('service','Application services','Coordinates use cases using domain objects and repositories.',[file('CourseService.java','Application service','Implements course-related use cases.',{language:'java'})]),
                folder('repository','Persistence contracts','Interfaces or adapters responsible for storing data.',[file('CourseRepository.java','Repository contract','Defines persistence operations without tying callers to one database.',{language:'java'})])
              ])
            ]),
            folder('resources','Runtime resources','Configuration and non-Java files placed on the application classpath.',[file('application.properties','Application configuration','Stores non-secret application defaults.',{language:'properties',readBy:'Application code'})])
          ]),
          folder('test','Automated tests','Mirrors production packages for test code and fixtures.',[
            folder('java/com/devpath/academy','Test package','Contains JUnit tests near their production package names.',[file('CourseServiceTest.java','JUnit test','Verifies observable service behavior.',{language:'java',readBy:'JUnit and Maven Surefire'})])
          ])
        ]),
        file('pom.xml','Maven build descriptor','Declares project coordinates, dependencies, plugins, and build lifecycle behavior.',{language:'xml',badge:'Required',readBy:'Maven',example:'<project>\n  <artifactId>academy-cli</artifactId>\n  <dependencies>...</dependencies>\n</project>'}),
        file('README.md','Project documentation','Explains JDK requirements, build commands, and architecture.',{language:'markdown'}),
        folder('target','Generated build output','Compiled classes, reports, and packaged JAR files created by Maven.',[],{generated:true,commit:'Usually ignore',delete:'Yes. Maven regenerates it during the next build.'})
      ]),
      architecture:['App.java','Service','Repository','Data source'],runtime:['java command','JVM','App.main()','Services','Output'],
      quiz:[{question:'Where should production Java source normally live in Maven?',options:['src/java','src/main/java','app/java','target/java'],answer:'src/main/java',explanation:'Maven uses conventional source roots so plugins work without custom configuration.'}],
      evolution:[{label:'Small CLI',items:['App.java','pom.xml']},{label:'Growing app',items:['model/','service/','repository/']},{label:'Modular app',items:['domain module','application module','infrastructure module']}]
    });
})();
