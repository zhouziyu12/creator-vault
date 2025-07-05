'use client';

import { ContentList } from '@/components/content/ContentList';
import { Search, TrendingUp, Clock, Star } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Content</h1>
          <p className="text-gray-600">
            Discover amazing content from Web3 creators around the world. Support creators directly with Sepolia ETH.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Clock className="w-4 h-4" />
                <span>Recent</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Star className="w-4 h-4" />
                <span>Featured</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <ContentList showCreatorOnly={false} />
      </div>
    </div>
  );
}
