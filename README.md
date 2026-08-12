# DevPath Academy

DevPath Academy is a bilingual, offline-ready learning platform for modern software development. It combines structured curricula, interactive labs, persistent progress, notes, bookmarks, review tools, and a personal roadmap builder in one dependency-free static application.

Created and maintained by **Ayman Aljamal — أيمن الجمل** · [github.com/aymanaljamal](https://github.com/aymanaljamal)

## Current Academy

| Learning path | Content |
|---|---:|
| React | 18 chapters · 416 major sections |
| Complete Java | 54 lessons |
| Spring & Spring Boot | 77 lessons |
| Postman API Testing | 25 lessons |
| Python, AI & Machine Learning | 197 lessons · 17 stages · 9 capstones |
| Firebase & Google Cloud | 46 lessons |
| SQL | 23 lessons |
| Database Optimization | 25 lessons |
| Projects | 4 guided projects |
| **Total** | **469 lessons across 9 paths** |

The Academy uses a red global identity. Each course keeps a separate accent color so course context remains visible without changing the product brand.

## Key Features

- Responsive Academy, course, and lesson interfaces
- Shared Arabic/English and RTL/LTR support
- Light and neutral-charcoal night themes
- Personal roadmap builder based on goal, level, and weekly hours
- Persistent course progress, bookmarks, notes, and daily activity
- Global search, dashboard, smart review, quizzes, exam, and certificate
- Notes export to JSON, Markdown, and printable PDF
- React props/state render lab
- Spring Boot request-pipeline lab
- Postman request composer
- SQL query builder and JOIN visualizer
- Database index advisor and execution-plan viewer
- Python model-comparison lab
- Installable PWA with offline cache
- No runtime dependencies, backend, or database required

All learner data is stored locally in the browser. Stable course and lesson IDs preserve progress between releases.

## Quick Start

Requirements: Node.js 18 or newer.

```bash
npm run build
npm test
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

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

Source code is organized by responsibility. The browser still receives one optimized platform bundle, but contributors work in smaller ordered feature files.

```text
src/data/courses/*.js
        │ course definitions with stable IDs
        ▼
src/features/course-catalog/
        │ official sources and cross-course relationships
        ▼
src/platform/
        ├── 01-core.js              state, icons, routing primitives, header
        ├── 02-home.js              home UI, roadmap builder, course cards
        ├── 03-course-reader.js     course and lesson rendering
        ├── 04-learner-tools.js     notes, search, toolbar, dashboard bindings
        ├── 05-interactive-labs.js  React, Spring, Postman, SQL, DB, Python labs
        └── 06-pages-router.js       sources, about, render entry point
        │
        ▼
scripts/source-manifest.mjs
        │ declares ordered source and asset inputs
        ▼
scripts/build.mjs
        ├── index.html    lightweight Academy application
        ├── react.html    Academy plus original React curriculum
        └── public/       Vercel deployment output
```

The numbered platform files intentionally share one private closure. Their order is declared once in `scripts/source-manifest.mjs`. The build concatenates them, and `scripts/check-platform.mjs` validates the combined syntax. This keeps runtime delivery simple while preventing a single application file from becoming a maintenance bottleneck.

## Project Structure

```text
.
├── src/
│   ├── index.template.html
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
├── assets/                        # PWA icons
├── public/                        # generated deployment bundle, ignored
├── index.html                     # generated Academy bundle
├── react.html                     # generated React reader bundle
├── manifest.webmanifest
├── sw.js
└── vercel.json
```

### Editable and Generated Files

| Type | Files | Rule |
|---|---|---|
| Application source | `src/platform/**`, `src/scripts/**`, `src/styles/**` | Edit here |
| Course curricula | `src/data/courses/*.js` | Keep IDs and slugs stable |
| Catalog metadata | `src/features/course-catalog/**` | Sources and relationships |
| Build configuration | `scripts/source-manifest.mjs` | Register new source layers here |
| Generated output | `index.html`, `react.html`, `public/**` | Never edit manually |
| Deployment/PWA | `vercel.json`, `manifest.webmanifest`, `sw.js` | Update intentionally |

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
3. Validates and concatenates the six platform fragments.
4. Compacts CSS.
5. Builds a lightweight home bundle and a lazy React reader.
6. Copies PWA assets into `public/`.

The automated suite currently validates 469 lessons across 9 paths and more than 130 structural, routing, accessibility, content, PWA, theme, and feature regressions.

## Deployment

Vercel uses `vercel.json` to run the build and publish `public/`. The generated static files can also be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any static web host.

PWA installation and offline support require HTTP or HTTPS. Increment the cache name in `sw.js` whenever deployable application assets change.
