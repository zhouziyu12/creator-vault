'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { 
  Plus, 
  Upload, 
  Type, 
  Video, 
  Mic, 
  Image, 
  Tag, 
  DollarSign,
  Eye,
  EyeOff,
  Save,
  Send,
  CheckCircle
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';

interface CreateContentFormProps {
  onSuccess?: () => void;
}

export function CreateContentForm({ onSuccess }: CreateContentFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    contentType: 'article' as 'article' | 'video' | 'audio' | 'image',
    tags: '',
    price: '0.001',
    isPremium: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const contentTypes = [
    { id: 'article', label: 'Article', icon: Type, description: 'Written content' },
    { id: 'video', label: 'Video', icon: Video, description: 'Video content' },
    { id: 'audio', label: 'Audio', icon: Mic, description: 'Podcast/Music' },
    { id: 'image', label: 'Image', icon: Image, description: 'Visual content' },
  ];

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user?.wallet?.address) return;

    setIsLoading(true);
    try {
      const contentItem: ContentItem = {
        id: `content_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        contentType: formData.contentType,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        price: parseFloat(formData.price),
        isPremium: formData.isPremium,
        creatorAddress: user.wallet.address,
        creatorName: user.id || 'Anonymous Creator',
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        earnings: 0,
        likes: 0,
        status,
      };

      contentStorage.saveContent(contentItem);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (error) {
      console.error('保存内容失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Created!</h3>
          <p className="text-gray-600">Your content has been created successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create New Content</h2>
          <p className="text-gray-600">Share your knowledge and earn Sepolia ETH</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* 内容类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, contentType: type.id as any }))}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    formData.contentType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${
                    formData.contentType === type.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter your content title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of your content..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* 内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your content here..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="web3, crypto, tutorial (comma separated)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 定价设置 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Monetization</label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPremium: !prev.isPremium }))}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                formData.isPremium
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {formData.isPremium ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{formData.isPremium ? 'Premium' : 'Free'}</span>
            </button>
          </div>

          {formData.isPremium && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Price (Sepolia ETH)</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                step="0.001"
                min="0"
                placeholder="0.001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 0.001 ETH • You keep 100% of earnings
              </p>
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isLoading || !formData.title || !formData.content}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isLoading || !formData.title || !formData.content}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Publish Now</span>
          </button>
        </div>
      </form>
    </div>
  );
}
