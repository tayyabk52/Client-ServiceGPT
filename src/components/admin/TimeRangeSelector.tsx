import React, { useState } from 'react';

interface TimeRangeSelectorProps {
  ranges: string[];
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ ranges }) => {
  const [selectedRange, setSelectedRange] = useState(ranges[0]);

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-500 dark:text-gray-400">Time Range:</label>
      <select
        value={selectedRange}
        onChange={(e) => setSelectedRange(e.target.value)}
        className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {ranges.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>
    </div>
  );
};
