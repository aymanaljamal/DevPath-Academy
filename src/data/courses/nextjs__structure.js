(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['nextjs'] = structure({
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
    });
})();
