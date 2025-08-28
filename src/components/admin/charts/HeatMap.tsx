import React from 'react';

export const HeatMap: React.FC = () => {
  // Generate sample data for the heatmap
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = 12; // Show 12 weeks of data

  const generateData = () => {
    const data = [];
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          value: Math.floor(Math.random() * 10),
          week,
          day,
        });
      }
    }
    return data;
  };

  const data = generateData();

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (value <= 3) return 'bg-green-100 dark:bg-green-900';
    if (value <= 6) return 'bg-green-300 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-500';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Days of week labels */}
        <div className="flex mb-2">
          <div className="w-8" /> {/* Spacer for alignment */}
          {days.map(day => (
            <div key={day} className="w-8 text-center text-xs text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex">
              {/* Week label */}
              <div className="w-8 text-right pr-2 text-xs text-gray-500 dark:text-gray-400">
                W{weekIndex + 1}
              </div>

              {/* Days in the week */}
              <div className="flex gap-1">
                {data
                  .filter(d => d.week === weekIndex)
                  .map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-8 h-8 rounded ${getColor(day.value)} transition-colors duration-200`}
                      title={`${days[day.day]}: ${day.value} activities`}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
          {[0, 3, 6, 9].map(value => (
            <div
              key={value}
              className={`w-4 h-4 rounded ${getColor(value)}`}
              title={`${value} activities`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
};
