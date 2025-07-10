"use client";
import { MoonPhase, getPhaseIcon, getPhaseColor } from "@/lib/moonPhase";
import { useState } from "react";

interface MoonPhaseClientProps {
  phases: MoonPhase[];
}

export default function MoonPhaseClient({ phases }: MoonPhaseClientProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short"
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          🌙 Ay Fazları Takvimi
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sonraki 30 günün ay fazları
        </p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">
        {phases.map(({ date, phase, phaseName, phaseDescription }) => {
          const key = date.toISOString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div 
              key={key} 
              className="flex-shrink-0 text-center group relative"
              onMouseEnter={() => setActiveTooltip(key)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2
                transition-all duration-200 hover:scale-110 cursor-pointer
                ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${getPhaseColor(phase)}
              `}>
                {getPhaseIcon(phase)}
              </div>
              
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {formatDate(date)}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {phaseName}
              </div>
              
              {/* Tooltip */}
              {activeTooltip === key && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                    <div className="font-semibold">{formatFullDate(date)}</div>
                    <div className="text-gray-300">{phaseName}</div>
                    <div className="text-xs text-gray-400 mt-1 max-w-xs">
                      {phaseDescription}
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🌑</span>
          <span className="text-gray-600 dark:text-gray-400">Yeni Ay</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🌓</span>
          <span className="text-gray-600 dark:text-gray-400">İlk Dördün</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🌕</span>
          <span className="text-gray-600 dark:text-gray-400">Dolunay</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🌗</span>
          <span className="text-gray-600 dark:text-gray-400">Son Dördün</span>
        </div>
      </div>
    </div>
  );
} 