import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read .env file manually
const envPath = path.resolve(".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[key] = value;
  }
});

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkHomepage() {
  console.log("Fetching homepage/main from Firestore...");
  const docRef = doc(db, "homepage", "main");
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const stringified = JSON.stringify(data);
      console.log(`Document exists! Size in bytes: ${stringified.length}`);
      console.log("Keys in document:", Object.keys(data));
      // Print some keys to see if they are empty
      console.log("heroTitle:", data.heroTitle);
      console.log("destinationCards length:", data.destinationCards ? data.destinationCards.length : "undefined");
    } else {
      console.log("Document homepage/main does not exist in Firestore.");
    }
  } catch (err) {
    console.error("Error reading document:", err);
  }
  process.exit(0);
}

checkHomepage();
