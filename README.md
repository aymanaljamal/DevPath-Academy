# DevPath Academy

DevPath Academy is a bilingual, offline-ready learning platform for modern software development. It combines structured curricula, interactive labs, persistent progress, notes, bookmarks, review tools, and a personal roadmap builder in one dependency-free static application.

Created and maintained by **Ayman Aljamal — أيمن الجمل** · [github.com/aymanaljamal](https://github.com/aymanaljamal)

## Current Academy

| Learning path                   |                                            Content |
| ------------------------------- | -------------------------------------------------: |
| React                           | 18 original chapters · 1 interactive structure lab |
| Next.js                         |                                         20 lessons |
| File Extensions & Project Files |                           69 lessons · 12 chapters |
| Complete Java                   |                                         54 lessons |
| Spring & Spring Boot            |                                         77 lessons |
| Postman API Testing             |                                         25 lessons |
| Python, AI & Machine Learning   |              198 lessons · 17 stages · 9 capstones |
| Firebase & Google Cloud         |                                         47 lessons |
| SQL                             |                                         23 lessons |
| Database Optimization           |                                         25 lessons |
| Projects                        |                                  5 guided projects |
| **Total**                       |    **561 lessons and experiences across 11 paths** |

The Academy uses a red global identity. Each course keeps a separate accent color so course context remains visible without changing the product brand.

## Key Features

- Responsive Academy, course, and lesson interfaces
- Shared Arabic/English and RTL/LTR support
- Light and neutral-charcoal night themes
- Personal roadmap builder based on goal, level, and weekly hours
- Persistent course progress, bookmarks, notes, and daily activity
- Global search, dashboard, smart review, quizzes, exam, and certificate
- Dedicated Next.js continuation path beside the original React curriculum
- Interactive, path-specific project structure labs with deep-linked files
- Searchable File Extensions & Project Files course with 69 lessons
- Notes export to JSON, Markdown, and printable PDF
- React props/state render lab
- Spring Boot request-pipeline lab
- Postman request composer
- SQL query builder and JOIN visualizer
- Database index advisor and execution-plan viewer
- Python model-comparison lab
- Installable PWA with offline cache
- No client-side framework runtime, backend, or database required

All learner data is stored locally in the browser. Stable course and lesson IDs preserve progress between releases.

## Quick Start

Requirements: Node.js 18 or newer.

```bash
npm run build
npm test
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

The standalone React curriculum is available at
[http://127.0.0.1:4173/react.html#chapter-1](http://127.0.0.1:4173/react.html#chapter-1).

Useful commands:

```bash
npm run lint                   # validates the assembled platform bundle
npm run verify                 # structural and regression checks
npm run validate:content       # curriculum completeness
npm run validate:sources       # source metadata
npm run validate:relationships # cross-course relationships
npm run validate:translations  # bilingual coverage
npm run validate:all           # all curriculum validations
```

## Scalable Architecture

Source code is organized by responsibility, and the generated HTML is only a
document shell. CSS, course data, the React reader, dashboard, catalog, and
platform runtime are emitted as separate cacheable assets.

```text
src/data/courses/*.js
        │ one file per learning path
        ▼
src/features/course-catalog/
        │ official sources and cross-course relationships
        ▼
src/platform/
        ├── 01-core.js              state, icons, routing primitives, header
        ├── 02-home.js              home UI, roadmap builder, file map, course cards
        ├── 03-course-reader.js     course and lesson rendering
        ├── 04-learner-tools.js     notes, search, toolbar, dashboard bindings
        ├── 05-project-files.js     project trees, file explorer, runtime flows
        ├── 05-interactive-labs.js  React, Spring, Postman, SQL, DB, Python labs
        └── 06-pages-router.js       sources, about, render entry point
scripts/build.mjs
        ├── index.html              lightweight Academy shell
        ├── react.html              shell plus original React chapters
        ├── assets/*.css|*.js       generated runtime parts
        └── public/                 Vercel deployment output
```

The numbered platform files intentionally share one private closure. Their order is declared once in `scripts/source-manifest.mjs`. The build validates and concatenates those fragments into `assets/platform-bundle.js`, while every other responsibility gets its own generated asset. This keeps `index.html` small without turning maintenance into another monolithic file.

### React Reader Isolation

The original React curriculum is static HTML enhanced with plain JavaScript;
it does not mount a React application. Keeping chapter content in
`src/content/chapters/*.html` preserves semantic markup, direct hash links,
searchability, and progressive rendering. Converting those chapters into
JavaScript strings would increase parsing and maintenance cost without fixing
rendering performance.

`react.html` intentionally loads only these application scripts:

```text
assets/course-reader.js
assets/learning-dashboard.js
```

It must not load `course-data.js`, catalog scripts, or `platform-bundle.js`.
Those files belong to the Academy shell in `index.html`. Loading both renderers
in the React document can duplicate routing and scroll work. `npm run verify`
contains a regression gate that fails if the Academy renderer is added back to
the standalone React reader.

## File Distribution Map

- One course per file keeps reviews focused and makes new paths easy to add.
- Shared lesson generation lives in `src/data/courses/zz-lesson-content.js`.
- Home, course, and page UI live in the numbered platform fragments.
- React stays special because it preserves the original 18 chapters in an
  isolated reader with its own lightweight navigation and dashboard scripts.
- Next.js now sits beside React as the modern continuation path.

## Project Structure

```text
.
├── src/
│   ├── home.template.html          # small Academy document shell
│   ├── react.template.html         # original React reader shell
│   ├── content/chapters/          # original React curriculum
│   ├── data/courses/              # one file per learning path
│   ├── features/course-catalog/   # sources and relationships
│   ├── platform/                  # shared Academy feature fragments
│   ├── scripts/                   # original React reader/dashboard
│   └── styles/                    # application style layers
├── scripts/
│   ├── source-manifest.mjs        # build source-of-truth
│   ├── build.mjs
│   ├── check-platform.mjs
│   ├── validate-academy.mjs
│   ├── verify.mjs
│   └── serve.mjs
├── assets/                        # icons, highlighting, generated runtime parts
├── public/                        # generated deployment bundle, ignored
├── index.html                     # generated Academy shell
├── react.html                     # generated React curriculum shell
├── manifest.webmanifest
├── sw.js
└── vercel.json
```

### Editable and Generated Files

| Type                | Files                                                                                                                                                                   | Rule                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Application source  | `src/platform/**`, `src/scripts/**`, `src/styles/**`                                                                                                                    | Edit here                       |
| Course curricula    | `src/data/courses/*.js`                                                                                                                                                 | Keep IDs and slugs stable       |
| Catalog metadata    | `src/features/course-catalog/**`                                                                                                                                        | Sources and relationships       |
| Build configuration | `scripts/source-manifest.mjs`                                                                                                                                           | Register new source layers here |
| Generated output    | `index.html`, `react.html`, `assets/devpath-bundle.css`, `assets/*-bundle.js`, `assets/course-*.js`, `assets/catalog-*.js`, `assets/learning-dashboard.js`, `public/**` | Never edit manually             |
| Deployment/PWA      | `vercel.json`, `manifest.webmanifest`, `sw.js`                                                                                                                          | Update intentionally            |

## Adding a Learning Path

1. Create `src/data/courses/<course-id>.js`.
2. Register a stable course ID, slug, titles, description, color, category, and modules.
3. Give every lesson a stable slug and bilingual metadata.
4. Add official sources in `src/features/course-catalog/sources.js`.
5. Add relevant course connections in `relationships.js`.
6. Run `npm run build && npm test`.

Course files are discovered automatically. The new path receives routing, search, progress, notes, bookmarks, navigation, and toolbar support from the shared platform.

## Adding a Platform Feature

- Put feature rendering and behavior in the matching `src/platform/` fragment.
- Create another numbered fragment only when the responsibility is genuinely separate.
- Register a new fragment in `scripts/source-manifest.mjs` in dependency order.
- Add a regression assertion to `scripts/verify.mjs`.
- Add responsive, dark-theme, RTL, and reduced-motion behavior when the feature has UI.
- Run the complete test suite before committing.

Avoid direct edits to generated HTML. Avoid changing existing course or lesson IDs because those IDs are browser-storage keys.

## Build and Quality Gates

The production build:

1. Discovers all course files and 18 React chapters.
2. Reads source order from the manifest.
3. Validates and concatenates the seven platform fragments.
4. Compacts CSS.
5. Emits the Academy shell with its platform assets.
6. Emits the isolated React reader with only its reader and dashboard scripts.
7. Copies the same offline-ready output into `public/`.

The automated suite currently validates 561 lessons and experiences across 11
paths and 155 structural, routing, accessibility, content, PWA, theme, and
feature regressions.

### React Reader Troubleshooting

If an already-open React tab still uses an older bundle after a rebuild, close
that tab and reopen `react.html`. A hard refresh (`Ctrl+Shift+R`) also bypasses
the previous document, while the versioned service-worker cache refreshes the
offline assets. For a clean verification run:

```bash
npm run build
npm test
npm start
```

Then open `react.html#chapter-16`, scroll through the full chapter, and test the
previous/next cards and sidebar links. The automated suite verifies the exact
chapter 1–18 chain and confirms that every sidebar section belongs to its
declared chapter.

## Deployment

Vercel uses `vercel.json` to run the build and publish `public/`. The generated static files can also be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any static web host.

PWA installation and offline support require HTTP or HTTPS. Increment the cache name in `sw.js` whenever deployable application assets change.
