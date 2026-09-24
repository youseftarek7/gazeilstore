import { useState, useEffect } from "react";

export function useCountdown(initialSecondsMap: Record<number | string, number>) {
  const [timers, setTimers] = useState<Record<string, number>>(() => {
    const formatted: Record<string, number> = {};
    for (const key in initialSecondsMap) {
      formatted[String(key)] = initialSecondsMap[key];
    }
    return formatted;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        for (const key in next) {
          if (next[key] > 0) {
            next[key] -= 1;
          } else {
            next[key] = 7200; // Reset countdown loop
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const setTimer = (id: string | number, seconds: number) => {
    setTimers((prev) => ({ ...prev, [String(id)]: seconds }));
  };

  return { timers, setTimer };
}
