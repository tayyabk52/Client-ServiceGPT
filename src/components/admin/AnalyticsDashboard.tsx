import React from 'react';
import { 
  LineChart as LineChartIcon, 
  Users, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { LineChart } from '.';
import { DonutChart } from '.';
import { HeatMap } from '.';
import { KPICard } from '.';
import { ChartCard } from '.';
import { TimeRangeSelector } from '.';
import { ExportButtons } from '.';

export const AnalyticsDashboard: React.FC = () => {
  // Sample data - replace with real data from your backend
  const kpiData = [
    { title: 'Total Users', value: '2,847', change: '+12.5%', icon: Users },
    { title: 'Active Conversations', value: '1,234', change: '+8.2%', icon: MessageSquare },
    { title: 'Revenue', value: '$45,678', change: '+15.3%', icon: DollarSign },
    { title: 'Conversion Rate', value: '3.2%', change: '+2.1%', icon: TrendingUp }
  ];

  const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <TimeRangeSelector ranges={timeRanges} />
          <ExportButtons />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Growth" icon={LineChartIcon}>
          <LineChart />
        </ChartCard>
        <ChartCard title="Usage Distribution" icon={LineChartIcon}>
          <DonutChart />
        </ChartCard>
        <ChartCard title="Activity Heatmap" icon={Calendar} className="lg:col-span-2">
          <HeatMap />
        </ChartCard>
      </div>
    </div>
  );
};
