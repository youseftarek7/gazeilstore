import {
  BookOpen,
  CheckCircle2,
  Boxes,
  ShoppingCart,
  LayoutDashboard,
  Tags,
  BarChart3,
  Home,
  Store,
  Sparkles,
} from "lucide-react";

interface GuideStep {
  id: string;
  title: string;
  icon: typeof BookOpen;
  color: string;
  summary: string;
  steps: {
    heading: string;
    body: string;
    tip?: string;
  }[];
}

const guideTopics: GuideStep[] = [
  {
    id: "dashboard",
    title: "لوحة القيادة (Dashboard)",
    icon: LayoutDashboard,
    color: "bg-sky-50 text-sky-700 border-sky-200",
    summary: "أول شاشة بترشالك ملخص كامل للمتجر",
    steps: [
      {
        heading: "إيه اللي بتشوفه في الـ Dashboard؟",
        body: "أول ما بتدخل على لوحة التحكم، بيظهرلك 4 مربعات: عدد المنتجات، عدد الطلبات، إجمالي المبيعات، والمنتجات اللي مخزونها قليل. ده ملخص يومي للمتجر.",
        tip: "ابدأ هنا كل يوم عشان تعرف إيه اللي محتاج انتباهك.",
      },
      {
        heading: "Latest Orders (أحدث الطلبات)",
        body: "في الجزء التاني بيظهرلك آخر 5 طلبات وصلوا — اسم العميل، رقمه، والمبلغ. تقدر تروح Orders من القائمة الجانبية عشان تشوف كل الطلبات.",
      },
      {
        heading: "Low Stock (مخزون قليل)",
        body: "في الجانب الأيمن بيظهرلك المنتجات اللي مخزونها 5 قطع أو أقل. لما بتشوف اسم منتج هنا معناها إنك محتاج تحدّثه أو تتواصل مع الموردين.",
        tip: "لو المنتج فضي قريباً، اعمله hidden من صفحة المنتجات عشان الزبون مايشوفش حاجة مش موجودة.",
      },
    ],
  },
  {
    id: "products",
    title: "المنتجات (Products)",
    icon: Boxes,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    summary: "تضيف وتعدّل وتحذف أي منتج في المتجر",
    steps: [
      {
        heading: "إزاي أضيف منتج جديد؟",
        body: '1. اضغط على زرار "Add Product" الأخضر فوق يمين الشاشة.\n2. ادخل اسم المنتج بالإنجليزي، بعدين السعر، وعدد المخزون.\n3. ارفع صورة المنتج بالضغط على "Upload Image".\n4. اختار القسم (Department) اللي ينتمي ليه المنتج.\n5. اضغط "Save Product" وخلاص — المنتج بيظهر فوراً على الموقع!',
        tip: "الصورة مهمة جداً — المنتج من غير صورة مش بيجذب الزبون.",
      },
      {
        heading: "إزاي أعدّل منتج موجود؟",
        body: 'ابحث عن المنتج في خانة البحث، بعدين اضغط على أيقونة القلم ✏️ جنبه. هيفتح نفس نموذج الإضافة بالبيانات الموجودة، عدّل اللي محتاج تعدله، واضغط "Save".',
      },
      {
        heading: "إزاي أخفي منتج مؤقتاً؟",
        body: 'لو المنتج مش موجود مؤقتاً أو محتاج تستنى، مش لازم تحذفه. افتح المنتج للتعديل وفعّل خيار "Hide Product from Storefront". المنتج هيختفي من الموقع بس يفضل موجود في اللوحة.',
        tip: "ده أفضل من الحذف — ممكن ترجعه تاني لما يتوفر.",
      },
      {
        heading: "الصور المتعددة والتفاصيل",
        body: 'في نموذج المنتج في قسم "Product Images" تقدر تضيف أكتر من صورة للمنتج. والزبون هيشوفهم كلهم في صفحة تفاصيل المنتج. كمان في قسم "Specifications" تقدر تضيف مواصفات تقنية مثل: مقاسات، مواد الصنع، إلخ.',
      },
    ],
  },
  {
    id: "categories",
    title: "الأقسام (Categories)",
    icon: BarChart3,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    summary: "نظّم المنتجات في أقسام ومجالات",
    steps: [
      {
        heading: "الأقسام (Departments) هي إيه؟",
        body: 'الأقسام هي التصنيفات الرئيسية للمتجر. مثال: "Academic" للطلاب، و"Clinics" للعيادات. الزبون لما يدخل الموقع بيلاقي الأقسام دي كبطاقات كبيرة عشان يختار منها.',
      },
      {
        heading: "إزاي أضيف قسم جديد؟",
        body: '1. اضغط "Add Category".\n2. ادخل اسم القسم بالإنجليزي وبالعربي.\n3. ادخل "Category Key" — ده اسم مختصر بالإنجليزي من غير مسافات (مثال: academic أو clinics).\n4. ارفع صورة للقسم.\n5. اضغط "Save Category".',
        tip: "الـ Key مهم جداً لأنه بيربط المنتجات بالقسم. مش هينعدّل بسهولة بعدين.",
      },
      {
        heading: "الأقسام الفرعية (Sub-Departments)",
        body: 'كل قسم ممكن يتقسم — مثلاً قسم "Academic" ممكن يحتوي على: Year 1، Year 2، Year 3. ده بيساعد الزبون يلاقي اللي محتاجه بسرعة. اضغط "Add Sub-Department" جوا نموذج القسم.',
      },
    ],
  },
  {
    id: "packages",
    title: "العروض (Packages & Offers)",
    icon: Tags,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    summary: "اعمل باقات وخصومات جاذبة",
    steps: [
      {
        heading: "الفرق بين المنتج والعرض",
        body: "المنتج هو شيء واحد بتبيعه بسعر عادي. أما العرض (Package) فهو باقة من أكتر من منتج بسعر مخفض، مع عداد وقت يضغط على الزبون يشتري بسرعة!",
      },
      {
        heading: "إزاي أعمل عرض؟",
        body: '1. اضغط "Add Package / Offer".\n2. ادخل اسم العرض بالإنجليزي والعربي.\n3. ادخل السعر الأصلي وسعر العرض المخفض.\n4. ادخل نسبة الخصم (مثال: 20).\n5. حدد مدة العرض بالساعات (مثال: 24 ساعة).\n6. من قائمة "Included Products" اختار المنتجات الداخلة في الباقة.',
        tip: "ضيف نقاط تشرح مميزات العرض في قسم Offer Features — ده بيزود المبيعات كتير.",
      },
      {
        heading: "إزاي أخفي عرض منتهي؟",
        body: 'افتح العرض للتعديل وفعّل "Hide Package from Storefront". العرض هيختفي من الموقع لحد ما تعيد تفعيله.',
      },
    ],
  },
  {
    id: "orders",
    title: "الطلبات (Orders)",
    icon: ShoppingCart,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    summary: "تابع وأدِّر كل طلبات الزبائن",
    steps: [
      {
        heading: "إزاي بتيجي الطلبات؟",
        body: "لما الزبون يضغط على زرار الطلب في الموقع، بييجيك رسالة على واتساب وفي نفس الوقت الطلب بيُسجَّل هنا أوتوماتيك. فبتبقى عارف بالتفصيل: اسمه، رقمه، المنتجات اللي طلبها، والمبلغ الإجمالي.",
      },
      {
        heading: "إزاي أغير حالة الطلب؟",
        body: 'كل طلب عنده Status (حالة). اضغط على القائمة المنسدلة جنب الطلب واختار:\n• Pending → لسه ما اتعملتلوش حاجة\n• Confirmed → تأكدت الطلب\n• Shipping → اتشحن\n• Delivered → وصل للزبون\n• Cancelled → اتلغى',
        tip: "حدّث الحالة باستمرار عشان تقدر تتابع الطلبات بكفاءة.",
      },
    ],
  },
  {
    id: "homepage",
    title: "الصفحة الرئيسية (Home Page)",
    icon: Home,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    summary: "عدّل شكل ومحتوى الصفحة الرئيسية للمتجر",
    steps: [
      {
        heading: "1. Top Banner (الصورة الكبيرة العلوية)",
        body: 'ده أول حاجة الزبون بيشوفها لما يدخل الموقع — صورة كبيرة مع عنوان ووصف. عدّل "Main Big Headline" عشان تكتب العنوان اللي عايزه، وارفع صورة جديدة لو محتاج.',
        tip: "اختار صورة عالية الجودة وألوانها تناسب هوية غزال ستور.",
      },
      {
        heading: "2. Shortcut Cards (الكروت السريعة)",
        body: 'دي الكروت اللي بتظهر تحت البانر الكبير. كل كارت ممكن يفتح قسم، أو منتج، أو عرض. اضغط "Add Card" عشان تضيف كارت جديد، وادخل صورة وعنوان وحدد "What should happen when the customer clicks this card?"',
      },
      {
        heading: "3. Offers Title (عنوان قسم العروض)",
        body: "ده بس بيعدّل النص المكتوب فوق قسم العروض. العروض الفعلية بتتضاف من صفحة Packages & Offers.",
      },
      {
        heading: "4. Departments Grid (شبكة الأقسام)",
        body: "ده بيعدّل العنوان والوصف فوق قائمة الأقسام. الأقسام نفسها بتتضاف من صفحة Categories.",
        tip: "بعد أي تعديل، اضغط زرار Save في الأعلى عشان التغييرات تتحفظ.",
      },
    ],
  },
  {
    id: "store",
    title: "بيانات المتجر (Store Contact)",
    icon: Store,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    summary: "حدّث أرقام التواصل والعناوين",
    steps: [
      {
        heading: "إيه اللي بتعدله هنا؟",
        body: "هنا بتحدّث: رقم الهاتف، رقم الواتساب (ده بيوصله الطلبات من الزبائن)، العنوان، ولينكات السوشيال ميديا (فيسبوك، إنستقرام، تيك توك، يوتيوب).",
        tip: "الواتساب مهم جداً — لو الرقم غلط الطلبات مش بتوصل!",
      },
      {
        heading: "فورمات رقم الواتساب",
        body: 'ادخل الرقم بدون + وبدون مسافات. مثال: 201551905201\n(ده كود مصر 20 + الرقم بدون الصفر الأول)',
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-8" dir="rtl">
      <div className="rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-violet-100 p-3 text-violet-700">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-violet-950">دليل استخدام لوحة تحكم غزال ستور</h1>
            <p className="mt-1 text-sm text-violet-700">المرجع الكامل لكل جزء في المتجر عشان تديره بسهولة واحترافية.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guideTopics.map((topic) => (
          <div key={topic.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className={`border-b p-4 ${topic.color}`}>
              <div className="flex items-center gap-3">
                <topic.icon className="h-6 w-6" />
                <h2 className="text-lg font-black">{topic.title}</h2>
              </div>
              <p className="mt-1 text-xs opacity-90 font-medium">{topic.summary}</p>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                {topic.steps.map((step, index) => (
                  <div key={index}>
                    <h3 className="mb-2 font-black text-slate-900 text-sm">{step.heading}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{step.body}</p>
                    {step.tip && (
                      <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 border border-amber-100 p-3">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-xs font-bold leading-relaxed text-amber-800">
                          نصيحة: {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
