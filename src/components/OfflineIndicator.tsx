import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  viewName?: string;
  contextHint?: string;
  className?: string;
}

export const OfflineIndicator: React.FC<Props> = ({
  viewName,
  contextHint,
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [checking, setChecking] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetryConnection = async () => {
    setChecking(true);
    try {
      // Attempt a lightweight ping
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        setIsOnline(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        // Fallback to checking navigator
        if (navigator.onLine) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      }
    } catch {
      setIsOnline(navigator.onLine);
    } finally {
      setChecking(false);
    }
  };

  if (isOnline && !showToast) {
    return null;
  }

  if (isOnline && showToast) {
    return (
      <div
        id="online-restored-toast"
        className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-md border border-emerald-600 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-300 mb-4"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span className="font-medium">
            Mtandao umerejea! Maudhui mapya ya EduKan yanasasishwa sasa hivi.
          </span>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="text-emerald-200 hover:text-white text-xs font-bold ml-3"
        >
          Sawa
        </button>
      </div>
    );
  }

  return (
    <div
      id={`offline-indicator-${viewName ? viewName.toLowerCase() : 'global'}`}
      className={`bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 dark:border-amber-700/50 rounded-2xl p-3.5 sm:p-4 text-amber-900 dark:text-amber-200 text-xs shadow-xs mb-4 animate-in fade-in duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold font-heading text-amber-950 dark:text-amber-100 text-sm">
                Hali ya Nje ya Mtandao (Offline)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                <Database className="w-2.5 h-2.5" />
                Data Zilizohifadhiwa (Cached)
              </span>
            </div>
            <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed text-xs">
              Kifaa chako hakina muunganisho wa mtandao kwa sasa. Unaona data zilizohifadhiwa awali (cached data)
              {viewName ? ` katika sehemu ya ${viewName}` : ''}.
              {contextHint ? ` ${contextHint}` : ' Unaweza kuendelea kusoma au kupitia maudhui yaliyopo.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            id="offline-retry-btn"
            onClick={handleRetryConnection}
            disabled={checking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-medium rounded-xl text-xs transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Inakagua...' : 'Jaribu Tena'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
