# Interactive React Learning Platform

A comprehensive, standalone React developer course created by **Ayman Aljamal**. The platform contains 18 chapters, persistent learning progress, searchable course content, personal notes, creative quizzes, bookmarks, reading preferences, and structured note exports.

GitHub: [github.com/aymanaljamal](https://github.com/aymanaljamal)

## Highlights

- 18 chapters from beginner concepts to enterprise React practices
- 416 major sections, 555 code examples, and 26 comparison tables
- Full-course search with `Ctrl/Cmd + K`
- Chapter completion tracking and Continue Learning
- Persistent bookmarks, personal notes, quiz scores, theme, and reading preferences
- Notes workspace with section-based subject suggestions and autocomplete
- Notes statistics: total notes, covered chapters, word count, and latest update
- Structured JSON export for backups and integrations
- Styled A4 PDF report export through the browser's **Save as PDF** workflow
- Import/Restore for complete progress backups
- Learning analytics dashboard with chapter performance and study-time statistics
- Smart spaced-review queue generated from incorrect quiz answers
- Final assessment with a printable PDF completion certificate
- Offline-installable PWA support
- Command palette for fast keyboard navigation
- English and Arabic interface modes
- Persistent per-chapter study-time tracking
- Persistent text highlights inside course chapters
- Markdown note export for GitHub, Notion, and other knowledge tools
- Responsive sidebar, keyboard navigation, dark mode, and accessible dialogs
- One-file production output that opens directly in a modern browser

## Project Structure

```text
.
|-- src/
|   |-- index.template.html          # Application shell and build placeholders
|   |-- content/
|   |   `-- chapters/                # One HTML file per course chapter
|   |       |-- chapter-01.html
|   |       `-- chapter-18.html
|   |-- styles/
|   |   |-- base.css                 # Core layout and course typography
|   |   |-- course-enhancements.css  # Navigation, search, tables, and code UI
|   |   `-- learning-dashboard.css   # Notes, quizzes, dialogs, theme, and tools
|   `-- scripts/
|       |-- course.js                # Core navigation and course behavior
|       `-- learning-dashboard.js    # Persistence, notes, exports, and quizzes
|-- scripts/
|   |-- build.mjs                    # Produces the standalone HTML artifact
|   `-- verify.mjs                   # Structural and JavaScript verification
|-- assets/
|   `-- course-icon.svg              # PWA application icon
|-- index.html                       # Canonical deployment entry point
|-- manifest.webmanifest             # Installable app metadata
|-- sw.js                            # Offline cache service worker
`-- package.json
```

## Requirements

- Node.js 18 or newer
- No npm packages are required
- No backend, database, or framework build tool is required

## Build

```bash
npm run build
```

For local PWA testing, run `npm start` and open `http://127.0.0.1:4173`.

The build script reads the modular source files and creates one standalone artifact:

- `index.html` - **the canonical deployment entry point**

The files contain all course content, CSS, and application JavaScript and can be opened directly in a modern browser. Deploy the project root and configure the host to serve `index.html`.

## Deployment

The root-level `index.html` is the official application entry point. For GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a standard static host, publish the project root after running:

```bash
npm run build
npm run verify
```

Include `index.html`, `manifest.webmanifest`, `sw.js`, and the `assets/` folder in the deployment. PWA installation and offline caching require HTTP/HTTPS; the core standalone course still works when `index.html` is opened as a local file.

## Verify

```bash
npm run verify
```

Verification checks the expected content counts, duplicate DOM IDs, sidebar targets, JavaScript syntax, persistence features, creator credit, and both note export formats.

## Editing the Course

### Edit educational content

Update the relevant file in `src/content/chapters/`. Chapter filenames use a fixed two-digit order so the build remains deterministic.

### Edit styling

- Use `base.css` for typography and the main page layout.
- Use `course-enhancements.css` for navigation, search, code blocks, and tables.
- Use `learning-dashboard.css` for notes, quizzes, dialogs, themes, and dashboard controls.

### Edit behavior

- Use `course.js` for core reading and navigation behavior.
- Use `learning-dashboard.js` for persisted user data and interactive learning tools.

After every source change, run:

```bash
npm run build
npm run verify
```

Do not manually edit the generated root `index.html`; update files under `src/` and run the build instead.

## Personal Notes and Exports

Each section has an **Add note** control. The note subject is automatically suggested from the current section and can also be selected from the course-wide autocomplete list.

The notes workspace provides:

- A complete saved-notes list
- Chapter and section metadata
- Total-note, chapter-coverage, word-count, and last-update statistics
- JSON export for reliable backup and future import/integration
- PDF export with a cover page, summary statistics, section metadata, and print-safe note cards

For PDF export, select **Export PDF**, then choose **Save as PDF** in the browser print dialog. This approach keeps the platform dependency-free and works from the standalone local HTML file.

## How Bookmarks Work

Bookmarks save a course location, not a copy of the content.

1. Navigate to the section you want to remember.
2. Select the **star button (☆)** in the learning toolbar, or the star beside a section heading.
3. A filled/highlighted star confirms that the section is saved.
4. Open **Bookmarks** to see every saved section and its chapter.
5. Select a saved item to jump directly to that section.
6. Select **Remove** to delete a bookmark.

Bookmarks persist after refresh, are included in progress JSON exports, and can be restored through Import/Restore. The `?` help button in the application shows the same workflow.

## Advanced Learning Features

- **Import/Restore:** Open Preferences, choose a valid JSON backup, and confirm replacement of current local data.
- **Dashboard:** Review completion, quiz average, notes, bookmarks, review queue, highlights, study time, and per-chapter scores.
- **Smart Review:** Incorrect chapter quizzes enter a spaced review queue. Correct 3/3 answers remove that chapter from the queue.
- **Final Exam:** Open Dashboard, select Final Exam, and score at least 80% to unlock the certificate.
- **Certificate:** Enter the learner name and select Print Certificate PDF, then choose Save as PDF.
- **Command Palette:** Press `Ctrl/Cmd + K` to search commands and chapters.
- **Language:** Choose English or Arabic under Preferences. Course educational content remains unchanged.
- **Study Time:** Time is recorded only while the page is visible and saved per chapter.
- **Highlights:** Select course text, choose yellow, green, blue, pink, or purple, then press Highlight. The selected color and highlight survive refresh and are included in progress backups. Saved highlights can be opened from the command palette.
- **Markdown:** Open Notes and select Export Markdown.

## Stored Data

Learning data is stored locally in the browser under versioned `localStorage` keys. It never leaves the device unless the learner explicitly exports it. Reset Course Data requires confirmation before deletion.

## Content Preservation

The modular build preserves the original educational material. Current production counts are:

| Element | Count |
|---|---:|
| Chapters | 18 |
| Major sections | 416 |
| Code blocks | 555 |
| Tables | 26 |
| Interview-question occurrences | 20 |

## Author

Designed and crafted by **Ayman Aljamal**.

- GitHub: [aymanaljamal](https://github.com/aymanaljamal)
