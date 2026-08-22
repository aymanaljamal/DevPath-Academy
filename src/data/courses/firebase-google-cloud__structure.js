(function () {
  const {structure, file, folder} = window.DevPathProjectStructures;
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
  window.ACADEMY_PROJECT_STRUCTURES['firebase-google-cloud'] = structure({
      title:'Firebase & Google Cloud Project Structure',subtitle:'A web application with client configuration, server functions, security rules, emulators, and deployment policy.',defaultPath:'academy-cloud/src/firebase.js',
      tree:folder('academy-cloud','Firebase project root','Connects the web client, Firebase services, local emulators, and deployable functions.',[
        folder('src','Web application source','Client code that imports Firebase SDK modules.',[
          file('firebase.js','Firebase client initialization','Initializes the public project configuration and exports scoped service clients.',{language:'javascript',readBy:'Vite and Firebase SDK',example:'import { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\n\nconst app = initializeApp(firebaseConfig);\nexport const db = getFirestore(app);'}),
          folder('features','Feature modules','UI and data logic grouped by product capability.',[])
        ]),
        folder('functions','Trusted server functions','Server-side event handlers and HTTP functions deployed to Google Cloud.',[
          folder('src','Function source','Trusted code with server credentials and validation.',[file('index.ts','Functions entry point','Exports deployable Cloud Functions handlers.',{language:'typescript',badge:'Entry Point',readBy:'Firebase CLI and Functions runtime'})]),
          file('package.json','Functions manifest','Defines server dependencies and build scripts.',{language:'json',readBy:'npm and Firebase CLI'})
        ]),
        file('firebase.json','Firebase deployment configuration','Maps hosting, functions, rules, indexes, and emulator settings.',{language:'json',badge:'Required',readBy:'Firebase CLI'}),
        file('.firebaserc','Firebase project aliases','Maps friendly aliases such as dev and prod to Firebase project IDs.',{language:'json',readBy:'Firebase CLI'}),
        file('firestore.rules','Firestore authorization rules','Server-enforced access rules for document requests.',{language:'javascript',readBy:'Cloud Firestore',commit:'Commit'}),
        file('firestore.indexes.json','Firestore indexes','Declares composite indexes deployed with the project.',{language:'json',readBy:'Firebase CLI and Firestore'}),
        file('storage.rules','Storage authorization rules','Controls access to Cloud Storage objects.',{language:'javascript',readBy:'Cloud Storage for Firebase'}),
        file('.env.local','Local client environment','Stores local project values; secrets belong in Secret Manager for trusted services.',{language:'bash',commit:'Do not commit'}),
        file('.gitignore','Git ignore rules','Excludes local environment values, emulator data, and dependencies.',{language:'text',readBy:'Git'})
      ]),
      architecture:['Browser','Firebase SDK','Security Rules','Firebase service','Cloud Function','Google Cloud'],runtime:['Vite client','initializeApp()','Auth state','Firestore request','Rules evaluation','Data/UI'],
      quiz:[{question:'Where should trusted API secrets for deployed functions live?',options:['src/firebase.js','firestore.rules','Secret Manager','public/config.json'],answer:'Secret Manager',explanation:'Client configuration is observable; trusted server secrets need managed secret storage and scoped runtime identity.'}],
      evolution:[{label:'Prototype',items:['src/firebase.js','firebase.json']},{label:'Growing app',items:['features/','functions/','rules files']},{label:'Production cloud',items:['separate projects','CI/CD','Secret Manager','observability']}]
    });
})();
