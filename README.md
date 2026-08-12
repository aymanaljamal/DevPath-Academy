# DevPath Academy


An interactive, bilingual, offline-ready learning academy for modern software development.

DevPath Academy brings **React**, **Java**, **Spring & Spring Boot**, and practical **Projects** into one consistent learning experience—with shared navigation, progress tracking, notes, bookmarks, review tools, and course-aware themes.

Created, designed, and maintained by **Ayman Aljamal — أيمن الجمل** · [GitHub Profile](https://github.com/aymanaljamal)

## Learning Paths

| Path | Current content | Accent |
|---|---:|---|
| React | 18 chapters · 416 major sections | Blue |
| Complete Java | 54 lessons | Orange |
| Spring & Spring Boot | 77 lessons | Green |
| Python, AI & Machine Learning | 197 lessons · 17 stages · 9 capstones | Python gold |
| SQL | 23 lessons · PostgreSQL project | Cyan/teal |
| Database Optimization | 25 lessons · performance case study | Amber/yellow |
| Firebase & Google Cloud Services | 46 lessons · 4 practical cloud projects | Google amber |
| Projects | 4 guided projects | Purple |

The Academy uses a red global identity while each learning path keeps its own accent color. The complete original React curriculum is preserved and loaded separately only when the learner opens it, keeping the home page fast.

## Features

- Unified responsive interface across every course
- English and Arabic controls with shared RTL/LTR state
- Shared light and charcoal dark themes
- Course-aware Previous and Next navigation
- Independent completion progress for every learning path
- Persistent bookmarks and advanced notes
- Note count, statistics, JSON backup, and printable PDF export
- Dashboard, smart review, quizzes, final assessment, and certificate
- Global search and command palette with `Ctrl/Cmd + K`
- Study timer and learning analytics
- Persistent text highlights with five colors
- Import and restore for saved learning data
- Markdown note export
- Three interactive learning tools on the home page
- Interactive goal roadmaps and a clickable course-progress constellation
- Hands-on React props and state lab with live component preview
- Python & AI roadmap, models library, projects, datasets, cheat sheets, bilingual glossary, and model comparison lab
- Installable PWA with offline support
- Mobile-friendly course reader and toolbar

All learning data is stored locally in the browser. Theme and language preferences are shared between the Academy and the original React reader.

## Python, AI & Machine Learning

The gold-accented path progresses from Python and mathematics through NumPy/Pandas, comparative traditional machine learning, time series, NLP, recommendations, PyTorch deep learning, computer vision, transformers and RAG, reinforcement learning, and MLOps. Every stage ends with a review and assessment, for 197 lessons across 17 stages and nine portfolio capstones.

Examples target Python 3.12+, use reproducible seed `42`, and rely on small open datasets or locally generated educational data. The browser-based Model Comparison Lab compares multiple candidates on a deterministic educational split and stores up to 20 experiments locally. Full training work uses scikit-learn and PyTorch; deployment lessons use FastAPI, Docker, and MLflow.

## SQL and Database Optimization

The SQL path covers relational foundations, schema definition, data changes, querying, joins, constraints, transactions, security, indexes, stored procedures, and a PostgreSQL project. Database Optimization continues with execution plans, `EXPLAIN ANALYZE`, index engineering, query rewrites, locking, maintenance, pooling, caching, monitoring, and a practical performance case study.

Both definitions use stable IDs and a versioned curriculum transport shape. They currently remain static for offline use, while the documented course-catalog boundary allows a future database adapter to register the same normalized shape without changing routes or learner data keys.

SQL and Database Optimization lessons include responsive code-native diagrams: ER/key relationships, interactive JOIN results, B-tree structure, query execution flow, and simulated before/after plan comparisons. Technical diagrams use structured HTML/SVG rather than AI-generated images. Lesson references point to verified PostgreSQL documentation and are validated with the content scripts.

## Verified Sources Catalog

The Academy includes a centralized, data-driven source catalog for every learning path. The current catalog contains 41 primary references:

| Path | Sources | Primary publishers |
|---|---:|---|
| React | 4 | React, MDN, Vite |
| Java | 4 | Oracle, Dev.java, Apache Maven |
| Spring & Spring Boot | 4 | Spring |
| Python, AI & Machine Learning | 8 | Python, NumPy, pandas, scikit-learn, PyTorch, Hugging Face, MLflow, FastAPI |
| SQL | 9 | PostgreSQL Global Development Group |
| Database Optimization | 9 | PostgreSQL Global Development Group |
| Projects | 3 | Git, Docker, OWASP |
| Firebase & Google Cloud | 14 | Google Firebase, Google Cloud |

Each source entry contains a real title, HTTPS URL, publisher, and source type. The Academy Sources page renders this catalog by learning path. SQL and Database Optimization lessons also show relevant lesson-level sources with access date and source classification. Source metadata lives in `src/features/course-catalog/sources.js`; curriculum data remains separate.

## Firebase & Google Cloud Services

This bilingual path contains 46 lessons across seven modules. It covers Firebase setup and emulators, Authentication, Firestore, Security Rules, Storage, Realtime Database, Messaging, Cloud Functions, Hosting, App Check, analytics and quality tools, then progresses into Cloud Run, Cloud SQL, Pub/Sub, IAM, Secret Manager, networking, logging, monitoring, CI/CD, reliability, cost control, and architecture. Four projects connect the path to React, Spring Boot, and AI deployment.

```bash
npm run validate:content
npm run validate:sources
npm run validate:relationships
npm run validate:translations
npm run validate:all
```

## Quick Start

Requirements: **Node.js 18+**. No npm dependencies, backend, or database are required.

```bash
npm run build
npm run verify
npm start
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Project Structure

```text
.
├── src/                                      # Editable application source
│   ├── index.template.html                   # Shared HTML shell and metadata
│   ├── content/
│   │   └── chapters/
│   │       ├── chapter-01.html               # Original React chapter 1
│   │       ├── ...
│   │       └── chapter-18.html               # Original React chapter 18
│   ├── data/
│   │   └── courses/                          # Data-driven learning paths
│   │       ├── react.js
│   │       ├── java-essentials.js
│   │       ├── spring-boot.js
│   │       ├── python-ai.js
│   │       ├── firebase-google-cloud.js
│   │       ├── sql.js
│   │       ├── database-optimization.js
│   │       └── projects.js
│   ├── features/
│   │   └── course-catalog/
│   │       ├── README.md                     # Catalog contract and DB-adapter notes
│   │       ├── relationships.js              # Cross-course relationship records
│   │       └── sources.js                    # Verified official source catalog
│   ├── scripts/
│   │   ├── course.js                         # Original React reader navigation
│   │   ├── learning-dashboard.js             # React tools, analytics, and persistence
│   │   └── devpath-platform.js               # SPA routes, shared reader, home tools,
│   │                                          # notes, bookmarks, progress, and labs
│   └── styles/
│       ├── base.css                           # Original reader foundations
│       ├── course-enhancements.css            # Reader interactions and accessibility
│       ├── learning-dashboard.css             # Dashboard and study-tool styling
│       └── devpath-platform.css               # Academy, courses, visualizations,
│                                              # responsive, RTL, and dark-mode styling
├── scripts/
│   ├── build.mjs                              # Builds root and public outputs
│   ├── serve.mjs                              # Local static development server
│   ├── validate-academy.mjs                   # Content/source/translation validation
│   └── verify.mjs                             # Structural and feature regression checks
├── assets/
│   └── course-icon.svg                        # Academy PWA icon
├── public/                                    # Generated deployment bundle (ignored here)
├── index.html                                 # Generated lightweight Academy SPA
├── react.html                                 # Generated lazy-loaded React reader
├── manifest.webmanifest                       # Installable PWA metadata
├── sw.js                                      # Offline cache and navigation fallback
├── vercel.json                                # Vercel build and output configuration
├── package.json                               # Commands and project metadata
└── README.md                                  # Project documentation
```

Generated files such as `index.html`, `react.html`, and the `public/` deployment bundle should not be edited manually. Change the source under `src/`, then run the build.

### Architecture at a Glance

```text
Course files (`src/data/courses/*.js`)
        │
        ├── register bilingual curriculum data
        ├── keep stable course and lesson IDs
        └── remain replaceable by a future database adapter
        │
        ▼
Course catalog (`src/features/course-catalog/`)
        ├── official sources
        └── cross-course relationships
        │
        ▼
Shared platform (`src/scripts/devpath-platform.js`)
        ├── hash routing and course discovery
        ├── landing, overview, and lesson rendering
        ├── search, roadmaps, and home interactions
        └── progress, notes, bookmarks, and experiments
        │
        ▼
Build (`scripts/build.mjs`)
        ├── index.html
        ├── react.html
        └── public/
```

### Generated vs. Editable Files

| Type | Files | Rule |
|---|---|---|
| Editable source | `src/**`, `scripts/**`, `README.md`, `sw.js` | Make implementation changes here. |
| Course curricula | `src/data/courses/*.js` | Keep IDs stable to preserve learner data. |
| Catalog metadata | `src/features/course-catalog/*.js` | Manage sources and course relationships here. |
| Generated output | `index.html`, `react.html`, `public/**` | Regenerate with `npm run build`; do not edit manually. |
| PWA/deployment | `manifest.webmanifest`, `sw.js`, `vercel.json` | Update when install, cache, or hosting behavior changes. |

## Add a New Learning Path

Create a JavaScript course definition under `src/data/courses/`. The build discovers course files automatically.

A course definition needs:

- A stable `id` and `slug`
- Title, short title, description, and accent color
- Categorized modules
- Stable lesson slugs and lesson content

The new path is automatically included in the catalog, search, progress calculations, bookmarks, notes, course toolbar, and lesson navigation.

## Notes, Bookmarks, and PDF

Every course includes the same learning toolbar:

- **Bookmark** saves the current lesson or section.
- **Notes** opens the bilingual notes workspace and displays the saved-note count.
- **Complete** updates course progress.
- **PDF** opens the browser print workflow for saving a clean PDF.
- **Theme** switches between the shared morning and night themes.
- **Dashboard** and **Review** expose progress and revision tools.
- **AR / EN** switches the interface language everywhere.

Saved notes can be exported as JSON, Markdown, or a formatted PDF report. Browser data can also be backed up and restored.

## Build and Verification

```bash
npm run build
npm run verify
```

The current verification suite runs **76 checks**, including:

- React content preservation
- Java and Spring lesson counts
- Valid navigation and unique DOM IDs
- Shared toolbar actions and boundary states
- Notes, bookmarks, exports, and restore support
- Shared theme and bilingual state
- Course colors and dark-theme consistency
- PWA assets and generated deployment output

Current verified content:

| Item | Count |
|---|---:|
| React chapters | 18 |
| Major React sections | 416 |
| Code blocks | 557 |
| Tables | 26 |
| Verification checks | 76 |

## Deployment

The project is ready for GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static host.

For Vercel, `vercel.json` runs the build and publishes the generated `public/` directory. For other static hosts, publish the production files after running the build.

PWA installation and offline caching require HTTP or HTTPS.

## Author

Designed, developed, and authored by **Ayman Aljamal — أيمن الجمل** · [GitHub Profile](https://github.com/aymanaljamal)

🌐 **Live Project:** [Open DevPath Academy](https://complete-react-developer-course-4wc5zxfpw-ayman-jamal.vercel.app/#courses)

## License

This repository is intended for educational use. Add a dedicated license file before redistributing or publishing the course content under specific reuse terms.
