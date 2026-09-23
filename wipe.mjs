import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

async function wipe() {
  console.log("Wiping Firebase...");
  const productsSnapshot = await getDocs(collection(db, "products"));
  let deletedProducts = 0;
  for (const docSnap of productsSnapshot.docs) {
    await deleteDoc(doc(db, "products", docSnap.id));
    deletedProducts++;
  }
  console.log(`Deleted ${deletedProducts} products.`);

  const categoriesSnapshot = await getDocs(collection(db, "categories"));
  let deletedCategories = 0;
  for (const docSnap of categoriesSnapshot.docs) {
    await deleteDoc(doc(db, "categories", docSnap.id));
    deletedCategories++;
  }
  console.log(`Deleted ${deletedCategories} categories.`);
  
  console.log("Done.");
  process.exit(0);
}

wipe().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
