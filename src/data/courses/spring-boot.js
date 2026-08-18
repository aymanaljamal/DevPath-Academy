window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};
window.ACADEMY_COURSES['spring-boot'] = {
  id: 'spring-boot',
  slug: 'spring-boot',
  icon: 'S',
  color: '#45a33d',
  title: 'Spring & Spring Boot',
  shortTitle: 'Spring Boot',
  description:
      'Master Spring Core, production REST APIs, persistence, security, messaging, microservices, testing, deployment, and operations.',
  level: 'Foundation to production',
  duration: '80–100 hours',
  modules: [
    {
      id: 'spring-core',
      title: 'Spring Framework Core',
      lessons: [
        ['spring-introduction', 'Introduction to Spring'],
        ['spring-architecture', 'Spring Framework Architecture'],
        ['inversion-control', 'Inversion of Control'],
        ['dependency-injection', 'Dependency Injection'],
        ['beans-lifecycle', 'Beans and Bean Lifecycle'],
        ['application-context', 'ApplicationContext'],
        ['component-scanning', 'Component Scanning'],
        ['spring-annotations', 'Spring Annotations'],
        ['java-configuration', 'Java-Based Configuration'],
        ['aop', 'Aspect-Oriented Programming'],
        ['application-events', 'Application Events']
      ]
    },
    {
      id: 'boot-foundations',
      title: 'Spring Boot Foundations',
      lessons: [
        ['boot-introduction', 'Spring Boot Introduction'],
        ['spring-initializr', 'Creating a Project with Spring Initializr'],
        ['project-structure', 'Spring Boot Project Structure'],
        ['maven-dependencies', 'Maven Dependencies'],
        ['first-application', 'Running the First Application'],
        [
          'application-properties', 'application.properties and application.yml'
        ],
        ['profiles-environment', 'Profiles and Environment Configuration'],
        ['logging', 'Logging']
      ]
    },
    {
      id: 'web-rest',
      title: 'Spring MVC and REST APIs',
      lessons: [
        ['spring-mvc', 'Spring MVC'], ['controllers', 'Controllers'],
        ['request-mapping', 'Request Mapping'],
        ['request-parameters', 'Request Parameters and Path Variables'],
        ['request-response', 'Request and Response Bodies'], ['dtos', 'DTOs'],
        ['rest-api', 'REST API Development'],
        ['http-methods-status', 'HTTP Methods and Status Codes'],
        ['validation', 'Validation'],
        ['global-exceptions', 'Global Exception Handling']
      ]
    },
    {
      id: 'data-persistence',
      title: 'Data and Persistence',
      lessons: [
        ['spring-data-jpa', 'Spring Data JPA'], ['entities', 'Entities'],
        ['entity-relationships', 'Entity Relationships'],
        ['repositories', 'Repositories'], ['jpql', 'JPQL'],
        ['native-queries', 'Native Queries'],
        ['pagination-sorting', 'Pagination and Sorting'],
        ['transactions', 'Transactions'],
        ['postgresql-mysql', 'PostgreSQL and MySQL Integration'],
        ['database-migrations', 'Database Migrations with Flyway and Liquibase']
      ]
    },
    {
      id: 'security',
      title: 'Application Security',
      lessons: [
        ['security-introduction', 'Spring Security'],
        ['authentication-authorization', 'Authentication and Authorization'],
        ['jwt-authentication', 'JWT Authentication'],
        ['role-based-access', 'Role-Based Access Control'],
        ['cors-csrf', 'CORS and CSRF'], ['oauth2', 'OAuth2']
      ]
    },
    {
      id: 'application-services',
      title: 'Application Services',
      lessons: [
        ['file-transfer', 'File Upload and Download'],
        ['email-services', 'Email Services'], ['scheduling', 'Scheduling'],
        ['caching', 'Caching'], ['async-processing', 'Async Processing'],
        ['websocket', 'WebSocket'],
        ['webflux', 'Reactive APIs with Spring WebFlux'],
        ['graphql', 'GraphQL with Spring'],
        ['spring-batch', 'Batch Processing'],
        ['swagger-openapi', 'API Documentation with Swagger/OpenAPI']
      ]
    },
    {
      id: 'testing',
      title: 'Testing Spring Applications',
      lessons: [
        ['service-testing', 'Testing Services'],
        ['controller-testing', 'Testing Controllers'],
        ['integration-testing', 'Integration Testing'],
        ['testcontainers', 'Database Testing with Testcontainers']
      ]
    },
    {
      id: 'delivery-operations',
      title: 'Delivery and Operations',
      lessons: [
        ['dockerizing', 'Dockerizing Spring Boot'],
        ['deployment', 'Spring Boot Deployment'],
        ['actuator', 'Monitoring with Actuator'],
        ['observability', 'Observability with Micrometer'],
        ['secrets-configuration', 'Secrets and Secure Configuration'],
        ['rate-limiting', 'Rate Limiting'],
        ['production-best-practices', 'Production Best Practices']
      ]
    },
    {
      id: 'microservices',
      title: 'Microservices and Spring Cloud',
      lessons: [
        ['microservices-introduction', 'Microservices Introduction'],
        ['spring-cloud', 'Spring Cloud Basics'], ['api-gateway', 'API Gateway'],
        ['service-discovery', 'Service Discovery'],
        ['configuration-server', 'Configuration Server'],
        ['feign-client', 'Feign Client'], ['resilience4j', 'Resilience4j'],
        ['rabbitmq-kafka', 'Messaging with RabbitMQ and Kafka']
      ]
    },
    {
      id: 'spring-capstone',
      title: 'Architecture and Production API Capstone',
      lessons: [
        ['modular-monolith', 'Modular Monolith Architecture'],
        ['clean-architecture', 'Clean Architecture for Spring Boot'],
        ['final-rest-api', 'Final Production REST API Project']
      ]
    }
  ]
};
