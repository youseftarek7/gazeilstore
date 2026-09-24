import React from "react";
import { MapPin, PhoneCall, MessageSquare } from "lucide-react";
import { useStorefront } from "../../context";

export default function Footer() {
  const { settings, developer } = useStorefront();
  const storePhone = settings?.phone || "01007070766";
  const storeWhatsapp = settings?.whatsapp || "201551905201";
  const storeWhatsappDisplay = settings?.whatsapp ? settings.whatsapp.replace(/^20/, "0") : "01551905201";
  const storeAddress = settings?.address || "Areesh • El-Masaeed (Alongside Mostafa Library)";

  return (
    <footer className="relative bg-[#fafafc] border-t border-slate-205 mt-24 pt-16 pb-16 overflow-hidden" dir="ltr">
      <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-slate-200/30 opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#0ea5e9]/5 opacity-30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Clinic / Store Details */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
                <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C10 2 8 3 8 5c0 2 1 3 1 5 0 2-3 3-3 6 0 3 2 4 4 4 1 0 2-1 2-2 0 1 1 2 2 2 2 0 4-1 4-4 0-3-3-4-3-6 0-2 1-3 1-5 0-2-2-3-4-3z" />
                </svg>
              </span>
              <span className="font-display font-black text-xl text-slate-900 tracking-tight">
                Ghazal Dental
              </span>
              <span className="inline-flex items-center text-[8.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250/50">
                OFFICIAL
              </span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Certified university dental kits, state-of-the-art restorative materials, and precision surgical instrumentation.
            </p>

            {/* Map Link */}
            <a 
              href="https://www.google.com/maps?q=31.118656,33.715492" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-start gap-2 text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 shadow-xs max-w-sm transition-all group"
            >
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5 shrink-0 group-hover:text-medical-teal transition-colors" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  STORE LOCATION (VIEW MAP)
                </span>
                <p className="text-xs font-bold text-slate-800 group-hover:text-medical-teal transition-colors">
                  {storeAddress}
                </p>
              </div>
            </a>
          </div>

          {/* Contact Channels */}
          <div className="lg:col-span-6 space-y-4">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              DIRECT CUSTOMER CARE
            </h5>

            <div className="space-y-3">
              <a 
                href={`tel:${storePhone}`} 
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all duration-250 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-250">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block">
                      TECHNICAL & ORDER SUPPORT
                    </span>
                    <span className="text-xs font-bold text-slate-800">{storePhone}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  CALL
                </span>
              </a>

              <a 
                href={`https://wa.me/${storeWhatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all duration-250 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-250">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block">
                      SALES WHATSAPP CHAT
                    </span>
                    <span className="text-xs font-bold text-slate-800">{storeWhatsappDisplay}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  CHAT
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200/50 flex items-center justify-center">
          <span className="text-[10px] text-slate-400/80 font-medium tracking-wide">
            Developer: {developer?.phone || "01006635631"}
          </span>
        </div>
      </div>
    </footer>
  );
}
