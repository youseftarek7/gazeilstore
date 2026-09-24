import React from "react";
import { GraduationCap, Stethoscope, ArrowRight, CheckCircle2 } from "lucide-react";
import { useStorefront } from "../../context";

export default function HomeSplit() {
  const { homepage, selectDepartment } = useStorefront();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10" dir="ltr">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Academic & University Students */}
        <div 
          onClick={() => selectDepartment("year-3-th")}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-7 md:p-9 text-white shadow-xl border border-slate-700/60 group hover:border-slate-500 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-medical-teal/20 blur-3xl group-hover:bg-medical-teal/30 transition-all pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-2xl bg-medical-teal/20 border border-medical-teal/40 flex items-center justify-center text-medical-teal">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-medical-teal bg-medical-teal/10 px-3 py-1 rounded-full border border-medical-teal/20">
                {homepage?.academicBadge || "YEARS 1 - 4 DENTAL"}
              </span>
            </div>

            <h3 className="font-display font-black text-2xl text-white group-hover:text-champagne-gold transition-colors mb-2">
              {homepage?.academicTitle || "Academic & Pre-Clinic Labs"}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              {homepage?.academicDescription || "Anatomy wax carving, refill acrylic teeth, typodont jaws, operative instruments, and phantom head lab gear."}
            </p>

            <ul className="space-y-2 mb-6">
              {(homepage?.academicFeatures || ["Accredited University Requirements", "Durable Stainless Steel Instruments", "Affordable Student Bundle Pricing"]).map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-champagne-gold group-hover:translate-x-1 transition-transform">
            <span>{homepage?.academicLabel || "Shop Academic Years"}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Dental Clinics & Practitioners */}
        <div 
          onClick={() => selectDepartment("year-4-th")}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 p-7 md:p-9 text-white shadow-xl border border-slate-700/60 group hover:border-indigo-500 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Stethoscope className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {homepage?.clinicsBadge || "CLINICAL GRADE"}
              </span>
            </div>

            <h3 className="font-display font-black text-2xl text-white group-hover:text-champagne-gold transition-colors mb-2">
              {homepage?.clinicsTitle || "Dental Clinics & Surgery"}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              {homepage?.clinicsDescription || "High-speed contra handpieces, composite syringe kits, dental isolation, sterilization pouches, and extraction forceps."}
            </p>

            <ul className="space-y-2 mb-6">
              {(homepage?.clinicsFeatures || ["High-Gloss Aesthetic Composites", "Premium Infection Control Standards", "Precision Extraction & Surgery Tools"]).map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-champagne-gold group-hover:translate-x-1 transition-transform">
            <span>{homepage?.clinicsLabel || "Shop Clinical Setup"}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
