import React from "react";
import { ArrowLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { useStorefront } from "../../context";
import { useFilteredProducts } from "../../hooks";
import ProductCard from "../product/ProductCard";

export default function CategoryPage() {
  const {
    products,
    categories,
    selectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    sortBy,
    setSortBy,
    onlyInStock,
    setOnlyInStock,
    setCurrentView,
    setSelectedCategory,
  } = useStorefront();

  const currentCat = categories.find((c) => c.key === selectedCategory) || categories[0];

  const filteredProducts = useFilteredProducts({
    products,
    selectedCategory,
    selectedSubCategory,
    searchQuery,
    sortBy,
    onlyInStock,
  });

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedCategory("best");
    setSelectedSubCategory("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6" dir="ltr">
      {/* Breadcrumb / Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-dark-blue bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>

        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {currentCat?.name || "Department"}
        </span>
      </div>

      {/* Hero Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12 mb-8 shadow-xl">
        <img
          src={currentCat?.premiumImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop&q=80"}
          alt={currentCat?.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-champagne-gold bg-champagne-light/20 px-3 py-1 rounded-full border border-champagne-gold/30">
            <Layers className="w-3 h-3" />
            <span>DEPARTMENT SHOWCASE</span>
          </span>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white">
            {currentCat?.name}
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">
            {currentCat?.description || currentCat?.arabicDescription}
          </p>
        </div>
      </div>

      {/* Subcategory Pills Bar */}
      {currentCat?.subCategories && currentCat.subCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedSubCategory("")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubCategory === ""
                ? "bg-medical-teal text-white shadow-md shadow-medical-teal/20"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            All Subcategories ({filteredProducts.length})
          </button>

          {currentCat.subCategories.map((sub) => (
            <button
              key={sub.key}
              onClick={() => setSelectedSubCategory(sub.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubCategory === sub.key
                  ? "bg-medical-teal text-white shadow-md shadow-medical-teal/20"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Filter / Sort bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <p className="text-xs font-bold text-slate-600">
          Showing <span className="text-medical-teal">{filteredProducts.length}</span> items in this department
        </p>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/65 hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-medical-teal border-slate-300 focus:ring-medical-teal/20 w-4 h-4 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-medical-teal/20 cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">High Rated First</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <span className="text-5xl block mb-3">📦</span>
          <h4 className="font-display font-extrabold text-lg text-dark-blue">No products in this subcategory</h4>
          <p className="text-slate-400 text-xs mt-2">Try clearing filters or choosing another subcategory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
