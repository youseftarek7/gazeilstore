import React from "react";
import { X, PhoneCall, MessageSquare, MapPin, ChevronRight, GraduationCap, ShieldCheck, Stethoscope } from "lucide-react";
import { useStorefront } from "../../context";

export default function NavigationDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, categories, selectDepartment, settings } = useStorefront();
  if (!isDrawerOpen) return null;

  const storePhone = settings?.phone || "01007070766";
  const storeWhatsapp = settings?.whatsapp || "201551905201";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" dir="ltr">
      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow">
                  🦷
                </span>
                <div>
                  <h3 className="font-display font-black text-lg text-dark-blue tracking-tight">Ghazal Dental</h3>
                  <p className="text-[10.5px] font-sans text-slate-400 font-medium">Departments & Categories</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter actions */}
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    selectDepartment("all");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-left font-sans font-bold text-xs text-dark-blue flex items-center justify-between group transition-colors"
                >
                  <span>All Catalog (313)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-medical-teal transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => {
                    selectDepartment("best");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3 bg-champagne-light/30 hover:bg-champagne-light/60 border border-champagne-gold/30 rounded-xl text-left font-sans font-bold text-xs text-gold-hover flex items-center justify-between group transition-colors"
                >
                  <span>Best Sellers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold-hover transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Main Categories Navigation Tree */}
            <div className="mt-8">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 px-1">
                Store Departments
              </h4>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.key} className="space-y-1">
                    <button
                      onClick={() => {
                        selectDepartment(cat.key);
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left font-sans font-bold text-xs text-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-medical-teal"></span>
                        <span className="group-hover:text-medical-teal transition-colors">{cat.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-medical-teal group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Subcategories list */}
                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="pl-6 space-y-1 border-l border-slate-100 ml-3.5 my-1">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.key}
                            onClick={() => {
                              selectDepartment(cat.key, sub.key);
                              setIsDrawerOpen(false);
                            }}
                            className="w-full text-left py-1 px-2 rounded-lg text-[11px] font-sans text-slate-500 hover:text-medical-teal hover:bg-slate-50/80 transition-colors block"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Contact bar inside drawer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
            <a 
              href={`tel:${storePhone}`}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                <span>Call Store</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{storePhone}</span>
            </a>

            <a 
              href={`https://wa.me/${storeWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100/60"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Care</span>
              </div>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded">Active</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
