import React from "react";
import { Sparkles, ShoppingBag, Eye } from "lucide-react";
import { useStorefront, useCart } from "../../context";

export default function DynamicShowcase() {
  const { homepage, products, openProductDetails } = useStorefront();
  const { addToCart, setIsCartOpen } = useCart();

  const customSliders = homepage?.customSliders || [];
  const customBanners = homepage?.customBanners || [];

  if (customSliders.length === 0 && customBanners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16 space-y-12" dir="ltr">
      {/* Dynamic Sliders / Banners */}
      {customSliders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-champagne-gold" />
            <h3 className="font-display font-black text-xl text-dark-blue">
              Featured Spotlights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customSliders.map((slide, index) => {
              const matchedProduct = products.find(
                (p) => String(p.id) === String(slide.productId) || p.firestoreId === String(slide.productId)
              );

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (matchedProduct) openProductDetails(matchedProduct);
                  }}
                  className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg cursor-pointer h-64 flex flex-col justify-end p-6 hover:scale-[1.01] transition-all"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  <div className="relative z-10 space-y-2">
                    <h4 className="font-display font-black text-lg text-white group-hover:text-champagne-gold transition-colors">
                      {slide.title}
                    </h4>

                    {matchedProduct && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/20">
                        <span className="text-sm font-bold text-champagne-gold">
                          {matchedProduct.price.toFixed(2)} EGP
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(matchedProduct, 1);
                            setIsCartOpen(true);
                          }}
                          className="px-3 py-1.5 bg-medical-teal text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow hover:bg-medical-light"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
