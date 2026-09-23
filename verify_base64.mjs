import "dotenv/config";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

function countBase64Images(value) {
  if (typeof value === "string") return value.startsWith("data:image/") ? 1 : 0;
  if (Array.isArray(value)) return value.reduce((total, item) => total + countBase64Images(item), 0);
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.values(value).reduce((total, item) => total + countBase64Images(item), 0);
  }
  return 0;
}

let remaining = 0;
for (const collectionName of ["products", "packages"]) {
  const snapshot = await getDocs(collection(db, collectionName));
  const count = snapshot.docs.reduce((total, item) => total + countBase64Images(item.data()), 0);
  remaining += count;
  console.log(`${collectionName}: ${count}`);
}
console.log(`remaining base64 images: ${remaining}`);
