import React from "react";
import { Download, X } from "lucide-react";
import { usePwaInstall } from "../../hooks";

export default function InstallPWA() {
  const { isInstallable, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 animate-fade-in flex items-center justify-between gap-3" dir="ltr">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-medical-teal flex items-center justify-center text-white shrink-0">
          <Download className="w-5 h-5" />
        </span>
        <div>
          <h5 className="font-display font-bold text-xs">Install Ghazal Store App</h5>
          <p className="text-[10.5px] text-slate-400">Fast offline access & instant catalog browsing.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={promptInstall}
          className="px-3 py-1.5 bg-medical-teal hover:bg-medical-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow active:scale-95"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
