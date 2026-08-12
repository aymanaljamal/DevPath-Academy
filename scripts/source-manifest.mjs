export const styleSources = [
  'styles/base.css',
  'styles/course-enhancements.css',
  'styles/learning-dashboard.css',
  'styles/devpath-platform.css',
];

export const sharedScriptSources = [
  'scripts/course.js',
  'scripts/learning-dashboard.js',
  'features/course-catalog/sources.js',
  'features/course-catalog/relationships.js',
];

// These files intentionally share one closure and must stay in numeric order.
// The production build concatenates them into one script to avoid runtime requests.
export const platformSources = [
  'platform/01-core.js',
  'platform/02-home.js',
  'platform/03-course-reader.js',
  'platform/04-learner-tools.js',
  'platform/05-interactive-labs.js',
  'platform/06-pages-router.js',
];

export const generatedAssets = [
  'course-icon.svg',
  'course-icon-32.png',
  'course-icon-180.png',
  'course-icon-192.png',
  'course-icon-512.png',
  'course-icon-maskable-512.png',
];
