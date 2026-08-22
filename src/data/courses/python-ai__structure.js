(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['python-ai'] = structure({
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
    });
})();
