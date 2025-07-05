'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
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
  CheckCircle,
  Globe,
  Lock,
  Zap
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';
import { IPFSUpload } from '@/components/ipfs/IPFSUpload';
import { RichTextEditor } from './RichTextEditor';

export function Web3CreateContentForm() {
  const { user } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    contentType: 'image' as 'article' | 'video' | 'audio' | 'image',
    tags: '',
    price: '0.001',
    isPremium: false,
    category: '',
  });
  
  const [ipfsFile, setIpfsFile] = useState<{
    hash: string;
    url: string;
    file: File;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const contentTypes = [
    { 
      id: 'article', 
      label: 'Article', 
      icon: Type, 
      description: 'Written content with rich formatting',
      acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSize: 10,
      note: 'Cover image (optional)'
    },
    { 
      id: 'video', 
      label: 'Video', 
      icon: Video, 
      description: 'Video content stored on IPFS',
      acceptedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
      maxSize: 500,
      note: 'Main video file'
    },
    { 
      id: 'audio', 
      label: 'Audio', 
      icon: Mic, 
      description: 'Podcast or music content',
      acceptedTypes: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'],
      maxSize: 100,
      note: 'Audio file'
    },
    { 
      id: 'image', 
      label: 'Image', 
      icon: Image, 
      description: 'Visual content and artwork',
      acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      maxSize: 50,
      note: 'Main image file'
    },
  ];

  const categories = [
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

  const selectedContentType = contentTypes.find(type => type.id === formData.contentType);

  const handleIPFSUploadComplete = (ipfsHash: string, ipfsUrl: string, file: File) => {
    setIpfsFile({ hash: ipfsHash, url: ipfsUrl, file });
    console.log('IPFS Upload Complete:', { ipfsHash, ipfsUrl, fileName: file.name });
  };

  const handleIPFSUploadError = (error: string) => {
    console.error('IPFS Upload Error:', error);
  };

  const isFormValid = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return false;
    }
    
    if (formData.contentType !== 'article') {
      return ipfsFile !== null;
    }
    
    return formData.content.trim() !== '';
  };

  // 完全安全的 handleSubmit 函数
  const handleSubmit = async (status: 'draft' | 'published') => {
    console.log('=== SUBMIT START ===');
    console.log('User object:', user);
    console.log('Form valid:', isFormValid());
    
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // 使用完全安全的默认值
      const defaultWallet = '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E';
      const defaultName = 'Test Creator';
      
      console.log('Creating content item...');
      
      const contentItem: ContentItem = {
        id: `content_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        content: formData.content || `${formData.contentType} content uploaded to IPFS`,
        contentType: formData.contentType,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        price: parseFloat(formData.price),
        isPremium: formData.isPremium,
        creatorAddress: defaultWallet, // 直接使用默认值
        creatorName: defaultName, // 直接使用默认值
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        earnings: 0,
        likes: 0,
        status,
      };

      // 添加IPFS信息
      if (ipfsFile) {
        contentItem.coverImage = ipfsFile.url;
        contentItem.ipfsHash = ipfsFile.hash;
        contentItem.fileSize = ipfsFile.file.size;
        contentItem.mimeType = ipfsFile.file.type;
        console.log('Added IPFS info:', {
          hash: ipfsFile.hash,
          url: ipfsFile.url,
          size: ipfsFile.file.size
        });
      }

      console.log('Final content item:', contentItem);
      console.log('Calling contentStorage.saveContent...');
      
      contentStorage.saveContent(contentItem);
      
      console.log('Content saved successfully!');
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/content');
      }, 2000);

    } catch (error) {
      console.error('=== SAVE ERROR ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      alert(`Save failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      console.log('=== SUBMIT END ===');
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Web3 Content Created!</h3>
          <p className="text-gray-600 mb-4">
            Your content has been saved with IPFS integration and is ready to share on the decentralized web.
          </p>
          {ipfsFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Stored on IPFS</span>
              </div>
              <code className="text-xs text-blue-600 mt-2 block break-all">
                {ipfsFile.hash}
              </code>
            </div>
          )}
          <button
            onClick={() => router.push('/content')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            View My Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create Web3 Content</h2>
          <p className="text-gray-600">Upload to IPFS and earn Sepolia ETH</p>
        </div>
      </div>

      {/* Web3 Features Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-800">Web3 Features Enabled</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>IPFS Decentralized Storage</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>Crypto Payments (ETH)</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>Zero Platform Fees</span>
          </div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Content Type</span>
          <span>Upload & Edit</span>
          <span>Publish Settings</span>
        </div>
      </div>

      <form className="space-y-6">
        {/* 步骤 1 */}
        {currentStep === 1 && (
          <div className="space-y-6">
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
                      <div className="text-xs text-blue-600 mt-1">{type.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter an engaging title for your content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description to attract your audience..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="web3, crypto, tutorial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 步骤 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {selectedContentType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {formData.contentType === 'article' ? 'Cover Image (Optional)' : `${selectedContentType.label} File *`}
                </label>
                <IPFSUpload
                  onUploadComplete={handleIPFSUploadComplete}
                  onUploadError={handleIPFSUploadError}
                  acceptedTypes={selectedContentType.acceptedTypes}
                  maxSize={selectedContentType.maxSize}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.contentType === 'article' ? 'Article Content *' : 'Description'}
              </label>
              {formData.contentType === 'article' ? (
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your article content here..."
                />
              ) : (
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your content..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>
        )}

        {/* 步骤 3 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Content Access</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPremium: !prev.isPremium }))}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    formData.isPremium
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {formData.isPremium ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
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
                    💡 You keep 100% • Recommended: 0.001-0.01 ETH
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Content Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {formData.title || 'Untitled'}</p>
                <p><strong>Type:</strong> {selectedContentType?.label}</p>
                <p><strong>Access:</strong> {formData.isPremium ? `Premium (${formData.price} ETH)` : 'Free'}</p>
                {ipfsFile && (
                  <div>
                    <p><strong>IPFS:</strong> File uploaded successfully</p>
                    <code className="text-xs bg-white p-1 rounded break-all">{ipfsFile.hash}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && (!formData.title || !formData.description)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit('draft')}
                  disabled={isLoading || !isFormValid()}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('published')}
                  disabled={isLoading || !isFormValid()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Web3</span>
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}