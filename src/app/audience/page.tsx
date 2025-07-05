'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Users, TrendingUp, Globe, Calendar } from 'lucide-react';

export default function AudiencePage() {
  const audienceStats = [
    { label: 'Total Subscribers', value: '45.6K', change: '+1,234 this month', icon: Users, color: 'purple' },
    { label: 'Monthly Active', value: '38.2K', change: '+8.5% vs last month', icon: TrendingUp, color: 'blue' },
    { label: 'Global Reach', value: '127 countries', change: '+5 new countries', icon: Globe, color: 'green' },
    { label: 'Avg. Session', value: '4m 32s', change: '+12s vs last month', icon: Calendar, color: 'orange' },
  ];

  const topCountries = [
    { country: 'United States', subscribers: '12.4K', percentage: 27 },
    { country: 'Canada', subscribers: '8.9K', percentage: 19 },
    { country: 'United Kingdom', subscribers: '6.2K', percentage: 14 },
    { country: 'Germany', subscribers: '4.8K', percentage: 11 },
    { country: 'Australia', subscribers: '3.1K', percentage: 7 },
  ];

  return (
    <PageLayout 
      title="Audience" 
      description="Understand your audience and grow your community"
    >
      <div className="space-y-6">
        {/* Audience Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            <div className="space-y-3">
              {topCountries.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {country.country.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{country.subscribers}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-purple-600 h-1 rounded-full" 
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Like Rate</span>
                  <span className="text-lg font-bold text-blue-600">8.5%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Comment Rate</span>
                  <span className="text-lg font-bold text-green-600">2.3%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">Share Rate</span>
                  <span className="text-lg font-bold text-purple-600">1.2%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-1/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriber Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Subscriber growth chart will be displayed here</p>
              <p className="text-sm text-gray-400">Chart implementation coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
