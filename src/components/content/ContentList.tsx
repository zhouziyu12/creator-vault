'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { contentStorage } from '@/lib/content/storage';
import { useContentInit } from '@/hooks/useContentInit';
import { ContentItem } from '@/types/content';
import { 
  Eye, 
  Heart, 
  DollarSign, 
  Calendar, 
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  Globe,
  Lock,
  User,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface ContentListProps {
  showCreatorOnly?: boolean;
  limit?: number;
  category?: string;
}

export function ContentList({ showCreatorOnly = false, limit, category }: ContentListProps) {
  const { user } = useUser();
  const isContentInitialized = useContentInit();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState<string | null>(null);

  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return 'ssr_user';
    
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        return JSON.parse(authUser).id;
      }
      return user?.id || user?.email || 'demo_user';
    } catch {
      return user?.id || user?.email || 'demo_user';
    }
  };

  useEffect(() => {
    if (!isContentInitialized) return;
    
    setLoading(true);
    
    try {
      let allContents: ContentItem[];
      
      if (showCreatorOnly) {
        // 只显示当前用户的内容
        const userId = getCurrentUserId();
        allContents = contentStorage.getUserContents(userId);
        console.log('📝 Loading user contents for:', userId, 'Found:', allContents.length);
      } else {
        // 显示所有用户的内容
        allContents = contentStorage.getAllContents();
        console.log('🌐 Loading all contents, Found:', allContents.length);
      }

      // 分类过滤
      if (category && category !== 'all') {
        allContents = allContents.filter(content => content.category === category);
      }

      // 只显示已发布的内容
      allContents = allContents.filter(content => content.status === 'published');

      // 按创建时间排序
      allContents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // 限制数量
      if (limit) {
        allContents = allContents.slice(0, limit);
      }

      setContents(allContents);
    } catch (error) {
      console.error('❌ Failed to load contents:', error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, [showCreatorOnly, limit, category, user, isContentInitialized]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      contentStorage.deleteContent(id);
      setContents(contents.filter(c => c.id !== id));
      setShowActions(null);
    }
  };

  const isOwner = (content: ContentItem) => {
    const userId = getCurrentUserId();
    const userName = user?.name || 'Demo User';
    
    return content.creatorAddress === userId ||
           content.creatorName === userName ||
           content.creatorAddress?.toLowerCase() === userId?.toLowerCase();
  };

  if (!isContentInitialized) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing content...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {showCreatorOnly ? 'No content created yet' : 'No content available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {showCreatorOnly 
            ? 'Start creating your first piece of content to build your audience.' 
            : 'Be the first to create and share content with the community.'
          }
        </p>
        {showCreatorOnly && (
          <Link
            href="/content/create"
            className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Content
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 内容统计 */}
      {!showCreatorOnly && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Community Content</span>
              </div>
              <div className="text-sm text-blue-600">
                {contents.length} pieces • {contents.filter(c => !c.isPremium).length} free • {contents.filter(c => c.isPremium).length} premium
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-blue-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Growing Community</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 内容列表 */}
      {contents.map((content) => (
        <div key={content.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-start space-x-4">
            {/* 缩略图 */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              {content.coverImage ? (
                <img
                  src={content.coverImage}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Globe className="w-8 h-8 text-purple-600" />
              )}
              {content.isPremium && (
                <div className="absolute top-1 right-1 bg-purple-600 text-white p-1 rounded">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* 内容信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-4">
                  <Link
                    href={`/content/${content.id}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {content.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {content.description}
                  </p>
                </div>
                
                {/* 价格标签 */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {content.isPremium ? (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{content.price} ETH</span>
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Free
                    </span>
                  )}
                </div>
              </div>

              {/* 创作者信息 */}
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {content.creatorName[0].toUpperCase()}
                  </div>
                  <span>{content.creatorName}</span>
                  {isOwner(content) && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      Your Content
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>

                {content.category && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {content.category}
                  </span>
                )}
              </div>

              {/* 标签 */}
              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {content.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">+{content.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* 底部统计和操作 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{content.views || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{content.likes || 0}</span>
                  </div>
                  <span className="text-xs">
                    {content.status === 'draft' ? '📝 Draft' : '✅ Published'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/content/${content.id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {content.isPremium ? 'View/Buy' : 'Read'}
                  </Link>

                  {/* 操作菜单 */}
                  {isOwner(content) && (
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === content.id ? null : content.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {showActions === content.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowActions(null)}></div>
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <Link
                              href={`/content/edit/${content.id}`}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowActions(null)}
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/content/${content.id}`);
                                alert('Link copied!');
                                setShowActions(null);
                              }}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                            <button
                              onClick={() => handleDelete(content.id)}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
