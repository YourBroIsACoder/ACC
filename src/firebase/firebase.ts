import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
   apiKey: "AIzaSyAbgeIBbEQ-44j3PORu-3bF0xF1eMapJBM",
  authDomain: "acc-demo-28c7e.firebaseapp.com",
  projectId: "acc-demo-28c7e",
  storageBucket: "acc-demo-28c7e.firebasestorage.app",
  messagingSenderId: "405424908184",
  appId: "1:405424908184:web:caf16d81925dea5db2aded",
  measurementId: "G-N11DKHLCFR"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase;