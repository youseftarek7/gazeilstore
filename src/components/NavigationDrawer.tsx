/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Category } from "../types";
import { X, Shield, Landmark, GraduationCap, Pill, Shirt, Trophy, ClipboardList, LayoutGrid } from "lucide-react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ar";
  categories: Category[];
  onSelectCategory: (catKey: string, subCatKey?: string) => void;
  content?: any;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  lang,
  categories,
  onSelectCategory,
  content,
}: NavigationDrawerProps) {
  if (!isOpen) return null;
  const isAr = lang === "ar";

  const handleLinkClick = (catKey: string, subCatKey?: string) => {
    onSelectCategory(catKey, subCatKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-dark-blue/50 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      <div className="absolute inset-y-0 left-0 max-w-full flex">
        {/* Drawer container panel */}
        <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-xl text-medical-teal">
                Ghazal Dental
              </h2>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                {isAr ? "مستلزمات ومعدات فاخرة" : "Premium Products & Kits"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            
            {/* Quick Catalog Shortcuts */}
            <div className="space-y-1">
              <span className="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Main Departments
              </span>

              <button
                onClick={() => handleLinkClick("all")}
                className="w-full flex items-center gap-3.5 px-3 py-3 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl font-semibold text-sm text-left cursor-pointer"
              >
                <LayoutGrid className="w-5 h-5 text-medical-teal" />
                <span>All Products (313 Items)</span>
              </button>

              <button
                onClick={() => handleLinkClick("best")}
                className="w-full flex items-center gap-3.5 px-3 py-3 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl font-semibold text-sm text-left cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-champagne-gold" />
                <span>Best Seller Items</span>
              </button>

              {categories.map((cat) => {
                const iconMap: Record<string, React.ReactNode> = {
                  year: <GraduationCap className="w-5 h-5 text-medical-teal" />,
                  "year-2-nd": <GraduationCap className="w-5 h-5 text-medical-teal" />,
                  "year-3-th": <GraduationCap className="w-5 h-5 text-medical-teal" />,
                  clinical: <GraduationCap className="w-5 h-5 text-medical-teal" />,
                  "year-4-th": <Landmark className="w-5 h-5 text-medical-teal" />,
                  "medical-scrub": <Shirt className="w-5 h-5 text-medical-teal" />,
                  "lab-coat-": <Shirt className="w-5 h-5 text-medical-teal" />,
                  "pharmacy-": <Pill className="w-5 h-5 text-medical-teal" />,
                  clinics: <Landmark className="w-5 h-5 text-medical-teal" />,
                  academic: <GraduationCap className="w-5 h-5 text-medical-teal" />,
                  pharmacy: <Pill className="w-5 h-5 text-medical-teal" />,
                  scrubs: <Shirt className="w-5 h-5 text-medical-teal" />,
                };

                return (
                  <button
                    key={cat.key}
                    onClick={() => handleLinkClick(cat.key)}
                    className="w-full flex items-center gap-3.5 px-3 py-3 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl font-semibold text-sm text-left cursor-pointer"
                  >
                    {iconMap[cat.key] || <GraduationCap className="w-5 h-5 text-medical-teal" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Sidebar Links (Dynamic) */}
            {content?.sidebarLinks?.length > 0 && (
              <div className="space-y-1">
                <span className="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {isAr ? "روابط سريعة" : "QUICK NAVIGATION"}
                </span>

                {content.sidebarLinks.map((link: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(link.categoryKey, link.subCategoryKey)}
                    className="w-full flex items-center gap-3.5 px-4 py-2 text-xs text-slate-500 hover:text-medical-teal hover:bg-medical-teal/5 transition-colors rounded-lg text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-champagne-gold rounded-full shrink-0"></span>
                    <span className="truncate">{isAr ? link.arLabel : link.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Customer Trust Information */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-medical-teal">
                <Shield className="w-4 h-4 text-champagne-gold" />
                <span>{isAr ? "ضمان غزال لطب الأسنان" : "Ghazal Dental Trust"}</span>
              </div>
              <p className="leading-relaxed font-sans">
                {isAr
                  ? "جميع المواد والحقائب والأدوات معتمدة ومطابقة لتعليمات اللجان العلمية لكليات طب الأسنان ومضمونة الاستبدال."
                  : "All instruments and students packages conform fully with academic regulations. High durability is guaranteed."}
              </p>
            </div>
          </nav>

          {/* Drawer Footer info */}
          <div className="p-6 border-t border-slate-100 text-center text-[10.5px] text-slate-400 font-sans space-y-3">
            <p className="text-[9.5px]">{isAr ? "صنع بحب للطلاب والعيادات" : "Crafted for students & clinicians"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
