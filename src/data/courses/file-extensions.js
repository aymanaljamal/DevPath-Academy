window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};

window.ACADEMY_FILE_EXTENSIONS = [
  {
    key: 'html',
    extension: '.html',
    fullName: 'HyperText Markup Language',
    category: 'Code',
    technologies: ['Browsers', 'Web frameworks'],
    purpose: 'Defines the semantic structure of a web document.',
    readers: ['Browser', 'HTML parser', 'Build tools'],
    locations: ['public/', 'templates/'],
    related: ['.htm', '.css', '.js'],
    example:
        '<!doctype html>\n<html lang="en">\n  <body><main id="app"></main></body>\n</html>',
    language: 'html',
    commit: 'Usually commit'
  },
  {
    key: 'css',
    extension: '.css',
    fullName: 'Cascading Style Sheets',
    category: 'Styling',
    technologies: ['Browsers', 'React', 'Next.js'],
    purpose:
        'Describes presentation, layout, responsive behavior, and visual states.',
    readers: ['Browser', 'CSS processors'],
    locations: ['src/styles/', 'src/components/'],
    related: ['.scss', '.less', '.html'],
    example: '.course-card {\n  display: grid;\n  border-radius: 18px;\n}',
    language: 'css',
    commit: 'Usually commit'
  },
  {
    key: 'scss',
    extension: '.scss',
    fullName: 'Sassy CSS',
    category: 'Styling',
    technologies: ['Sass compiler'],
    purpose:
        'Adds variables, nesting, modules, and functions that compile to CSS.',
    readers: ['Sass compiler', 'Build tools'],
    locations: ['src/styles/'],
    related: ['.css', '.sass'],
    example: '$accent: #b91c1c;\n.card { color: $accent; }',
    language: 'scss',
    commit: 'Usually commit'
  },
  {
    key: 'js',
    extension: '.js',
    fullName: 'JavaScript',
    category: 'Code',
    technologies: ['Browser', 'Node.js', 'Build tools'],
    purpose:
        'Stores JavaScript source code for logic, UI behavior, tooling, or configuration.',
    readers: ['JavaScript runtime', 'Browser', 'Build tools'],
    locations: ['src/', 'scripts/'],
    related: ['.mjs', '.cjs', '.jsx', '.ts'],
    example:
        'export function formatCourse(course) {\n  return `${course.title} · ${course.lessons} lessons`;\n}',
    language: 'javascript',
    commit: 'Usually commit'
  },
  {
    key: 'mjs',
    extension: '.mjs',
    fullName: 'ECMAScript Module',
    category: 'Code',
    technologies: ['Node.js', 'JavaScript runtimes'],
    purpose: 'Explicitly identifies JavaScript using the ES module system.',
    readers: ['Node.js', 'JavaScript runtime'],
    locations: ['scripts/', 'tools/'],
    related: ['.js', '.cjs'],
    example:
        'import { readFile } from "node:fs/promises";\nexport const load = path => readFile(path, "utf8");',
    language: 'javascript',
    commit: 'Usually commit'
  },
  {
    key: 'cjs',
    extension: '.cjs',
    fullName: 'CommonJS Module',
    category: 'Code',
    technologies: ['Node.js'],
    purpose:
        'Explicitly identifies JavaScript using require and module.exports.',
    readers: ['Node.js'],
    locations: ['scripts/', 'config/'],
    related: ['.js', '.mjs'],
    example:
        'const path = require("node:path");\nmodule.exports = { root: path.resolve(".") };',
    language: 'javascript',
    commit: 'Usually commit'
  },
  {
    key: 'jsx',
    extension: '.jsx',
    fullName: 'JavaScript XML',
    category: 'Code',
    technologies: ['React', 'Vite', 'Babel'],
    purpose: 'Allows JavaScript source files to contain JSX interface syntax.',
    readers: ['JavaScript build tools', 'Vite', 'Babel'],
    locations: ['src/components/', 'src/pages/'],
    related: ['.js', '.tsx', '.html'],
    example:
        'export function Welcome({ name }) {\n  return <h1>Hello, {name}</h1>;\n}',
    language: 'jsx',
    commit: 'Usually commit'
  },
  {
    key: 'ts',
    extension: '.ts',
    fullName: 'TypeScript',
    category: 'Code',
    technologies: ['TypeScript compiler'],
    purpose: 'Adds static types to JavaScript without JSX syntax.',
    readers: ['TypeScript compiler', 'Build tools'],
    locations: ['src/', 'scripts/'],
    related: ['.tsx', '.js'],
    example:
        'type Course = { title: string; lessons: number };\nexport const total = (course: Course) => course.lessons;',
    language: 'typescript',
    commit: 'Usually commit'
  },
  {
    key: 'tsx',
    extension: '.tsx',
    fullName: 'TypeScript with JSX',
    category: 'Code',
    technologies: ['React', 'TypeScript'],
    purpose: 'Combines TypeScript type checking with JSX interface syntax.',
    readers: ['TypeScript compiler', 'React build tools'],
    locations: ['src/components/', 'app/'],
    related: ['.ts', '.jsx'],
    example:
        'type Props = { title: string };\nexport function Card({ title }: Props) {\n  return <article>{title}</article>;\n}',
    language: 'tsx',
    commit: 'Usually commit'
  },
  {
    key: 'json',
    extension: '.json',
    fullName: 'JavaScript Object Notation',
    category: 'Data',
    technologies: ['npm', 'Web APIs', 'Build tools'],
    purpose:
        'Stores structured data and configuration using objects, arrays, and primitive values.',
    readers: ['Applications', 'Package managers', 'Build tools'],
    locations: ['project root', 'data/'],
    related: ['.yaml', '.xml'],
    example: '{\n  "name": "devpath-app",\n  "private": true\n}',
    language: 'json',
    commit: 'Depends on contents'
  },
  {
    key: 'xml',
    extension: '.xml',
    fullName: 'Extensible Markup Language',
    category: 'Data',
    technologies: ['Maven', 'Java tools', 'Enterprise systems'],
    purpose:
        'Stores hierarchical structured data with explicit opening and closing tags.',
    readers: ['Maven', 'XML parsers', 'Applications'],
    locations: ['project root', 'config/'],
    related: ['.json', '.html'],
    example: '<project>\n  <artifactId>academy-api</artifactId>\n</project>',
    language: 'xml',
    commit: 'Usually commit'
  },
  {
    key: 'svg',
    extension: '.svg',
    fullName: 'Scalable Vector Graphics',
    category: 'Data',
    technologies: ['Browsers', 'Design tools'],
    purpose: 'Describes resolution-independent vector graphics using XML.',
    readers: ['Browser', 'Image editor'],
    locations: ['public/', 'src/assets/'],
    related: ['.xml', '.png'],
    example:
        '<svg viewBox="0 0 24 24">\n  <circle cx="12" cy="12" r="8" />\n</svg>',
    language: 'xml',
    commit: 'Usually commit'
  },
  {
    key: 'java',
    extension: '.java',
    fullName: 'Java Source File',
    category: 'Code',
    technologies: ['JDK', 'Spring Boot'],
    purpose: 'Contains Java source code compiled by javac into JVM bytecode.',
    readers: ['Java compiler', 'IDE'],
    locations: ['src/main/java/', 'src/test/java/'],
    related: ['.class', '.jar'],
    example: 'public final class Course {\n  private final String title;\n}',
    language: 'java',
    commit: 'Usually commit'
  },
  {
    key: 'class',
    extension: '.class',
    fullName: 'Java Bytecode Class',
    category: 'Binary',
    technologies: ['JVM'],
    purpose:
        'Contains compiled Java bytecode executed by a Java Virtual Machine.',
    readers: ['JVM', 'Java tooling'],
    locations: ['target/classes/', 'build/classes/'],
    related: ['.java', '.jar'],
    example: 'Compiled binary output; do not edit as source.',
    language: 'text',
    commit: 'Usually ignore'
  },
  {
    key: 'jar',
    extension: '.jar',
    fullName: 'Java Archive',
    category: 'Binary',
    technologies: ['JVM', 'Maven', 'Gradle'],
    purpose:
        'Packages Java classes, resources, and metadata into a distributable ZIP-based archive.',
    readers: ['JVM', 'Java tooling'],
    locations: ['target/', 'build/libs/'],
    related: ['.java', '.class'],
    example: 'java -jar academy-api.jar',
    language: 'bash',
    commit: 'Usually release artifact'
  },
  {
    key: 'py',
    extension: '.py',
    fullName: 'Python Source File',
    category: 'Code',
    technologies: ['Python'],
    purpose:
        'Contains Python modules, scripts, classes, and application entry points.',
    readers: ['Python interpreter', 'Type checkers'],
    locations: ['src/', 'app/', 'tests/'],
    related: ['.pyc', '.toml'],
    example:
        'def course_title(course: dict) -> str:\n    return course["title"]',
    language: 'python',
    commit: 'Usually commit'
  },
  {
    key: 'pyc',
    extension: '.pyc',
    fullName: 'Compiled Python Bytecode',
    category: 'Binary',
    technologies: ['Python'],
    purpose: 'Caches compiled Python bytecode so modules can load faster.',
    readers: ['Python interpreter'],
    locations: ['__pycache__/'],
    related: ['.py'],
    example: 'Generated binary cache; do not edit.',
    language: 'text',
    commit: 'Ignore'
  },
  {
    key: 'sql',
    extension: '.sql',
    fullName: 'SQL Source File',
    category: 'Database',
    technologies: ['PostgreSQL', 'MySQL', 'Database clients'],
    purpose:
        'Stores SQL statements such as schemas, migrations, queries, or seed data.',
    readers: ['Database client', 'Migration tool', 'Text editor'],
    locations: ['db/migrations/', 'sql/'],
    related: ['.db', '.dump'],
    example:
        'CREATE TABLE courses (\n  id BIGINT PRIMARY KEY,\n  title TEXT NOT NULL\n);',
    language: 'sql',
    commit: 'Usually commit'
  },
  {
    key: 'db',
    extension: '.db',
    fullName: 'Database File',
    category: 'Database',
    technologies: ['SQLite', 'Embedded databases'],
    purpose:
        'Stores database pages and records in an engine-specific binary format, not SQL source text.',
    readers: ['Compatible database engine', 'Database viewer'],
    locations: ['data/', 'var/'],
    related: ['.sqlite', '.sql', '.dump'],
    example: 'Binary database contents; query it through the matching engine.',
    language: 'text',
    commit: 'Usually data-dependent'
  },
  {
    key: 'sqlite',
    extension: '.sqlite',
    fullName: 'SQLite Database',
    category: 'Database',
    technologies: ['SQLite'],
    purpose: 'Common filename extension for a complete SQLite database file.',
    readers: ['SQLite engine', 'Compatible clients'],
    locations: ['data/', 'local development'],
    related: ['.db', '.sqlite3', '.sql'],
    example: 'sqlite3 academy.sqlite ".tables"',
    language: 'bash',
    commit: 'Usually avoid production data'
  },
  {
    key: 'dump',
    extension: '.dump',
    fullName: 'Database Dump',
    category: 'Database',
    technologies: ['PostgreSQL', 'Database backup tools'],
    purpose:
        'Stores an exported database backup, often in a tool-specific binary or archive format.',
    readers: ['Matching restore tool'],
    locations: ['backups/'],
    related: ['.sql', '.bak'],
    example: 'pg_restore --dbname academy backup.dump',
    language: 'bash',
    commit: 'Do not commit sensitive backups'
  },
  {
    key: 'yaml',
    extension: '.yaml',
    fullName: 'YAML',
    category: 'Configuration',
    technologies: ['Docker Compose', 'CI systems', 'Kubernetes'],
    purpose:
        'Represents human-readable structured configuration using indentation.',
    readers: ['Configuration tools', 'Applications'],
    locations: ['project root', '.github/workflows/', 'config/'],
    related: ['.yml', '.json', '.toml'],
    example: 'services:\n  api:\n    image: academy-api:latest',
    language: 'yaml',
    commit: 'Usually commit'
  },
  {
    key: 'yml',
    extension: '.yml',
    fullName: 'YAML (short extension)',
    category: 'Configuration',
    technologies: ['Docker Compose', 'CI systems'],
    purpose:
        'Uses the same YAML format as .yaml; the shorter suffix is a naming convention.',
    readers: ['Configuration tools'],
    locations: ['project root', '.github/workflows/'],
    related: ['.yaml'],
    example: 'name: verify\non: [push]',
    language: 'yaml',
    commit: 'Usually commit'
  },
  {
    key: 'toml',
    extension: '.toml',
    fullName: 'Tom’s Obvious Minimal Language',
    category: 'Configuration',
    technologies: ['Python', 'Rust', 'Build tools'],
    purpose: 'Stores typed configuration in sections and key/value pairs.',
    readers: ['Applications', 'Package tools'],
    locations: ['project root', 'config/'],
    related: ['.ini', '.yaml', '.json'],
    example: '[project]\nname = "devpath-tools"\nversion = "1.0.0"',
    language: 'ini',
    commit: 'Usually commit'
  },
  {
    key: 'properties',
    extension: '.properties',
    fullName: 'Java Properties',
    category: 'Configuration',
    technologies: ['Spring Boot', 'Java'],
    purpose:
        'Stores flat key/value configuration commonly read by Java applications.',
    readers: ['Spring Boot', 'Java Properties API'],
    locations: ['src/main/resources/'],
    related: ['.yml', '.env'],
    example: 'spring.application.name=academy-api\nserver.port=8080',
    language: 'properties',
    commit: 'Commit non-secret defaults'
  },
  {
    key: 'env',
    extension: '.env',
    fullName: 'Environment Variables File',
    category: 'Configuration',
    technologies: ['Application runtimes', 'Build tools'],
    purpose:
        'Provides local environment values as key/value pairs. A leading dot makes it hidden on Unix-like systems; env is not a conventional extension.',
    readers: ['Application bootstrap', 'dotenv-style tools'],
    locations: ['project root'],
    related: ['.env.example', '.env.local'],
    example:
        'API_URL=https://api.example.test\nDATABASE_URL=postgresql://localhost/academy',
    language: 'bash',
    commit: 'Do not commit real secrets',
    warning: 'Never commit production credentials or private keys.'
  },
  {
    key: 'env-example',
    extension: '.env.example',
    fullName: 'Environment Template',
    category: 'Documentation',
    technologies: ['Teams', 'Deployment workflows'],
    purpose:
        'Documents required environment variable names without storing real secret values.',
    readers: ['Developers', 'Deployment tooling'],
    locations: ['project root'],
    related: ['.env'],
    example: 'API_URL=\nDATABASE_URL=\nAPI_KEY=',
    language: 'bash',
    commit: 'Usually commit'
  },
  {
    key: 'package-json',
    extension: 'package.json',
    fullName: 'npm Package Manifest',
    category: 'Build',
    technologies: ['npm', 'Node.js', 'Vite'],
    purpose:
        'Defines package metadata, scripts, dependencies, and runtime expectations.',
    readers: ['npm', 'Node.js tools', 'Build systems'],
    locations: ['project root'],
    related: ['package-lock.json', 'pnpm-lock.yaml'],
    example:
        '{\n  "scripts": { "dev": "vite", "build": "vite build" },\n  "dependencies": { "react": "^19.0.0" }\n}',
    language: 'json',
    commit: 'Commit',
    badge: 'Required'
  },
  {
    key: 'package-lock',
    extension: 'package-lock.json',
    fullName: 'npm Dependency Lockfile',
    category: 'Build',
    technologies: ['npm'],
    purpose:
        'Records the exact resolved dependency graph for reproducible installations.',
    readers: ['npm'],
    locations: ['project root'],
    related: ['package.json', 'pnpm-lock.yaml'],
    example:
        'Generated and maintained by npm; normally commit it for applications.',
    language: 'text',
    commit: 'Usually commit',
    generated: true
  },
  {
    key: 'pom',
    extension: 'pom.xml',
    fullName: 'Maven Project Object Model',
    category: 'Build',
    technologies: ['Maven', 'Java', 'Spring Boot'],
    purpose:
        'Defines Java project coordinates, dependencies, plugins, and build lifecycle configuration.',
    readers: ['Maven'],
    locations: ['project root'],
    related: ['build.gradle', '.jar'],
    example:
        '<dependencies>\n  <dependency>\n    <artifactId>spring-boot-starter-web</artifactId>\n  </dependency>\n</dependencies>',
    language: 'xml',
    commit: 'Commit'
  },
  {
    key: 'requirements',
    extension: 'requirements.txt',
    fullName: 'Python Requirements File',
    category: 'Build',
    technologies: ['pip', 'Python'],
    purpose:
        'Lists Python packages, optionally with pinned versions, for installation by pip.',
    readers: ['pip'],
    locations: ['project root'],
    related: ['pyproject.toml'],
    example: 'fastapi==0.116.1\nuvicorn[standard]==0.35.0',
    language: 'text',
    commit: 'Usually commit'
  },
  {
    key: 'pyproject',
    extension: 'pyproject.toml',
    fullName: 'Python Project Configuration',
    category: 'Build',
    technologies: ['Python build tools', 'pip'],
    purpose:
        'Centralizes Python build-system, project metadata, dependency, and tool configuration.',
    readers: ['pip', 'Build backends', 'Linters'],
    locations: ['project root'],
    related: ['requirements.txt', '.toml'],
    example: '[project]\nname = "academy-api"\nrequires-python = ">=3.12"',
    language: 'ini',
    commit: 'Commit'
  },
  {
    key: 'gitignore',
    extension: '.gitignore',
    fullName: 'Git Ignore Rules',
    category: 'Git',
    technologies: ['Git'],
    purpose:
        'Lists untracked paths Git should normally not add, such as secrets, caches, dependencies, and build output.',
    readers: ['Git'],
    locations: ['repository root', 'nested directories'],
    related: ['.git', '.gitattributes'],
    example: '.env\nnode_modules/\ndist/\n__pycache__/',
    language: 'text',
    commit: 'Commit'
  },
  {
    key: 'gitattributes',
    extension: '.gitattributes',
    fullName: 'Git Attributes',
    category: 'Git',
    technologies: ['Git'],
    purpose:
        'Controls path-specific Git behavior such as line endings, diff drivers, and export rules.',
    readers: ['Git'],
    locations: ['repository root'],
    related: ['.gitignore'],
    example: '* text=auto\n*.sh text eol=lf',
    language: 'text',
    commit: 'Commit'
  },
  {
    key: 'readme',
    extension: 'README.md',
    fullName: 'Project Readme',
    category: 'Documentation',
    technologies: ['Git platforms', 'Markdown renderers'],
    purpose:
        'Introduces a project and explains setup, use, architecture, and contribution expectations.',
    readers: ['Developers', 'Markdown renderer'],
    locations: ['repository root'],
    related: ['CHANGELOG.md', 'CONTRIBUTING.md'],
    example: '# DevPath Academy\n\nLearn, practice, and ship modern software.',
    language: 'markdown',
    commit: 'Commit'
  },
  {
    key: 'dockerfile',
    extension: 'Dockerfile',
    fullName: 'Docker Build Instructions',
    category: 'Deployment',
    technologies: ['Docker'],
    purpose:
        'Defines ordered instructions for building a container image. It intentionally has no extension.',
    readers: ['Docker builder'],
    locations: ['project root', 'deployment/'],
    related: ['.dockerignore', 'docker-compose.yml'],
    example:
        'FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "start"]',
    language: 'dockerfile',
    commit: 'Commit',
    badge: 'No extension'
  },
  {
    key: 'docker-compose',
    extension: 'docker-compose.yml',
    fullName: 'Docker Compose Configuration',
    category: 'Deployment',
    technologies: ['Docker Compose'],
    purpose:
        'Defines a multi-container development or deployment application and its networks, volumes, and environment.',
    readers: ['Docker Compose'],
    locations: ['project root', 'deployment/'],
    related: ['Dockerfile', '.yaml'],
    example: 'services:\n  web:\n    build: .\n    ports: ["3000:3000"]',
    language: 'yaml',
    commit: 'Commit'
  },
  {
    key: 'vite-config',
    extension: 'vite.config.js',
    fullName: 'Vite Configuration',
    category: 'Build',
    technologies: ['Vite'],
    purpose:
        'Configures Vite plugins, aliases, development server, and production build behavior.',
    readers: ['Vite'],
    locations: ['project root'],
    related: ['package.json', 'index.html'],
    example:
        'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });',
    language: 'javascript',
    commit: 'Commit'
  },
  {
    key: 'tsconfig',
    extension: 'tsconfig.json',
    fullName: 'TypeScript Configuration',
    category: 'Build',
    technologies: ['TypeScript compiler'],
    purpose:
        'Defines the TypeScript project boundary, language checks, module behavior, and emitted output.',
    readers: ['TypeScript compiler', 'Editors', 'Build tools'],
    locations: ['project root'],
    related: ['.ts', '.tsx'],
    example: '{ "compilerOptions": { "strict": true, "jsx": "react-jsx" } }',
    language: 'json',
    commit: 'Commit'
  },
  {
    key: 'license',
    extension: 'LICENSE',
    fullName: 'Software License',
    category: 'Documentation',
    technologies: ['People', 'Legal tooling'],
    purpose:
        'States the legal terms under which software may be used, changed, and distributed. It commonly has no extension.',
    readers: ['Users', 'Contributors', 'License scanners'],
    locations: ['repository root'],
    related: ['README.md'],
    example: 'License text selected by the project owner.',
    language: 'text',
    commit: 'Commit',
    badge: 'No extension'
  }
];

const extensionLessons = {
  'file-foundations': ['explore-file-types', 'Explore File Types'],
};

window.ACADEMY_COURSES['file-extensions'] = {
  id: 'file-extensions',
  slug: 'file-extensions',
  icon: 'FX',
  color: '#2563eb',
  category: 'foundations',
  title: 'File Extensions & Project Files',
  shortTitle: 'File Extensions',
  description:
      'Understand what every file in a software project does, who reads it, where it belongs, and whether Git should track it.',
  level: 'Beginner to professional',
  duration: '18–24 hours',
  skipAutoContent: true,
  modules: [
    {
      id: 'file-foundations',
      title: 'Understanding Files',
      lessons: [
        extensionLessons['file-foundations'],
        ['what-is-a-file', 'What Is a File?'],
        ['what-is-an-extension', 'What Is a File Extension?'],
        ['filename-vs-extension', 'File Name vs Extension'],
        ['os-file-identification', 'How Operating Systems Identify Files'],
        ['source-vs-configuration', 'Source Files vs Configuration Files'],
        ['text-vs-binary', 'Text Files vs Binary Files'],
        ['hidden-files', 'Hidden Files'],
        ['extensionless-files', 'Extensionless Files']
      ]
    },
    {
      id: 'web-files',
      title: 'Web Development Files',
      lessons: [
        ['html-files', 'HTML Files', {extensionKey: 'html'}],
        ['css-files', 'CSS and Preprocessor Files', {extensionKey: 'css'}],
        ['javascript-files', 'JavaScript Module Files', {extensionKey: 'js'}],
        ['jsx-files', 'JSX Files', {extensionKey: 'jsx'}],
        ['typescript-files', 'TypeScript Files', {extensionKey: 'ts'}],
        ['tsx-files', 'TSX Files', {extensionKey: 'tsx'}],
        ['web-data-files', 'JSON, XML, and SVG', {extensionKey: 'json'}]
      ]
    },
    {
      id: 'backend-files',
      title: 'Backend Development Files',
      lessons: [
        ['java-source-files', 'Java Source Files', {extensionKey: 'java'}],
        [
          'java-bytecode-archives', 'Java Bytecode and Archives',
          {extensionKey: 'jar'}
        ],
        [
          'python-source-cache', 'Python Source and Bytecode',
          {extensionKey: 'py'}
        ],
        ['backend-mainstream-files', 'C#, Go, Rust, Ruby, and PHP Files']
      ]
    },
    {
      id: 'database-files',
      title: 'Database Files',
      lessons: [
        ['sql-source-files', 'SQL Source Files', {extensionKey: 'sql'}],
        [
          'database-engine-files', 'Database Engine Files', {extensionKey: 'db'}
        ],
        ['sqlite-files', 'SQLite Files', {extensionKey: 'sqlite'}],
        [
          'database-backups', 'Database Backups and Dumps',
          {extensionKey: 'dump'}
        ],
        ['sql-vs-db-vs-dump', 'database.sql vs database.db vs backup.dump']
      ]
    },
    {
      id: 'configuration-files',
      title: 'Configuration Files',
      lessons: [
        ['json-configuration', 'JSON Configuration', {extensionKey: 'json'}],
        ['yaml-configuration', 'YAML Configuration', {extensionKey: 'yaml'}],
        ['toml-configuration', 'TOML Configuration', {extensionKey: 'toml'}],
        [
          'properties-configuration', 'Properties and INI Configuration',
          {extensionKey: 'properties'}
        ],
        [
          'environment-configuration', 'Environment Files',
          {extensionKey: 'env'}
        ]
      ]
    },
    {
      id: 'package-files',
      title: 'Package & Dependency Files',
      lessons: [
        ['npm-manifest', 'package.json', {extensionKey: 'package-json'}],
        [
          'npm-lockfiles', 'npm and JavaScript Lockfiles',
          {extensionKey: 'package-lock'}
        ],
        ['maven-gradle-files', 'Maven and Gradle Files', {extensionKey: 'pom'}],
        [
          'python-dependency-files', 'Python Dependency Files',
          {extensionKey: 'pyproject'}
        ],
        ['dotnet-project-files', '.csproj and .sln']
      ]
    },
    {
      id: 'git-files',
      title: 'Git Files',
      lessons: [
        ['git-directory', '.git Directory'],
        ['gitignore-file', '.gitignore', {extensionKey: 'gitignore'}],
        [
          'gitattributes-file', '.gitattributes',
          {extensionKey: 'gitattributes'}
        ],
        ['gitmodules-file', '.gitmodules'],
        ['git-data-flow', 'Working Tree, Stage, Local, and Remote']
      ]
    },
    {
      id: 'environment-files',
      title: 'Environment & Secret Files',
      lessons: [
        ['env-file', '.env and Secret Safety', {extensionKey: 'env'}],
        ['environment-variants', '.env.local, Development, and Production'],
        ['env-example-file', '.env.example', {extensionKey: 'env-example'}],
        ['secret-management', 'Secrets, Git, and Deployment']
      ]
    },
    {
      id: 'documentation-files',
      title: 'Documentation Files',
      lessons: [
        ['readme-file', 'README.md', {extensionKey: 'readme'}],
        ['changelog-file', 'CHANGELOG.md'],
        ['contributing-file', 'CONTRIBUTING.md'],
        ['license-file', 'LICENSE', {extensionKey: 'license'}],
        ['markdown-anatomy', 'Markdown Source and Rendered Documentation']
      ]
    },
    {
      id: 'build-tooling-files',
      title: 'Build & Tooling Files',
      lessons: [
        ['vite-config-file', 'vite.config.js', {extensionKey: 'vite-config'}],
        ['eslint-prettier-files', 'ESLint and Prettier Configuration'],
        ['babel-config-file', 'babel.config.js'],
        ['tsconfig-file', 'tsconfig.json', {extensionKey: 'tsconfig'}],
        ['who-reads-config', 'Who Reads Each Configuration File?']
      ]
    },
    {
      id: 'deployment-files',
      title: 'Docker & Deployment Files',
      lessons: [
        ['dockerfile-file', 'Dockerfile', {extensionKey: 'dockerfile'}],
        [
          'compose-file', 'docker-compose.yml', {extensionKey: 'docker-compose'}
        ],
        ['dockerignore-file', '.dockerignore'],
        ['platform-config-files', 'vercel.json and netlify.toml'],
        ['nginx-config-file', 'nginx.conf']
      ]
    },
    {
      id: 'extensions-deep-dive',
      title: 'File Extensions Deep Dive',
      lessons: [
        ['jsx-vs-js', '.jsx vs .js'], ['tsx-vs-ts', '.tsx vs .ts'],
        ['js-module-formats', '.js vs .mjs vs .cjs'],
        ['yaml-spelling', '.yaml vs .yml'], ['html-spelling', '.html vs .htm'],
        ['multiple-dot-files', 'Multiple-Dot File Names'],
        ['no-extension-conventions', 'Files Without Extensions'],
        ['open-vs-execute', 'Opening a File vs Executing It'],
        ['reader-map', 'Who Reads This File?'],
        [
          'can-you-read-project', 'Final Challenge: Can You Read a Project?',
          {kind: 'assessment'}
        ]
      ]
    }
  ]
};
