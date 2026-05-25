'use client';

import React from 'react';

interface ContributionGraphProps {
  data: Array<Array<number>>;
  year?: number;
  maxValue?: number;
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  data,
  year = new Date().getFullYear(),
  maxValue = 10,
}) => {
  const getCellColor = (value: number): string => {
    if (value === 0) return 'bg-white border-black';
    const intensity = Math.min(value / maxValue, 1);
    if (intensity < 0.3) return 'bg-yellow-100 border-black';
    if (intensity < 0.6) return 'bg-yellow-300 border-black';
    if (intensity < 0.85) return 'bg-yellow-400 border-black';
    return 'bg-black border-black text-white';
  };

  return (
    <div className="border-3 border-black p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">
          Contributions in {year}
        </h3>
      </div>

      {/* Graph Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {data.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`
                    w-3 h-3 border-2 transition-brutal cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-black
                    ${getCellColor(day)}
                  `}
                  title={`${day} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="font-bold">Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-white border-2 border-black"></div>
          <div className="w-3 h-3 bg-yellow-100 border-2 border-black"></div>
          <div className="w-3 h-3 bg-yellow-300 border-2 border-black"></div>
          <div className="w-3 h-3 bg-yellow-400 border-2 border-black"></div>
          <div className="w-3 h-3 bg-black border-2 border-black"></div>
        </div>
        <span className="font-bold">More</span>
      </div>
    </div>
  );
};

export default ContributionGraph;