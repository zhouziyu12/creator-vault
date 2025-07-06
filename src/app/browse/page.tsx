'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Heart, 
  Calendar,
  User,
  Globe,
  Lock,
  Image,
  Video,
  Mic,
  Type
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';

export default function BrowsePage() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'all',
    'Web3 & Blockchain',
    'Cryptocurrency',
    'NFTs & Digital Art',
    'DeFi & Finance',
    'Technology',
    'Education',
    'Entertainment',
    'Lifestyle',
    'Business',
    'Other'
  ];

  const contentTypes = [
    { id: 'all', label: 'All Types', icon: Filter },
    { id: 'article', label: 'Articles', icon: Type },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'audio', label: 'Audio', icon: Mic },
  ];

  useEffect(() => {
    const allContents = contentStorage.getAllContents()
      .filter(content => content.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setContents(allContents);
    setFilteredContents(allContents);
  }, []);

  useEffect(() => {
    let filtered = contents;

    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(content => content.contentType === selectedType);
    }

    setFilteredContents(filtered);
  }, [contents, searchQuery, selectedCategory, selectedType]);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return Type;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Mic;
      default: return Type;
    }
  };

  const ContentCard = ({ content }: { content: ContentItem }) => {
    const Icon = getContentTypeIcon(content.contentType);
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push(`/content/${content.id}`)}
      >
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
          {content.coverImage ? (
            <img
              src={content.coverImage}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className="w-12 h-12 text-gray-400" />
          )}
          
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Icon className="w-3 h-3" />
            <span>{content.contentType}</span>
          </div>

          <div className="absolute top-2 right-2">
            {content.isPremium ? (
              <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>{content.price} ETH</span>
              </div>
            ) : (
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Free</span>
              </div>
            )}
          </div>

          {content.ipfsHash && (
            <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
              IPFS
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
          
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {content.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {content.tags.length > 3 && (
                <span className="text-gray-400 text-xs">+{content.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{content.creatorName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{content.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{content.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Content</h1>
              <p className="text-gray-600">Discover amazing Web3 content from creators worldwide</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              {contentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found {filteredContents.length} content{filteredContents.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredContents.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
