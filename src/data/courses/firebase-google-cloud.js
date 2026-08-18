window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES['firebase-google-cloud'] = {
  schemaVersion: 1,
  source: 'static',
  id: 'firebase-google-cloud',
  slug: 'firebase-google-cloud',
  icon: 'G',
  color: '#f9ab00',
  category: 'cloud',
  title: 'Firebase & Google Cloud Services',
  titleAr: 'فايربيس وخدمات جوجل السحابية',
  shortTitle: 'Firebase & GCP',
  shortTitleAr: 'فايربيس وجوجل كلاود',
  description:
      'Build, secure, deploy, observe, and scale modern applications with Firebase and foundational Google Cloud services.',
  descriptionAr:
      'ابنِ التطبيقات الحديثة وأمّنها وانشرها وراقبها ووسّعها باستخدام Firebase وخدمات Google Cloud الأساسية.',
  level: 'Beginner to advanced',
  duration: '55–75 hours',
  modules: [
    {
      id: 'cloud-foundations',
      title: 'Cloud and Firebase Foundations',
      titleAr: 'أساسيات السحابة وفايربيس',
      lessons: [
        [
          'cloud-service-models',
          'Cloud Service Models and Shared Responsibility',
          {titleAr: 'نماذج الخدمات السحابية والمسؤولية المشتركة'}
        ],
        [
          'firebase-vs-google-cloud', 'Firebase vs Google Cloud',
          {titleAr: 'الفرق بين Firebase وGoogle Cloud'}
        ],
        [
          'projects-billing-iam',
          'Projects, Billing, IAM, and Resource Hierarchy',
          {titleAr: 'المشاريع والفوترة وIAM وتسلسل الموارد'}
        ],
        [
          'firebase-web-setup', 'Firebase Web Setup and SDKs',
          {titleAr: 'إعداد Firebase للويب وحزم SDK'}
        ],
        [
          'local-emulator-suite', 'Local Emulator Suite',
          {titleAr: 'حزمة المحاكيات المحلية'}
        ]
      ]
    },
    {
      id: 'firebase-build',
      title: 'Build with Firebase',
      titleAr: 'البناء باستخدام فايربيس',
      lessons: [
        [
          'firebase-authentication', 'Firebase Authentication',
          {titleAr: 'المصادقة في Firebase'}
        ],
        [
          'auth-providers-sessions', 'Identity Providers, Tokens, and Sessions',
          {titleAr: 'مزودو الهوية والرموز والجلسات'}
        ],
        [
          'cloud-firestore-modeling', 'Cloud Firestore Data Modeling',
          {titleAr: 'نمذجة بيانات Cloud Firestore'}
        ],
        [
          'firestore-queries-indexes', 'Firestore Queries and Indexes',
          {titleAr: 'استعلامات وفهارس Firestore'}
        ],
        [
          'firestore-transactions', 'Firestore Transactions and Batched Writes',
          {titleAr: 'معاملات Firestore والكتابة المجمعة'}
        ],
        [
          'security-rules', 'Firebase Security Rules',
          {titleAr: 'قواعد أمان Firebase'}
        ],
        [
          'cloud-storage-firebase', 'Cloud Storage for Firebase',
          {titleAr: 'التخزين السحابي في Firebase'}
        ],
        [
          'realtime-database', 'Realtime Database and Presence',
          {titleAr: 'قاعدة البيانات الآنية وحالة الاتصال'}
        ],
        [
          'firebase-cloud-messaging', 'Firebase Cloud Messaging',
          {titleAr: 'الإشعارات باستخدام Firebase Cloud Messaging'}
        ]
      ]
    },
    {
      id: 'serverless-delivery',
      title: 'Serverless and Delivery',
      titleAr: 'الخدمات بدون خادم والنشر',
      lessons: [
        [
          'cloud-functions-firebase', 'Cloud Functions for Firebase',
          {titleAr: 'Cloud Functions for Firebase'}
        ],
        [
          'event-driven-functions', 'Event-Driven Functions',
          {titleAr: 'الدوال المعتمدة على الأحداث'}
        ],
        ['firebase-hosting', 'Firebase Hosting', {titleAr: 'استضافة Firebase'}],
        [
          'app-hosting', 'Firebase App Hosting',
          {titleAr: 'استضافة تطبيقات Firebase'}
        ],
        [
          'remote-config', 'Remote Config and Feature Flags',
          {titleAr: 'Remote Config وأعلام الميزات'}
        ],
        [
          'app-check', 'Firebase App Check',
          {titleAr: 'حماية التطبيقات باستخدام App Check'}
        ]
      ]
    },
    {
      id: 'quality-observability',
      title: 'Quality, Analytics, and Operations',
      titleAr: 'الجودة والتحليلات والتشغيل',
      lessons: [
        [
          'analytics', 'Google Analytics for Firebase',
          {titleAr: 'إحصاءات Google في Firebase'}
        ],
        [
          'crashlytics', 'Crashlytics',
          {titleAr: 'تتبع الأعطال باستخدام Crashlytics'}
        ],
        [
          'performance-monitoring-firebase', 'Firebase Performance Monitoring',
          {titleAr: 'مراقبة الأداء في Firebase'}
        ],
        [
          'testing-lab', 'Firebase Test Lab', {titleAr: 'مختبر اختبار Firebase'}
        ],
        [
          'costs-quotas', 'Pricing, Quotas, Budgets, and Cost Control',
          {titleAr: 'التسعير والحصص والميزانيات وضبط التكلفة'}
        ],
        [
          'backup-recovery', 'Backups, Recovery, and Data Lifecycle',
          {titleAr: 'النسخ الاحتياطي والاستعادة ودورة حياة البيانات'}
        ]
      ]
    },
    {
      id: 'google-cloud-core',
      title: 'Google Cloud Core Services',
      titleAr: 'خدمات Google Cloud الأساسية',
      lessons: [
        [
          'cloud-run', 'Cloud Run Containers',
          {titleAr: 'الحاويات باستخدام Cloud Run'}
        ],
        [
          'cloud-storage-gcp', 'Google Cloud Storage',
          {titleAr: 'Google Cloud Storage'}
        ],
        ['cloud-sql', 'Cloud SQL', {titleAr: 'Cloud SQL'}],
        ['pub-sub', 'Pub/Sub Messaging', {titleAr: 'الرسائل باستخدام Pub/Sub'}],
        ['secret-manager', 'Secret Manager', {titleAr: 'إدارة الأسرار'}],
        [
          'cloud-logging-monitoring', 'Cloud Logging and Monitoring',
          {titleAr: 'التسجيل والمراقبة السحابية'}
        ],
        [
          'vpc-networking', 'VPC and Networking Fundamentals',
          {titleAr: 'أساسيات VPC والشبكات'}
        ],
        [
          'iam-service-accounts', 'IAM and Service Accounts',
          {titleAr: 'IAM وحسابات الخدمة'}
        ]
      ]
    },
    {
      id: 'architecture-security',
      title: 'Architecture and Security',
      titleAr: 'الهندسة والأمان',
      lessons: [
        [
          'firebase-gcp-architecture', 'Firebase and Google Cloud Architecture',
          {titleAr: 'هندسة Firebase وGoogle Cloud'}
        ],
        [
          'least-privilege', 'Least Privilege and Credential Safety',
          {titleAr: 'أقل صلاحية وأمان بيانات الاعتماد'}
        ],
        [
          'multi-environment',
          'Development, Staging, and Production Environments',
          {titleAr: 'بيئات التطوير والاختبار والإنتاج'}
        ],
        [
          'ci-cd-google-cloud', 'CI/CD with Google Cloud',
          {titleAr: 'التكامل والنشر المستمران مع Google Cloud'}
        ],
        [
          'migration-portability', 'Migration, Portability, and Vendor Lock-In',
          {titleAr: 'الترحيل وقابلية النقل والارتباط بالمزود'}
        ],
        [
          'reliability-design', 'Reliability, Regions, and Failure Design',
          {titleAr: 'الاعتمادية والمناطق وتصميم الفشل'}
        ]
      ]
    },
    {
      id: 'cloud-projects',
      title: 'Practical Cloud Projects',
      titleAr: 'مشاريع سحابية عملية',
      lessons: [
        [
          'react-firebase-app', 'React and Firebase Application',
          {titleAr: 'تطبيق React وFirebase', kind: 'project'}
        ],
        [
          'spring-cloud-run-api', 'Spring Boot API on Cloud Run',
          {titleAr: 'نشر Spring Boot API على Cloud Run', kind: 'project'}
        ],
        [
          'event-driven-project', 'Event-Driven Media Processing Project',
          {titleAr: 'مشروع معالجة وسائط معتمد على الأحداث', kind: 'project'}
        ],
        [
          'firebase-google-cloud-capstone',
          'Firebase and Google Cloud Capstone',
          {titleAr: 'مشروع Firebase وGoogle Cloud النهائي', kind: 'project'}
        ],
        [
          'cloud-review', 'Firebase and Google Cloud Review',
          {titleAr: 'مراجعة Firebase وGoogle Cloud', kind: 'review'}
        ],
        [
          'cloud-assessment', 'Firebase and Google Cloud Assessment',
          {titleAr: 'تقييم Firebase وGoogle Cloud', kind: 'assessment'}
        ]
      ]
    }
  ]
};
