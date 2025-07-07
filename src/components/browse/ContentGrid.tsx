'use client';

import { ContentItem } from '@/types/content';
import { 
  Eye, 
  Heart, 
  DollarSign, 
  Calendar, 
  Globe, 
  Lock,
  Video,
  Headphones,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface ContentGridProps {
  contents: ContentItem[];
  viewMode: 'grid' | 'list';
  onContentClick: (content: ContentItem) => void;
  onTipClick: (content: ContentItem) => void;
}

export function ContentGrid({ contents, viewMode, onContentClick, onTipClick }: ContentGridProps) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  const ImageWithFallback = ({ src, alt, className, contentType }: { 
    src?: string; 
    alt: string; 
    className?: string;
    contentType: string;
  }) => {
    const FallbackIcon = getContentTypeIcon(contentType);
    
    if (!src) {
      return (
        <div className={`bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center ${className}`}>
          <FallbackIcon className="w-8 h-8 text-purple-600" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center w-full h-full">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            `;
          }
        }}
      />
    );
  };

  if (contents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
        <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {contents.map((content) => {
          const ContentTypeIcon = getContentTypeIcon(content.contentType);
          
          return (
            <div key={content.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start space-x-4">
                {/* 缩略图 */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <ImageWithFallback
                    src={content.coverImage}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    contentType={content.contentType}
                  />
                  {content.isPremium && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs capitalize">
                    {content.contentType}
                  </div>
                </div>

                {/* 内容信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 
                        className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer line-clamp-1"
                        onClick={() => onContentClick(content)}
                      >
                        {content.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {content.description}
                      </p>
                    </div>
                    
                    {/* 价格标签 */}
                    <div className="flex-shrink-0">
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

                  {/* 创作者和时间 */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {content.creatorName[0].toUpperCase()}
                      </div>
                      <span>{content.creatorName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
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
                      {content.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {content.tags.length > 4 && (
                        <span className="text-gray-400 text-xs">+{content.tags.length - 4}</span>
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
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onTipClick(content)}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1"
                      >
                        <Heart className="w-3 h-3" />
                        <span>Tip</span>
                      </button>
                      
                      <button
                        onClick={() => onContentClick(content)}
                        className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        {content.isPremium ? 'Buy Now' : 'Read Free'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 网格视图
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contents.map((content) => {
        const ContentTypeIcon = getContentTypeIcon(content.contentType);
        
        return (
          <div key={content.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
            {/* 封面图片 */}
            <div className="relative aspect-video">
              <ImageWithFallback
                src={content.coverImage}
                alt={content.title}
                className="w-full h-full object-cover"
                contentType={content.contentType}
              />
              
              {/* 覆盖层 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
              
              {/* 统计信息 */}
              <div className="absolute top-3 left-3 flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  <Eye className="w-3 h-3" />
                  <span>{content.views || 0}</span>
                </div>
                <div className="flex items-center space-x-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  <Heart className="w-3 h-3" />
                  <span>{content.likes || 0}</span>
                </div>
              </div>

              {/* 类型和价格标签 */}
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <div className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded text-xs font-medium capitalize flex items-center space-x-1">
                  <ContentTypeIcon className="w-3 h-3" />
                  <span>{content.contentType}</span>
                </div>
                
                {content.isPremium && (
                  <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>{content.price} ETH</span>
                  </div>
                )}
              </div>
            </div>

            {/* 内容信息 */}
            <div className="p-4">
              <h3 
                className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onContentClick(content)}
              >
                {content.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {content.description}
              </p>

              {/* 创作者信息 */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {content.creatorName[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-600">{content.creatorName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* 标签 */}
              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {content.tags.length > 2 && (
                    <span className="text-gray-400 text-xs">+{content.tags.length - 2}</span>
                  )}
                </div>
              )}

              {/* 底部操作 */}
              <div className="flex items-center justify-between">
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onTipClick(content)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onContentClick(content)}
                    className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {content.isPremium ? 'Buy' : 'View'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
