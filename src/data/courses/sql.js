window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES.sql = {
  schemaVersion:1, source:'static', id:'sql', slug:'sql', icon:'SQL', color:'#0891b2', category:'database',
  title:'SQL', titleAr:'لغة SQL', shortTitle:'SQL', shortTitleAr:'SQL',
  description:'Learn relational data modeling and practical PostgreSQL from first table to secure, transactional applications.',
  descriptionAr:'تعلّم نمذجة البيانات العلائقية وPostgreSQL عمليًا من أول جدول حتى التطبيقات الآمنة والمعاملات.',
  level:'Beginner to intermediate', duration:'35–45 hours',
  modules:[
    {id:'foundations',title:'Database Foundations',titleAr:'أساسيات قواعد البيانات',lessons:[['database-introduction','Introduction to Databases',{titleAr:'مقدمة إلى قواعد البيانات'}],['relational-concepts','Relational Database Concepts',{titleAr:'مفاهيم قواعد البيانات العلائقية'}],['tables-rows-columns','Tables, Rows, and Columns',{titleAr:'الجداول والصفوف والأعمدة'}],['data-types','SQL Data Types',{titleAr:'أنواع البيانات في SQL'}],['primary-foreign-keys','Primary and Foreign Keys',{titleAr:'المفاتيح الأساسية والخارجية'}]]},
    {id:'definition-mutation',title:'Defining and Changing Data',titleAr:'تعريف البيانات وتغييرها',lessons:[['create-alter-drop','CREATE, ALTER, and DROP',{titleAr:'أوامر CREATE وALTER وDROP'}],['insert-update-delete','INSERT, UPDATE, and DELETE',{titleAr:'أوامر INSERT وUPDATE وDELETE'}],['constraints','Constraints',{titleAr:'القيود'}],['transactions','Transactions',{titleAr:'المعاملات'}]]},
    {id:'querying',title:'Querying Data',titleAr:'الاستعلام عن البيانات',lessons:[['select-statements','SELECT Statements',{titleAr:'جمل SELECT'}],['where-filtering','WHERE and Filtering',{titleAr:'WHERE والتصفية'}],['order-by','ORDER BY',{titleAr:'الترتيب باستخدام ORDER BY'}],['aggregate-functions','Aggregate Functions',{titleAr:'الدوال التجميعية'}],['group-by-having','GROUP BY and HAVING',{titleAr:'GROUP BY وHAVING'}]]},
    {id:'advanced-sql',title:'Advanced SQL',titleAr:'SQL المتقدم',lessons:[['join-types','JOIN Types',{titleAr:'أنواع JOIN'}],['subqueries','Subqueries',{titleAr:'الاستعلامات الفرعية'}],['views','Views',{titleAr:'العروض Views'}],['indexes','Indexes',{titleAr:'الفهارس'}],['stored-procedures','Stored Procedures',{titleAr:'الإجراءات المخزنة'}]]},
    {id:'production-project',title:'Production SQL',titleAr:'SQL للإنتاج',lessons:[['database-security','Database Security',{titleAr:'أمان قواعد البيانات'}],['postgresql-project','PostgreSQL Practical Project',{titleAr:'مشروع PostgreSQL عملي',kind:'project'}],['sql-review','SQL Course Review',{titleAr:'مراجعة مسار SQL',kind:'review'}],['sql-assessment','SQL Final Assessment',{titleAr:'التقييم النهائي لمسار SQL',kind:'assessment'}]]}
  ]
};
