# Course catalog feature

Course definitions currently load from `src/data/courses/*.js` for backward-compatible, offline-first builds. Every definition uses a versioned transport shape (`schemaVersion`, `source`, stable IDs, bilingual metadata, modules, and lessons).

The UI consumes only `window.ACADEMY_COURSES`; a future database adapter can fetch records, normalize them to this shape, and register them before `devpath-platform.js` starts. Persistence keys are based on stable course and lesson IDs, so changing the content source will not discard learner progress, notes, or bookmarks.

Feature boundaries introduced without breaking the existing build:

- `course-catalog`: registry and curriculum transport contract
- `learning-reader`: shared course/lesson rendering and navigation (currently in the compatible platform runtime)
- `learner-state`: progress, notes, bookmarks, preferences, and experiments
- `discovery`: catalog filters and global search

The next safe extraction step is moving one boundary at a time into its feature folder while retaining a compatibility entry point in `src/scripts/devpath-platform.js`.
