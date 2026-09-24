import React from "react";
import { Search, Sparkles, ShieldCheck, ArrowRight, Award, GraduationCap, Stethoscope } from "lucide-react";
import { useStorefront } from "../../context";

export default function Hero({ onScrollToProducts }: { onScrollToProducts?: () => void }) {
  const { searchQuery, setSearchQuery, homepage, selectDepartment, openProductDetails, products } = useStorefront();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScrollToProducts) onScrollToProducts();
  };

  const heroCardProductId = (homepage as any)?.heroCardProductId || (homepage as any)?.customSliders?.[0]?.productId;

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-8 pb-14" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Presentation Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-champagne-light/35 border border-champagne-gold/30 px-3.5 py-1.5 rounded-full text-gold-hover font-bold text-[11px] tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
              <span>{homepage?.offersEyebrow || "OFFICIAL DENTAL ACADEMIC & CLINICAL HUB"}</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-dark-blue tracking-tight leading-[1.12]">
              {homepage?.heroTitle || "Precision Dental Materials, Engineered for Clinical Excellence."}
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl font-sans">
              {homepage?.heroSubtitle || "Equipping dentistry students, pre-clinical laboratories, and private practices with accredited dental instruments, rotary systems, composites, and hospital supplies."}
            </p>

            {/* Interactive Search Bar on Mobile / Hero */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-lg bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-medical-teal/20 focus-within:border-medical-teal transition-all">
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 300+ dental instruments, burs, files..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-medical-teal hover:bg-medical-light text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Browse All
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Medical Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-champagne-gold" />
                <span>Sinai University Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                <span>Fast Direct Delivery</span>
              </div>
            </div>
          </div>

          {/* Right: Featured Hero Visual Banner */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => {
                if (heroCardProductId) {
                  const prod = products.find(p => String(p.id) === String(heroCardProductId) || p.firestoreId === String(heroCardProductId));
                  if (prod) openProductDetails(prod);
                } else if (homepage?.heroCardCategoryKey) {
                  selectDepartment(homepage.heroCardCategoryKey);
                } else {
                  onScrollToProducts?.();
                }
              }}
              className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group cursor-pointer aspect-4/3 sm:aspect-16/10 lg:aspect-square flex flex-col justify-end p-6 md:p-8"
            >
              <img
                src={homepage?.heroImage || homepage?.heroCardImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80"}
                alt="Ghazal Dental Hero"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <span className="inline-block bg-champagne-gold text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-wider">
                  {homepage?.heroCardTag || "FEATURED COLLECTION"}
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white group-hover:text-champagne-gold transition-colors">
                  {homepage?.heroCardTitle || "University Kits & Clinical Rotary Files"}
                </h3>
                <p className="text-slate-300 text-xs line-clamp-2">
                  {homepage?.heroCardSubtitle || "Complete academic setup for years 1 through 4 with high durability dental appliances."}
                </p>
                <div className="pt-2 flex items-center gap-2 text-champagne-gold text-xs font-bold group-hover:translate-x-1 transition-transform">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
