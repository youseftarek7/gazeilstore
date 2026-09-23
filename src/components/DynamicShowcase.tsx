import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Product } from "../types";

interface DynamicShowcaseProps {
  content: any;
  lang?: "en" | "ar";
  onViewProduct?: (productId: number) => void;
  onAddToCart?: (product: Product) => void;
  products?: Product[];
}

export default function DynamicShowcase({ content, onViewProduct, onAddToCart, products }: DynamicShowcaseProps) {
  const sliders = content?.customSliders || [];
  const banners = content?.customBanners || [];

  const catScrollRef = useRef<HTMLDivElement>(null);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      if (bannerScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bannerScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          bannerScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          bannerScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (sliders.length === 0 && banners.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Sliders (Categories or specific products) */}
        {sliders.length > 0 && (
          <div className="relative mb-12 group">
            <button onClick={() => scroll(catScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-medical-teal opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity disabled:opacity-0">
              <ChevronLeft />
            </button>
            
            <div ref={catScrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {sliders.map((slide: any, i: number) => {
                const product = slide.productId ? products?.find(p => String(p.id) === String(slide.productId) || p.firestoreId === String(slide.productId)) : null;
                const title = slide.title || (product ? product.name : "");
                const fallbackImg = product ? product.image : "https://placehold.co/400x300?text=Ghazal+Store";
                const image = slide.image && slide.image.trim().length > 4 ? slide.image : fallbackImg;
                
                return (
                  <div 
                    key={i} 
                    className="min-w-[240px] md:min-w-[280px] snap-center bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group/card relative"
                  >
                    <div className="cursor-pointer" onClick={() => { if (product && onViewProduct) onViewProduct(product.id); }}>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white flex items-center justify-center mb-3 relative border border-slate-50 shadow-sm">
                        <img src={image} alt={title} onError={(e) => { e.currentTarget.src = fallbackImg; }} className="w-full h-full object-cover rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] transition-transform duration-700 md:group-hover/card:scale-110" />
                      </div>
                      <h3 className="text-center font-bold text-slate-800 text-sm">{title}</h3>
                      {product && (
                        <div className="flex items-center gap-1.5 opacity-90 mt-1 justify-center">
                          <span className="font-bold text-medical-teal text-sm bg-medical-teal/10 px-2 py-0.5 rounded-md">
                            {product.price} EGP
                          </span>
                        </div>
                      )}
                    </div>
                      
                    {product && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) onAddToCart(product);
                        }}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-medical-teal text-white rounded-full flex items-center justify-center shadow-lg hover:bg-medical-light hover:scale-110 transition-all z-20"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => scroll(catScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-medical-teal opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity disabled:opacity-0">
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Banners Slider */}
        {banners.length > 0 && (
          <div className="relative group">
            <div ref={bannerScrollRef} className="flex overflow-x-auto snap-x snap-mandatory rounded-3xl shadow-lg border border-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {banners.map((banner: any, i: number) => {
                 const product = banner.productId ? products?.find(p => String(p.id) === String(banner.productId) || p.firestoreId === String(banner.productId)) : null;
                 const fallbackImg = product ? product.image : "https://placehold.co/1200x400?text=Ghazal+Store";
                 const image = banner.image && banner.image.trim().length > 4 ? banner.image : fallbackImg;
                 return (
                  <div 
                    key={i} 
                    className="min-w-full snap-center relative cursor-pointer group/banner"
                    onClick={() => {
                      if (product && onViewProduct) {
                        onViewProduct(product.id);
                      }
                    }}
                  >
                    <div className="aspect-[21/9] md:aspect-[3/1] bg-white w-full relative overflow-hidden flex items-center justify-center border border-slate-100 rounded-3xl">
                      <img src={image} alt="Banner" onError={(e) => { e.currentTarget.src = fallbackImg; }} className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105" />
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
