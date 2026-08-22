(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['react'] = structure({
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
    });
})();
