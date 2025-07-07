'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useEffect, useState } from 'react';

interface RevenueChartProps {
  timeRange: string;
}

export function RevenueChart({ timeRange }: RevenueChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    generateChartData();
  }, [timeRange]);

  const generateChartData = () => {
    const dataPoints = {
      '7d': 7,
      '30d': 30,
      '90d': 12,
      '1y': 12
    };
    
    const points = dataPoints[timeRange as keyof typeof dataPoints] || 7;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - 1 - i));
      
      // 生成趋势增长的收益数据
      const baseValue = timeRange === '1y' ? 0.2 : 
                       timeRange === '90d' ? 0.05 : 
                       timeRange === '30d' ? 0.01 : 0.005;
      
      const growth = 1 + (i / points) * 0.5; // 50% 增长
      const randomFactor = 0.8 + Math.random() * 0.4; // ±20% 波动
      
      data.push({
        period: timeRange === '1y' ? `Month ${i + 1}` : 
                timeRange === '90d' ? `Week ${i + 1}` : 
                date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: Number((baseValue * growth * randomFactor).toFixed(4)),
        sales: Math.floor(Math.random() * 15 + 5),
        views: Math.floor(Math.random() * 500 + 200)
      });
    }
    
    setChartData(data);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <p className="text-sm text-gray-600">Your earnings over time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Earnings (ETH)</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'earnings' ? `${value} ETH` : value,
                  name === 'earnings' ? 'Earnings' : name
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales and Views Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
            <p className="text-sm text-gray-600">Sales and views performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Views</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
