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
import { useEffect, useState } from 'react';
import { contentStorage } from '@/lib/content/storage';
import { paymentService } from '@/lib/payments/paymentService';

interface EarningsOverviewProps {
  timeRange: string;
}

export function EarningsOverview({ timeRange }: EarningsOverviewProps) {
  const [stats, setStats] = useState({
    totalEarnings: '0.000',
    totalViews: '0',
    totalSales: '0',
    totalContent: '0',
    trends: { earnings: 0, views: 0, sales: 0, content: 0 }
  });

  useEffect(() => {
    calculateRealStats();
  }, [timeRange]);

  const calculateRealStats = () => {
    // 获取真实内容数据
    const allContents = contentStorage.getAllContents();
    const publishedContents = allContents.filter(content => content.status === 'published');
    
    // 获取真实购买和打赏数据
    const purchases = paymentService.getPurchases();
    const tips = paymentService.getTips();
    
    // 计算总观看量
    const totalViews = publishedContents.reduce((sum, content) => sum + (content.views || 0), 0);
    
    // 计算总收益（购买 + 打赏）
    const purchaseEarnings = purchases.reduce((sum: number, purchase: any) => sum + purchase.amount, 0);
    const tipEarnings = tips.reduce((sum: number, tip: any) => sum + tip.amount, 0);
    const totalEarnings = purchaseEarnings + tipEarnings;
    
    // 计算销售次数
    const totalSales = purchases.length;
    
    // 计算内容数量
    const totalContent = publishedContents.length;
    
    // 模拟趋势数据（基于实际数据生成合理的增长率）
    const baseTrend = totalEarnings > 0 ? 15 : 0;
    const viewsTrend = totalViews > 100 ? 12 : totalViews > 0 ? 5 : 0;
    const salesTrend = totalSales > 0 ? 25 : 0;
    const contentTrend = totalContent > 1 ? 8 : 0;

    setStats({
      totalEarnings: totalEarnings.toFixed(3),
      totalViews: totalViews.toLocaleString(),
      totalSales: totalSales.toString(),
      totalContent: totalContent.toString(),
      trends: {
        earnings: baseTrend,
        views: viewsTrend,
        sales: salesTrend,
        content: contentTrend
      }
    });
  };

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
      title: 'Published Content',
      value: stats.totalContent,
      subValue: 'Live content pieces',
      icon: TrendingUp,
      color: 'orange',
      trend: stats.trends.content,
      description: 'Growing library'
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
              {stat.trend > 0 && (
                <div className={`flex items-center space-x-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subValue}</p>
              <p className="text-xs text-blue-600 font-medium">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
