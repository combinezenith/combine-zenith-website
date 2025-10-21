// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBT8mP7KqbNEEnmqR4-ela858a4hqms4bc",
  authDomain: "combine-zenith.firebaseapp.com",
  projectId: "combine-zenith",
  storageBucket: "combine-zenith.firebasestorage.app",
  messagingSenderId: "580594778639",
  appId: "1:580594778639:web:4291551f48ecd9220d197a",
  measurementId: "G-VVFCSDCZW7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
