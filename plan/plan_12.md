# plan_12 — Data Migration Script

**Goal:** Create a one-off script to migrate all existing static data from `src/lib/content.ts` into your new Firestore backend, so you don't have to manually re-enter everything through the admin dashboard. 

**Prerequisite:** plans 01-11 complete.

---

## Create `scripts/migrate.ts`

Create a script at the root of the project to initialize the Admin SDK and push the static data to Firestore.

```ts
// scripts/migrate.ts
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 1. Initialize Firebase Admin
// Make sure FIREBASE_ADMIN_SERVICE_ACCOUNT is exported in your terminal or read it from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
  console.error("Missing FIREBASE_ADMIN_SERVICE_ACCOUNT");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

// 2. Import your old static data
// (Note: you might need to copy/paste the objects directly here if you can't import the TS file directly in a node script without compilation)
const oldProfile = {
  // ... paste static profile ...
};

const oldProjects = [
  // ... paste static projects ...
];

const oldExperience = [
  // ... paste static experience ...
];

const oldTech = {
  // ... paste static technologies ...
};

const oldTestimonials = [
  // ... paste static testimonials ...
];

async function run() {
  console.log("Migrating Profile...");
  await db.collection("site").doc("profile").set(oldProfile);

  console.log("Migrating Projects...");
  for (const proj of oldProjects) {
    await db.collection("projects").doc(proj.slug).set({
      ...proj,
      updatedAt: new Date().toISOString(),
    });
  }

  console.log("Migrating Experience...");
  // ... loop and add

  console.log("Migrating Tech...");
  // ... add the 3 documents

  console.log("Migrating Testimonials...");
  // ... loop and add

  console.log("Done!");
}

run().catch(console.error);
```

### Run the Migration

Use `ts-node` or compile and run:

```bash
npm install -g ts-node
ts-node scripts/migrate.ts
```

Verify in the Firebase Console that all collections (`site`, `projects`, `experience`, `technologies`, `testimonials`) are populated.

---

## Verification
Load `http://localhost:3000/`. The frontend should now look exactly as it did before, but all data is coming from Firestore.
