// Firebase configuration (Firebase Storage + Hosting)
// ============================================================
// To enable Firebase:
// 1. Create a project at https://console.firebase.google.com
// 2. Add a Web App to get the config values below
// 3. Copy `.env.example` to `.env` and fill in the values (prefix with VITE_)
// 4. Enable Storage, then update storage rules in the Firebase console
// 5. (Optional) Enable Hosting and run `firebase deploy`
// ============================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const hasConfig = Object.values(firebaseConfig).some((v) => v && v.length > 0);

// Only initialize Firebase if config values are provided.
// This keeps the app working even before the user fills in their Firebase project.
export const storage = hasConfig
  ? getStorage(getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

/**
 * Uploads a file to Firebase Storage under the given path.
 * Throws a descriptive error if Firebase is not configured.
 *
 * @param {File} file - The file to upload
 * @param {string} path - Storage path, e.g. `avatars/<userId>/<timestamp>_<name>`
 * @returns {Promise<string>} The download URL
 */
export async function uploadToFirebase(file, path) {
  if (!storage) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to client/.env to enable avatar uploads."
    );
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export default null;

