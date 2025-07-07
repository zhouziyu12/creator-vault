'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth-web3/react';
import { PageLayout } from '@/components/layout/PageLayout';
import { FileUploader } from '@/components/upload/FileUploader';
import { MediaPreview } from '@/components/upload/MediaPreview';
import { contentStorage } from '@/lib/content/storage';
import { ContentItem } from '@/types/content';
import { 
  Save, 
  Eye, 
  Upload, 
  DollarSign, 
  Globe, 
  Lock,
  Image as ImageIcon,
  Tag,
  FileText,
  Video,
  Headphones,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

export default function CreateContentPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    contentType: 'article' as ContentItem['contentType'],
    category: 'Technology',
    tags: [] as string[],
    isPremium: false,
    price: 0.001,
    coverImage: '',
    status: 'published' as ContentItem['status']
  });
  
  // 文件上传状态
  const [uploadedFiles, setUploadedFiles] = useState<{
    coverImage?: { file: File; dataUrl: string };
    mainContent?: { file: File; dataUrl: string };
  }>({});
  
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const categories = ['Technology', 'Education', 'Entertainment', 'Art', 'Music', 'Gaming', 'Business', 'Health', 'Science'];
  const contentTypes = [
    { value: 'article', label: 'Article', icon: FileText, accept: 'text/*' },
    { value: 'video', label: 'Video', icon: Video, accept: 'video/*' },
    { value: 'audio', label: 'Audio', icon: Headphones, accept: 'audio/*' },
    { value: 'image', label: 'Image Gallery', icon: ImageIcon, accept: 'image/*' }
  ];

  const getCurrentUserInfo = () => {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const parsed = JSON.parse(authUser);
        return {
          id: parsed.id,
          name: parsed.name || parsed.id?.slice(0, 8) + '...' || 'Demo User'
        };
      }
      
      return {
        id: user?.id || user?.email || 'demo_user_' + Date.now(),
        name: user?.name || user?.id?.slice(0, 8) + '...' || 'Demo Creator'
      };
    } catch {
      return {
        id: user?.id || user?.email || 'demo_user_' + Date.now(),
        name: user?.name || 'Demo Creator'
      };
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理封面图片上传
  const handleCoverImageUpload = (file: File, dataUrl: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      coverImage: { file, dataUrl }
    }));
    setFormData(prev => ({ ...prev, coverImage: dataUrl }));
    console.log('📸 Cover image uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  };

  // 处理主要内容文件上传
  const handleMainContentUpload = (file: File, dataUrl: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      mainContent: { file, dataUrl }
    }));
    
    // 根据文件类型更新内容
    if (formData.contentType === 'video' || formData.contentType === 'audio' || formData.contentType === 'image') {
      setFormData(prev => ({ 
        ...prev, 
        content: dataUrl // 对于媒体文件，将 dataUrl 存储为内容
      }));
    }
    
    console.log('📁 Main content uploaded:', file.name, 'Type:', file.type, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  };

  // 移除文件
  const handleRemoveFile = (type: 'coverImage' | 'mainContent') => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
    
    if (type === 'coverImage') {
      setFormData(prev => ({ ...prev, coverImage: '' }));
    } else if (type === 'mainContent') {
      setFormData(prev => ({ ...prev, content: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    // 验证内容类型要求
    if ((formData.contentType === 'video' || formData.contentType === 'audio' || formData.contentType === 'image') && !uploadedFiles.mainContent) {
      alert(`Please upload ${formData.contentType} content`);
      return;
    }

    if (formData.contentType === 'article' && !formData.content.trim()) {
      alert('Please write your article content');
      return;
    }

    setLoading(true);
    
    try {
      const userInfo = getCurrentUserInfo();
      
      // 生成内容HTML（根据类型）
      let contentHtml = '';
      if (formData.contentType === 'article') {
        contentHtml = formData.content;
      } else if (formData.contentType === 'video') {
        contentHtml = `
          <div class="video-content">
            <video controls style="width: 100%; max-width: 800px; height: auto;">
              <source src="${formData.content}" type="${uploadedFiles.mainContent?.file.type}">
              Your browser does not support the video tag.
            </video>
            <p style="margin-top: 1rem; color: #666;">${formData.description}</p>
          </div>
        `;
      } else if (formData.contentType === 'audio') {
        contentHtml = `
          <div class="audio-content">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; text-align: center; margin-bottom: 1rem;">
              <div style="color: white; font-size: 1.5rem; margin-bottom: 1rem;">🎵 Audio Content</div>
              <audio controls style="width: 100%; max-width: 600px;">
                <source src="${formData.content}" type="${uploadedFiles.mainContent?.file.type}">
                Your browser does not support the audio element.
              </audio>
            </div>
            <p style="color: #666;">${formData.description}</p>
          </div>
        `;
      } else if (formData.contentType === 'image') {
        contentHtml = `
          <div class="image-content">
            <img src="${formData.content}" alt="${formData.title}" style="width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="margin-top: 1rem; color: #666;">${formData.description}</p>
          </div>
        `;
      }
      
      const newContent: ContentItem = {
        id: 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: contentHtml,
        contentType: formData.contentType,
        category: formData.category,
        tags: formData.tags,
        isPremium: formData.isPremium,
        price: formData.isPremium ? formData.price : 0,
        coverImage: formData.coverImage,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorName: userInfo.name,
        creatorAddress: userInfo.id,
        views: 0,
        likes: 0,
        ipfsHash: '' // 可以在这里添加 IPFS 上传逻辑
      };

      console.log('💾 Creating new content:', newContent);
      console.log('📁 Uploaded files:', uploadedFiles);
      
      // 保存到全局存储
      contentStorage.saveContent(newContent);
      
      console.log('✅ Content created successfully!');
      alert(`🎉 ${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} content created successfully!`);
      
      // 跳转到内容详情页
      router.push(`/content/${newContent.id}`);
      
    } catch (error) {
      console.error('❌ Failed to create content:', error);
      alert('Failed to create content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' as ContentItem['status'] };
    setFormData(draftData);
    
    console.log('📝 Saving draft...');
    alert('Draft saved! 💾');
  };

  const currentContentType = contentTypes.find(type => type.value === formData.contentType);

  if (previewMode) {
    return (
      <PageLayout
        title="Preview Content"
        description="Preview how your content will look to viewers"
        actions={
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Edit
          </button>
        }
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
              <p className="text-gray-600 text-lg mb-4">{formData.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <span>By {getCurrentUserInfo().name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {formData.isPremium ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>{formData.isPremium ? `${formData.price} ETH` : 'Free'}</span>
                </div>
                <span className="capitalize">{formData.contentType}</span>
                <span>{formData.category}</span>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {formData.coverImage && (
              <div className="mb-6">
                <MediaPreview
                  src={formData.coverImage}
                  type="image"
                  title="Cover Image"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {formData.content ? (
                formData.contentType === 'article' ? (
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                ) : (
                  <MediaPreview
                    src={formData.content}
                    type={formData.contentType === 'image' ? 'image' : formData.contentType}
                    title={formData.title}
                  />
                )
              ) : (
                <p className="text-gray-500 italic">No content yet...</p>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Create New Content"
      description={`Share your ${formData.contentType} with the Web3 community`}
      actions={
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主表单 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 内容类型选择 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Content Type</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contentTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('contentType', type.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.contentType === type.value
                          ? 'border-purple-300 bg-purple-50 text-purple-700 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 基本信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={`Enter your ${formData.contentType} title...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Describe your ${formData.contentType}...`}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 封面图片上传 */}
         <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
               <ImageIcon className="w-5 h-5" />
               <span>Cover Image</span>
               <span className="text-sm text-gray-500 font-normal">(Optional)</span>
             </h3>
             
             <FileUploader
               type="image"
               accept="image/*"
               maxSize={10}
               onFileUpload={handleCoverImageUpload}
               onFileRemove={() => handleRemoveFile('coverImage')}
               currentFile={formData.coverImage}
               className="w-full"
             />
             
             <div className="mt-3 text-xs text-gray-500">
               💡 A good cover image helps attract viewers. Recommended size: 1200x630px
             </div>
           </div>

           {/* 主要内容区域 */}
           <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
               {currentContentType && <currentContentType.icon className="w-5 h-5" />}
               <span>{formData.contentType === 'article' ? 'Article Content' : `${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} Upload`}</span>
               <span className="text-red-500">*</span>
             </h3>
             
             {formData.contentType === 'article' ? (
               <div>
                 <textarea
                   value={formData.content}
                   onChange={(e) => handleInputChange('content', e.target.value)}
                   placeholder="Write your article here... You can use HTML tags for formatting."
                   rows={15}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none font-mono text-sm"
                 />
                 
                 <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                   <div className="text-sm text-blue-800 font-medium mb-1">HTML Formatting Tips:</div>
                   <div className="text-xs text-blue-700 space-y-1">
                     <p>• &lt;h2&gt;Heading&lt;/h2&gt; for section titles</p>
                     <p>• &lt;p&gt;Paragraph text&lt;/p&gt; for body content</p>
                     <p>• &lt;strong&gt;Bold text&lt;/strong&gt; for emphasis</p>
                     <p>• &lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt; for lists</p>
                   </div>
                 </div>
               </div>
             ) : (
               <div>
                 <FileUploader
                   type={formData.contentType}
                   accept={currentContentType?.accept}
                   maxSize={formData.contentType === 'video' ? 100 : 50}
                   onFileUpload={handleMainContentUpload}
                   onFileRemove={() => handleRemoveFile('mainContent')}
                   currentFile={uploadedFiles.mainContent?.dataUrl}
                   className="w-full"
                 />
                 
                 <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                   <div className="flex items-center space-x-2 text-yellow-800 text-sm">
                     <AlertCircle className="w-4 h-4" />
                     <span className="font-medium">File Size Limits:</span>
                   </div>
                   <div className="text-xs text-yellow-700 mt-1 space-y-1">
                     <p>• Images: Up to 10MB (JPG, PNG, GIF, WebP)</p>
                     <p>• Videos: Up to 100MB (MP4, WebM, MOV)</p>
                     <p>• Audio: Up to 50MB (MP3, WAV, OGG)</p>
                   </div>
                 </div>
               </div>
             )}
           </div>

           {/* 内容预览 */}
           {(uploadedFiles.mainContent || (formData.contentType === 'article' && formData.content)) && (
             <div className="bg-white rounded-xl border border-gray-200 p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                 <Eye className="w-5 h-5" />
                 <span>Content Preview</span>
               </h3>
               
               {formData.contentType === 'article' ? (
                 <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 bg-gray-50">
                   <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                 </div>
               ) : uploadedFiles.mainContent && (
                 <MediaPreview
                   src={uploadedFiles.mainContent.dataUrl}
                   type={formData.contentType === 'image' ? 'image' : formData.contentType}
                   title={formData.title}
                 />
               )}
             </div>
           )}
         </div>

         {/* 侧边栏设置 */}
         <div className="space-y-6">
           {/* 分类 */}
           <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4">Category</h3>
             
             <select
               value={formData.category}
               onChange={(e) => handleInputChange('category', e.target.value)}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
             >
               {categories.map(category => (
                 <option key={category} value={category}>{category}</option>
               ))}
             </select>
           </div>

           {/* 标签 */}
           <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4">Tags</h3>
             
             <div className="flex gap-2 mb-3">
               <input
                 type="text"
                 value={tagInput}
                 onChange={(e) => setTagInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                 placeholder="Add a tag..."
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
               />
               <button
                 onClick={handleAddTag}
                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
               >
                 <Tag className="w-4 h-4" />
               </button>
             </div>
             
             {formData.tags.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {formData.tags.map((tag, index) => (
                   <span
                     key={index}
                     className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                   >
                     #{tag}
                     <button
                       onClick={() => handleRemoveTag(tag)}
                       className="ml-2 text-blue-500 hover:text-blue-700"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 ))}
               </div>
             )}
           </div>

           {/* 定价设置 */}
           <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4">Pricing</h3>
             
             <div className="space-y-4">
               <div className="flex items-center space-x-3">
                 <input
                   type="checkbox"
                   id="isPremium"
                   checked={formData.isPremium}
                   onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                   className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                 />
                 <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                   Premium Content
                 </label>
               </div>

               {formData.isPremium && (
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Price (ETH)
                   </label>
                   <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                     <input
                       type="number"
                       step="0.001"
                       min="0.001"
                       value={formData.price}
                       onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0.001)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                     />
                   </div>
                   <div className="mt-2 text-sm text-gray-500">
                     ≈ ${((formData.price || 0) * 2000).toFixed(2)} USD
                   </div>
                 </div>
               )}

               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                 <div className="flex items-center space-x-2 mb-2">
                   <Globe className="w-4 h-4 text-blue-600" />
                   <span className="text-sm font-medium text-blue-800">Web3 Benefits</span>
                 </div>
                 <div className="text-xs text-blue-700 space-y-1">
                   <p>✅ 100% earnings go to you</p>
                   <p>✅ Instant crypto payments</p>
                   <p>✅ Global accessibility</p>
                   <p>✅ Decentralized storage</p>
                 </div>
               </div>
             </div>
           </div>

           {/* 发布设置 */}
           <div className="bg-white rounded-xl border border-gray-200 p-6">
             <h3 className="text-lg font-semibold mb-4">Publish Settings</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Status
                 </label>
                 <select
                   value={formData.status}
                   onChange={(e) => handleInputChange('status', e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                 >
                   <option value="published">Published</option>
                   <option value="draft">Draft</option>
                 </select>
               </div>

               <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                 <div className="flex items-center space-x-2 mb-2">
                   <CheckCircle className="w-4 h-4 text-green-600" />
                   <span className="text-sm font-medium text-green-800">Visibility</span>
                 </div>
                 <div className="text-xs text-green-700">
                   <p>Your {formData.contentType} will be visible to all users in the Browse section and can be discovered through search.</p>
                 </div>
               </div>
             </div>
           </div>

           {/* 上传状态 */}
           {Object.keys(uploadedFiles).length > 0 && (
             <div className="bg-white rounded-xl border border-gray-200 p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                 <Upload className="w-5 h-5" />
                 <span>Uploaded Files</span>
               </h3>
               
               <div className="space-y-3">
                 {uploadedFiles.coverImage && (
                   <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                     <div className="flex items-center space-x-3">
                       <CheckCircle className="w-5 h-5 text-green-600" />
                       <div>
                         <p className="text-sm font-medium text-green-900">Cover Image</p>
                         <p className="text-xs text-green-700">{uploadedFiles.coverImage.file.name}</p>
                       </div>
                     </div>
                     <button
                       onClick={() => handleRemoveFile('coverImage')}
                       className="text-green-600 hover:text-green-800"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 )}
                 
                 {uploadedFiles.mainContent && (
                   <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                     <div className="flex items-center space-x-3">
                       <CheckCircle className="w-5 h-5 text-purple-600" />
                       <div>
                         <p className="text-sm font-medium text-purple-900 capitalize">{formData.contentType} Content</p>
                         <p className="text-xs text-purple-700">{uploadedFiles.mainContent.file.name}</p>
                         <p className="text-xs text-purple-600">
                           {(uploadedFiles.mainContent.file.size / 1024 / 1024).toFixed(2)} MB
                         </p>
                       </div>
                     </div>
                     <button
                       onClick={() => handleRemoveFile('mainContent')}
                       className="text-purple-600 hover:text-purple-800"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 )}
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   </PageLayout>
 );
}
