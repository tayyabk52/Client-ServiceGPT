import React from 'react';

export const DonutChart: React.FC = () => {
  // Sample data
  const data = [
    { label: 'Mobile', value: 45, color: 'text-blue-500' },
    { label: 'Desktop', value: 35, color: 'text-green-500' },
    { label: 'Tablet', value: 20, color: 'text-purple-500' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, i) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={i}
                d={pathData}
                className={item.color}
                fill="currentColor"
              />
            );
          })}
          {/* Inner circle for donut effect */}
          <circle
            cx="50"
            cy="50"
            r="25"
            className="fill-white dark:fill-gray-900"
          />
        </svg>

        {/* Legend */}
        <div className="absolute top-full mt-4 w-full">
          <div className="flex flex-wrap justify-center gap-4">
            {data.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mr-2`} />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.label} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
