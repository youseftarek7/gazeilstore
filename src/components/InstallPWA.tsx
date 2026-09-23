import React, { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

export default function InstallPWA({ lang }: { lang: "ar" | "en" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsVisible(false);
      return;
    }

    // 2. Check if user dismissed it before
    if (localStorage.getItem("hideInstallPWA") === "true") {
      setIsVisible(false);
      return;
    }

    // Detect iOS Device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // For other browsers (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const dismissForever = () => {
    localStorage.setItem("hideInstallPWA", "true");
    setIsVisible(false);
    setShowIOSPrompt(false);
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }
    
    if (!deferredPrompt) {
        // Fallback for browsers like Firefox
        alert(lang === 'ar' ? "لتثبيت التطبيق، يرجى الضغط على القائمة (ثلاث نقاط) في المتصفح ثم اختيار (إضافة للشاشة الرئيسية)." : "Please use 'Add to Home Screen' from your browser menu to install.");
        dismissForever();
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      dismissForever();
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-medical-teal to-emerald-500 text-white text-xs font-bold rounded-lg shadow hover:shadow-md transition-all active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        {lang === "ar" ? "تثبيت التطبيق" : "Install App"}
      </button>

      {/* iOS Install Guide Modal - Fixed CSS */}
      {showIOSPrompt && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <button 
              onClick={dismissForever}
              className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-blue-500 mb-2">
                <Share className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-xl text-slate-800">
                {lang === "ar" ? "تثبيت التطبيق على الآيفون" : "Install App on iPhone"}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {lang === "ar" 
                  ? "لإضافة الموقع كتطبيق، اضغط على أيقونة (مشاركة) أسفل الشاشة، ثم اختر (إضافة للشاشة الرئيسية)." 
                  : "Tap the (Share) button at the bottom of Safari, then select (Add to Home Screen)."}
              </p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 mt-4 text-slate-600 text-sm font-bold">
                <span className="flex items-center justify-center gap-2">
                  1. اضغط على <Share className="w-4 h-4 text-blue-500" />
                </span>
                <span className="flex items-center justify-center gap-2">
                  2. اختر <strong>إضافة للشاشة الرئيسية</strong>
                </span>
              </div>
              
              <button 
                onClick={dismissForever}
                className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all"
              >
                {lang === "ar" ? "حسناً، فهمت الطريقة" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
