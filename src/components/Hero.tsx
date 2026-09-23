/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Sparkles, ShieldCheck, Truck, ArrowRight, Award, Trophy, Zap, CheckCircle2, Star } from "lucide-react";

interface HeroProps {
  lang?: "en" | "ar";
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onScrollToProducts: () => void;
  content?: any;
  onSelectCategory?: (catKey: string) => void;
  onOpenProduct?: (productId: string) => void;
}

export default function Hero({ searchQuery, setSearchQuery, onScrollToProducts, content, onSelectCategory, onOpenProduct }: HeroProps) {
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onScrollToProducts();
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#f9fafc] via-[#eceef5] to-[#f9fafc] border-b border-slate-200 min-h-[500px] lg:min-h-[620px] flex items-center pt-24 pb-12 overflow-hidden text-slate-800">
      
      {/* Dynamic Immersive Premium Dental Store Background Layout */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.15] mix-blend-multiply transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('${content?.heroImage || "https://images.unsplash.com/photo-1629567947683-10ac7b9a5a22?auto=format&fit=crop&q=80&w=1600"}')`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Futuristic digital/clinical glow effects and soft lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-100/40 opacity-90 blur-3xl pointer-events-none transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-indigo-100/30 opacity-70 blur-3xl pointer-events-none"></div>

      {/* Clean geometric clinical micro-grid pattern for modern tech aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000001_1px,transparent_1px),linear-gradient(to_bottom,#00000001_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Block: Premium Copy & Search - Uncluttered Layout */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left">
            
            {/* Premium, Spacious & Highly Legible Search Bar */}
            <div className="relative max-w-lg w-full mx-auto lg:mx-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl blur-xs opacity-40"></div>
              
              <div className="relative bg-white rounded-xl shadow-sm border border-slate-300/80 overflow-hidden flex items-center py-1.5 px-2">
                <div className="p-2 text-slate-400">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  dir="ltr"
                  className="w-full h-10 bg-transparent text-slate-800 text-xs sm:text-sm focus:outline-none placeholder-slate-400 font-medium px-2"
                  placeholder="Search models, dental restoratives, tools..."
                />

                <button
                  onClick={onScrollToProducts}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-all font-bold text-xs cursor-pointer active:scale-95 shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Filter Indicators (No visual clutter) */}
            {content?.trendingLinks?.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
                <span className="text-slate-400 font-bold">Trending:</span>
                {content.trendingLinks.map((link: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (link.productId && onOpenProduct) {
                        onOpenProduct(link.productId);
                      } else if (link.categoryKey && onSelectCategory) {
                        onSelectCategory(link.categoryKey);
                      } else {
                        setSearchQuery(link.label);
                        onScrollToProducts();
                      }
                    }}
                    className="text-slate-600 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-300/75 transition-all text-[11px] font-semibold cursor-pointer active:scale-95"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {/* Title with Brushed Silver Highlight */}
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-[1.15] tracking-tight">
              {content?.heroTitle ? (
                content.heroTitle
              ) : (
                <>
                  Acquire Elite Clinical Gear <br />
                  <span className="bg-gradient-to-r from-slate-400 via-slate-800 to-slate-700 bg-clip-text text-transparent font-extrabold">
                    With Modern System Excellence
                  </span>
                </>
              )}
            </h2>

            {/* Clear Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
              {content?.heroSubtitle || "Your specialized source for certified student dental packages, laboratory tools, and clinical model typodonts engineered to last."}
            </p>

          </div>

          {/* Right Block: Safe Side-by-Side Dental Product Image Frame. Integrates beautifully on desktop and mobile! */}
          <div className="lg:col-span-5 relative flex justify-center w-full select-none animate-fade-in mt-4 lg:mt-0">
            {/* Elegant Brushed Silver Card (سيلفر تشد وميكونشي في زحمه) */}
            <div 
              onClick={() => {
                if (content?.heroCardCategoryKey && onSelectCategory) {
                  onSelectCategory(content.heroCardCategoryKey);
                }
              }}
              className={`relative w-full max-w-sm bg-gradient-to-b from-[#f8f8fa] to-[#e8e8ed] border border-slate-300/80 rounded-2xl p-4 shadow-lg ${content?.heroCardCategoryKey ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`}
            >
              
              {/* Elegant Medical/Premium glowing borders */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-medical-teal rounded-tl-md"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-md"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-md"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-medical-teal rounded-br-md"></div>

              {/* Clean Medical Store Tooth & Instrument Image Frame with high contrast */}
              <div className="h-56 sm:h-64 rounded-xl overflow-hidden relative bg-white border border-slate-50 shadow-inner flex items-center justify-center group">
                <img 
                  src={content?.heroCardImage || "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800"}
                  alt={content?.heroCardTitle || "Clinical Teeth model"}
                  className="w-full h-full object-contain p-2 opacity-90 transition-transform duration-[6s] brightness-[1.05] group-hover:scale-110 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Creative Neon HUD Overlay Gradients (From your orange-cyan image reference) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-orange-500/10 mix-blend-color-dodge"></div>
                <div className="absolute top-4 right-4 bg-orange-500/90 text-white font-mono text-[8.5px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>CALIBRATED</span>
                </div>
                
                {/* Visual Glassmorphed Gradient Tag overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4">
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="text-[9px] text-zinc-300 font-bold tracking-wider uppercase block">
                        {content?.heroCardSubtitle || "GHAZAL DENTAL SUITE"}
                      </span>
                      <span className="text-xs font-black block">
                        {content?.heroCardTitle || "3D Clinical Teeth Model"}
                      </span>
                    </div>
                    <span className="bg-white/95 text-slate-800 font-extrabold text-[8.5px] px-2 py-1 rounded shadow-xs">
                      {content?.heroCardTag || "TRAINING ED."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimal Clean Details Strip (Non-intrusive metadata summary - الملخص غير المزدحم) */}
              <div className="pt-3 pb-1 space-y-2">
                <div className="flex justify-between items-center text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-700">
                      Perfect Anatomical Detailing
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Interactive Jaw
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold justify-between pt-2 border-t border-slate-205">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-amber-500" strokeWidth={0} />
                    <span className="text-[10.5px]">5.0</span>
                    <span className="text-slate-500 font-medium text-[10px]">(180+ reviews)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm font-bold">
                    In Stock
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
