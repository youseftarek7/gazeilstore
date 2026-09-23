import React, { useEffect, useState } from "react";

export default function SplashLoader({ settings, isLoadingData, onComplete }: { settings?: any, isLoadingData?: boolean, onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Logo drops in with a spring bounce & triggers shockwave
    const t1 = setTimeout(() => setStage(1), 30);
    
    // Stage 2: Quick hold
    const t2 = setTimeout(() => setStage(2), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage >= 2 && !isLoadingData) {
      // Stage 3: The cinematic Split Doors reveal & dive-in effect
      const t3 = setTimeout(() => setStage(3), 200);

      // Stage 4: Fully unmount after doors are completely open
      const t4 = setTimeout(() => {
        setStage(4);
        onComplete();
      }, 700);

      return () => {
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [stage, isLoadingData, onComplete]);

  // Safety fallback: Force close after 2 seconds to prevent any hang in WebViews
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setStage((prev) => {
        if (prev < 3) {
          setTimeout(() => {
            setStage(4);
            onComplete();
          }, 400);
          return 3;
        }
        return prev;
      });
    }, 2000);
    return () => clearTimeout(safetyTimer);
  }, [onComplete]);

  if (stage === 4) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      
      {/* 
        Left Door 
        Uses Expo In-Out easing for a dramatic, heavy feel when sliding open.
      */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 bg-white transition-transform duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
          stage >= 3 ? "-translate-x-full" : "translate-x-0"
        } shadow-[10px_0_50px_rgba(0,0,0,0.07)] z-10`}
      ></div>
      
      {/* Right Door */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 bg-white transition-transform duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
          stage >= 3 ? "translate-x-full" : "translate-x-0"
        } shadow-[-10px_0_50px_rgba(0,0,0,0.07)] z-10`}
      ></div>

      {/* Center Content Group */}
      <div 
        className={`relative z-20 flex flex-col items-center justify-center transition-all duration-[600ms] ease-in ${
          stage >= 3 ? "opacity-0 scale-150 blur-xl" : "opacity-100 scale-100 blur-0"
        }`}
      >
        {/* Shockwave Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-32 h-32 absolute border-2 border-medical-teal rounded-full transition-all duration-1000 ease-out ${stage >= 1 ? "scale-[4] opacity-0" : "scale-50 opacity-100"}`}></div>
          <div className={`w-32 h-32 absolute border-2 border-champagne-gold rounded-full transition-all duration-[1200ms] ease-out delay-150 ${stage >= 1 ? "scale-[5] opacity-0" : "scale-50 opacity-100"}`}></div>
        </div>

        {/* Logo Container with Spring Bounce */}
        <div className={`relative transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          stage === 0 ? "scale-50 opacity-0 -translate-y-24 rotate-[-15deg]" : "scale-100 opacity-100 translate-y-0 rotate-0"
        }`}>
          {/* Subtle Glow Behind Logo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-medical-teal/10 to-champagne-light/10 rounded-full blur-3xl animate-pulse scale-[1.5]"></div>
          
          <img 
            src={settings?.icon || "/icon.jpg"} 
            alt="Loading..." 
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain mix-blend-multiply relative z-10"
          />
        </div>

        {/* Cinematic Title Reveal */}
        <div className={`mt-10 flex flex-col items-center transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
          stage === 0 ? "opacity-0 translate-y-10 tracking-tighter" : "opacity-100 translate-y-0 tracking-widest"
        }`}>
          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 uppercase text-center max-w-lg px-4 leading-tight">
            Ghazal Store Professional Dental Supplies
          </h1>
          

        </div>
        
      </div>
    </div>
  );
}
