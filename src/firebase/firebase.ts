// src/firebase/firebase.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your public Firebase configuration object remains the same.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// --- INITIALIZE THE PRIMARY APP (for regular users) ---
let primaryApp: firebase.app.App;

// Check if the primary app is already initialized. If not, create it with the name "primary".
// Giving it a name is the key to allowing multiple apps.
try {
  primaryApp = firebase.app("primary");
} catch (e) {
  primaryApp = firebase.initializeApp(firebaseConfig, "primary");
}

// --- INITIALIZE THE SECONDARY ADMIN APP ---
let adminApp: firebase.app.App;

// Check if the admin app is already initialized. If not, create it with the name "admin".
try {
  adminApp = firebase.app("admin");
} catch (e) {
  adminApp = firebase.initializeApp(firebaseConfig, "admin");
}


// --- EXPORT THE SERVICES FOR EACH APP ---

// These are the default services for your main website (Newsletter, etc.)
// They are connected to the "primary" app instance.
export const auth = primaryApp.auth();
export const db = primaryApp.firestore();
export const storage = primaryApp.storage();

// This is a special, separate authentication service ONLY for the admin panel.
// It is connected to the "admin" app instance.
export const adminAuth = adminApp.auth();
export const adminDb = adminApp.firestore(); // A Firestore instance for the admin


// Export the primary app as the default
export default primaryApp;