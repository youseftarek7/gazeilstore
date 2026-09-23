// Script to update Firestore categories and products with Arabic names, tags, and descriptions
const categoriesUpdates = [
  {
    id: "7XNx0CKvyYLVF6Ctbjds",
    arabicName: "السنة الأولى (Year 1)",
    arabicDescription: "أدوات التشريح الوصفي للأسنان ونحت الشمع وكاستات الدراسة للمستوى الأول."
  },
  {
    id: "8iLdtsAUj4w571fdcMOE",
    arabicName: "مستلزمات صيدلية وطبية",
    arabicDescription: "أدوات ومستلزمات طبية وصيدلية عامة مساعدة."
  },
  {
    id: "HNYa3PQ5uFVUplwOEI6O",
    arabicName: "السنة الثانية (Year 2)",
    arabicDescription: "مستلزمات التركيبات المتحركة، الأكريليك، مواد الطبعات وأدوات الحشو."
  },
  {
    id: "HzB2rSrAtgYow084tBUU",
    arabicName: "السنة الثالثة (Pre-Clinic)",
    arabicDescription: "مبارد علاج الجذور، سنابل التحضير، فكوك التدريب ومستلزمات المعامل المتقدمة."
  },
  {
    id: "LbunkLEmCwqui4vs9Vb0",
    arabicName: "السنة الرابعة (Clinical)",
    arabicDescription: "أطقم الفحص السريري، فورسبس الخلع، التخدير ومستلزمات العيادات المباشرة."
  },
  {
    id: "dDb5Lbw2u0NcwoTs8zLq",
    arabicName: "سكراب وزي طبي",
    arabicDescription: "بدل وسكرابات طبية بأقمشة مريحة وعالية الجودة وتصاميم عصرية."
  },
  {
    id: "pHR1RvPl7m3pCzjcSkEH",
    arabicName: "تجهيزات عيادات الأسنان",
    arabicDescription: "مستلزمات العيادات الاحترافية، أجهزة البلمرة الضوئية والتعقيم والمستهلكات اليومية."
  },
  {
    id: "tUmKB1bHJp2L3bJk5kT0",
    arabicName: "بالطو ومعاطف طبية",
    arabicDescription: "معاطف وبالطو أبيض قطني كلاسيكي لتدريب المعامل والمستشفيات."
  }
];

const productsUpdates = [
  {
    id: "00FO63KcTlJbi57g5Qg6",
    arabicName: "كومبوزيت كراون فيل A2",
    arabicDescription: "حشوة كومبوزيت عالية الجودة للترميمات التجميلية وتيجان الأسنان شيد A2.",
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً"
  },
  {
    id: "02LAi9fEJsCEKoBeccsp",
    arabicName: "سمنت مؤقت للتركيبات (Temporary Cement)",
    arabicDescription: "إسمنت لاصق مؤقت عالي الثبات وسهل الإزالة للجسور والتيجان.",
    tag: "ESSENTIAL",
    arabicTag: "أساسي"
  },
  {
    id: "08NtLbkc48yMuB7WvbP0",
    arabicName: "أوفر شوز طبي (غطاء حذاء)",
    arabicDescription: "أغطية أحذية طبية معقمة مانعة للانزلاق لغرف العمليات والعيادات والمعامل.",
    tag: "ESSENTIAL",
    arabicTag: "مستهلكات"
  },
  {
    id: "0ADW2WiLTXOobAtSUWtA",
    arabicName: "بالطو معمل طبي قصير (Lab Coat)",
    arabicDescription: "بالطو قطني مريح وأنيق للأطباء والطلاب بجيوب عملية وأزرار متينة.",
    tag: "POPULAR",
    arabicTag: "شائع"
  },
  {
    id: "0E5sBOzG07zXTymJzI3D",
    arabicName: "شاش ومسحات طبية معقمة (Swab)",
    arabicDescription: "مسحات قطنية وشاش طبي معقم عالي الامتصاص للإجراءات الجراحية والعيادية.",
    tag: "ESSENTIAL",
    arabicTag: "أساسي"
  },
  {
    id: "0LZQAVPTGiDWn3mZEy3J",
    arabicName: "أسنان أكريليك للتدريب الأكاديمي",
    arabicDescription: "طقم أسنان أكريليك عالي الدقة لتدريب طلاب طب الأسنان على التركيبات والنحت.",
    tag: "POPULAR",
    arabicTag: "تدريب"
  },
  {
    id: "0pJOfL3tpQGT1D20B2bT",
    arabicName: "كارفر نحت تشريحي للأسنان",
    arabicDescription: "أداة كارفر ستانلس ستيل لنحت تفاصيل الأسطح الإطباقية وشمع الأسنان بدقة.",
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً"
  },
  {
    id: "0sXLYPnzNWyZ6MxFEHX3",
    arabicName: "ماتريكس باند لحشوات الأسنان (Matrix Band)",
    arabicDescription: "شرائح ماتريكس باند مرنة ومتينة لتشكيل حشوات الكومبوزيت بدقة متناهية.",
    tag: "ESSENTIAL",
    arabicTag: "أساسي"
  },
  {
    id: "0uzzTsHGK2TMFJrOiN8f",
    arabicName: "ديسكات تشطيب وتلميع كومبوزيت",
    arabicDescription: "مجموعة ديسكات مرنة لتلميع وتشطيب أسطح الحشوات للحصول على لمعان طبيعي فائق.",
    tag: "BEST SELLER",
    arabicTag: "الأكثر مبيعاً"
  },
  {
    id: "0z2in99bfW363Rv4hNpw",
    arabicName: "بروب فحص أسنان ستانلس (Probe)",
    arabicDescription: "مسبار فحص وتشخيص تسوس الأسنان وجيوب اللثة مصنوع من الستانلس ستيل المقاوم للصدأ.",
    tag: "ESSENTIAL",
    arabicTag: "أساسي"
  }
];

async function updateAll() {
  console.log("Updating Categories in Firestore...");
  for (const cat of categoriesUpdates) {
    const url = `https://firestore.googleapis.com/v1/projects/store-ce8ef/databases/(default)/documents/categories/${cat.id}?updateMask.fieldPaths=arabicName&updateMask.fieldPaths=arabicDescription`;
    const body = {
      fields: {
        arabicName: { stringValue: cat.arabicName },
        arabicDescription: { stringValue: cat.arabicDescription },
      }
    };
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log(`✓ Category ${cat.arabicName} updated`);
    } else {
      console.error(`✗ Category ${cat.id} failed:`, await res.text());
    }
  }

  console.log("\nUpdating Products in Firestore...");
  for (const prod of productsUpdates) {
    const url = `https://firestore.googleapis.com/v1/projects/store-ce8ef/databases/(default)/documents/products/${prod.id}?updateMask.fieldPaths=arabicName&updateMask.fieldPaths=arabicDescription&updateMask.fieldPaths=tag&updateMask.fieldPaths=arabicTag`;
    const body = {
      fields: {
        arabicName: { stringValue: prod.arabicName },
        arabicDescription: { stringValue: prod.arabicDescription },
        tag: { stringValue: prod.tag },
        arabicTag: { stringValue: prod.arabicTag },
      }
    };
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log(`✓ Product ${prod.arabicName} updated`);
    } else {
      console.error(`✗ Product ${prod.id} failed:`, await res.text());
    }
  }
  console.log("\nAll Firestore updates completed successfully!");
}

updateAll().catch(console.error);
