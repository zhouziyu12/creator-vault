'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { 
  Eye, 
  DollarSign, 
  Heart, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2, 
  ExternalLink,
  TrendingUp,
  Lock,
  Globe,
  FileText
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';
import Link from 'next/link';

interface ContentListProps {
  showCreatorOnly?: boolean;
  limit?: number;
}

export function ContentList({ showCreatorOnly = false, limit }: ContentListProps) {
  const { user } = useUser();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    loadContent();
  }, [user, showCreatorOnly, filter]);

  const loadContent = () => {
    let items: ContentItem[] = [];
    
    if (showCreatorOnly && user?.wallet?.address) {
      items = contentStorage.getContentByCreator(user.wallet.address);
    } else {
      items = contentStorage.getPublishedContent();
    }

    if (filter === 'published') {
      items = items.filter(item => item.status === 'published');
    } else if (filter === 'draft') {
      items = items.filter(item => item.status === 'draft');
    }

    if (limit) {
      items = items.slice(0, limit);
    }

    setContent(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      contentStorage.deleteContent(id);
      loadContent();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'image': return '🖼️';
      default: return '📝';
    }
  };

  if (content.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {showCreatorOnly ? 'No Content Yet' : 'No Published Content'}
          </h3>
          <p className="text-gray-600 mb-4">
            {showCreatorOnly 
              ? 'Start creating your first piece of content to earn Sepolia ETH'
              : 'Check back later for more content from creators'
            }
          </p>
          {showCreatorOnly && (
            <Link
              href="/content/create"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <Edit3 className="w-4 h-4" />
              <span>Create Content</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 过滤器 (仅创作者视图) */}
      {showCreatorOnly && (
        <div className="flex items-center space-x-2 mb-6">
          {(['all', 'published', 'draft'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      )}

      {/* 内容卡片 */}
      <div className="grid gap-6">
        {content.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                {/* 内容类型图标 */}
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-xl">
                  {getContentTypeIcon(item.contentType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    {item.isPremium ? (
                      <Lock className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Globe className="w-4 h-4 text-green-600" />
                    )}
                    {item.status === 'draft' && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{item.earnings.toFixed(4)} ETH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              {showCreatorOnly && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {/* 标签 */}
            {item.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 价格和操作 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {item.isPremium ? (
                  <div className="text-lg font-semibold text-purple-600">
                    {item.price} ETH
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-green-600">
                    Free
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  by {item.creatorName}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!showCreatorOnly && item.status === 'published' && (
                  <Link
                    href={`/content/${item.id}`}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                  >
                    <span>{item.isPremium ? 'Purchase' : 'Read'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                
                {showCreatorOnly && (
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 py-2 px-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    <span>Preview</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
