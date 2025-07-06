'use client';

import { Eye, DollarSign, Heart, TrendingUp } from 'lucide-react';
import { contentStorage } from '@/lib/content/storage';
import { useEffect, useState } from 'react';

export function TopContent() {
  const [topContent, setTopContent] = useState<any[]>([]);

  useEffect(() => {
    const contents = contentStorage.getAllContents()
      .filter(content => content.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(content => ({
        ...content,
        earnings: content.isPremium ? (content.price * Math.floor(Math.random() * 10 + 1)) : 0,
        conversionRate: content.isPremium ? (Math.random() * 5 + 1).toFixed(1) : 'N/A'
      }));
    
    setTopContent(contents);
  }, []);

  if (topContent.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No content data available</p>
        <p className="text-sm text-gray-400">Create and publish content to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topContent.map((content, index) => (
        <div key={content.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-500' :
              'bg-blue-500'
            }`}>
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
            <p className="text-sm text-gray-500 truncate">{content.description}</p>
          </div>
          
          <div className="flex-shrink-0 text-right space-y-1">
            <div className="flex items-center space-x-1 text-sm">
              <Eye className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{content.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">
                {content.earnings ? `${content.earnings.toFixed(3)} ETH` : 'Free'}
              </span>
            </div>
            {content.isPremium && (
              <div className="text-xs text-blue-600">
                {content.conversionRate}% conversion
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
