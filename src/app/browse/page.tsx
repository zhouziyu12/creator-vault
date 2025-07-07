'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ContentGrid } from '@/components/browse/ContentGrid';
import { FilterSidebar } from '@/components/browse/FilterSidebar';
import { SearchBar } from '@/components/browse/SearchBar';
import { CategoryTabs } from '@/components/browse/CategoryTabs';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { contentStorage } from '@/lib/content/storage';
import { useContentInit } from '@/hooks/useContentInit';
import { ContentItem } from '@/types/content';
import { 
  Search,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  Grid,
  List,
  RefreshCw,
  Users,
  Globe
} from 'lucide-react';

export default function BrowsePage() {
  const isContentInitialized = useContentInit();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'purchase' | 'tip'>('purchase');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Technology', 'Education', 'Entertainment', 'Art', 'Music', 'Gaming'];
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'trending', label: 'Trending' }
  ];

  const loadContents = () => {
    if (!isContentInitialized) return;
    
    setLoading(true);
    try {
      // 加载所有已发布的内容（来自所有用户）
      const allContents = contentStorage.getAllContents()
        .filter(content => content.status === 'published');
      
      console.log('🌐 Browse: Loaded all contents:', allContents.length);
      console.log('📊 Content breakdown:', {
        total: allContents.length,
        free: allContents.filter(c => !c.isPremium).length,
        premium: allContents.filter(c => c.isPremium).length,
        creators: [...new Set(allContents.map(c => c.creatorName))].length
      });
      
      setContents(allContents);
      setFilteredContents(allContents);
    } catch (error) {
      console.error('❌ Failed to load contents:', error);
      setContents([]);
      setFilteredContents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [isContentInitialized]);

  useEffect(() => {
    // 应用过滤和排序
    let filtered = contents;

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.category === selectedCategory);
    }

    // 排序
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'trending':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default: // latest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredContents(filtered);
  }, [contents, searchQuery, selectedCategory, sortBy]);

  const handleContentClick = (content: ContentItem) => {
    // 如果是免费内容，直接跳转
    if (!content.isPremium) {
      window.location.href = `/content/${content.id}`;
      return;
    }

    // 付费内容显示支付选项
    setSelectedContent(content);
    setPaymentType('purchase');
    setShowPaymentModal(true);
  };

  const handleTipClick = (content: ContentItem) => {
    setSelectedContent(content);
    setPaymentType('tip');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (selectedContent && paymentType === 'purchase') {
      // 购买成功后跳转到内容页面
      window.location.href = `/content/${selectedContent.id}`;
    }
  };

  const refreshContents = () => {
    console.log('🔄 Refreshing content list...');
    loadContents();
  };

  if (!isContentInitialized) {
    return (
      <PageLayout
        title="Browse Community Content"
        description="Loading content..."
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing content system...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Browse Community Content"
      description="Discover amazing Web3 content from creators around the world"
      actions={
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshContents}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 搜索栏 */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
        />

        {/* 分类标签 */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* 统计信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-1">{contents.length}</div>
              <div className="text-sm text-blue-700 flex items-center justify-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Total Content</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900 mb-1">{contents.filter(c => !c.isPremium).length}</div>
              <div className="text-sm text-green-700">Free Content</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-900 mb-1">{contents.filter(c => c.isPremium).length}</div>
              <div className="text-sm text-purple-700 flex items-center justify-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>Premium Content</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-900 mb-1">{[...new Set(contents.map(c => c.creatorName))].length}</div>
              <div className="text-sm text-orange-700 flex items-center justify-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Active Creators</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-blue-700">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>0% Platform Fees</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Web3 Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Instant Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索结果信息 */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>
              {loading ? 'Loading...' : `Found ${filteredContents.length} content pieces`}
            </span>
            {searchQuery && (
              <>
                <span>•</span>
                <span>Search: "{searchQuery}"</span>
              </>
            )}
            {selectedCategory !== 'all' && (
              <>
                <span>•</span>
                <span>Category: {selectedCategory}</span>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Sorted by: {sortOptions.find(opt => opt.value === sortBy)?.label}
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex gap-6">
          {/* 过滤侧边栏 */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <FilterSidebar
                contents={contents}
                onFilterChange={(filters) => {
                  // 这里可以添加更复杂的过滤逻辑
                  console.log('Filters changed:', filters);
                }}
              />
            </div>
          )}

          {/* 内容网格 */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading community content...</p>
              </div>
            ) : (
              <ContentGrid
                contents={filteredContents}
                viewMode={viewMode}
                onContentClick={handleContentClick}
                onTipClick={handleTipClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* 支付模态框 */}
      {showPaymentModal && selectedContent && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          content={selectedContent}
          paymentType={paymentType}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </PageLayout>
  );
}
