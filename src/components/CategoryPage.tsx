/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Category, Product } from "../types";
import { ArrowLeft, ArrowRight, Star, ShoppingCart, Eye, Landmark, GraduationCap, Pill, Shirt, Sparkles, SlidersHorizontal, PackageCheck } from "lucide-react";
import ProductCard from "./ProductCard";

interface CategoryPageProps {
  categoryKey: string;
  subCategoryKey: string;
  setSubCategoryKey: (key: string) => void;
  lang: "en" | "ar";
  products: Product[];
  categories: Category[];
  sortBy: "default" | "price-low" | "price-high" | "rating";
  setSortBy: (sort: "default" | "price-low" | "price-high" | "rating") => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  onBackToHome: () => void;
}

export default function CategoryPage({
  categoryKey,
  subCategoryKey,
  setSubCategoryKey,
  lang,
  products,
  categories,
  sortBy,
  setSortBy,
  onlyInStock,
  setOnlyInStock,
  onAddToCart,
  onViewDetails,
  onBackToHome,
}: CategoryPageProps) {
  const isAr = lang === "ar";
  const currentCategory = categories.find((c) => c.key === categoryKey);

  if (!currentCategory) return null;

  const iconMap: Record<string, React.ReactNode> = {
    year: <GraduationCap className="w-8 h-8 text-medical-teal" />,
    "year-2-nd": <GraduationCap className="w-8 h-8 text-medical-teal" />,
    "year-3-th": <GraduationCap className="w-8 h-8 text-medical-teal" />,
    clinical: <GraduationCap className="w-8 h-8 text-medical-teal" />,
    "year-4-th": <Landmark className="w-8 h-8 text-medical-teal" />,
    "medical-scrub": <Shirt className="w-8 h-8 text-medical-teal" />,
    "lab-coat-": <Shirt className="w-8 h-8 text-medical-teal" />,
    "pharmacy-": <Pill className="w-8 h-8 text-medical-teal" />,
    clinics: <Landmark className="w-8 h-8 text-medical-teal" />,
    academic: <GraduationCap className="w-8 h-8 text-medical-teal" />,
    pharmacy: <Pill className="w-8 h-8 text-medical-teal" />,
    scrubs: <Shirt className="w-8 h-8 text-medical-teal" />,
  };

  // Filter products by category and subcategory
  const filteredCategoryProducts = products.filter((product) => {
    const pCat = (product.categoryKey || "").trim();
    const targetCat = (categoryKey || "").trim();
    const catMatch = pCat === targetCat || (product as any).categoryId === targetCat;
    if (!catMatch) return false;

    if (subCategoryKey) {
      const pSub = (product.subCategoryKey || "").trim();
      const targetSub = subCategoryKey.trim();
      const subMatch = pSub === targetSub ||
                       pSub.replace(/-+$/, "") === targetSub.replace(/-+$/, "") ||
                       pSub.toLowerCase() === targetSub.toLowerCase();
      if (!subMatch) return false;
    }

    if (onlyInStock && !product.inStock) return false;
    return true;
  });

  // Sort products
  const sortedCategoryProducts = [...filteredCategoryProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-20 animate-fade-in">
      {/* Navigation Breadcrumb / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <button
          onClick={onBackToHome}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 hover:text-medical-teal border border-slate-100/90 rounded-2xl hover:border-slate-200 transition-all text-xs font-semibold cursor-pointer shadow-sm active:scale-95"
          id="btn-back-home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="cursor-pointer hover:underline hover:text-medical-teal" onClick={onBackToHome}>
            Home
          </span>
          <span>/</span>
          <span className="font-bold text-slate-600">
            {currentCategory.name}
          </span>
        </div>
      </div>

      {/* Brand Hero Banner specific to key category */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-900 h-60 md:h-72 mb-10 flex items-center">
        <img
          src={currentCategory.premiumImage}
          alt={currentCategory.name}
          className="absolute inset-0 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-10000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10"></div>
        
        {/* Banner Content */}
        <div className="relative z-20 max-w-xl px-6 md:px-12 text-left ml-auto text-left">
          <div className="flex items-center gap-3 mb-3 justify-start">
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md text-white">
              {iconMap[categoryKey] 
                ? React.cloneElement(iconMap[categoryKey] as React.ReactElement, { className: "w-8 h-8 text-white" })
                : <PackageCheck className="w-8 h-8 text-white" />
              }
            </span>
            <span className="text-[10px] tracking-widest font-black uppercase text-champagne-gold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded">
              OFFICIALLY ACCREDITED DEPT
            </span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-2 drop-shadow-md">
            {currentCategory.name}
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed drop-shadow-md">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Grid Layout: Left sidebar filters (destructed), main list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar filters and subcategories navigation */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Subcategories division selector cards */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
                <span>Subcategories</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Toggle tabs to view items
              </p>
            </div>

            <div className="space-y-2.5">
              {/* "All" button custom */}
              <button
                onClick={() => setSubCategoryKey("")}
                className={`w-full p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer border flex flex-col justify-center ${
                  subCategoryKey === ""
                    ? "bg-medical-teal text-white border-medical-teal shadow-md shadow-medical-teal/5"
                    : "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100"
                }`}
              >
                <span className={`text-[8px] uppercase font-bold ${subCategoryKey === "" ? "text-champagne-light" : "text-slate-400"}`}>
                  GENERAL LISTING
                </span>
                <span className="font-bold text-sm mt-0.5">
                  All Products
                </span>
              </button>

              {currentCategory.subCategories.map((sub, idx) => {
                const subKey = sub.key || sub.name;
                const isActive = subCategoryKey === subKey;
                return (
                  <button
                    key={idx}
                    onClick={() => setSubCategoryKey(subKey)}
                    className={`w-full p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer border flex flex-col justify-center ${
                      isActive
                        ? "bg-medical-teal text-white border-medical-teal shadow-md shadow-medical-teal/5"
                        : "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`text-[8px] uppercase font-bold ${isActive ? "text-champagne-light" : "text-slate-400"}`}>
                      SPECIALTY GRADE
                    </span>
                    <span className="font-bold text-xs mt-0.5">
                      {sub.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct WhatsApp Call banner */}
          <div className="bg-emerald-50/75 border border-emerald-100 rounded-3xl p-5 text-center space-y-3">
            <span className="text-xl block">💬</span>
            <h4 className="font-display font-extrabold text-sm text-emerald-800">
              Need Instant Advice?
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Talk to our medical team on WhatsApp to confirm specifications and orders.
            </p>
            <a
              href="https://wa.me/201551905201"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#25D366] text-white hover:brightness-105 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Direct WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Main Products Grid right-hand side */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sort bar & Results count */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-slate-500 text-xs font-sans">
                Showing category products:
              </p>
              <h3 className="font-display font-black text-sm text-dark-blue mt-0.5">
                {subCategoryKey
                  ? currentCategory.subCategories.find((s) => (s.key || s.name) === subCategoryKey)?.name
                  : "All Department catalog items"}
                <span className="text-slate-400 font-mono text-xs ml-2">
                  ({sortedCategoryProducts.length})
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Only in stock */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-medical-teal border-slate-200 focus:ring-medical-teal/20 w-4.5 h-4.5"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active subcategory description box */}
          {subCategoryKey && (
            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 font-sans flex items-start gap-3">
              <span className="text-lg">📢</span>
              <div>
                <strong className="text-dark-blue block font-display mb-0.5">
                  Academic & Clinical Guidance notes
                </strong>
                <span>
                  {currentCategory.subCategories.find((s) => (s.key || s.name) === subCategoryKey)?.description}
                </span>
              </div>
            </div>
          )}

          {/* Grid list containing the elements */}
          {sortedCategoryProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100/80 rounded-3xl shadow-sm">
              <span className="text-5xl block mb-3">📦</span>
              <h4 className="font-display font-black text-lg text-dark-blue">
                No instruments available here!
              </h4>
              <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto font-sans leading-relaxed">
                We are currently out of stock for this specific level. Please deselect 'In Stock Only' to view coming shipments.
              </p>
              <button
                onClick={() => {
                  setSubCategoryKey("");
                  setOnlyInStock(false);
                }}
                className="mt-5 px-5 py-2.5 bg-medical-teal text-white font-bold text-xs rounded-xl hover:bg-medical-light transition-all cursor-pointer shadow active:scale-95"
              >
                Browse All Category items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedCategoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
