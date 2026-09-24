import React, { useEffect } from "react";
import { StoreSettings } from "../../types";

interface SplashLoaderProps {
  settings?: StoreSettings | null;
  isLoadingData?: boolean;
  onComplete: () => void;
}

export default function SplashLoader({ settings, isLoadingData, onComplete }: SplashLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 animate-fade-in" dir="ltr">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img
            src={settings?.icon || "/icon.jpg"}
            alt="Ghazal Dental"
            className="w-24 h-24 object-contain animate-pulse mix-blend-multiply"
          />
        </div>
        <div className="w-8 h-8 rounded-full border-3 border-medical-teal border-t-transparent animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Ghazal Dental...</span>
      </div>
    </div>
  );
}
