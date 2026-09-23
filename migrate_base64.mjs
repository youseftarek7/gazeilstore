import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
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
const cloudName = envVars.VITE_CLOUDINARY_CLOUD_NAME || "rvbujouj";
const uploadPreset = envVars.VITE_CLOUDINARY_UPLOAD_PRESET || "ghazal_products";

async function uploadBase64ToCloudinary(base64Data) {
  if (!base64Data.startsWith("data:")) {
    return base64Data;
  }

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", uploadPreset);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error(`Cloudinary upload failed (${response.status}).`);

  const result = await response.json();
  if (!result.secure_url) throw new Error("Cloudinary did not return a secure image URL.");
  return result.secure_url;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

async function uploadAllBase64InObject(obj, folder) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        console.log(`Uploading a base64 image (${Math.round(obj.length / 1024)} KB) to folder: ${folder}...`);
        const url = await uploadBase64ToCloudinary(obj);
        console.log(`-> Uploaded! URL: ${url.substring(0, 60)}...`);
        return url;
      } catch (error) {
        console.error("Failed to upload base64 image to storage:", error);
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = [];
    for (const item of obj) {
      newArray.push(await uploadAllBase64InObject(item, folder));
    }
    return newArray;
  }

  if (isPlainObject(obj)) {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await uploadAllBase64InObject(obj[key], folder);
    }
    return newObj;
  }

  return obj;
}

async function migrate() {
  console.log("Starting image migration (Base64 -> Cloudinary URLs)...");

  // 1. Migrate homepage/main
  console.log("\nChecking homepage/main...");
  const homepageDocRef = doc(db, "homepage", "main");
  const homepageSnap = await getDoc(homepageDocRef);
  if (homepageSnap.exists()) {
    const data = homepageSnap.data();
    const updatedData = await uploadAllBase64InObject(data, "homepage");
    await setDoc(homepageDocRef, updatedData, { merge: true });
    console.log("Homepage migration done.");
  } else {
    console.log("homepage/main document does not exist.");
  }

  // 2. Migrate all image-bearing collections. A document is updated only after
  // every image in it has a successful Cloudinary copy, so no image is lost.
  for (const collectionName of ["categories", "products", "packages"]) {
    console.log(`\nChecking ${collectionName} collection...`);
    const snapshot = await getDocs(collection(db, collectionName));
    console.log(`Found ${snapshot.docs.length} documents.`);
    for (const docSnap of snapshot.docs) {
      const updatedData = await uploadAllBase64InObject(docSnap.data(), collectionName);
      await updateDoc(doc(db, collectionName, docSnap.id), updatedData);
      console.log(`${collectionName}/${docSnap.id} migration done.`);
    }
  }

  for (const [collectionName, documentId] of [["settings", "main"], ["developer", "main"]]) {
    const documentRef = doc(db, collectionName, documentId);
    const snapshot = await getDoc(documentRef);
    if (!snapshot.exists()) continue;
    const updatedData = await uploadAllBase64InObject(snapshot.data(), collectionName);
    await setDoc(documentRef, updatedData, { merge: true });
  }

  console.log("\nMigration completed successfully!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
