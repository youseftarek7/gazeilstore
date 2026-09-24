import React from "react";
import { Product } from "../../types";
import { Star, ShoppingCart, Eye, Check } from "lucide-react";
import { useCart, useStorefront } from "../../context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { openProductDetails } = useStorefront();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div
      onClick={() => openProductDetails(product)}
      className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image area */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-6 border-b border-slate-50">
        <img
          src={product.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"}
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("unsplash")) {
              target.src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80";
            }
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-800 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-xs">
            {product.tag}
          </span>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <span className="uppercase">{product.code}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
            </div>
          </div>

          <h4 className="font-display font-bold text-sm text-dark-blue line-clamp-2 leading-snug group-hover:text-medical-teal transition-colors" title={product.name}>
            {product.name}
          </h4>

          <p className="text-slate-400 text-xs line-clamp-2 font-sans leading-relaxed">
            {product.description || product.arabicDescription || "Clinical dental supplies and materials."}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Price</span>
            <span className="text-base font-black text-medical-teal font-sans">
              {product.price.toFixed(2)} EGP
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                product.inStock
                  ? "bg-slate-100 hover:bg-medical-teal text-slate-700 hover:text-white active:scale-90"
                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
