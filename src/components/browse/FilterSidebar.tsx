'use client';

import { useState } from 'react';
import { ContentItem } from '@/types/content';
import { DollarSign, Clock, Eye, Heart } from 'lucide-react';

interface FilterSidebarProps {
  contents: ContentItem[];
  onFilterChange: (filters: any) => void;
}

export function FilterSidebar({ contents, onFilterChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1]);
  const [contentType, setContentType] = useState<string[]>([]);
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);

  const contentTypes = ['article', 'video', 'image', 'audio'];
  const maxPrice = Math.max(...contents.map(c => c.price || 0), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* 价格范围 */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>Price Range</span>
        </h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="free-content"
              checked={priceRange[0] === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setPriceRange([0, 0]);
                }
              }}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="free-content" className="text-sm text-gray-700">
              Free Content
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="premium-content"
              checked={isPremiumOnly}
              onChange={(e) => setIsPremiumOnly(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="premium-content" className="text-sm text-gray-700">
              Premium Only
            </label>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="0.001"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 ETH</span>
              <span>{priceRange[1].toFixed(3)} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 内容类型 */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Content Type</span>
        </h4>
        <div className="space-y-2">
          {contentTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={type}
                checked={contentType.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentType([...contentType, type]);
                  } else {
                    setContentType(contentType.filter(t => t !== type));
                  }
                }}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor={type} className="text-sm text-gray-700 capitalize">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 受欢迎程度 */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Heart className="w-4 h-4" />
          <span>Popularity</span>
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="trending"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="trending" className="text-sm text-gray-700">
              Trending
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="most-viewed"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="most-viewed" className="text-sm text-gray-700">
              Most Viewed
            </label>
          </div>
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={() => {
          setPriceRange([0, maxPrice]);
          setContentType([]);
          setIsPremiumOnly(false);
          onFilterChange({});
        }}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Reset Filters
      </button>
    </div>
  );
}
