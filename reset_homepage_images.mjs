import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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

async function resetImages() {
  console.log("Fetching homepage/main to clear large images...");
  const docRef = doc(db, "homepage", "main");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    
    // Clear top-level images
    if (data.heroImage) data.heroImage = "";
    if (data.heroCardImage) data.heroCardImage = "";
    if (data.academicImage) data.academicImage = "";
    if (data.clinicsImage) data.clinicsImage = "";
    
    // Clear images in customSliders
    if (Array.isArray(data.customSliders)) {
      data.customSliders = data.customSliders.map(s => ({ ...s, image: "" }));
    }
    
    // Clear images in customBanners
    if (Array.isArray(data.customBanners)) {
      data.customBanners = data.customBanners.map(b => ({ ...b, image: "" }));
    }
    
    // Clear images in destinationCards
    if (Array.isArray(data.destinationCards)) {
      data.destinationCards = data.destinationCards.map(c => ({ ...c, image: "" }));
    }
    
    await setDoc(docRef, data);
    console.log("SUCCESS! Homepage document has been cleared of all large base64 images.");
    console.log("New size should be under 2KB.");
  } else {
    console.log("Document homepage/main does not exist.");
  }
  process.exit(0);
}

resetImages().catch(err => {
  console.error("Failed to reset:", err);
  process.exit(1);
});
