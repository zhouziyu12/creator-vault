'use client';

import { ContentItem } from '@/types/content';
import { MediaPreview } from '@/components/upload/MediaPreview';
import { Globe, ExternalLink } from 'lucide-react';

interface ContentViewerProps {
  content: ContentItem;
  canView: boolean;
}

export function ContentViewer({ content, canView }: ContentViewerProps) {
  if (!canView) {
    return null; // 付费墙会处理这种情况
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Content</h2>
        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded capitalize">
          {content.contentType}
        </span>
        {content.ipfsHash && (
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Stored on IPFS
          </span>
        )}
      </div>
      
      {/* 封面图片 */}
      {content.coverImage && (
        <div className="mb-6">
          <MediaPreview
            src={content.coverImage}
            type="image"
            title="Cover Image"
          />
        </div>
      )}

      {/* 主要内容 */}
      {content.content && (
        <div className="mb-6">
          {content.contentType === 'article' ? (
            <div className="prose prose-lg prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          ) : (
            // 对于媒体内容，内容字段包含了完整的HTML
            <div className="media-content">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          )}
        </div>
      )}

      {/* IPFS 信息 */}
      {content.ipfsHash && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-800">IPFS Hash:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open('https://ipfs.io/ipfs/' + content.ipfsHash, '_blank')}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on IPFS</span>
              </button>
            </div>
          </div>
          <code className="text-xs text-blue-600 break-all block">
            {content.ipfsHash}
          </code>
        </div>
      )}
    </div>
  );
}
