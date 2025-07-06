'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  Heart, 
  Calendar, 
  DollarSign,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  Image,
  Video,
  Mic,
  Type
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';

interface ContentListProps {
  showCreatorOnly?: boolean;
  limit?: number;
}

export function ContentList({ showCreatorOnly = false, limit }: ContentListProps) {
  const { user } = useUser();
  const router = useRouter();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [user, filter, showCreatorOnly]);

  const loadContent = () => {
    setLoading(true);
    try {
      console.log('=== LOADING CONTENT ===');
      console.log('showCreatorOnly:', showCreatorOnly);
      console.log('user:', user);
      console.log('filter:', filter);
      
      let items: ContentItem[] = [];
      const allContents = contentStorage.getAllContents();
      
      console.log('All contents from storage:', allContents);
      
      if (showCreatorOnly) {
        // 更宽松的创作者匹配逻辑
        const possibleCreatorIds = [
          user?.wallet?.address,
          user?.id,
          user?.email,
          '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E', // 默认地址
          'Test Creator', // 默认创作者名
          'Demo Creator'
        ].filter(Boolean);
        
        console.log('Looking for any of these creator IDs:', possibleCreatorIds);
        
        items = allContents.filter(content => {
          const match = possibleCreatorIds.some(id => 
            content.creatorAddress === id || 
            content.creatorName === id ||
            content.creatorAddress?.toLowerCase() === id?.toLowerCase()
          );
          console.log(`Content "${content.title}" creator: ${content.creatorAddress}, match: ${match}`);
          return match;
        });
        
        console.log('Matched creator contents:', items);
      } else {
        // 显示所有已发布的内容
        items = allContents.filter(content => content.status === 'published');
        console.log('Published contents:', items);
      }

      if (filter === 'published') {
        items = items.filter(content => content.status === 'published');
      } else if (filter === 'draft') {
        items = items.filter(content => content.status === 'draft');
      }

      console.log('Final filtered items:', items);

      // 按创建时间排序
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // 应用限制
      if (limit && limit > 0) {
        items = items.slice(0, limit);
      }
      
      setContents(items);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        contentStorage.deleteContent(id);
        loadContent(); // 重新加载列表
      } catch (error) {
        console.error('Failed to delete content:', error);
        alert('Failed to delete content');
      }
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return Type;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Mic;
      default: return Type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <Type className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">No content found</h3>
        <p className="text-xs text-gray-600 mb-3">
          {showCreatorOnly ? "You don't have any content yet" : "No published content available"}
        </p>
        {showCreatorOnly && (
          <div className="space-y-2">
            <Link
              href="/content/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm"
            >
              Create Your First Content
            </Link>
            <div className="text-xs">
              <button
               onClick={() => {
                 // 临时修复：将现有内容的创作者改为当前用户
                 const allContents = contentStorage.getAllContents();
                 allContents.forEach(content => {
                   if (content.creatorAddress === '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E') {
                     content.creatorAddress = user?.id || user?.wallet?.address || content.creatorAddress;
                     contentStorage.saveContent(content);
                   }
                 });
                 loadContent();
               }}
               className="text-blue-600 hover:text-blue-700 underline"
             >
               Link existing content to my account
             </button>
           </div>
         </div>
       )}
     </div>
   );
 }

 return (
   <div className="space-y-4">
     {/* 过滤器 - 只在显示创作者内容且非限制模式时显示 */}
     {showCreatorOnly && !limit && (
       <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
         <button
           onClick={() => setFilter('all')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
             filter === 'all'
               ? 'bg-white text-purple-600 shadow-sm'
               : 'text-gray-600 hover:text-gray-900'
           }`}
         >
           All
         </button>
         <button
           onClick={() => setFilter('published')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
             filter === 'published'
               ? 'bg-white text-purple-600 shadow-sm'
               : 'text-gray-600 hover:text-gray-900'
           }`}
         >
           Published
         </button>
         <button
           onClick={() => setFilter('draft')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
             filter === 'draft'
               ? 'bg-white text-purple-600 shadow-sm'
               : 'text-gray-600 hover:text-gray-900'
           }`}
         >
           Draft
         </button>
       </div>
     )}

     {/* 内容列表 */}
     <div className="grid gap-4">
       {contents.map((content) => {
         const Icon = getContentTypeIcon(content.contentType);
         
         return (
           <div key={content.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="flex items-start space-x-4">
               {/* 缩略图 */}
               <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                 {content.coverImage ? (
                   <img
                     src={content.coverImage}
                     alt={content.title}
                     className="w-full h-full object-cover rounded-lg"
                   />
                 ) : (
                   <Icon className="w-6 h-6 text-gray-400" />
                 )}
                 
                 {/* IPFS 标识 */}
                 {content.ipfsHash && (
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                 )}
               </div>

               {/* 内容信息 */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <h3 className="text-lg font-semibold text-gray-900 truncate">{content.title}</h3>
                     <p className="text-gray-600 text-sm mt-1 line-clamp-2">{content.description}</p>
                     
                     {/* 元数据 */}
                     <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                       <div className="flex items-center space-x-1">
                         <Calendar className="w-4 h-4" />
                         <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         <Eye className="w-4 h-4" />
                         <span>{content.views || 0}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         <Heart className="w-4 h-4" />
                         <span>{content.likes || 0}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         {content.isPremium ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                         <span>{content.isPremium ? `${content.price} ETH` : 'Free'}</span>
                       </div>
                     </div>
                   </div>

                   {/* 状态和操作 */}
                   <div className="flex items-center space-x-2 ml-4">
                     {/* 状态标识 */}
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       content.status === 'published' 
                         ? 'bg-green-100 text-green-700'
                         : 'bg-yellow-100 text-yellow-700'
                     }`}>
                       {content.status === 'published' ? 'Published' : 'Draft'}
                     </span>

                     {/* 操作按钮 */}
                     <div className="flex items-center space-x-1">
                       <button
                         onClick={() => router.push(`/content/${content.id}`)}
                         className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                         title="Preview"
                       >
                         <ExternalLink className="w-4 h-4" />
                       </button>
                       
                       {showCreatorOnly && (
                         <>
                           <button
                             onClick={() => router.push(`/content/edit/${content.id}`)}
                             className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                             title="Edit"
                           >
                             <Edit className="w-4 h-4" />
                           </button>
                           
                           <button
                             onClick={() => handleDelete(content.id)}
                             className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                             title="Delete"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 </div>

                 {/* 标签 */}
                 {content.tags && content.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-3">
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

                 {/* IPFS 信息 */}
                 {content.ipfsHash && (
                   <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                     <div className="flex items-center space-x-1 text-blue-700">
                       <Globe className="w-3 h-3" />
                       <span className="font-medium">Stored on IPFS</span>
                     </div>
                     <code className="text-blue-600 break-all">{content.ipfsHash}</code>
                   </div>
                 )}
               </div>
             </div>
           </div>
         );
       })}
     </div>
   </div>
 );
}
