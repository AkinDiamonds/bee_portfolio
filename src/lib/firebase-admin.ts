import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Firebase Admin is not configured. Add FIREBASE_ADMIN_SERVICE_ACCOUNT in Vercel.");

  try {
    return JSON.parse(raw) as { project_id: string; client_email: string; private_key: string };
  } catch {
    throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT must be valid JSON.");
  }
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccount = getServiceAccount();
  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}
