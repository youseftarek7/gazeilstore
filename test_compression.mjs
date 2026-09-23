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

function isPlainObject(val) {
  if (typeof val !== "object" || val === null) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

// Mock compressBase64
async function compressBase64(base64Data, maxWidth = 500, maxHeight = 500, quality = 0.5) {
  return base64Data + "_compressed";
}

async function compressAllBase64InObject(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        return await compressBase64(obj, 500, 500, 0.5);
      } catch (error) {
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = await Promise.all(
      obj.map((item) => compressAllBase64InObject(item))
    );
    return newArray;
  }

  if (isPlainObject(obj)) {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await compressAllBase64InObject(obj[key]);
    }
    return newObj;
  }

  return obj;
}

async function runTest() {
  const docRef = doc(db, "homepage", "main");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    console.log("Original data:", data);
    try {
      const processed = await compressAllBase64InObject(data);
      console.log("Processed data success!");
      console.log("Processed keys:", Object.keys(processed));
    } catch (err) {
      console.error("CRITICAL ERROR running compressAllBase64InObject:", err);
    }
  } else {
    console.log("homepage/main doesn't exist");
  }
  process.exit(0);
}

runTest();
