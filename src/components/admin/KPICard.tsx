import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className={`ml-2 text-sm font-medium ${
          isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
        }`}>
          {change}
        </p>
      </div>
    </div>
  );
};
