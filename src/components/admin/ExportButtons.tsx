import React from 'react';
import { Download } from 'lucide-react';

export const ExportButtons: React.FC = () => {
  const handleExport = (format: string) => {
    // TODO: Implement actual export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleExport('csv')}
        className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Download className="w-4 h-4 mr-2" />
        CSV
      </button>
      <button
        onClick={() => handleExport('pdf')}
        className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Download className="w-4 h-4 mr-2" />
        PDF
      </button>
    </div>
  );
};
