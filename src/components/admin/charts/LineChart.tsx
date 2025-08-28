import React from 'react';

export const LineChart: React.FC = () => {
  // Sample data
  const data = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1000 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1400 },
  ];

  const maxValue = Math.max(...data.map(d => d.users));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.users / maxValue) * 100
  }));

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="w-full h-64 relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
        {[maxValue, maxValue / 2, 0].map((value, i) => (
          <div key={i} className="relative -mt-2">
            {Math.round(value)}
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="ml-12 h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-gray-200 dark:text-gray-700"
            />
          ))}

          {/* Line chart */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1.5"
              className="fill-blue-500"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          {data.map((d, i) => (
            <div key={i}>{d.month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
