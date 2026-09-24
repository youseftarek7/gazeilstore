import React, { useRef } from "react";
import { useStorefront } from "../../context";
import { useFilteredProducts } from "../../hooks";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const {
    products,
    categories,
    selectedCategory,
    selectedSubCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    onlyInStock,
    setOnlyInStock,
    resetFilters,
  } = useStorefront();

  const catalogRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useFilteredProducts({
    products,
    selectedCategory,
    selectedSubCategory,
    searchQuery,
    sortBy,
    onlyInStock,
  });

  const activeCategoryObject = categories.find((c) => c.key === selectedCategory);

  return (
    <section ref={catalogRef} className="max-w-7xl mx-auto px-4 md:px-8 mt-14 scroll-mt-24" id="inventory-grid" dir="ltr">
      {/* Top Header & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 p-6 bg-white border border-slate-100/80 rounded-2xl shadow-xs">
        <div>
          {searchQuery.trim() !== "" ? (
            <>
              <span className="text-[10px] uppercase tracking-widest font-bold text-champagne-gold bg-champagne-light/25 px-2.5 py-1 rounded">
                SEARCH RESULTS
              </span>
              <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                Results for "{searchQuery}"
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Revealed {filteredProducts.length} matching items
              </p>
            </>
          ) : selectedCategory === "all" ? (
            <>
              <span className="text-[10px] uppercase tracking-widest font-bold text-medical-teal bg-medical-teal/5 px-2.5 py-1 rounded">
                ALL STORE PRODUCTS
              </span>
              <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                All Dental Products ({filteredProducts.length})
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Browse our full catalog of dental instruments, materials, university kits, and medical apparel.
              </p>
            </>
          ) : selectedCategory === "best" ? (
            <>
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                HIGHLY RECOMMENDED
              </span>
              <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                Best Sellers & Most Trusted ({filteredProducts.length})
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Core clinical files and kits highly praised by both doctors and senior university students.
              </p>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-widest font-bold text-medical-teal bg-medical-teal/5 px-2.5 py-1 rounded">
                DEPARTMENT CATALOG
              </span>
              <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                {`${activeCategoryObject?.name || "Department"} - ${
                  activeCategoryObject?.subCategories.find((s) => s.key === selectedSubCategory)?.name || "All Items"
                }`}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Click details to inspect medical registration codes and technical specifications.
              </p>
            </>
          )}
        </div>

        {/* Filter / Sort Controls */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Checkbox In Stock */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/65 hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-medical-teal border-slate-300 focus:ring-medical-teal/20 w-4 h-4 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">High Rated First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <span className="text-5xl block mb-3">🔍</span>
          <h4 className="font-display font-extrabold text-lg text-dark-blue">
            No products found!
          </h4>
          <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto font-sans leading-relaxed">
            Try typing simple keywords (e.g. 'Scrub', 'Composite', or 'Kit'), or disable 'In Stock Only' flag to show more items.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-medical-teal text-white font-bold text-xs rounded-xl hover:bg-medical-light transition-all cursor-pointer shadow active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
