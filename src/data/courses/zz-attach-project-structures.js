(function () {
const courses = window.ACADEMY_COURSES || {};
const attach = (courseId, slug, title) => {
  const course = courses[courseId];
  if (!course) return;
  const titleAr = {
    'python-ai': 'بنية مشروع بايثون والذكاء الاصطناعي',
    'firebase-google-cloud': 'بنية مشروع فايربيس وجوجل كلاود',
    projects: 'بنية مشروع متكامل'
  }[courseId] || title;
  for (const module of course.modules) {
    const lesson = module.lessons.find(item => item[0] === slug);
    if (lesson) {
      lesson[2] = {
        ...(lesson[2] || {}),
        kind: 'project-structure',
        structureId: courseId,
        titleAr
      };
      return;
    }
  }
  const target =
      course.modules.find(
          module => /architecture|project|foundation/i.test(module.title)) ||
      course.modules[0];
  target.lessons.push([
    slug, title, {
      kind: 'project-structure',
      structureId: courseId,
      titleAr,
      duration: '55 min',
      difficulty: 'Beginner to professional',
      prerequisites: 'Basic course foundations'
    }
  ]);
};

courses.react.experiences = [[
  'project-structure', 'Interactive React Project Structure', {
    kind: 'project-structure',
    structureId: 'react',
    moduleId: 'react-enterprise',
    moduleTitle: 'Enterprise Architecture'
  }
]];
attach('nextjs', 'nextjs-project-setup', 'Next.js Project Structure');
attach(
    'java-essentials', 'packages-project-structure', 'Java Project Structure');
attach('spring-boot', 'project-structure', 'Spring Boot Project Structure');
attach(
    'python-ai', 'python-project-structure', 'Python & AI Project Structure');
attach(
    'firebase-google-cloud', 'firebase-project-structure',
    'Firebase & Google Cloud Project Structure');
attach(
    'projects', 'full-stack-project-structure', 'Full-Stack Project Structure');
})();
