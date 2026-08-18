(function() {
const courses = window.ACADEMY_COURSES || {};
const file = (name, role, description, extra = {}) =>
    ({name, type: 'file', role, description, ...extra});
const folder = (name, role, description, children = [], extra = {}) =>
    ({name, type: 'folder', role, description, children, ...extra});
const common = {
  commit: 'Usually commit',
  required: false,
  generated: false,
  rename: 'Sometimes, if imports and tooling are updated.',
  delete: 'Only after confirming nothing imports or requires it.'
};
const withDefaults = node =>
    ({...common, ...node, children: node.children?.map(withDefaults)});
const structure = config => ({...config, tree: withDefaults(config.tree)});

window.ACADEMY_PROJECT_STRUCTURES = {
    react:structure({
      title:'React Project Structure',subtitle:'A maintainable Vite-powered React application that grows by responsibility.',defaultPath:'devpath-app/src/App.jsx',
      tree:folder('devpath-app','Project root','The repository boundary containing source, public assets, configuration, and dependency metadata.',[
        folder('public','Static public files','Files copied or served without passing through the JavaScript module graph.',[
          file('favicon.svg','Browser icon','A vector icon requested directly by the browser.',{readBy:'Browser',location:'public/',rename:'Yes, if the HTML or metadata reference changes.'}),
          folder('assets','Public assets','Images or downloads that need stable public URLs.',[])
        ]),
        folder('src','Application source','Developer-written React source processed by Vite.',[
          folder('assets','Imported assets','Images and fonts imported from JavaScript or CSS so the build tool can fingerprint them.',[]),
          folder('components','Reusable UI','UI pieces shared across pages or features.',[
            folder('Navbar','Navbar component','Keeps the component implementation and styles together.',[
              file('Navbar.jsx','React component','Renders primary navigation and its accessible interaction states.',{language:'jsx',layer:'Presentation',imports:['Navbar.css'],importedBy:['App.jsx'],example:'export function Navbar() {\n  return <nav aria-label="Primary">...</nav>;\n}'}),
              file('Navbar.css','Component styles','Styles scoped by naming convention to Navbar markup.',{language:'css',layer:'Presentation',importedBy:['Navbar.jsx']})
            ]),
            folder('CourseCard','Course card component','A reusable course summary used in lists and dashboards.',[
              file('CourseCard.jsx','React component','Displays course metadata and progress.',{language:'jsx',layer:'Presentation',importedBy:['Home.jsx']}),
              file('CourseCard.css','Component styles','Defines CourseCard layout and responsive states.',{language:'css'})
            ])
          ]),
          folder('pages','Route-level UI','Components representing complete screens or route destinations.',[
            file('Home.jsx','Page component','Composes course cards into the academy home screen.',{language:'jsx',imports:['CourseCard.jsx'],importedBy:['App.jsx'],layer:'Presentation'}),
            file('Course.jsx','Page component','Displays one course and its lessons.',{language:'jsx',importedBy:['App.jsx'],layer:'Presentation'})
          ]),
          folder('hooks','Reusable React behavior','Custom hooks package stateful React behavior without owning visual markup.',[
            file('useCourseProgress.js','Custom hook','Reads and updates a learner’s course progress.',{language:'javascript',importedBy:['Course.jsx'],layer:'Application'})
          ]),
          folder('services','External boundaries','Functions that communicate with APIs or browser persistence.',[
            file('api.js','API client','Centralizes request construction, response parsing, and API errors.',{language:'javascript',importedBy:['Course.jsx'],layer:'Infrastructure'})
          ]),
          folder('utils','Pure utilities','Small framework-independent transformations.',[
            file('formatDate.js','Utility module','Formats dates consistently without rendering UI.',{language:'javascript',layer:'Shared'})
          ]),
          file('App.jsx','Application root component','Composes routes, providers, layouts, pages, and shared UI beneath the browser entry point.',{language:'jsx',layer:'Application',badge:'Entry Point',importedBy:['main.jsx'],imports:['Navbar.jsx','Home.jsx','Course.jsx'],readBy:'React runtime',example:'import { Navbar } from "./components/Navbar/Navbar.jsx";\n\nexport default function App() {\n  return <><Navbar /><main>...</main></>;\n}',delete:'No. main.jsx needs a root component unless you replace that architecture.'}),
          file('main.jsx','Browser entry module','Finds the HTML root element and mounts the React component tree.',{language:'jsx',layer:'Bootstrap',badge:'Entry Point',importedBy:['index.html'],imports:['App.jsx'],readBy:'Browser module loader and Vite',example:'import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App.jsx";\n\ncreateRoot(document.getElementById("root")).render(\n  <StrictMode><App /></StrictMode>\n);',delete:'No. The browser needs a module that starts React.'})
        ]),
        file('.env','Local environment values','Stores local configuration consumed by Vite through allowed prefixes.',{language:'bash',readBy:'Vite and application bootstrap',commit:'Do not commit secrets',badge:'Do Not Commit',delete:'Yes if no environment values are required; deployments still need their configured values.'}),
        file('.gitignore','Git ignore rules','Prevents dependencies, secrets, caches, and build output from being accidentally tracked.',{readBy:'Git',example:'.env\nnode_modules/\ndist/',language:'text'}),
        file('eslint.config.js','Lint configuration','Defines JavaScript and React static-analysis rules.',{language:'javascript',readBy:'ESLint',layer:'Tooling'}),
        file('index.html','HTML entry document','Provides the root DOM node and loads src/main.jsx as a module.',{language:'html',badge:'Entry Point',imports:['main.jsx'],readBy:'Browser and Vite',example:'<main id="root"></main>\n<script type="module" src="/src/main.jsx"></script>'}),
        file('package.json','npm manifest','Defines scripts, dependencies, package metadata, and module mode.',{language:'json',readBy:'npm, Node.js, and Vite',badge:'Required',delete:'No. npm and the build scripts depend on it.'}),
        file('package-lock.json','npm lockfile','Pins the resolved dependency graph for repeatable npm installs.',{language:'json',readBy:'npm',generated:true,commit:'Usually commit',delete:'It can be regenerated, but removing it loses the reviewed deterministic dependency graph.'}),
        file('vite.config.js','Vite configuration','Configures React plugins, aliases, and build or development-server behavior.',{language:'javascript',readBy:'Vite',layer:'Tooling'}),
        file('README.md','Project documentation','Explains setup, commands, architecture, and contribution expectations.',{language:'markdown',readBy:'Developers and documentation renderers'})
      ]),
      architecture:['index.html','main.jsx','App.jsx','pages/','components/','Rendered UI'],
      runtime:['Browser','index.html','main.jsx','createRoot()','App.jsx','Components','Rendered UI'],
      quiz:[
        {question:'Where should a reusable Button component usually live?',options:['pages/','components/','services/','public/'],answer:'components/',explanation:'Reusable visual behavior belongs with shared components, not route pages or API services.'},
        {question:'Where should API request functions usually live?',options:['assets/','services/','components/','public/'],answer:'services/',explanation:'A service module creates an explicit boundary around external communication.'}
      ],
      evolution:[
        {label:'Small app',items:['src/App.jsx','src/main.jsx','src/App.css']},
        {label:'Growing app',items:['src/components/','src/pages/','src/hooks/','src/services/','src/utils/']},
        {label:'Large app',items:['src/app/','src/features/','src/layouts/','src/routes/','src/store/']}
      ]
    }),
    nextjs:structure({
      title:'Next.js Project Structure',subtitle:'An App Router application where folders define route segments and server boundaries.',defaultPath:'devpath-web/app/layout.tsx',
      tree:folder('devpath-web','Next.js project root','Contains App Router source, public assets, framework configuration, and package metadata.',[
        folder('app','App Router','Route segments, layouts, loading states, server actions, and route handlers.',[
          file('layout.tsx','Root layout','Defines the shared HTML shell, metadata, fonts, and providers for every route.',{language:'tsx',badge:'Required',readBy:'Next.js',imports:['globals.css'],example:'export default function RootLayout({ children }) {\n  return <html><body>{children}</body></html>;\n}'}),
          file('page.tsx','Home route','Renders the UI for the root URL.',{language:'tsx',readBy:'Next.js router'}),
          file('loading.tsx','Loading boundary','Provides route-level Suspense fallback UI.',{language:'tsx',readBy:'Next.js router',required:false}),
          file('error.tsx','Error boundary','A client boundary for recoverable route errors.',{language:'tsx',readBy:'Next.js router',required:false}),
          folder('courses','Courses route segment','Maps the folder hierarchy to /courses URLs.',[
            file('page.tsx','Courses page','Renders the course collection at /courses.',{language:'tsx'}),
            folder('[courseId]','Dynamic route segment','Captures a courseId URL parameter.',[
              file('page.tsx','Course page','Loads and renders one course using route parameters.',{language:'tsx'})
            ])
          ]),
          folder('api','Route handlers','Server HTTP endpoints colocated with the application.',[
            folder('progress','Progress endpoint','Maps to /api/progress.',[
              file('route.ts','Route handler','Exports HTTP method handlers that run on the server.',{language:'typescript',readBy:'Next.js server runtime',example:'export async function GET() {\n  return Response.json({ complete: 12 });\n}'})
            ])
          ]),
          file('globals.css','Global styles','Defines global CSS loaded once by the root layout.',{language:'css',importedBy:['layout.tsx']})
        ]),
        folder('components','Shared components','Reusable UI not responsible for defining a route.',[
          file('CourseCard.tsx','Typed React component','Displays a course summary with TypeScript props.',{language:'tsx',importedBy:['app/courses/page.tsx']})
        ]),
        folder('lib','Server and shared utilities','Data access, validation, authentication, and framework-independent helpers.',[
          file('courses.ts','Data access module','Loads course data behind a stable application API.',{language:'typescript',importedBy:['app/courses/page.tsx'],layer:'Data'})
        ]),
        folder('public','Static public assets','Files served from stable root-relative URLs.',[]),
        file('.env.local','Local secrets and endpoints','Local-only environment values loaded by Next.js.',{language:'bash',commit:'Do not commit',badge:'Do Not Commit',readBy:'Next.js'}),
        file('next.config.mjs','Next.js configuration','Controls framework-level build and runtime options.',{language:'javascript',readBy:'Next.js'}),
        file('package.json','npm manifest','Defines Next.js scripts and dependencies.',{language:'json',readBy:'npm'}),
        file('tsconfig.json','TypeScript configuration','Defines strict checks, JSX mode, and path aliases.',{language:'json',readBy:'TypeScript and Next.js'})
      ]),
      architecture:['Request','App Router','layout.tsx','page.tsx','Server/Client Components','Response'],
      runtime:['Browser request','Next.js server','Route match','Server Components','HTML stream','Client hydration'],
      quiz:[{question:'Where does the UI for /courses normally live?',options:['app/courses/page.tsx','components/Courses.tsx','public/courses.html','lib/courses.ts'],answer:'app/courses/page.tsx',explanation:'In the App Router, folders create segments and page.tsx supplies the route UI.'}],
      evolution:[{label:'Small app',items:['app/layout.tsx','app/page.tsx']},{label:'Growing app',items:['app/courses/','components/','lib/']},{label:'Large app',items:['app/(marketing)/','app/(product)/','features/','server/']}]
    }),
    'java-essentials':structure({
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
    }),
    'spring-boot':structure({
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
    }),
    'python-ai':structure({
      title:'Python & AI Project Structure',subtitle:'A reproducible Python service that separates source, experiments, data boundaries, models, and tests.',defaultPath:'academy-ml/src/academy_ml/main.py',
      tree:folder('academy-ml','Python project root','A src-layout Python project with reproducible configuration and explicit generated artifacts.',[
        folder('src/academy_ml','Importable package','Production Python package kept separate from repository tooling and tests.',[
          file('__init__.py','Package marker and API','Defines package initialization and optional public exports.',{language:'python',readBy:'Python import system'}),
          file('main.py','Application entry point','Starts the API or command-line workflow.',{language:'python',badge:'Entry Point',readBy:'Python and Uvicorn',example:'from fastapi import FastAPI\nfrom .routes import router\n\napp = FastAPI()\napp.include_router(router)'}),
          file('routes.py','HTTP routes','Validates request models and delegates inference.',{language:'python',imports:['services.py']}),
          file('services.py','Inference service','Loads approved model artifacts and applies preprocessing consistently.',{language:'python',imports:['features.py']}),
          file('features.py','Feature pipeline','Transforms validated raw input into model-ready features.',{language:'python'}),
          file('settings.py','Typed settings','Loads environment configuration without embedding secrets in source.',{language:'python',readBy:'Application bootstrap'})
        ]),
        folder('notebooks','Exploration notebooks','Experiments and analysis that are not the production application boundary.',[]),
        folder('data','Local data boundary','Small documented samples or ignored local datasets.',[file('.gitkeep','Empty-directory marker','Lets Git preserve an intentionally empty directory.',{language:'text'})],{commit:'Data-dependent'}),
        folder('models','Model artifacts','Versioned or externally managed trained model files.',[],{generated:true,commit:'Usually use artifact storage'}),
        folder('tests','Automated tests','Tests preprocessing, contracts, inference, and failure behavior.',[file('test_api.py','API contract tests','Verifies requests, validation errors, and model responses.',{language:'python',readBy:'pytest'})]),
        file('pyproject.toml','Python project configuration','Defines build metadata, dependencies, and tool settings.',{language:'ini',readBy:'pip and Python tooling'}),
        file('.env.example','Environment template','Documents required settings without real secrets.',{language:'bash',commit:'Commit'}),
        file('.env','Local secrets','Provides local endpoints and credentials.',{language:'bash',commit:'Do not commit',badge:'Do Not Commit'}),
        file('Dockerfile','Model service image','Builds a reproducible runtime for the inference service.',{language:'dockerfile'})
      ]),
      architecture:['Client','FastAPI route','Service','Feature pipeline','Model','Prediction'],runtime:['Uvicorn','main.py','FastAPI app','Model load','Request validation','Inference'],
      quiz:[{question:'Where should production feature transformation code live?',options:['notebooks/','src/academy_ml/','models/','data/'],answer:'src/academy_ml/',explanation:'Production preprocessing must be importable, tested, and versioned with the service.'}],
      evolution:[{label:'Experiment',items:['notebook.ipynb','data.csv']},{label:'Reproducible project',items:['src/','tests/','pyproject.toml']},{label:'Production ML',items:['service/','model registry','monitoring/']}]
    }),
    'firebase-google-cloud':structure({
      title:'Firebase & Google Cloud Project Structure',subtitle:'A web application with client configuration, server functions, security rules, emulators, and deployment policy.',defaultPath:'academy-cloud/src/firebase.js',
      tree:folder('academy-cloud','Firebase project root','Connects the web client, Firebase services, local emulators, and deployable functions.',[
        folder('src','Web application source','Client code that imports Firebase SDK modules.',[
          file('firebase.js','Firebase client initialization','Initializes the public project configuration and exports scoped service clients.',{language:'javascript',readBy:'Vite and Firebase SDK',example:'import { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\n\nconst app = initializeApp(firebaseConfig);\nexport const db = getFirestore(app);'}),
          folder('features','Feature modules','UI and data logic grouped by product capability.',[])
        ]),
        folder('functions','Trusted server functions','Server-side event handlers and HTTP functions deployed to Google Cloud.',[
          folder('src','Function source','Trusted code with server credentials and validation.',[file('index.ts','Functions entry point','Exports deployable Cloud Functions handlers.',{language:'typescript',badge:'Entry Point',readBy:'Firebase CLI and Functions runtime'})]),
          file('package.json','Functions manifest','Defines server dependencies and build scripts.',{language:'json',readBy:'npm and Firebase CLI'})
        ]),
        file('firebase.json','Firebase deployment configuration','Maps hosting, functions, rules, indexes, and emulator settings.',{language:'json',badge:'Required',readBy:'Firebase CLI'}),
        file('.firebaserc','Firebase project aliases','Maps friendly aliases such as dev and prod to Firebase project IDs.',{language:'json',readBy:'Firebase CLI'}),
        file('firestore.rules','Firestore authorization rules','Server-enforced access rules for document requests.',{language:'javascript',readBy:'Cloud Firestore',commit:'Commit'}),
        file('firestore.indexes.json','Firestore indexes','Declares composite indexes deployed with the project.',{language:'json',readBy:'Firebase CLI and Firestore'}),
        file('storage.rules','Storage authorization rules','Controls access to Cloud Storage objects.',{language:'javascript',readBy:'Cloud Storage for Firebase'}),
        file('.env.local','Local client environment','Stores local project values; secrets belong in Secret Manager for trusted services.',{language:'bash',commit:'Do not commit'}),
        file('.gitignore','Git ignore rules','Excludes local environment values, emulator data, and dependencies.',{language:'text',readBy:'Git'})
      ]),
      architecture:['Browser','Firebase SDK','Security Rules','Firebase service','Cloud Function','Google Cloud'],runtime:['Vite client','initializeApp()','Auth state','Firestore request','Rules evaluation','Data/UI'],
      quiz:[{question:'Where should trusted API secrets for deployed functions live?',options:['src/firebase.js','firestore.rules','Secret Manager','public/config.json'],answer:'Secret Manager',explanation:'Client configuration is observable; trusted server secrets need managed secret storage and scoped runtime identity.'}],
      evolution:[{label:'Prototype',items:['src/firebase.js','firebase.json']},{label:'Growing app',items:['features/','functions/','rules files']},{label:'Production cloud',items:['separate projects','CI/CD','Secret Manager','observability']}]
    }),
    projects:structure({
      title:'Full-Stack Project Structure',subtitle:'A repository that makes frontend, backend, database, and operations boundaries visible.',defaultPath:'learning-platform/apps/web/src/App.jsx',
      tree:folder('learning-platform','Repository root','A small monorepo containing deployable applications and shared contracts.',[
        folder('apps','Deployable applications','Each child can be built, tested, and deployed independently.',[
          folder('web','React frontend','Browser application and UI tests.',[
            folder('src','Frontend source','React components, pages, and services.',[file('App.jsx','Frontend root','Composes the browser application.',{language:'jsx',badge:'Entry Point'})]),
            file('package.json','Frontend manifest','Defines frontend scripts and dependencies.',{language:'json'})
          ]),
          folder('api','Spring Boot API','Trusted HTTP API and persistence boundary.',[
            folder('src/main/java','API source','Controllers, services, repositories, and models.',[]),
            file('pom.xml','API build','Defines Java dependencies and packaging.',{language:'xml'})
          ])
        ]),
        folder('packages','Shared packages','Versioned contracts or tooling shared intentionally across apps.',[
          folder('contracts','API contracts','OpenAPI or generated-safe contract source.',[file('openapi.yaml','HTTP API contract','Defines endpoints and schemas shared by client and server.',{language:'yaml'})])
        ]),
        folder('infra','Deployment infrastructure','Container, proxy, and environment deployment definitions.',[file('docker-compose.yml','Local stack','Runs frontend, API, and database together for development.',{language:'yaml'})]),
        folder('docs','Architecture documentation','Decision records, diagrams, and operational guides.',[file('architecture.md','Architecture guide','Explains boundaries and dependency decisions.',{language:'markdown'})]),
        file('.env.example','Environment template','Documents required variables for every service.',{language:'bash'}),
        file('README.md','Repository guide','Explains setup and commands across applications.',{language:'markdown'})
      ]),
      architecture:['Browser','React web','Spring API','PostgreSQL','Telemetry'],runtime:['docker compose','Database','Spring API','React dev server','Browser'],
      quiz:[{question:'Where should a shared OpenAPI contract live?',options:['apps/web/public/','packages/contracts/','apps/api/target/','infra/secrets/'],answer:'packages/contracts/',explanation:'A shared contract deserves an explicit neutral boundary rather than belonging to generated output or one consumer.'}],
      evolution:[{label:'Single app',items:['src/','package.json']},{label:'Full stack',items:['web/','api/','database/']},{label:'Multi-app repo',items:['apps/','packages/','infra/','docs/']}]
    })
  };

const attach = (courseId, slug, title) => {
  const course = courses[courseId];
  if (!course) return;
  const titleAr = {
    'python-ai': 'بنية مشروع بايثون والذكاء الاصطناعي',
    'firebase-google-cloud': 'بنية مشروع فايربيس وجوجل كلاود',
    projects: 'بنية مشروع متكامل'
  }[courseId] || title;
  for (const module of course.modules) {
    const lesson = module.lessons.find(item => item[0] === slug);
    if (lesson) {
      lesson[2] = {
        ...(lesson[2] || {}),
        kind: 'project-structure',
        structureId: courseId,
        titleAr
      };
      return;
    }
  }
  const target =
      course.modules.find(
          module => /architecture|project|foundation/i.test(module.title)) ||
      course.modules[0];
  target.lessons.push([
    slug, title, {
      kind: 'project-structure',
      structureId: courseId,
      titleAr,
      duration: '55 min',
      difficulty: 'Beginner to professional',
      prerequisites: 'Basic course foundations'
    }
  ]);
};

courses.react.experiences = [[
  'project-structure', 'Interactive React Project Structure', {
    kind: 'project-structure',
    structureId: 'react',
    moduleId: 'react-enterprise',
    moduleTitle: 'Enterprise Architecture'
  }
]];
attach('nextjs', 'nextjs-project-setup', 'Next.js Project Structure');
attach(
    'java-essentials', 'packages-project-structure', 'Java Project Structure');
attach('spring-boot', 'project-structure', 'Spring Boot Project Structure');
attach(
    'python-ai', 'python-project-structure', 'Python & AI Project Structure');
attach(
    'firebase-google-cloud', 'firebase-project-structure',
    'Firebase & Google Cloud Project Structure');
attach(
    'projects', 'full-stack-project-structure', 'Full-Stack Project Structure');
})();
