(function () {
  const {lower, escString} = window.DevPathLessonContent;
  window.ACADEMY_LESSON_SPECS = window.ACADEMY_LESSON_SPECS || {};
  const firebaseExamples = title => {
  const t = lower(title);
  if (/^google cloud storage$/.test(t))
    return [
      [
        'Upload with generation precondition',
        'Prevent an accidental overwrite by requiring that no live object exists.',
        `await storage.bucket(bucket).upload("course.pdf", { destination:"exports/course.pdf", preconditionOpts:{ ifGenerationMatch:0 } });`,
        'Upload succeeds once or fails its generation precondition'
      ],
      [
        'Apply object lifecycle',
        'Move old exports to a colder storage class before deletion.',
        `{ "rule": [{ "action":{"type":"SetStorageClass","storageClass":"COLDLINE"}, "condition":{"age":30,"matchesPrefix":["exports/"]} }] }`,
        'Exports older than thirty days transition to Coldline'
      ]
    ];
  if (/^pub\/sub messaging$/.test(t))
    return [
      [
        'Publish a versioned event',
        'Send machine-readable data plus attributes for routing and evolution.',
        `const data = Buffer.from(JSON.stringify({ courseId:42, version:1 }));\nconst messageId = await pubsub.topic("course-published").publishMessage({ data, attributes:{ eventType:"CoursePublished" } });\nconsole.log(messageId);`,
        'A Pub/Sub message identifier'
      ],
      [
        'Acknowledge after durable work',
        'Throw before ack so transient failures are retried.',
        `subscription.on("message", async message => {\n  try { await projector.apply(JSON.parse(message.data)); message.ack(); }\n  catch (error) { console.error(error); message.nack(); }\n});`,
        'Successful work is acknowledged; failures are redelivered'
      ]
    ];
  if (/^cloud logging and monitoring$/.test(t))
    return [
      [
        'Write a structured Cloud log',
        'Attach severity, trace, and stable resource identifiers.',
        `console.log(JSON.stringify({ severity:"ERROR", message:"publish failed", courseId:42, trace:process.env.TRACE_ID }));`,
        'A filterable error log entry'
      ],
      [
        'Metric and alert contract',
        'Alert on a sustained ratio with enough traffic to be meaningful.',
        `fetch_cloud_run_request_count(status_class="5xx") / fetch_cloud_run_request_count(all) > 0.01\nfor: 10 minutes\nminimum_requests: 100`,
        'Alert after sustained error-rate breach'
      ]
    ];
  if (/^projects, billing, iam, and resource hierarchy$/.test(t))
    return [
      [
        'Place projects under governance',
        'Create separate workload projects beneath the intended folder and billing account.',
        `Organization\n└─ Learning Platform folder\n   ├─ academy-dev project\n   ├─ academy-staging project\n   └─ academy-prod project`,
        'Environment-isolated resource hierarchy'
      ],
      [
        'Attach billing explicitly',
        'Link a project and enable only required services.',
        `gcloud billing projects link academy-staging --billing-account=BILLING_ACCOUNT\ngcloud services enable run.googleapis.com firestore.googleapis.com --project=academy-staging`,
        'A billed staging project with two APIs enabled'
      ]
    ];
  if (/^least privilege and credential safety$/.test(t))
    return [
      [
        'Custom role from observed needs',
        'Grant only actions the worker actually performs.',
        `title: Academy thumbnail worker\nincludedPermissions:\n  - storage.objects.get\n  - storage.objects.create\n  - logging.logEntries.create`,
        'A narrow custom role definition'
      ],
      [
        'Eliminate service-account keys',
        'Use workload identity or impersonation for short-lived credentials.',
        `gcloud auth print-access-token --impersonate-service-account=thumbnail-worker@PROJECT_ID.iam.gserviceaccount.com`,
        'A short-lived access token without a downloaded key file'
      ]
    ];
  if (/^spring boot api on cloud run$/.test(t))
    return [
      [
        'Build a Spring Boot container',
        'Use the Spring Boot build-image goal and publish the immutable artifact.',
        `./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=europe-west1-docker.pkg.dev/PROJECT/apps/academy-api:REVISION\ndocker push europe-west1-docker.pkg.dev/PROJECT/apps/academy-api:REVISION`,
        'A pushed OCI image'
      ],
      [
        'Deploy with database and health configuration',
        'Bind secrets and limit initial capacity deliberately.',
        `gcloud run deploy academy-api --image=IMAGE --region=europe-west1 \\\n  --set-secrets=DB_PASSWORD=db-password:latest \\\n  --min-instances=0 --max-instances=10 --concurrency=40`,
        'A bounded Cloud Run revision'
      ]
    ];
  if (/^event-driven media processing project$/.test(t))
    return [
      [
        'Event envelope and idempotency',
        'Persist processing status by object generation so replacements are distinct.',
        `const jobId = event.data.bucket + ":" + event.data.name + ":" + event.data.generation;\nawait firestore.runTransaction(async tx => {\n  const ref = firestore.doc("mediaJobs/" + jobId);\n  if ((await tx.get(ref)).exists) return;\n  tx.create(ref,{status:"PROCESSING",createdAt:FieldValue.serverTimestamp()});\n});`,
        'One job per immutable object generation'
      ],
      [
        'Failure routing',
        'Publish irrecoverable failures with diagnostic context, not file bytes.',
        `await deadLetterTopic.publishMessage({ data:Buffer.from(JSON.stringify({ jobId, code:error.code })), attributes:{ source:"media-worker" } });`,
        'A small dead-letter diagnostic event'
      ]
    ];
  if (/web setup|sdk/.test(t))
    return [
      [
        'Initialize modular SDKs',
        'Create one app and derive service clients from it.',
        `import { initializeApp } from "firebase/app";\nimport { getAuth } from "firebase/auth";\nimport { getFirestore } from "firebase/firestore";\nconst app = initializeApp(firebaseConfig);\nexport const auth = getAuth(app);\nexport const db = getFirestore(app);`,
        'Configured Auth and Firestore clients'
      ],
      [
        'Connect only in local development',
        'Point SDK calls at emulators before making service requests.',
        `import { connectAuthEmulator } from "firebase/auth";\nimport { connectFirestoreEmulator } from "firebase/firestore";\nif (location.hostname === "localhost") {\n  connectAuthEmulator(auth, "http://127.0.0.1:9099");\n  connectFirestoreEmulator(db, "127.0.0.1", 8080);\n}`,
        'Local calls stay inside the Emulator Suite'
      ]
    ];
  if (/emulator/.test(t))
    return [
      [
        'Declare emulator ports', 'Keep ports stable for scripts and CI.',
        `{\n  "emulators": {\n    "auth": { "port": 9099 },\n    "firestore": { "port": 8080 },\n    "ui": { "enabled": true, "port": 4000 }\n  }\n}`,
        'firebase.json emulator configuration'
      ],
      [
        'Run isolated tests',
        'Import seed data, execute tests, and stop emulators afterward.',
        `firebase emulators:exec --project demo-academy \\\n  --import=./test-data \\\n  "npm test"`,
        'Test exit code propagated by emulators:exec'
      ]
    ];
  if (/firebase authentication/.test(t))
    return [
      [
        'Email sign-in',
        'Handle the asynchronous credential result and avoid storing the password.',
        `import { signInWithEmailAndPassword } from "firebase/auth";\nconst credential = await signInWithEmailAndPassword(auth, email, password);\nconsole.log(credential.user.uid);`,
        'The authenticated user UID'
      ],
      [
        'Observe session changes',
        'Drive UI state from the SDK observer rather than assuming persistence timing.',
        `import { onAuthStateChanged } from "firebase/auth";\nconst unsubscribe = onAuthStateChanged(auth, user => {\n  renderSession(user ? { uid: user.uid } : null);\n});`,
        'UI updates on sign-in, refresh, and sign-out'
      ]
    ];
  if (/provider|token|session/.test(t))
    return [
      [
        'Verify an ID token on the server',
        'The Admin SDK checks signature, audience, issuer, and expiry.',
        `const header = request.headers.authorization || "";\nconst idToken = header.startsWith("Bearer ") ? header.slice(7) : "";\nconst decoded = await getAuth().verifyIdToken(idToken);\nconsole.log(decoded.uid);`,
        'A verified UID or a rejected request'
      ],
      [
        'Use custom claims for coarse roles',
        'Set claims from a trusted environment and force token refresh before expecting clients to see them.',
        `await getAuth().setCustomUserClaims(uid, { instructor: true });\n// Client: await auth.currentUser.getIdToken(true);`,
        'Future ID tokens include instructor=true'
      ]
    ];
  if (/firestore data modeling/.test(t))
    return [
      [
        'Document and subcollection model',
        'Keep bounded course metadata in one document and growing lessons in a subcollection.',
        `courses/{courseId}\n  title: "Database Optimization"\n  published: true\ncourses/{courseId}/lessons/{lessonId}\n  title: "B-Tree Indexes"\n  position: 2`,
        'A bounded parent and independently queryable children'
      ],
      [
        'Write a typed document',
        'Use server timestamps for authoritative update time.',
        `import { doc, setDoc, serverTimestamp } from "firebase/firestore";\nawait setDoc(doc(db, "courses", courseId), {\n  title, published: false, updatedAt: serverTimestamp()\n});`,
        'One course document created or replaced'
      ]
    ];
  if (/firestore queries|indexes/.test(t))
    return [
      [
        'Compound query',
        'The equality and ordering shape may require a composite index.',
        `import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";\nconst q = query(collection(db, "lessons"), where("courseId", "==", courseId), where("published", "==", true), orderBy("position"), limit(20));\nconst snapshot = await getDocs(q);`,
        'Up to twenty published lessons in position order'
      ],
      [
        'Cursor pagination',
        'Continue after the last document instead of using offsets.',
        `const next = query(collection(db, "lessons"), orderBy("position"), startAfter(lastVisible), limit(20));\nconst page = await getDocs(next);`,
        'The next page after lastVisible'
      ]
    ];
  if (/firestore transaction|batched/.test(t))
    return [
      [
        'Read-dependent transaction',
        'Retry the function when a concurrent write changes a document read by the transaction.',
        `await runTransaction(db, async transaction => {\n  const ref = doc(db, "courses", courseId);\n  const snapshot = await transaction.get(ref);\n  const count = snapshot.data().enrollmentCount || 0;\n  transaction.update(ref, { enrollmentCount: count + 1 });\n});`,
        'One atomic increment after any required retries'
      ],
      [
        'Atomic write batch',
        'Use a batch when no write depends on a fresh read.',
        `const batch = writeBatch(db);\nbatch.set(doc(db, "progress", progressId), progress);\nbatch.update(doc(db, "courses", courseId), { updatedAt: serverTimestamp() });\nawait batch.commit();`,
        'Both writes commit together'
      ]
    ];
  if (/security rules/.test(t))
    return [
      [
        'Ownership rule',
        'Require authentication and compare the path owner with the token UID.',
        `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /profiles/{userId} {\n      allow read, update: if request.auth != null && request.auth.uid == userId;\n    }\n  }\n}`,
        'Only the owner can read or update the profile'
      ],
      [
        'Validate changed fields',
        'Restrict both identity and the fields a client may modify.',
        `allow update: if request.auth.uid == userId\n  && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['displayName', 'photoUrl'])\n  && request.resource.data.displayName is string;`,
        'Role or billing fields cannot be changed by this rule'
      ]
    ];
  if (/cloud storage/.test(t))
    return [
      [
        'Resumable web upload', 'Attach bounded metadata and observe progress.',
        `const fileRef = ref(storage, "course-media/" + courseId + "/" + file.name);\nconst task = uploadBytesResumable(fileRef, file, { contentType: file.type });\ntask.on("state_changed", snapshot => console.log(snapshot.bytesTransferred / snapshot.totalBytes));`,
        'Progress values followed by a completed upload'
      ],
      [
        'Storage rule checks owner and size',
        'Validate authorization and request metadata before accepting bytes.',
        `match /course-media/{courseId}/{fileName} {\n  allow write: if request.auth != null\n    && request.resource.size < 10 * 1024 * 1024\n    && request.resource.contentType.matches('image/.*');\n}`,
        'Authenticated image uploads under 10 MiB'
      ]
    ];
  if (/realtime database|presence/.test(t))
    return [
      [
        'Connection-aware presence',
        'Queue the disconnect write before announcing online state.',
        `const connected = ref(db, ".info/connected");\nonValue(connected, async snap => {\n  if (!snap.val()) return;\n  const status = ref(db, "status/" + uid);\n  await onDisconnect(status).set({ state: "offline", changedAt: serverTimestamp() });\n  await set(status, { state: "online", changedAt: serverTimestamp() });\n});`,
        'Online now and offline after disconnect'
      ],
      [
        'Listen to a bounded path',
        'Detach listeners when the screen unmounts.',
        `const messages = query(ref(db, "rooms/" + roomId + "/messages"), limitToLast(50));\nconst unsubscribe = onValue(messages, snapshot => render(snapshot.val()));\n// later: unsubscribe();`,
        'At most the latest fifty messages'
      ]
    ];
  if (/cloud messaging/.test(t))
    return [
      [
        'Handle foreground messages',
        'Treat message payload as untrusted display data.',
        `import { onMessage } from "firebase/messaging";\nonMessage(messaging, payload => {\n  showToast({ title: payload.notification?.title || "Update" });\n});`,
        'A foreground notification UI'
      ],
      [
        'Send to a topic from trusted server code',
        'Never embed server credentials in the client.',
        `await getMessaging().send({\n  topic: "course-sql",\n  notification: { title: "New lesson", body: "Window functions is available" },\n  data: { courseId: "sql" }\n});`,
        'A message ID; delivery remains best effort'
      ]
    ];
  if (/function|event-driven|pub\/sub/.test(t))
    return [
      [
        'Idempotent event handler',
        'Use the event ID as a deduplication key before applying side effects.',
        `export const processUpload = onObjectFinalized(async event => {\n  const marker = db.collection("processedEvents").doc(event.id);\n  if ((await marker.get()).exists) return;\n  await createThumbnail(event.data.bucket, event.data.name);\n  await marker.create({ processedAt: FieldValue.serverTimestamp() });\n});`,
        'Duplicate delivery performs no second thumbnail write'
      ],
      [
        'HTTP callable boundary',
        'Validate identity and input before invoking domain work.',
        `export const publishCourse = onCall(async request => {\n  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required");\n  if (typeof request.data.courseId !== "string") throw new HttpsError("invalid-argument", "courseId required");\n  return publish(request.auth.uid, request.data.courseId);\n});`,
        'A structured result or callable HttpsError'
      ]
    ];
  if (/hosting|app hosting/.test(t))
    return [
      [
        'SPA rewrite and headers',
        'Serve static assets directly and route unknown app paths to the shell.',
        `{ "hosting": {\n  "public": "dist",\n  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],\n  "rewrites": [{ "source": "**", "destination": "/index.html" }]\n} }`,
        'A deployable Firebase Hosting configuration'
      ],
      [
        'Preview before release', 'Create an expiring channel for review.',
        `firebase hosting:channel:deploy curriculum-review --expires 7d`,
        'A temporary preview URL'
      ]
    ];
  if (/remote config/.test(t))
    return [
      [
        'Fetch and activate safely',
        'Provide an in-app default before fetching remote values.',
        `remoteConfig.defaultConfig = { newLessonReader: false };\nremoteConfig.settings.minimumFetchIntervalMillis = 3600000;\nawait fetchAndActivate(remoteConfig);\nconst enabled = getBoolean(remoteConfig, "newLessonReader");`,
        'A boolean from activated config or the safe default'
      ],
      [
        'Guard a rollout',
        'Keep old and new behavior behind one evaluated parameter.',
        `if (enabled) renderNewReader(); else renderStableReader();`,
        'One of two explicit reader paths'
      ]
    ];
  if (/app check/.test(t))
    return [
      [
        'Initialize web attestation',
        'Use the provider configured for the deployed app.',
        `const appCheck = initializeAppCheck(app, {\n  provider: new ReCaptchaEnterpriseProvider(siteKey),\n  isTokenAutoRefreshEnabled: true\n});`,
        'App Check tokens accompany supported Firebase requests'
      ],
      [
        'Enforce after observing metrics',
        'Register debug tokens only for local testing, never production source.',
        `// Local environment only\nself.FIREBASE_APPCHECK_DEBUG_TOKEN = true;`,
        'A debug token printed for local registration'
      ]
    ];
  if (/cloud run/.test(t))
    return [
      [
        'Deploy a containerized service',
        'Set region, runtime identity, and unauthenticated policy deliberately.',
        `gcloud run deploy academy-api --source . \\\n  --region=europe-west1 \\\n  --service-account=academy-api@PROJECT_ID.iam.gserviceaccount.com \\\n  --no-allow-unauthenticated`,
        'A revision URL protected by IAM'
      ],
      [
        'Honor the runtime port',
        'Cloud Run injects PORT and sends concurrent HTTP requests.',
        `const port = Number(process.env.PORT || 8080);\nserver.listen(port, "0.0.0.0", () => console.log({ port }));`,
        'Server listens on the injected port'
      ]
    ];
  if (/cloud sql/.test(t))
    return [
      [
        'Bound the connection pool',
        'Pool size must fit instance capacity across all service instances.',
        `const pool = new Pool({\n  max: 10,\n  connectionTimeoutMillis: 3000,\n  idleTimeoutMillis: 30000\n});`,
        'At most ten connections in this process'
      ],
      [
        'Parameterized transaction', 'Keep related relational writes atomic.',
        `const client = await pool.connect();\ntry {\n  await client.query("BEGIN");\n  await client.query("UPDATE courses SET published=$1 WHERE id=$2", [true, courseId]);\n  await client.query("COMMIT");\n} catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }`,
        'Commit or rollback, with the connection released'
      ]
    ];
  if (/secret manager/.test(t))
    return [
      [
        'Access a named secret version',
        'Use Application Default Credentials and decode the returned bytes.',
        `const [version] = await secretClient.accessSecretVersion({\n  name: "projects/" + projectId + "/secrets/db-password/versions/latest"\n});\nconst password = version.payload.data.toString("utf8");`,
        'The latest secret value in memory'
      ],
      [
        'Grant only accessor role',
        'Bind the runtime service account to one secret.',
        `gcloud secrets add-iam-policy-binding db-password \\\n  --member="serviceAccount:academy-api@PROJECT_ID.iam.gserviceaccount.com" \\\n  --role="roles/secretmanager.secretAccessor"`,
        'A least-privilege secret binding'
      ]
    ];
  if (/iam|service account|least privilege/.test(t))
    return [
      [
        'Grant a predefined role at narrow scope',
        'Bind a workload identity to the resource it must access.',
        `gcloud projects add-iam-policy-binding PROJECT_ID \\\n  --member="serviceAccount:academy-worker@PROJECT_ID.iam.gserviceaccount.com" \\\n  --role="roles/pubsub.subscriber"`,
        'The worker may consume subscriptions in the project'
      ],
      [
        'Use impersonation instead of keys',
        'Operators obtain short-lived credentials through an audited grant.',
        `gcloud run services describe academy-api \\\n  --impersonate-service-account=deployer@PROJECT_ID.iam.gserviceaccount.com \\\n  --region=europe-west1`,
        'A read using short-lived impersonated credentials'
      ]
    ];
  if (/logging|monitoring|analytics|crashlytics|performance/.test(t))
    return [
      [
        'Structured event',
        'Emit stable fields so logs can be filtered and joined.',
        `console.log(JSON.stringify({\n  severity: "INFO", event: "course_published", courseId, revision, durationMs\n}));`,
        'One structured log entry'
      ],
      [
        'Actionable alert signal',
        'Record numerator and denominator rather than only an average.',
        `const metrics = { requests: 1000, errors: 17 };\nconst errorRate = metrics.errors / metrics.requests;\nif (errorRate > 0.01) notifyOnCall({ errorRate });`,
        'Alert when the example error rate exceeds 1%'
      ]
    ];
  if (/service model|shared responsibility|firebase vs google cloud/.test(t))
    return [
      [
        'Map responsibility explicitly',
        'Record who owns each control before selecting a managed service.',
        `const responsibility = {\n  runtimePatching: "provider",\n  applicationCode: "team",\n  dataClassification: "team",\n  physicalDatacenter: "provider"\n};\nconsole.table(responsibility);`,
        'A provider-versus-team responsibility map'
      ],
      [
        'Choose by workload',
        'Use Firebase client services for synchronized app features and Google Cloud primitives for controlled backend workloads.',
        `const choice = { userIdentity: "Firebase Authentication", realtimeDocuments: "Cloud Firestore", containerApi: "Cloud Run", relationalData: "Cloud SQL" };\nconsole.table(choice);`,
        'A workload-to-service decision table'
      ]
    ];
  if (/project|billing|resource hierarchy|cost|quota|budget/.test(t))
    return [
      [
        'Set a budget alert',
        'Budgets notify; they do not automatically cap every service.',
        `gcloud billing budgets create \\\n  --billing-account=BILLING_ACCOUNT \\\n  --display-name="academy-monthly" \\\n  --budget-amount=100USD \\\n  --threshold-rule=percent=0.5 \\\n  --threshold-rule=percent=0.9`,
        'Budget notifications at 50% and 90%'
      ],
      [
        'Label resources for attribution',
        'Apply stable environment and owner labels.',
        `gcloud run services update academy-api \\\n  --region=europe-west1 \\\n  --update-labels=environment=staging,team=learning`,
        'Service costs can be grouped by labels'
      ]
    ];
  if (/test lab/.test(t))
    return [
      [
        'Run an Android instrumentation matrix',
        'Choose devices and versions that represent supported users.',
        `gcloud firebase test android run \\\n  --type instrumentation \\\n  --app app-debug.apk \\\n  --test app-debug-androidTest.apk \\\n  --device model=Pixel2,version=30,locale=en,orientation=portrait`,
        'A Test Lab matrix and result URL'
      ],
      [
        'Treat flakes separately',
        'Retry infrastructure failures without hiding deterministic test failures.',
        `const summary = { passed: 48, failed: 1, inconclusive: 1 };\nif (summary.failed > 0) process.exitCode = 1;`,
        'A failing build when an app test fails'
      ]
    ];
  if (/backup|recovery|data lifecycle/.test(t))
    return [
      [
        'Define recovery objectives',
        'RPO limits acceptable data loss; RTO limits restoration time.',
        `const recovery = { service: "course-data", rpoMinutes: 60, rtoMinutes: 240, restoreTestedAt: "2026-08-01" };\nconsole.log(recovery);`,
        'A reviewable recovery contract'
      ],
      [
        'Lifecycle old objects',
        'Move or delete data according to classification and retention.',
        `{ "rule": [{\n  "action": { "type": "Delete" },\n  "condition": { "age": 365, "matchesPrefix": ["exports/"] }\n}] }`,
        'Bucket lifecycle deletes year-old exports'
      ]
    ];
  if (/vpc|network/.test(t))
    return [
      [
        'Create a custom subnet',
        'Choose a non-overlapping private range and regional placement.',
        `gcloud compute networks create academy-vpc --subnet-mode=custom\ngcloud compute networks subnets create app-eu \\\n  --network=academy-vpc --region=europe-west1 --range=10.20.0.0/24`,
        'A custom VPC and regional subnet'
      ],
      [
        'Restrict ingress', 'Permit only the required source and port.',
        `gcloud compute firewall-rules create allow-internal-postgres \\\n  --network=academy-vpc --allow=tcp:5432 --source-ranges=10.20.0.0/24`,
        'PostgreSQL reachable only from the application subnet'
      ]
    ];
  if (/environment|ci\/cd/.test(t))
    return [
      [
        'Separate deploy targets',
        'Use distinct projects so identities, quotas, and data cannot cross accidentally.',
        `firebase use --add\n# aliases: dev -> academy-dev, staging -> academy-staging, prod -> academy-prod\nfirebase deploy --project staging --only firestore:rules,hosting`,
        'A deployment to the staging project only'
      ],
      [
        'Promote an immutable image',
        'Deploy the tested digest instead of rebuilding for production.',
        `gcloud run deploy academy-api \\\n  --image=europe-west1-docker.pkg.dev/PROJECT/apps/academy@sha256:DIGEST \\\n  --region=europe-west1`,
        'Production runs the exact tested container digest'
      ]
    ];
  if (/migration|portability|vendor lock-in/.test(t))
    return [
      [
        'Define a portable domain port',
        'Keep vendor document shapes outside business rules.',
        `export class CourseRepository {\n  async find(id) { throw new Error("port"); }\n  async save(course) { throw new Error("port"); }\n}\n// FirestoreCourseRepository adapts Firestore documents to Course.`,
        'Domain code depends on a repository contract'
      ],
      [
        'Export and verify data',
        'A migration proves row counts and checksums before cutover.',
        `const report = { sourceDocuments: 1200, importedRows: 1200, invalid: 0 };\nif (report.sourceDocuments !== report.importedRows || report.invalid) throw new Error("migration verification failed");`,
        'Cutover proceeds only with verified counts'
      ]
    ];
  if (/architecture|reliability|region|failure design/.test(t))
    return [
      [
        'Document a failure path',
        'Make retry, fallback, and data ownership explicit.',
        `Browser -> Firebase Hosting\nBrowser -> Authentication -> ID token\nBrowser -> Cloud Run API -> Cloud SQL\nCloud Run -> Pub/Sub -> idempotent worker\nFailure: queue retries; dead-letter topic alerts operator`,
        'A service and failure-flow diagram'
      ],
      [
        'Calculate availability dependency',
        'Serial dependencies multiply availability rather than adding it.',
        `const hosting=.9995, api=.999, database=.9995;\nconst endToEnd=hosting*api*database;\nconsole.log((endToEnd*100).toFixed(3)+"%");`,
        'Approximately 99.800%'
      ]
    ];
  if (/react and firebase application|capstone|review|assessment/.test(t))
    return [
      [
        'Integrated emulator test',
        'Exercise authentication, rules, and Firestore through public SDK behavior.',
        `const user = await signInWithEmailAndPassword(auth, "learner@example.test", "test-only-password");\nawait setDoc(doc(db, "progress", user.user.uid + "_lesson-42"), { completed: true });\nconst saved = await getDoc(doc(db, "progress", user.user.uid + "_lesson-42"));\nconsole.assert(saved.data().completed === true);`,
        'Authenticated progress persists in the emulator'
      ],
      [
        'Deployment acceptance gates',
        'Verify rules, tests, budget, rollback, and health before production promotion.',
        `firebase emulators:exec "npm test"\ngcloud builds submit --config cloudbuild.yaml\ngcloud run services describe academy-api --region=europe-west1\n# Record revision, health result, and rollback command.`,
        'Auditable evidence for the release decision'
      ]
    ];
  return null;
};
window.ACADEMY_LESSON_SPECS['firebase-google-cloud'] = {
  ...{
        context: 'Firebase and Google Cloud systems',
        language: 'javascript',
        concepts: [
          [
            /service model|shared responsibility/,
            'Managed cloud services move specific operational duties to the provider, but customers still own data classification, identities, access, configuration, application code, and cost controls'
          ],
          [
            /firebase vs|project|billing|resource hierarchy/,
            'Firebase is a developer-facing product layer backed by Google Cloud projects; organization, folder, project, billing, and IAM boundaries determine ownership and blast radius'
          ],
          [
            /web setup|sdk|emulator/,
            'A Firebase app configuration identifies public project endpoints; SDK initialization creates service clients, while the Emulator Suite supports isolated local integration tests'
          ],
          [
            /authentication|provider|token|session/,
            'Firebase Authentication verifies end users and issues ID tokens; trusted servers verify tokens before applying application authorization'
          ],
          [
            /firestore model|queries|index|transaction|batch/,
            'Cloud Firestore stores documents in collections; query shapes drive indexes, transactions protect read-dependent writes, and batches atomically group writes without reads'
          ],
          [
            /security rule/,
            'Security Rules are server-enforced allow expressions evaluated per request; rules must validate identity, ownership, allowed fields, and resulting data'
          ],
          [
            /storage/,
            'Cloud Storage stores immutable byte objects plus metadata in buckets; authorization, lifecycle, upload validation, and signed access must match data sensitivity'
          ],
          [
            /realtime|presence/,
            'Realtime Database synchronizes a JSON tree to connected clients and supports presence through connection state plus onDisconnect operations'
          ],
          [
            /messaging/,
            'Firebase Cloud Messaging routes notification or data messages to app instances; delivery is not a durable exactly-once work queue'
          ],
          [
            /function|event-driven|pub\/sub/,
            'Event-driven compute must tolerate retries and duplicate delivery by using idempotency keys, atomic state transitions, and observable dead-letter handling'
          ],
          [
            /hosting|app hosting|cloud run/,
            'Managed hosting deploys versioned web or container artifacts behind HTTPS; health, region, concurrency, rollback, and runtime identity shape production behavior'
          ],
          [
            /remote config|feature flag/,
            'Remote Config separates remotely evaluated parameters from releases; safe rollout needs defaults, targeting, activation rules, metrics, and a kill switch'
          ],
          [
            /app check/,
            'App Check attests that requests originate from an authentic app instance; it complements rather than replaces Authentication and authorization rules'
          ],
          [
            /analytics|crashlytics|performance|logging|monitoring/,
            'Telemetry answers different questions: events describe usage, crash reports group failures, traces measure latency, logs retain records, and metrics support alerts'
          ],
          [
            /test lab|cost|quota|budget|backup|recovery|lifecycle/,
            'Cloud operations require tested recovery, quota awareness, cost attribution, retention policy, representative device testing, and alerts that lead to an action'
          ],
          [
            /cloud sql/,
            'Cloud SQL manages a relational engine, backups, patching, and high-availability options while applications still own schema, queries, pooling, and migrations'
          ],
          [
            /secret manager|iam|service account|least privilege/, 'IAM grants principals roles on resources; service accounts identify workloads and Secret Manager stores versioned sensitive values without embedding credentials'
          ],
          [
            /vpc|network/,
            'A VPC is a global private network with regional subnets, routes, firewall policy, DNS, and controlled paths to managed services and the internet'
          ],
          [
            /architecture|environment|ci\/cd|migration|portability|reliability|region|project|review|assessment/,
            'Cloud architecture makes environment isolation, identity, data boundaries, deployment, observability, failure modes, recovery objectives, portability, and cost explicit'
          ]
        ]
      },
  examples: firebaseExamples,
  guidanceRules: [
      [
        /auth|identity|iam|security|secret|app check|privilege/,
        [
          'Authenticate Academy users and workloads, then enforce least-privilege authorization at every managed-service boundary.',
          [
            'Confusing Firebase Authentication with database authorization.',
            'Shipping service-account keys or secrets to browser code.',
            'Assuming App Check blocks an authenticated but unauthorized user.'
          ],
          [
            'Verify ID tokens only on trusted servers.',
            'Test Security Rules with emulators and deny by default.',
            'Prefer workload identity and short-lived credentials over keys.'
          ]
        ]
      ],
      [
        /firestore|realtime|storage|cloud sql|data|backup/,
        [
          'Store Academy documents, presence, objects, or relational facts in the service whose consistency and query model fit.',
          [
            'Modeling Firestore like a normalized SQL database.',
            'Using unbounded arrays or document growth.',
            'Treating an object upload as validated just because it completed.'
          ],
          [
            'Design from read and query patterns.',
            'Use transactions only for read-dependent writes and batches otherwise.',
            'Define retention, backup, restore testing, and lifecycle rules.'
          ]
        ]
      ],
      [
        /function|event|pub\/sub|messaging|run|hosting|deploy|ci/,
        [
          'Deliver Academy web, container, and event workloads with idempotency, immutable revisions, and safe rollback.',
          [
            'Assuming events are delivered exactly once.',
            'Acknowledging a message before durable work completes.',
            'Deploying mutable artifacts independently to each environment.'
          ],
          [
            'Use event IDs or generations for deduplication.',
            'Deploy tested immutable artifacts.',
            'Set region, concurrency, runtime identity, health, retry, and dead-letter policies explicitly.'
          ]
        ]
      ],
      [
        /analytics|crash|performance|logging|monitor|cost|quota|budget|reliability|architecture|environment|migration|vpc|network|project|review|assessment/,
        [
          'Operate the Academy cloud system with isolated environments, telemetry, cost controls, and tested failure recovery.',
          [
            'Collecting analytics without a data-governance purpose.',
            'Alerting on noisy single samples.',
            'Assuming a budget automatically stops all spend.'
          ],
          [
            'Use stable structured telemetry fields.',
            'Connect alerts to runbooks and user impact.',
            'Separate projects and credentials by environment and rehearse recovery and migration.'
          ]
        ]
      ]
    ]
};
})();
