import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

const dummyCodes = [
  "alginate", "silaxil", "articulator", "acrostone", 
  "acrylic-teeth-sheet", "rubber-bowl", "gas-torch", 
  "spatula-plastic", "scrub-navy", "lab-coat-white", 
  "forceps-set", "curing-light"
];

async function removeDummyProducts() {
  console.log("Removing newly added dummy products...");
  const snap = await getDocs(collection(db, "products"));
  let removed = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (dummyCodes.includes(data.code)) {
      await deleteDoc(doc(db, "products", d.id));
      console.log(`Deleted dummy product: ${data.name} (${d.id})`);
      removed++;
    }
  }
  console.log(`Finished. Removed ${removed} products.`);
  process.exit(0);
}

removeDummyProducts().catch((e) => {
  console.error("Error removing dummy products:", e);
  process.exit(1);
});
