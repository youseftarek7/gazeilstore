import fs from "fs";
import path from "path";

// Read data.ts and extract items cleanly
const dataTsPath = path.resolve("src/data.ts");
const dataContent = fs.readFileSync(dataTsPath, "utf-8");

// Create json export directly from data.ts
const allData = {
  exportedAt: new Date().toISOString(),
  store: "Ghazal Dental Store (ستور غزال)",
  website: "https://ghazaldental.vercel.app",
};

console.log("Exporting all store data...");
