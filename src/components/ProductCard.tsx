/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Product } from "../types";
import { ShoppingCart, Eye, Star } from "lucide-react";

interface ProductCardProps {
  key?: any;
  product: Product;
  lang: "en" | "ar";
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

export default function ProductCard({ product, lang, onAddToCart, onViewDetails }: ProductCardProps) {
  const isAr = lang === "ar";

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
        <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Product Tag Badge (Best seller, popular etc.) */}
      {product.tag && (
        <span className="absolute top-3 left-3 bg-medical-teal/15 text-medical-teal text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 uppercase tracking-wider">
          {product.tag}
        </span>
      )}

      {/* Product Image Area */}
      <div className="relative overflow-hidden rounded-xl aspect-square bg-slate-50 mb-4 flex items-center justify-center">
        <img
          src={product.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"}
          alt={product.name || "Ghazal Dental"}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("unsplash")) {
              target.src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80";
            }
          }}
          className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Hover interaction overlays */}
        <div className="absolute inset-0 bg-dark-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="p-3 bg-white text-dark-blue rounded-full hover:bg-champagne-gold hover:text-white shadow-md transition-all cursor-pointer transform hover:scale-110 active:scale-95"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Description details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-1 mb-1">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
            {product.code}
          </span>
          {renderRatingStars(product.rating)}
        </div>

        <h4 className="font-display font-bold text-sm text-dark-blue leading-snug group-hover:text-medical-teal transition-colors line-clamp-1">
          {product.name}
        </h4>

        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2 h-8 font-sans">
          {product.description || "Certified university dental supplies and clinical grade materials."}
        </p>

        {/* Pricing tag & stock details */}
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-medical-teal font-extrabold text-lg tracking-tight" dir="ltr">
            {product.price.toFixed(2)} EGP
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
              product.inStock
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => onViewDetails(product)}
          className="flex-1 p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
        
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`flex-1 p-2 ${
            product.inStock
              ? "bg-medical-teal hover:bg-medical-light text-white cursor-pointer active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
          } text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
