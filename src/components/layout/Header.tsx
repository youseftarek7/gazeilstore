import React from "react";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useStorefront, useCart } from "../../context";

export default function Header() {
  const { searchQuery, setSearchQuery, settings, setIsDrawerOpen, setCurrentView, setSelectedCategory, setSelectedSubCategory } = useStorefront();
  const { totalCount, setIsCartOpen } = useCart();
  const whatsappNumber = settings?.whatsapp || "201551905201";

  const handleLogoClick = () => {
    setCurrentView("home");
    setSelectedCategory("all");
    setSelectedSubCategory("");
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 h-full" dir="ltr">
        {/* Left Side: Brand & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 hover:bg-slate-100 transition-colors rounded-full text-slate-700 cursor-pointer active:scale-90"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-6 h-6 text-medical-teal" />
          </button>
          
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center cursor-pointer group select-none active:scale-95 transition-transform py-1"
            aria-label="Homepage"
          >
            <img 
              src={settings?.icon || "/icon.jpg"} 
              alt="Ghazal Dental Store Logo" 
              className="h-14 sm:h-16 md:h-[4.5rem] w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply scale-[1.15]"
            />
          </button>
        </div>

        {/* Center: Search Field (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-full py-2.5 pl-11 pr-5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal transition-all text-slate-800"
              placeholder="Search instruments, composites, years, scrubs..."
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Socials & Cart Button */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Facebook Link */}
          {settings?.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          )}

          {/* TikTok Link */}
          {settings?.tiktok && (
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors flex"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
          )}

          {/* Instagram Link */}
          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors flex"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}

          {/* WhatsApp Support Button */}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2.5 bg-emerald-50 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 group shadow-sm shrink-0"
              aria-label="WhatsApp Support"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          )}

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-3 relative bg-medical-teal text-white hover:bg-medical-light rounded-full transition-all duration-300 shadow-md shadow-medical-teal/10 hover:shadow-lg active:scale-95 cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-champagne-gold text-white font-bold text-[10.5px] w-5.5 h-5.5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
