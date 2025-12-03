import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import data from "./seed.json" assert { type: "json" };

const firebaseConfig = { /* new config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionName = input("Enter collection name: ");
async function seed() {
  for (const item of data) {
    await setDoc(doc(db, {collectionName}, item.id), item);
  }
  console.log("Done seeding!");
}

seed();
