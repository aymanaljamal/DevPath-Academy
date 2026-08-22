(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  window.ACADEMY_LESSON_SPECS.nextjs = {
  ...{
    context: 'Next.js applications',
    language: 'javascript',
    concepts: [
      [
        /introduction|project setup|app structure|file-based routing|routing/,
        'Next.js combines React with file-based routing, server rendering, and production-focused project conventions so application structure maps directly to URLs and layouts'
      ],
      [
        /layout|nested layout/,
        'Layouts share UI across route segments while nested layouts preserve structure and state at the segment boundary'
      ],
      [
        /server component|server-rendered|server rendering/,
        'Server Components render on the server and can read data without shipping their implementation to the browser bundle'
      ],
      [
        /client component|interactive|hooks/,
        'Client Components run in the browser when interactivity, local state, or browser-only APIs are required'
      ],
      [
        /suspense|loading/,
        'Suspense coordinates deferred rendering with a dedicated fallback so the page can reveal partial content while data or code is still pending'
      ],
      [
        /error boundary|not found/,
        'Error and not-found boundaries give route segments explicit failure states instead of collapsing the whole app'
      ],
      [
        /data fetching|fetching in next\.js/,
        'Next.js data fetching is tied to the rendering model, so where a request runs affects caching, streaming, and bundle size'
      ],
      [
        /server actions/,
        'Server Actions move trusted mutations to the server while letting the client submit intent through a direct framework-managed boundary'
      ],
      [
        /route handlers|api/,
        'Route Handlers expose server endpoints inside the app router for data access, webhooks, and custom responses'
      ],
      [
        /caching|revalidation/,
        'Caching and revalidation balance freshness with latency by deciding which requests are reused and when stale data is refreshed'
      ],
      [
        /metadata|seo/,
        'Metadata and SEO concerns belong close to the route so titles, descriptions, canonical links, and social previews follow the page content'
      ],
      [
        /image|font/,
        'Optimized images and fonts reduce layout shift and transfer cost while keeping visual quality under control'
      ],
      [
        /forms|validation/,
        'Forms need progressive enhancement, input constraints, and server-side validation so failures stay understandable and secure'
      ],
      [
        /authenticat|authorization/,
        'Authentication establishes identity and authorization limits what a session may read or mutate'
      ],
      [
        /performance|optimization/,
        'Performance work in Next.js usually means reducing JavaScript shipped to the browser, avoiding unnecessary waterfalls, and choosing the right rendering mode'
      ],
      [
        /testing/,
        'Testing Next.js applications should cover route behavior, data boundaries, and user-visible outcomes rather than framework internals'
      ],
      [
        /deployment|vercel/,
        'Next.js deployment works best when build output, environment variables, preview flows, and edge/runtime boundaries are explicit'
      ],
      [
        /capstone|production/,
        'A production capstone should prove routing, rendering, mutations, observability, and deployment in one coherent app'
      ]
    ]
  }
};
})();
