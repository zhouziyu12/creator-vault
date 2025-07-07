'use client';

import { ContentItem } from '@/types/content';
import { 
  Eye, 
  Heart, 
  DollarSign, 
  Lock, 
  Globe, 
  Clock,
  User,
  Gift,
  Play,
  FileText,
  Image as ImageIcon,
  Headphones
} from 'lucide-react';

interface ContentCardProps {
  content: ContentItem;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onTipClick: () => void;
}

export function ContentCard({ content, viewMode, onClick, onTipClick }: ContentCardProps) {
  const getContentTypeIcon = () => {
    switch (content.contentType) {
      case 'video': return Play;
      case 'audio': return Headphones;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  const ContentTypeIcon = getContentTypeIcon();

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex items-center space-x-6">
          {/* 缩略图 */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            {content.coverImage ? (
              <img
                src={content.coverImage}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (<ContentTypeIcon className="w-8 h-8 text-purple-600" />
           )}
           {content.isPremium && (
             <div className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded">
               <Lock className="w-3 h-3" />
             </div>
           )}
         </div>

         {/* 内容信息 */}
         <div className="flex-1 min-w-0">
           <div className="flex items-start justify-between mb-2">
             <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
               {content.title}
             </h3>
             <div className="flex items-center space-x-2 flex-shrink-0">
               {content.isPremium ? (
                 <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                   {content.price} ETH
                 </span>
               ) : (
                 <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                   Free
                 </span>
               )}
             </div>
           </div>
           
           <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
           
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-4 text-sm text-gray-500">
               <div className="flex items-center space-x-1">
                 <User className="w-4 h-4" />
                 <span>{content.creatorName}</span>
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
                 <Clock className="w-4 h-4" />
                 <span>{new Date(content.createdAt).toLocaleDateString()}</span>
               </div>
             </div>
             
             <div className="flex items-center space-x-2">
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   onTipClick();
                 }}
                 className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
               >
                 <Gift className="w-3 h-3" />
                 <span>Tip</span>
               </button>
               <button
                 onClick={onClick}
                 className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm"
               >
                 {content.isPremium ? 'Buy' : 'View'}
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }

 // Grid view
 return (
   <div 
     onClick={onClick}
     className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
   >
     {/* 缩略图区域 */}
     <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
       {content.coverImage ? (
         <img
           src={content.coverImage}
           alt={content.title}
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
         />
       ) : (
         <div className="w-full h-full flex items-center justify-center">
           <ContentTypeIcon className="w-16 h-16 text-purple-600" />
         </div>
       )}
       
       {/* 覆盖层信息 */}
       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
         <div className="absolute top-3 left-3 flex items-center space-x-2">
           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
             content.isPremium 
               ? 'bg-purple-600 text-white' 
               : 'bg-green-500 text-white'
           }`}>
             {content.isPremium ? `${content.price} ETH` : 'Free'}
           </span>
           <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs capitalize">
             {content.contentType}
           </span>
         </div>
         
         <div className="absolute top-3 right-3">
           {content.isPremium && <Lock className="w-5 h-5 text-white" />}
           {!content.isPremium && <Globe className="w-5 h-5 text-white" />}
         </div>
         
         <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           <div className="flex items-center justify-between text-white text-sm">
             <div className="flex items-center space-x-3">
               <div className="flex items-center space-x-1">
                 <Eye className="w-4 h-4" />
                 <span>{content.views || 0}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <Heart className="w-4 h-4" />
                 <span>{content.likes || 0}</span>
               </div>
             </div>
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 onTipClick();
               }}
               className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
             >
               <Gift className="w-4 h-4" />
             </button>
           </div>
         </div>
       </div>
     </div>

     {/* 内容信息 */}
     <div className="p-4">
       <div className="mb-2">
         <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
           {content.title}
         </h3>
         <p className="text-gray-600 text-sm line-clamp-2">
           {content.description}
         </p>
       </div>

       {/* 创作者信息 */}
       <div className="flex items-center space-x-2 mb-3">
         <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
           {content.creatorName[0].toUpperCase()}
         </div>
         <span className="text-sm text-gray-700 font-medium">{content.creatorName}</span>
       </div>

       {/* 标签 */}
       {content.tags && content.tags.length > 0 && (
         <div className="flex flex-wrap gap-1 mb-3">
           {content.tags.slice(0, 3).map((tag, index) => (
             <span
               key={index}
               className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
             >
               #{tag}
             </span>
           ))}
           {content.tags.length > 3 && (
             <span className="text-gray-400 text-xs">+{content.tags.length - 3}</span>
           )}
         </div>
       )}

       {/* 底部操作栏 */}
       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
         <div className="flex items-center space-x-3 text-sm text-gray-500">
           <span>{new Date(content.createdAt).toLocaleDateString()}</span>
         </div>
         
         <div className="flex items-center space-x-2">
           <button
             onClick={(e) => {
               e.stopPropagation();
               onTipClick();
             }}
             className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm"
           >
             <Gift className="w-3 h-3" />
             <span>Tip</span>
           </button>
           
           <button className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
             content.isPremium
               ? 'bg-purple-600 text-white hover:bg-purple-700'
               : 'bg-green-600 text-white hover:bg-green-700'
           }`}>
             {content.isPremium ? 'Buy Now' : 'Read Free'}
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}
