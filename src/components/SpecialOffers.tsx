/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Clock, Percent, ShieldCheck, Flame, ChevronRight, ChevronLeft, Gift } from "lucide-react";
import { Product, StorePackage } from "../types";

interface SpecialOffersProps {
  lang?: "en" | "ar";
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
  content?: any;
  packages?: StorePackage[];
  products?: Product[];
}

interface PromoOffer {
  id: number;
  code: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  image: string;
  tag: string;
  arabicTag?: string;
  bullets: string[];
  arabicBullets?: string[];
  timeLeftSeconds: number; // initial ticking time
  productIds?: string[];
}

export default function SpecialOffers({ onAddToCart, onOpenCart, content, packages = [], products = [] }: SpecialOffersProps) {
  // Simulated ticking timers for FOMO
  const [timers, setTimers] = useState<{ [key: number]: number }>({
    1: 4235,  // 1 hr 10 min 35 s
    2: 7890,  // 2 hr 11 min 30 s
    3: 11450, // 3 hr 10 min 50 s
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        for (const key in next) {
          if (next[key] > 0) {
            next[key] -= 1;
          } else {
            next[key] = 12000; // loop reset
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const offers: PromoOffer[] = [];

  const handleClaimOffer = (promo: PromoOffer) => {
    // Convert PromoOffer to a Product object structure
    const promoProduct: Product = {
      id: promo.id,
      code: promo.code,
      name: promo.name,
      price: promo.dealPrice,
      image: promo.image,
      tag: "SPECIAL BUNDLE",
      categoryKey: "special-bundle",
      subCategoryKey: "offers",
      description: promo.description,
      specifications: promo.bullets,
      inStock: true,
      rating: 5.0,
      reviewsCount: 38
    };

    onAddToCart(promoProduct, 1);
    onOpenCart();
  };

  const packageOffers: PromoOffer[] = packages.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description,
    originalPrice: item.originalPrice,
    dealPrice: item.dealPrice,
    discountPercent: item.discountPercent,
    image: item.image,
    tag: item.tag,
    bullets: item.bullets || [],
    timeLeftSeconds: item.timeLeftSeconds,
    productIds: item.productIds || [],
  }));
  const displayOffers: PromoOffer[] =
    packageOffers.length > 0 ? packageOffers : Array.isArray(content?.offers) && content.offers.length > 0 ? content.offers : offers;

  useEffect(() => {
    setTimers((current) => {
      const next = { ...current };
      displayOffers.forEach((offer) => {
        if (!next[offer.id]) next[offer.id] = Number(offer.timeLeftSeconds || 7200);
      });
      return next;
    });
  }, [displayOffers.map((offer) => offer.id).join("|")]);

  if (displayOffers.length === 0) return null;

  return (
    <section 
      dir="ltr"
      className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-10 pb-4"
      id="special-offers"
    >
      {/* Visual Header Banner Spark */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-champagne-gold uppercase tracking-widest bg-champagne-light/30 border border-champagne-gold/25 px-3 py-1.5 rounded-full mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            <span>{content?.offersEyebrow || "EXCITEMENT CORNER - EXCLUSIVE BUNDLES"}</span>
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl text-dark-blue flex items-center gap-2">
            {content?.offersTitle || "High-Impact Deals & Savings"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {content?.offersSubtitle || "Save double on student essential sets and clinical restoration packages. Vetted for legal class requirements."}
          </p>
        </div>
      </div>

      {/* Offers Showcase Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {displayOffers.map((promo) => (
          <div 
            key={promo.id}
            id={`offer-${promo.id}`}
            className="flex flex-col bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800/95 relative group hover:scale-[1.01] transition-all duration-300"
          >
            <span id={`offer-${promo.code}`} className="absolute -top-24" aria-hidden="true"></span>
            {/* Promo Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-gradient-to-r from-champagne-gold to-gold-hover text-slate-950 text-[10px] font-black uppercase px-3.5 py-1.5 rounded-xl shadow-md tracking-wider">
                {promo.tag}
              </span>
            </div>

            {/* Discount Percentage Floating Badge */}
            {promo.discountPercent > 0 && (
              <div className="absolute top-4 right-4 z-10 flex flex-col items-center bg-rose-600 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-md border border-rose-500 animate-pulse">
                <span>{`-${promo.discountPercent}%`}</span>
              </div>
            )}

            {/* Top Product Image */}
            <div className="h-56 relative overflow-hidden bg-slate-950">
              <img 
                src={promo.image} 
                alt={promo.name} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 brightness-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-5">
                {/* Simulated Ticking Countdown */}
                <div className="inline-flex items-center gap-2 bg-rose-600/90 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-xl shadow-lg border border-rose-500/30">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="font-mono tracking-wider">{formatTime(timers[promo.id] || 4230)}</span>
                  <span className="text-[9.5px] border-l border-white/30 pl-1.5 ml-1 select-none">
                    Offer ends
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Desc */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <h4 className="font-display font-bold text-lg text-white group-hover:text-champagne-gold tracking-tight min-h-[48px] flex items-center leading-snug">
                  {promo.name}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {promo.description}
                </p>

                {/* Bullets List */}
                <ul className="space-y-2 pt-2 border-t border-slate-800/60">
                  {promo.bullets.slice(0, 3).map((b, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[11.5px] text-slate-300">
                      <span className="text-emerald-500 font-black">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                  {(!promo.productIds || promo.productIds.length === 0) && (
                    <li className="flex gap-2 items-start text-[10px] text-slate-400">
                      <Gift className="w-3.5 h-3.5 text-champagne-gold" />
                      <span>+ Free clinic gift & protective casing</span>
                    </li>
                  )}
                </ul>

                {/* Included Products Mini-Gallery */}
                {promo.productIds && promo.productIds.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/60">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      Package Contents:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {promo.productIds.map(pid => {
                        const prod = products.find(p => String(p.id) === String(pid) || p.firestoreId === String(pid));
                        if (!prod) return null;
                        return (
                          <div key={pid} className="flex items-center gap-1.5 bg-slate-800/50 rounded-lg p-1 pr-2 border border-slate-700/50">
                            <img src={prod.image || "https://placehold.co/100x100"} alt={prod.name} className="w-6 h-6 rounded object-cover bg-white" />
                            <span className="text-[9px] text-slate-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]" title={prod.name}>
                              {prod.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Tag & Add-to-cart call */}
              <div className="pt-4 border-t border-slate-800/80 mt-auto flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  {/* Original Strikethrough Price */}
                  {promo.originalPrice > promo.dealPrice && promo.originalPrice > 0 && (
                    <span className="text-xs text-slate-400 font-mono line-through tracking-wider">
                      {`${promo.originalPrice} EGP`}
                    </span>
                  )}
                  {/* Glowing Premium Deal Price */}
                  <span className="text-xl font-display font-black text-champagne-gold tracking-tight" dir="ltr">
                    {`${promo.dealPrice} EGP`}
                  </span>
                </div>

                <button
                  onClick={() => handleClaimOffer(promo)}
                  className="px-5 py-3 bg-gradient-to-r from-champagne-gold to-gold-hover text-slate-950 text-xs font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-champagne-gold/15"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Claim Ultimate Deal</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
