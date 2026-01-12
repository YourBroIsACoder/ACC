// src/firebase/firebase.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your public Firebase configuration object remains the same.
const firebaseConfig = {
  apiKey: "AIzaSyBHdau7i8Azx6s4U8N5wAozgGD86zY1CcY",
  authDomain: "acc-website-2210d.firebaseapp.com",
  projectId: "acc-website-2210d",
  storageBucket: "acc-website-2210d.firebasestorage.app",
  messagingSenderId: "1028991703610",
  appId: "1:1028991703610:web:6dab80e85b0d7e3255b303",
  measurementId: "G-MWG04VTLHW"
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