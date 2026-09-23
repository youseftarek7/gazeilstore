/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, Landmark, ShieldCheck, Sparkles, MoveRight, ArrowUpRight, Flame } from "lucide-react";
import { Product } from "../types";

interface HomeSplitProps {
  lang?: "en" | "ar";
  onSelectCategory: (catKey: string, subCatKey?: string) => void;
  products?: Product[];
  onOpenProduct?: (product: Product) => void;
  content?: any;
}

export default function HomeSplit({ onSelectCategory, products = [], onOpenProduct, content }: HomeSplitProps) {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const academicFeatures = content?.academicFeatures || ["Autoclavable Dental Models", "Medical Wax & Carver Sets"];
  const clinicsFeatures = content?.clinicsFeatures || ["Microbrush & Curing Lights", "Super Stainless Steel Forceps"];
  const adminDestinationCards = Array.isArray(content?.destinationCards) ? content.destinationCards : [];
  const productDestinationCards = products
    .filter((product) => product.showInHomeSplit)
    .map((product) => ({
      id: `product-${product.firestoreId || product.code || product.id}`,
      actionType: "product",
      productCode: product.code,
      productId: product.firestoreId || product.id,
      title: product.splitTitle || product.name,
      description: product.splitDescription || product.description,
      image: product.splitImage || product.image,
      badge: product.splitBadge || product.tag || "PRODUCT",
      label: product.splitLabel || product.code,
      features: product.splitFeatures || product.specifications?.slice(0, 2) || [],
      buttonText: product.splitButtonText || "Open Product",
    }));
  const destinationCards = [...adminDestinationCards, ...productDestinationCards];
  const runCardAction = (card: any) => {
    const actionType = card.actionType || "category";

    if (actionType === "url" && card.url) {
      window.open(card.url, card.openInNewTab === false ? "_self" : "_blank");
      return;
    }

    if (actionType === "offer") {
      const target = card.offerId ? document.getElementById(`offer-${card.offerId}`) : document.getElementById("special-offers");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (actionType === "scroll" && card.targetId) {
      document.getElementById(card.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (actionType === "product") {
      const product = products.find(
        (item) =>
          item.code === card.productCode ||
          String(item.id) === String(card.productId) ||
          String(item.firestoreId) === String(card.productId),
      );
      if (product && onOpenProduct) {
        onOpenProduct(product);
        return;
      }
    }

    onSelectCategory(card.categoryKey || "best", card.subCategoryKey);
  };

  return (
    <section 
      dir="ltr"
      className="max-w-7xl mx-auto px-4 md:px-8 mt-12"
      id="home-split-decision"
    >
      {destinationCards.length > 0 && (
        <>
          {/* Visual Accent Badge to capture attention */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-champagne-gold uppercase tracking-widest bg-champagne-light/20 border border-champagne-gold/25 px-4 py-2 rounded-full mb-3 select-none">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse animate-bounce" />
              <span>{content?.splitEyebrow || "EXPLORE BY YOUR PROFESSIONAL FIELD"}</span>
            </span>
            <h3 className="font-display font-black text-2xl md:text-3.5xl text-dark-blue tracking-tight">
              {content?.splitTitle || "Tailored Destination Hubs"}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mt-1">
              {content?.splitSubtitle || "Jump instantly into bespoke dental assets filtered directly for your specific medical class or clinical practice."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {destinationCards.map((card: any, index: number) => {
            const features = Array.isArray(card.features) ? card.features : [];
            return (
              <div
                key={card.id || card.categoryKey || index}
                onClick={() => runCardAction(card)}
                className="relative min-h-[360px] overflow-hidden rounded-3xl border border-slate-250/90 shadow-md cursor-pointer select-none transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
              >
                <img
                  src={card.image || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="}
                  alt={card.title || "Destination card"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[6s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/10"></div>
                <div className="absolute top-4 left-4 z-10">
                  <span className="rounded-full bg-medical-teal px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    {card.badge || "PORTAL"}
                  </span>
                </div>
                <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-6 text-white md:p-10">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-champagne-gold">
                    {card.label || ""}
                  </span>
                  <h4 className="font-display text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                    {card.title || "Untitled Card"}
                  </h4>
                  <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {card.description || ""}
                  </p>
                  {features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {features.map((feature: string) => (
                        <span key={feature} className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] text-white">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="group mt-6 flex items-center gap-2 text-xs font-bold text-champagne-gold">
                    <span className="underline decoration-current underline-offset-4">{card.buttonText || "Open Section"}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}
    </section>
  );
}
