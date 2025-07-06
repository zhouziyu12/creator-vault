'use client';

import { Users, Globe, Wallet, TrendingUp } from 'lucide-react';

export function AudienceInsights() {
  const audienceData = [
    {
      metric: 'Total Followers',
      value: '1,247',
      change: '+23%',
      positive: true,
      description: 'Verified Web3 users'
    },
    {
      metric: 'Avg. Session',
      value: '4.2m',
      change: '+12%',
      positive: true,
      description: 'Content engagement time'
    },
    {
      metric: 'Return Visitors',
      value: '68%',
      change: '+8%',
      positive: true,
      description: 'Loyal audience growth'
    },
    {
      metric: 'Global Reach',
      value: '47',
      change: '+5',
      positive: true,
      description: 'Countries accessing content'
    }
  ];

  const topCountries = [
    { country: 'United States', percentage: 34, flag: '🇺🇸' },
    { country: 'United Kingdom', percentage: 18, flag: '🇬🇧' },
    { country: 'Germany', percentage: 12, flag: '🇩🇪' },
    { country: 'Canada', percentage: 10, flag: '🇨🇦' },
    { country: 'Others', percentage: 26, flag: '🌍' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {audienceData.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{item.metric}</span>
              <span className={`text-xs font-medium ${
                item.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {item.value}
            </div>
            <div className="text-xs text-gray-500">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Geographic Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>Top Locations</span>
        </h4>
        <div className="space-y-3">
          {topCountries.map((country, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-lg">{country.flag}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {country.country}
                  </span>
                  <span className="text-sm text-gray-500">
                    {country.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Web3 Insights */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Wallet className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Web3 Audience</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Crypto wallet holders:</span>
            <span className="font-medium text-blue-900">89%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">DeFi experience:</span>
            <span className="font-medium text-blue-900">67%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">NFT collectors:</span>
            <span className="font-medium text-blue-900">45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
