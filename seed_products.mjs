import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, setDoc, doc } from "firebase/firestore";
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

const initialProducts = [
  {
    name: "Alginate Impression Material",
    arabicName: "مادة ألجينات لأخذ الطبعات",
    code: "alginate",
    price: 200,
    stock: 50,
    categoryKey: "year",
    description: "High precision dental alginate impression material for study models and orthodontics.",
    arabicDescription: "ألجينات عالي الدقة لأخذ طبعات الأسنان ونماذج الدراسة والتقويم.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً",
    rating: 5,
    reviewsCount: 42,
    hidden: false,
  },
  {
    name: "Silaxil C-Silicone Impression Kit",
    arabicName: "طقم سيليكون سيلاكسيل",
    code: "silaxil",
    price: 870,
    stock: 25,
    categoryKey: "year-2-nd",
    description: "Premium condensation silicone impression material with putty, light body, and activator.",
    arabicDescription: "مادة طبعات سيليكون عالية الجودة تشمل البتي واللايت والأكتيفاتور.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "POPULAR",
    arabicTag: "شائع",
    rating: 5,
    reviewsCount: 38,
    hidden: false,
  },
  {
    name: "Dental Articulator Standard",
    arabicName: "أرتيكولاتور أسنان قياسي",
    code: "articulator",
    price: 450,
    stock: 30,
    categoryKey: "year",
    description: "Durable metal articulator for mounting dental casts and analyzing occlusion.",
    arabicDescription: "أرتيكولاتور معدني متين لتركيب كاستات الأسنان ودراسة الإطباق.",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "ESSENTIAL",
    arabicTag: "أساسي",
    rating: 5,
    reviewsCount: 29,
    hidden: false,
  },
  {
    name: "Acrostone Cold Cure Acrylic",
    arabicName: "أكروستون كولد كيور",
    code: "acrostone",
    price: 390,
    stock: 40,
    categoryKey: "year-2-nd",
    description: "Self-curing acrylic resin powder and liquid for dental laboratory repairs and appliances.",
    arabicDescription: "بودرة وسائل أكريليك ذاتي التصلب لصناعة وتصليح الأجهزة التعويضية.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً",
    rating: 5,
    reviewsCount: 51,
    hidden: false,
  },
  {
    name: "Acrylic Teeth Full Set Sheet",
    arabicName: "شيت أسنان أكريليك كامل",
    code: "acrylic-teeth-sheet",
    price: 95,
    stock: 100,
    categoryKey: "year-2-nd",
    description: "High quality polymer cross-linked teeth for complete and partial dentures practice.",
    arabicDescription: "أسنان بوليمر متصالبة عالية الجودة لتدريب التركيبات الكاملة والجزئية.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    hidden: false,
  },
  {
    name: "Dental Rubber Mixing Bowl",
    arabicName: "وعاء خلط مطاطي",
    code: "rubber-bowl",
    price: 25,
    stock: 150,
    categoryKey: "year",
    description: "Flexible rubber mixing bowl for alginate, plaster, and stone mixing.",
    arabicDescription: "وعاء مطاطي مرن لخلط الألجينات والجبس وحجر الأسنان بسهولة.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
    featured: false,
    rating: 4.9,
    reviewsCount: 65,
    hidden: false,
  },
  {
    name: "Gas Torch Micro Burner",
    arabicName: "تورج غاز للمختبر",
    code: "gas-torch",
    price: 90,
    stock: 45,
    categoryKey: "year",
    description: "Refillable butane gas torch for wax carving and dental lab work.",
    arabicDescription: "شعلة غاز قابلة لإعادة التعبئة لنحت الشمع وأعمال مختبر الأسنان.",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80",
    featured: false,
    rating: 4.7,
    reviewsCount: 22,
    hidden: false,
  },
  {
    name: "Plastic Alginate Spatula",
    arabicName: "سباتيولا بلاستيك للألجينات",
    code: "spatula-plastic",
    price: 15,
    stock: 200,
    categoryKey: "year",
    description: "Ergonomic plastic spatula designed for smooth, bubble-free alginate mixing.",
    arabicDescription: "سباتيولا بلاستيكية مريحة لخلط الألجينات بسلاسة وبدون فقاعات.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
    featured: false,
    rating: 5,
    reviewsCount: 30,
    hidden: false,
  },
  {
    name: "Medical Scrub Premium Navy Blue",
    arabicName: "سكراب طبي كحلي ممتاز",
    code: "scrub-navy",
    price: 350,
    stock: 60,
    categoryKey: "medical-scrub",
    description: "High quality breathable medical scrub suit for clinic and university students.",
    arabicDescription: "بدلة سكراب طبي قماش مريح ومقاوم للسوائل لطلاب الطب والعيادات.",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "POPULAR",
    arabicTag: "شائع",
    rating: 5,
    reviewsCount: 44,
    hidden: false,
  },
  {
    name: "White Lab Coat Doctor Cut",
    arabicName: "بالطو أبيض طبي كلاسيك",
    code: "lab-coat-white",
    price: 250,
    stock: 80,
    categoryKey: "lab-coat-",
    description: "Professional cotton lab coat with deep pockets for university and hospital.",
    arabicDescription: "بالطو أبيض قطني كلاسيكي بجيوب مريحة للجامعة والمستشفى.",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "ESSENTIAL",
    arabicTag: "أساسي",
    rating: 5,
    reviewsCount: 35,
    hidden: false,
  },
  {
    name: "Dental Extraction Forceps Set",
    arabicName: "طقم كماشات خلع أسنان ستانلس",
    code: "forceps-set",
    price: 650,
    stock: 20,
    categoryKey: "clinical",
    description: "German stainless steel dental extraction forceps set for adult teeth.",
    arabicDescription: "طقم فورسبس ستانلس ستيل ألماني عالي الجودة للخلط الجراحي والعيادات.",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً",
    rating: 5,
    reviewsCount: 48,
    hidden: false,
  },
  {
    name: "LED Wireless Curing Light",
    arabicName: "جهاز لايت كيور لاسلكي",
    code: "curing-light",
    price: 1200,
    stock: 15,
    categoryKey: "year-4-th",
    description: "High power cordless LED curing light for dental composite resin restoration.",
    arabicDescription: "جهاز بلمرة حشوات كومبوزيت ليزر لاسلكي عالي الكفاءة مع بطارية تدوم طويلاً.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80",
    featured: true,
    tag: "FEATURED",
    arabicTag: "مميز",
    rating: 5,
    reviewsCount: 27,
    hidden: false,
  }
];

async function seed() {
  console.log("Checking current products...");
  const snap = await getDocs(collection(db, "products"));
  console.log(`Current products in DB: ${snap.size}`);
  
  if (snap.size === 0) {
    console.log("Seeding products into Firestore...");
    for (const p of initialProducts) {
      await addDoc(collection(db, "products"), {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`+ Added: ${p.name}`);
    }
    console.log("Seeding complete!");
  } else {
    console.log("Products already exist in DB.");
  }
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
