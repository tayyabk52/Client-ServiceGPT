import React from 'react';
import { Clock, User, Search, Settings } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'search' | 'system' | 'provider';
  message: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ className = '' }) => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'user',
      message: 'New user registration from John Doe',
      timestamp: '2 minutes ago',
      user: 'john.doe@email.com'
    },
    {
      id: '2',
      type: 'search',
      message: 'Search performed for "electrician" in New York',
      timestamp: '5 minutes ago',
      user: 'jane.smith@email.com'
    },
    {
      id: '3',
      type: 'provider',
      message: 'New provider "ABC Plumbing" submitted for verification',
      timestamp: '8 minutes ago'
    },
    {
      id: '4',
      type: 'system',
      message: 'Daily backup completed successfully',
      timestamp: '15 minutes ago'
    },
    {
      id: '5',
      type: 'user',
      message: 'User Sarah Wilson updated profile',
      timestamp: '22 minutes ago',
      user: 'sarah.wilson@email.com'
    },
    {
      id: '6',
      type: 'search',
      message: 'High volume search activity detected',
      timestamp: '25 minutes ago'
    },
    {
      id: '7',
      type: 'system',
      message: 'API rate limit reached for user premium tier',
      timestamp: '30 minutes ago'
    },
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'user':
        return <User className={iconClass} />;
      case 'search':
        return <Search className={iconClass} />;
      case 'system':
        return <Settings className={iconClass} />;
      case 'provider':
        return <Settings className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return 'from-blue-500 to-blue-600';
      case 'search':
        return 'from-green-500 to-green-600';
      case 'system':
        return 'from-purple-500 to-purple-600';
      case 'provider':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`rounded-2xl p-6 bg-card-light dark:bg-card-dark shadow transition-colors duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div className={`w-8 h-8 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">{activity.message}</p>
              {activity.user && (
                <p className="text-blue-400 text-xs mt-1">{activity.user}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
