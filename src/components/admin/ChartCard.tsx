import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, icon: Icon, className = '' }) => {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};
