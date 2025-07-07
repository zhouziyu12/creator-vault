'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { EarningsOverview } from '@/components/analytics/EarningsOverview';
import { TopContent } from '@/components/analytics/TopContent';
import { 
  TrendingUp,
  DollarSign,
  Eye,
  Users,
  Zap,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  return (
    <PageLayout 
      title="Analytics" 
      description="Track your Web3 earnings and content performance"
      actions={
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Earnings Overview */}
        <section>
          <EarningsOverview timeRange={timeRange} />
        </section>

        {/* Revenue Charts */}
        <section>
          <RevenueChart timeRange={timeRange} />
        </section>

        {/* Additional Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Average per sale</span>
                </div>
                <span className="text-sm font-medium text-gray-900">0.045 ETH</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">Views per day</span>
                </div>
                <span className="text-sm font-medium text-gray-900">347</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">Conversion rate</span>
                </div>
                <span className="text-sm font-medium text-gray-900">2.8%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-700">Growth rate</span>
                </div>
                <span className="text-sm font-medium text-green-600">+24.5%</span>
              </div>
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Insights</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Web3 Developers</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Crypto Enthusiasts</span>
                  <span className="text-sm font-medium text-gray-900">32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">DeFi Users</span>
                  <span className="text-sm font-medium text-gray-900">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Content Table */}
        <section>
          <TopContent />
        </section>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                0.834 ETH
              </div>
              <div className="text-sm text-gray-600 mb-1">Premium Content Sales</div>
              <div className="text-xs text-gray-400">72% of total revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                0.245 ETH
              </div>
              <div className="text-sm text-gray-600 mb-1">Tips & Donations</div>
              <div className="text-xs text-gray-400">21% of total revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                0.081 ETH
              </div>
              <div className="text-sm text-gray-600 mb-1">Subscription Revenue</div>
              <div className="text-xs text-gray-400">7% of total revenue</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">1.160 ETH ≈ $2,320</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Platform Fee (0%)</span>
              <span className="font-semibold text-green-600">$0 saved vs traditional platforms</span>
            </div>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎉 CreatorVault Advantage
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                See how much more you earn compared to traditional platforms
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">CreatorVault</div>
                  <div className="text-lg font-bold text-green-600">$2,320</div>
                  <div className="text-xs text-gray-500">0% platform fee</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">YouTube</div>
                  <div className="text-lg font-bold text-red-600">$1,624</div>
                  <div className="text-xs text-gray-500">30% platform fee</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">Patreon</div>
                  <div className="text-lg font-bold text-red-600">$1,740</div>
                  <div className="text-xs text-gray-500">25% platform fee</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">
                +$696
              </div>
              <div className="text-sm text-gray-600">
                Extra earnings this month
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
