// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDen2-aBckudhwk1_Boi9pX4u9n2VQ_TM",
  authDomain: "database01-a938f.firebaseapp.com",
  projectId: "database01-a938f",
  storageBucket: "database01-a938f.firebasestorage.app",
  messagingSenderId: "462092854204",
  appId: "1:462092854204:web:e95abaf3ff50eeb38881b9",
  measurementId: "G-1SWSEZT3WB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);