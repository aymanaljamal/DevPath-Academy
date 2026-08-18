window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES.projects = {
  id: 'projects',
  slug: 'projects',
  icon: 'P',
  color: '#8b5cf6',
  title: 'Projects',
  shortTitle: 'Projects',
  level: 'Applied learning',
  duration: 'Self-paced',
  description:
      'Connect the frontend and backend paths through practical, portfolio-ready builds.',
  modules: [
    {
      id: 'guided-projects',
      title: 'Guided Projects',
      lessons: [
        ['task-api', 'Task Manager REST API'],
        ['react-dashboard', 'React API Dashboard']
      ]
    },
    {
      id: 'capstones',
      title: 'Capstone Projects',
      lessons: [
        ['full-stack-learning-app', 'Full-Stack Learning Tracker'],
        ['production-checklist', 'Production Readiness Checklist']
      ]
    }
  ]
};
