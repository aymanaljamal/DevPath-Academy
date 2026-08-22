(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['projects'] = structure({
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
    });
})();
