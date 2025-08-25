import React from 'react';
import AdminLayout from './AdminLayout';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import ActivityFeed from './ActivityFeed';
import LineChart from './charts/LineChart';
import DonutChart from './charts/DonutChart';
import HeatMap from './charts/HeatMap';
import { 
  Users, 
  Activity, 
  Zap, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data
  const kpiData = [
    {
      title: 'Total Users',
      value: '12,459',
      change: { value: 12.5, type: 'increase' as const },
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Active Sessions',
      value: '847',
      change: { value: 8.2, type: 'increase' as const },
      icon: Activity,
      color: 'green' as const
    },
    {
      title: 'API Calls Today',
      value: '23,891',
      change: { value: 3.1, type: 'decrease' as const },
      icon: Zap,
      color: 'purple' as const
    },
    {
      title: 'Top Category',
      value: 'Electricians',
      icon: TrendingUp,
      color: 'orange' as const
    }
  ];

  const usageData = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 150 },
    { label: 'Wed', value: 180 },
    { label: 'Thu', value: 140 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 160 },
    { label: 'Sun', value: 190 }
  ];

  const categoryData = [
    { label: 'Electricians', value: 35, color: '#3B82F6' },
    { label: 'Plumbers', value: 25, color: '#10B981' },
    { label: 'Contractors', value: 20, color: '#F59E0B' },
    { label: 'Cleaners', value: 12, color: '#EF4444' },
    { label: 'Others', value: 8, color: '#8B5CF6' }
  ];

  const geoData = [
    { x: 25, y: 40, value: 1250, location: 'New York' },
    { x: 60, y: 35, value: 980, location: 'Chicago' },
    { x: 80, y: 70, value: 1450, location: 'Los Angeles' },
    { x: 45, y: 55, value: 750, location: 'Houston' },
    { x: 35, y: 25, value: 650, location: 'Boston' },
    { x: 70, y: 45, value: 850, location: 'Denver' },
  ];

  const handleRefresh = () => {
    // Implement refresh logic
    console.log('Refreshing dashboard data...');
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-400 mt-1">Monitor your platform's performance and user activity</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <div className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Usage Over Time */}
            <ChartCard 
              title="Usage Over Time"
              actions={
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="7d" className="bg-slate-800">Last 7 days</option>
                  <option value="30d" className="bg-slate-800">Last 30 days</option>
                  <option value="90d" className="bg-slate-800">Last 90 days</option>
                </select>
              }
            >
              <LineChart data={usageData} color="#3B82F6" />
            </ChartCard>

            {/* Popular Categories */}
            <ChartCard title="Popular Categories">
              <DonutChart data={categoryData} />
            </ChartCard>
          </div>

          {/* Geographic Distribution and Activity Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Geographic Distribution */}
            <ChartCard 
              title="Geographic Distribution" 
              className="xl:col-span-2"
              actions={
                <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  View Details
                </button>
              }
            >
              <HeatMap data={geoData} />
            </ChartCard>

            {/* Recent Activity Feed */}
            <ActivityFeed />
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Platform Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">All Systems Operational</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-blue-400">98.5%</div>
                <div className="text-sm text-gray-400 mt-1">Uptime</div>
                <div className="text-xs text-green-400 mt-1">+0.2%</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-green-400">2.3s</div>
                <div className="text-sm text-gray-400 mt-1">Avg Response</div>
                <div className="text-xs text-green-400 mt-1">-0.1s</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-purple-400">4.8/5</div>
                <div className="text-sm text-gray-400 mt-1">User Rating</div>
                <div className="text-xs text-green-400 mt-1">+0.1</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-orange-400">156</div>
                <div className="text-sm text-gray-400 mt-1">Active Providers</div>
                <div className="text-xs text-green-400 mt-1">+12</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
