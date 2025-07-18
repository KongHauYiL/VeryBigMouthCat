
import React from 'react';

interface GlobalCounterProps {
  globalTaps: number;
  isLoading: boolean;
}

export function GlobalCounter({ globalTaps, isLoading }: GlobalCounterProps) {
  return (
    <div className="text-center p-6 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 rounded-2xl border border-rose-200/50 dark:border-rose-800/50">
      <h2 className="text-lg font-semibold text-muted-foreground mb-2">
        Global Taps
      </h2>
      <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
        {isLoading ? (
          <div className="animate-pulse">---.---</div>
        ) : (
          globalTaps.toLocaleString()
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Taps from around the world! 🌍
      </p>
    </div>
  );
}
