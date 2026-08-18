window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES['nextjs'] = {
  id: 'nextjs',
  slug: 'nextjs',
  icon: 'N',
  color: '#000000',
  title: 'Next.js Journey',
  shortTitle: 'Next.js',
  description:
      'A practical Next.js journey from routing and rendering fundamentals to data fetching, mutations, performance, deployment, and production app architecture.',
  level: 'React to production',
  duration: '30–40 hours',
  modules: [
    {
      id: 'next-foundations',
      title: 'Next.js Foundations',
      lessons: [
        ['nextjs-introduction', 'Introduction to Next.js'],
        ['nextjs-project-setup', 'Project Setup and App Structure'],
        ['nextjs-routing', 'File-based Routing'],
        ['nextjs-layouts', 'Layouts and Nested Layouts']
      ]
    },
    {
      id: 'rendering-model',
      title: 'Rendering and Components',
      lessons: [
        ['server-components', 'Server Components'],
        ['client-components', 'Client Components'],
        ['suspense-loading', 'Suspense and Loading UI'],
        ['error-boundaries', 'Error Boundaries and Not Found Pages']
      ]
    },
    {
      id: 'data-layer',
      title: 'Data Fetching and Caching',
      lessons: [
        ['data-fetching', 'Data Fetching in Next.js'],
        ['server-actions', 'Server Actions'],
        ['route-handlers', 'Route Handlers and APIs'],
        ['caching-revalidation', 'Caching and Revalidation']
      ]
    },
    {
      id: 'production-features',
      title: 'Production Features',
      lessons: [
        ['metadata-seo', 'Metadata and SEO'],
        ['images-fonts', 'Images and Fonts'],
        ['forms-validation', 'Forms and Validation'],
        ['authentication', 'Authentication and Authorization']
      ]
    },
    {
      id: 'shipping',
      title: 'Performance and Shipping',
      lessons: [
        ['performance-optimization', 'Performance Optimization'],
        ['testing-next-apps', 'Testing Next.js Apps'],
        ['deployment-vercel', 'Deployment to Vercel'],
        ['nextjs-capstone', 'Next.js Production Capstone']
      ]
    }
  ]
};
