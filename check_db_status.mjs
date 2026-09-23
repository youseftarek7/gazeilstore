import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

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

async function checkDatabase() {
  console.log("=== CHECKING FIRESTORE COLLECTIONS ===");
  
  // 1. Products
  const productsSnap = await getDocs(collection(db, "products"));
  console.log(`Products collection count: ${productsSnap.size}`);
  productsSnap.docs.slice(0, 5).forEach(d => {
    const data = d.data();
    console.log(` - Product [${d.id}]: name="${data.name}", hidden=${data.hidden}, price=${data.price}`);
  });

  // 2. Categories
  const categoriesSnap = await getDocs(collection(db, "categories"));
  console.log(`Categories collection count: ${categoriesSnap.size}`);
  categoriesSnap.docs.forEach(d => {
    const data = d.data();
    console.log(` - Category [${d.id}]: name="${data.name}", key="${data.key}", hidden=${data.hidden}`);
  });

  // 3. Homepage
  const homepageSnap = await getDoc(doc(db, "homepage", "main"));
  console.log(`Homepage doc exists: ${homepageSnap.exists()}`);
  if (homepageSnap.exists()) {
    const data = homepageSnap.data();
    console.log(" - Homepage data keys:", Object.keys(data));
    console.log(" - heroTitle:", data.heroTitle);
    console.log(" - destinationCards count:", data.destinationCards?.length);
    console.log(" - customSliders count:", data.customSliders?.length);
  }

  // 4. Packages
  const packagesSnap = await getDocs(collection(db, "packages"));
  console.log(`Packages collection count: ${packagesSnap.size}`);

  process.exit(0);
}

checkDatabase().catch(err => {
  console.error("DB check failed:", err);
  process.exit(1);
});
