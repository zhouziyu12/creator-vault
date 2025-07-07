'use client';

import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Users,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface EarningsOverviewProps {
  timeRange: string;
}

export function EarningsOverview({ timeRange }: EarningsOverviewProps) {
  // 模拟数据 - 根据时间范围调整
  const getStatsForTimeRange = (range: string) => {
    const baseStats = {
      '7d': {
        totalEarnings: '0.0347',
        totalViews: '1.2K',
        totalSales: '12',
        conversionRate: '2.3',
        trends: { earnings: 12.5, views: 8.2, sales: 15.3, conversion: 3.1 }
      },
      '30d': {
        totalEarnings: '0.1847',
        totalViews: '4.8K',
        totalSales: '56',
        conversionRate: '2.8',
        trends: { earnings: 23.4, views: 18.7, sales: 31.2, conversion: 5.6 }
      },
      '90d': {
        totalEarnings: '0.6234',
        totalViews: '12.3K',
        totalSales: '167',
        conversionRate: '3.2',
        trends: { earnings: 45.2, views: 34.1, sales: 52.8, conversion: 8.9 }
      },
      '1y': {
        totalEarnings: '2.4561',
        totalViews: '45.6K',
        totalSales: '634',
        conversionRate: '3.8',
        trends: { earnings: 156.7, views: 89.3, sales: 142.5, conversion: 15.2 }
      }
    };
    return baseStats[range as keyof typeof baseStats] || baseStats['7d'];
  };

  const stats = getStatsForTimeRange(timeRange);

  const statCards = [
    {
      title: 'Total Earnings',
      value: `${stats.totalEarnings} ETH`,
      subValue: `≈ $${(parseFloat(stats.totalEarnings) * 2000).toFixed(0)}`,
      icon: DollarSign,
      color: 'green',
      trend: stats.trends.earnings,
      description: '100% creator revenue'
    },
    {
      title: 'Content Views',
      value: stats.totalViews,
      subValue: 'Total impressions',
      icon: Eye,
      color: 'blue',
      trend: stats.trends.views,
      description: 'Organic discovery'
    },
    {
      title: 'Content Sales',
      value: stats.totalSales,
      subValue: 'Premium unlocks',
      icon: Zap,
      color: 'purple',
      trend: stats.trends.sales,
      description: 'Direct purchases'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      subValue: 'View to purchase',
      icon: TrendingUp,
      color: 'orange',
      trend: stats.trends.conversion,
      description: 'Above industry avg'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend > 0;
        const TrendIcon = isPositive ? ArrowUp : ArrowDown;
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <Icon className={`w-6 h-6 ${
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {stat.trend.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">
                {stat.subValue}
              </p>
              <p className="text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {stat.title}
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    stat.color === 'green' ? 'bg-green-500' :
                    stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(stat.trend * 2, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
