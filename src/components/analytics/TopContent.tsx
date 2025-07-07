'use client';

import { Eye, DollarSign, Heart, TrendingUp, TrendingDown } from 'lucide-react';

export function TopContent() {
  const topContent = [
    {
      id: '1',
      title: 'Building Your First DeFi App',
      type: 'article',
      views: 2840,
      earnings: 0.125,
      likes: 47,
      trend: 'up',
      trendValue: 23.5,
      thumbnail: '📱'
    },
    {
      id: '2',
      title: 'Web3 Security Best Practices',
      type: 'video',
      views: 1950,
      earnings: 0.089,
      likes: 31,
      trend: 'up',
      trendValue: 15.2,
      thumbnail: '🔐'
    },
    {
      id: '3',
      title: 'Solidity Smart Contract Tutorial',
      type: 'article',
      views: 1670,
      earnings: 0.067,
      likes: 28,
      trend: 'down',
      trendValue: -5.3,
      thumbnail: '⚡'
    },
    {
      id: '4',
      title: 'NFT Marketplace Development',
      type: 'video',
      views: 1420,
      earnings: 0.053,
      likes: 22,
      trend: 'up',
      trendValue: 8.7,
      thumbnail: '🎨'
    },
    {
      id: '5',
      title: 'Crypto Wallet Integration Guide',
      type: 'article',
      views: 1200,
      earnings: 0.041,
      likes: 19,
      trend: 'up',
      trendValue: 12.1,
      thumbnail: '💰'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
        <p className="text-sm text-gray-600 mt-1">Your highest earning and most viewed content</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topContent.map((content, index) => {
              const TrendIcon = content.trend === 'up' ? TrendingUp : TrendingDown;
              
              return (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{content.thumbnail}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {content.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {content.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-900">
                          {content.likes}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((content.likes / content.views) * 100).toFixed(1)}% like rate
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {content.earnings.toFixed(3)} ETH
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ≈ ${(content.earnings * 2000).toFixed(0)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-1 ${
                      content.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {content.trendValue > 0 ? '+' : ''}{content.trendValue}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      vs last period
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
