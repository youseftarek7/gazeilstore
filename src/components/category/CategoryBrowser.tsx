import React from "react";
import { ChevronRight, Sparkles, Layers } from "lucide-react";
import { useStorefront } from "../../context";

export default function CategoryBrowser() {
  const { categories, selectedCategory, selectDepartment, homepage } = useStorefront();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16" id="categories-browser" dir="ltr">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-medical-teal uppercase tracking-widest bg-medical-teal/5 border border-medical-teal/15 px-3 py-1 rounded-full mb-2">
            <Layers className="w-3.5 h-3.5 text-medical-teal" />
            <span>EXPLORE DEPARTMENTS</span>
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl text-dark-blue">
            {homepage?.categoryBrowserTitle || "Browse Dental Specialties"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {homepage?.categoryBrowserSubtitle || "Direct access to curated lists organized by academic study year and clinical disciplines."}
          </p>
        </div>

        <button
          onClick={() => selectDepartment("all")}
          className="text-xs font-bold text-medical-teal hover:text-medical-light flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All 300+ Products</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Categories Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.key}
            onClick={() => selectDepartment(cat.key)}
            className={`group rounded-3xl overflow-hidden border p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
              selectedCategory === cat.key
                ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]"
                : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg text-dark-blue"
            }`}
          >
            {/* Top icon / image thumbnail */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100/80">
              <img
                src={cat.premiumImage}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Titles */}
            <div className="space-y-1">
              <h4 className={`font-display font-black text-sm transition-colors ${
                selectedCategory === cat.key ? "text-white" : "group-hover:text-medical-teal text-dark-blue"
              }`}>
                {cat.name}
              </h4>
              <p className={`text-[11px] line-clamp-2 ${
                selectedCategory === cat.key ? "text-slate-400" : "text-slate-400 font-sans"
              }`}>
                {cat.description || cat.arabicDescription}
              </p>
            </div>

            {/* Sub-departments count badge */}
            <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between">
              <span className={`text-[10px] font-bold ${
                selectedCategory === cat.key ? "text-champagne-gold" : "text-slate-400"
              }`}>
                {cat.subCategories?.length || 0} Subcategories
              </span>
              <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                selectedCategory === cat.key ? "text-champagne-gold" : "text-slate-400 group-hover:text-medical-teal"
              }`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
