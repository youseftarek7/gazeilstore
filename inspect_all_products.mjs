import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

async function inspectProducts() {
  console.log("=== INSPECTING FIRESTORE PRODUCTS ===");
  const snap = await getDocs(collection(db, "products"));
  console.log(`Total products in Firestore: ${snap.size}`);
  snap.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Name: "${d.name}" | ArName: "${d.arabicName}" | Code: "${d.code}" | Price: ${d.price} | Image: ${(d.image || "").substring(0, 50)}...`);
  });
  process.exit(0);
}

inspectProducts().catch((e) => {
  console.error("Inspect error:", e);
  process.exit(1);
});
