import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
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

const testData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function testBucket(bucketName) {
  console.log(`Testing bucket: ${bucketName}...`);
  const config = {
    apiKey: envVars.VITE_FIREBASE_API_KEY,
    authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.VITE_FIREBASE_PROJECT_ID,
    storageBucket: bucketName,
    messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.VITE_FIREBASE_APP_ID,
  };
  
  const app = initializeApp(config, bucketName); // Use distinct app name
  const storage = getStorage(app);
  const testRef = ref(storage, "test_upload.png");
  
  try {
    await uploadString(testRef, testData, "data_url");
    const url = await getDownloadURL(testRef);
    console.log(`SUCCESS for bucket: ${bucketName}. URL: ${url}`);
    return true;
  } catch (err) {
    console.error(`FAILED for bucket: ${bucketName}.`);
    console.dir(err);
    return false;
  }
}

async function runTests() {
  const buckets = [
    envVars.VITE_FIREBASE_STORAGE_BUCKET,
    "store-ce8ef.appspot.com",
    "store-ce8ef.firebasestorage.app",
    "store-ce8ef"
  ];
  
  // Filter unique values
  const uniqueBuckets = [...new Set(buckets.filter(Boolean))];
  
  for (const bucket of uniqueBuckets) {
    await testBucket(bucket);
    console.log("------------------------");
  }
  process.exit(0);
}

runTests();
