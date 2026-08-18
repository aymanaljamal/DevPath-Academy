window.ACADEMY_RELATIONSHIPS = [
  {
    source: 'java-essentials',
    target: 'sql',
    type: 'RECOMMENDED_AFTER',
    titleEn: 'Persist Java objects',
    titleAr: 'حفظ كائنات Java',
    reasonEn: 'SQL turns Java domain objects into durable relational rows.',
    reasonAr: 'تساعد SQL على حفظ كائنات Java كصفوف علائقية دائمة.'
  },
  {
    source: 'sql',
    target: 'spring-boot',
    type: 'PREREQUISITE',
    titleEn: 'Model data before JPA',
    titleAr: 'نمذجة البيانات قبل JPA',
    reasonEn:
        'Keys, joins, constraints, and transactions explain what Spring Data JPA generates.',
    reasonAr:
        'تفسّر المفاتيح والربط والقيود والمعاملات ما تولّده Spring Data JPA.'
  },
  {
    source: 'spring-boot',
    target: 'database-optimization',
    type: 'CONTINUATION',
    titleEn: 'Optimize generated SQL',
    titleAr: 'تحسين SQL المولّدة',
    reasonEn:
        'Inspect JPA queries, N+1 behavior, pagination, pooling, and repository indexes.',
    reasonAr:
        'افحص استعلامات JPA ومشكلة N+1 والتقسيم وتجميع الاتصالات والفهارس.'
  },
  {
    source: 'spring-boot',
    target: 'postman',
    type: 'PRACTICAL_APPLICATION',
    titleEn: 'Verify API contracts',
    titleAr: 'التحقق من عقود API',
    reasonEn:
        'Postman turns Spring controllers, validation, authentication, and errors into repeatable API tests.',
    reasonAr:
        'يحوّل Postman وحدات تحكم Spring والتحقق والمصادقة والأخطاء إلى اختبارات API قابلة للتكرار.'
  },
  {
    source: 'postman',
    target: 'spring-boot',
    type: 'RELATED_CONCEPT',
    titleEn: 'Test a production API',
    titleAr: 'اختبار API إنتاجي',
    reasonEn:
        'Use collections, environments, scripts, and Newman against the Spring Boot capstone.',
    reasonAr:
        'استخدم Collections والبيئات والسكريبتات وNewman مع مشروع Spring Boot النهائي.'
  },
  {
    source: 'sql',
    target: 'database-optimization',
    type: 'CONTINUATION',
    titleEn: 'From correct queries to efficient queries',
    titleAr: 'من الاستعلام الصحيح إلى السريع',
    reasonEn: 'Execution plans and indexes build directly on SQL query design.',
    reasonAr: 'تعتمد خطط التنفيذ والفهارس مباشرة على تصميم استعلامات SQL.'
  },
  {
    source: 'react',
    target: 'spring-boot',
    type: 'PRACTICAL_APPLICATION',
    titleEn: 'Consume REST data',
    titleAr: 'استهلاك بيانات REST',
    reasonEn:
        'React loading, forms, errors, authentication, and pagination depend on API contracts.',
    reasonAr:
        'تعتمد حالات التحميل والنماذج والأخطاء والمصادقة والتقسيم على عقود API.'
  },
  {
    source: 'react',
    target: 'nextjs',
    type: 'CONTINUATION',
    titleEn: 'Move from React to Next.js',
    titleAr: 'الانتقال من React إلى Next.js',
    reasonEn:
        'Next.js extends React with routing, server rendering, data fetching, and deployment primitives.',
    reasonAr:
        'توسّع Next.js React عبر التوجيه والعرض من الخادم وجلب البيانات وأساسيات النشر.'
  },
  {
    source: 'projects',
    target: 'sql',
    type: 'USED_IN_PROJECT',
    titleEn: 'Course Management System',
    titleAr: 'نظام إدارة الدورات',
    reasonEn:
        'Design the schema, query it, expose it through Spring, and optimize measured bottlenecks.',
    reasonAr:
        'صمّم المخطط واستعلم عنه واعرضه عبر Spring ثم حسّن الاختناقات المقاسة.'
  },
  {
    source: 'react',
    target: 'firebase-google-cloud',
    type: 'PRACTICAL_APPLICATION',
    titleEn: 'Ship a React application',
    titleAr: 'نشر تطبيق React',
    reasonEn:
        'Firebase adds authentication, managed data, hosting, messaging, and observability to React applications.',
    reasonAr:
        'تضيف Firebase المصادقة والبيانات المُدارة والاستضافة والإشعارات والمراقبة لتطبيقات React.'
  },
  {
    source: 'spring-boot',
    target: 'firebase-google-cloud',
    type: 'RECOMMENDED_AFTER',
    titleEn: 'Deploy Spring Boot to Cloud Run',
    titleAr: 'نشر Spring Boot على Cloud Run',
    reasonEn:
        'Containerize a Spring API and operate it with Google Cloud IAM and monitoring.',
    reasonAr:
        'حوّل Spring API إلى حاوية وشغّله باستخدام IAM والمراقبة في Google Cloud.'
  },
  {
    source: 'python-ai',
    target: 'firebase-google-cloud',
    type: 'PRACTICAL_APPLICATION',
    titleEn: 'Deploy AI services',
    titleAr: 'نشر خدمات الذكاء الاصطناعي',
    reasonEn:
        'Cloud Run, Storage, Pub/Sub, and monitoring provide production boundaries for AI inference.',
    reasonAr:
        'توفر Cloud Run وStorage وPub/Sub والمراقبة بيئة إنتاج لاستدلال الذكاء الاصطناعي.'
  }
];
