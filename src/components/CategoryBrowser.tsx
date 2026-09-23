/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Category } from "../types";
import { Sparkles, Trophy, Landmark, GraduationCap, Pill, Shirt, LayoutGrid } from "lucide-react";

interface CategoryBrowserProps {
  lang: "en" | "ar";
  categories: Category[];
  content?: any;
  selectedCategory: string; // 'all' | 'best' or 'clinics' | 'academic' | 'pharmacy' | 'scrubs'
  setSelectedCategory: (cat: string) => void;
  selectedSubCategory: string; // subcategory key
  setSelectedSubCategory: (subCat: string) => void;
}

export default function CategoryBrowser({
  lang,
  categories,
  content,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
}: CategoryBrowserProps) {
  const isAr = lang === "ar";

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    setSelectedSubCategory("");
  };

  const currentCategory = categories.find((c) => c.key === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10 scroll-mt-24" id="categories-hub">
      {/* Categories Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-display font-bold text-2xl text-dark-blue flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-champagne-gold" />
            <span>Browse Clinical Categories</span>
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Select a department to browse clinical levels, academic years, or attire.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`font-semibold text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-medical-teal text-white border-medical-teal shadow-xs"
                : "text-slate-600 bg-white border-slate-200 hover:border-medical-teal"
            }`}
          >
            All Products (313)
          </button>
          <button
            onClick={() => handleCategorySelect("best")}
            className={`font-semibold text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedCategory === "best"
                ? "bg-champagne-gold text-white border-champagne-gold shadow-xs"
                : "text-slate-600 bg-white border-slate-200 hover:border-champagne-gold"
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Main Categories Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* All Products Block */}
        <button
          onClick={() => handleCategorySelect("all")}
          className={`group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-900 border-2 cursor-pointer ${
            selectedCategory === "all" ? "border-medical-teal scale-[1.02] ring-4 ring-medical-teal/10" : "border-slate-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/95 via-dark-blue/60 to-slate-900/80 z-0"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white z-10 text-left">
            <LayoutGrid className="w-8 h-8 text-medical-teal mb-auto" />
            <p className="text-[10px] font-semibold text-medical-light uppercase tracking-widest mb-1">
              FULL CATALOG
            </p>
            <h4 className="font-display font-bold text-lg leading-tight group-hover:text-champagne-light transition-colors">
              All Products
            </h4>
          </div>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          const iconMap: Record<string, React.ReactNode> = {
            year: <GraduationCap className="w-5 h-5" />,
            "year-2-nd": <GraduationCap className="w-5 h-5" />,
            "year-3-th": <GraduationCap className="w-5 h-5" />,
            clinical: <GraduationCap className="w-5 h-5" />,
            "year-4-th": <Landmark className="w-5 h-5" />,
            "medical-scrub": <Shirt className="w-5 h-5" />,
            "lab-coat-": <Shirt className="w-5 h-5" />,
            "pharmacy-": <Pill className="w-5 h-5" />,
            clinics: <Landmark className="w-5 h-5" />,
            academic: <GraduationCap className="w-5 h-5" />,
            pharmacy: <Pill className="w-5 h-5" />,
            scrubs: <Shirt className="w-5 h-5" />,
          };

          return (
            <button
              key={cat.key}
              onClick={() => handleCategorySelect(cat.key)}
              className={`group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white border-2 cursor-pointer ${
                isActive ? "border-medical-teal scale-[1.02] ring-4 ring-medical-teal/5" : "border-slate-100"
              }`}
            >
              <img
                src={cat.premiumImage}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/90 via-dark-blue/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4 text-white/90 bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                {iconMap[cat.key] || <Sparkles className="w-5 h-5" />}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                <p className="text-[10px] font-bold text-champagne-light tracking-widest uppercase mb-1">
                  {["year", "year-2-nd", "year-3-th", "clinical", "academic"].includes(cat.key)
                    ? "TRAINING KITS"
                    : ["medical-scrub", "lab-coat-", "scrubs"].includes(cat.key)
                    ? "MEDICAL ATTIRE"
                    : "CLINICAL GRADE"}
                </p>
                <h4 className="font-display font-bold text-lg leading-tight transition-colors group-hover:text-champagne-light">
                  {cat.name}
                </h4>
              </div>
            </button>
          );
        })}

        {/* Best Sellers Block */}
        <button
          onClick={() => handleCategorySelect("best")}
          className={`group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-medical-teal border-2 cursor-pointer ${
            selectedCategory === "best" ? "border-champagne-gold scale-[1.02] ring-4 ring-champagne-gold/5" : "border-slate-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white z-10 text-left">
            <Trophy className="w-8 h-8 text-champagne-gold mb-auto animate-bounce" />
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-widest mb-1">
              TOP RATED
            </p>
            <h4 className="font-display font-bold text-lg leading-tight group-hover:text-champagne-light transition-colors">
              Best Sellers
            </h4>
          </div>
        </button>
      </div>

      {/* SUB-CATEGORIES DIVISION SECTION - CRITICAL FOR SUB-DIRECTORIES */}
      {selectedCategory !== "best" && selectedCategory !== "all" && currentCategory && (
        <div className="mt-8 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-medical-teal uppercase bg-medical-teal/5 px-2.5 py-1 rounded">
                SUB-DEPARTMENT
              </span>
              <h4 className="font-display font-extrabold text-xl text-dark-blue mt-1">
                {currentCategory.name}
              </h4>
              <p className="text-slate-500 text-xs mt-0.5 max-w-2xl leading-relaxed">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Sub-Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubCategory("")}
              className={`px-5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer text-left flex flex-col border ${
                !selectedSubCategory
                  ? "bg-medical-teal text-white border-medical-teal shadow-md shadow-medical-teal/10 scale-[1.01]"
                  : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              <span className={`${!selectedSubCategory ? "text-champagne-light" : "text-slate-400"} text-[9px] font-bold uppercase`}>
                ALL
              </span>
              <span className="font-semibold text-sm mt-0.5">
                All Department Items
              </span>
            </button>
            {currentCategory.subCategories.map((sub) => {
              const isSubActive = selectedSubCategory === sub.key;
              return (
                <button
                  key={sub.key}
                  onClick={() => setSelectedSubCategory(sub.key)}
                  className={`px-5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer text-left flex flex-col border ${
                    isSubActive
                      ? "bg-medical-teal text-white border-medical-teal shadow-md shadow-medical-teal/10 scale-[1.01]"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <span className={`${isSubActive ? "text-champagne-light" : "text-slate-400"} text-[9px] font-bold uppercase`}>
                    CLICK TO BROWSE
                  </span>
                  <span className="font-semibold text-sm mt-0.5">
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Description of newly active subcategory */}
          {selectedSubCategory && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-sans flex items-start gap-2">
              <span className="inline-block px-1.5 py-0.5 bg-champagne-gold/10 text-champagne-gold rounded font-bold uppercase text-[9px]">
                {isAr ? "معلومات" : "INFO"}
              </span>
              <span>
                {
                  isAr
                    ? currentCategory.subCategories.find((s) => s.key === selectedSubCategory)?.arabicDescription
                    : currentCategory.subCategories.find((s) => s.key === selectedSubCategory)?.description
                }
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
