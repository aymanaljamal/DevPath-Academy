# DevPath Academy


An interactive, bilingual, offline-ready learning academy for modern software development.

DevPath Academy brings **React**, **Java**, **Spring & Spring Boot**, and practical **Projects** into one consistent learning experience—with shared navigation, progress tracking, notes, bookmarks, review tools, and course-aware themes.

Created by **Ayman Aljamal** · [GitHub Profile](https://github.com/aymanaljamal)

## Learning Paths

| Path | Current content | Accent |
|---|---:|---|
| React | 18 chapters · 416 major sections | Blue |
| Complete Java | 54 lessons | Orange |
| Spring & Spring Boot | 77 lessons | Green |
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
- Installable PWA with offline support
- Mobile-friendly course reader and toolbar

All learning data is stored locally in the browser. Theme and language preferences are shared between the Academy and the original React reader.

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
├── src/
│   ├── index.template.html          # Shared application shell
│   ├── content/chapters/            # Original 18 React chapters
│   ├── data/courses/                # Java, Spring Boot, Projects, React catalog data
│   ├── scripts/
│   │   ├── course.js                # Original reader navigation
│   │   ├── learning-dashboard.js    # React learning tools and persistence
│   │   └── devpath-platform.js      # Academy routing and shared tools
│   └── styles/
│       ├── base.css
│       ├── course-enhancements.css
│       ├── learning-dashboard.css
│       └── devpath-platform.css
├── scripts/
│   ├── build.mjs                    # Generates production files
│   └── verify.mjs                   # Runs structural and feature checks
├── assets/course-icon.svg           # Red PWA icon
├── index.html                       # Lightweight Academy entry point
├── react.html                       # Lazy-loaded complete React reader
├── manifest.webmanifest
├── sw.js
└── vercel.json
```

Generated files such as `index.html`, `react.html`, and the `public/` deployment bundle should not be edited manually. Change the source under `src/`, then run the build.

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

Created by **Ayman Aljamal** · [GitHub Profile](https://github.com/aymanaljamal)

🌐 **Live Project:** [Open DevPath Academy](https://complete-react-developer-course-4wc5zxfpw-ayman-jamal.vercel.app/#courses)

## License

This repository is intended for educational use. Add a dedicated license file before redistributing or publishing the course content under specific reuse terms.
