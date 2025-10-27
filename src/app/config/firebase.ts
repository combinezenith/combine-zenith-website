// app/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT8mP7KqbNEEnmqR4-ela858a4hqms4bc",
  authDomain: "combine-zenith.firebaseapp.com",
  projectId: "combine-zenith",
  storageBucket: "combine-zenith.firebasestorage.app",
  messagingSenderId: "580594778639",
  appId: "1:580594778639:web:4291551f48ecd9220d197a",
  measurementId: "G-VVFCSDCZW7",
};

// ✅ Initialize Firebase only once (important for Next.js hot reload)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firestore (for use across your app)
export const db = getFirestore(app);
