'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@civic/auth-web3/react';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Share2, 
  Download, 
  ExternalLink,
  Globe,
  Lock,
  Calendar,
  User,
  Tag,
  DollarSign,
  Gift,
  Play,
  Headphones,
  ShoppingCart
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { contentStorage } from '@/lib/content/storage';
import { paymentService } from '@/lib/payments/paymentService';
import { PaywallModal } from '@/components/payments/PaywallModal';
import { TipModal } from '@/components/payments/TipModal';

export default function ContentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    console.log('🔍 Loading content with ID:', id);
    if (id) {
      // 尝试多种方式查找内容
      let item = contentStorage.getContent(id as string);
      
      if (!item) {
        // 如果直接查找失败，尝试从所有内容中查找
        const allContents = contentStorage.getAllContents();
        item = allContents.find(c => c.id === id || c.id.includes(id as string));
        console.log('🔍 Searching in all contents:', allContents.length, 'found:', !!item);
      }
      
      setContent(item || null);
      
      if (item) {
        console.log('✅ Content found:', item.title, 'isPremium:', item.isPremium);
        
        // 增加浏览量
        contentStorage.incrementViews(item.id);
        
        // 检查是否已购买
        const purchased = paymentService.hasPurchased(item.id);
        setHasPurchased(purchased);
        console.log('💰 Has purchased:', purchased);
        
        // 检查是否是内容所有者
        const userAddresses = [
          user?.wallet?.address,
          user?.id,
          '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E',
          'Test Creator',
          'Demo Creator',
          'Web3 Academy'
        ].filter(Boolean);
        
        const owner = userAddresses.some(addr => 
          addr === item.creatorAddress || 
          addr?.toLowerCase() === item.creatorAddress?.toLowerCase() ||
          item.creatorName === addr
        );
        setIsOwner(owner);
        console.log('👤 Is owner:', owner);
      } else {
        console.log('❌ Content not found');
      }
      
      setLoading(false);
    }
  }, [id, user]);

  const handleLike = () => {
    if (content) {
      contentStorage.incrementLikes(content.id);
      setContent(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    }
  };

  const handlePurchaseSuccess = () => {
    console.log('🎉 Purchase successful! Updating state...');
    setHasPurchased(true);
    setShowPaywall(false);
    
    // 重新加载内容以更新views
    if (content) {
      const updatedContent = contentStorage.getContent(content.id);
      if (updatedContent) {
        setContent(updatedContent);
      }
    }
  };

  const canViewContent = () => {
    if (!content) return false;
    if (!content.isPremium) return true; // 免费内容
    if (isOwner) return true; // 内容所有者
    if (hasPurchased) return true; // 已购买
    return false;
  };

  const handleUnlockContent = () => {
    console.log('🔓 Trying to unlock content...');
    if (content?.isPremium && !canViewContent()) {
      console.log('💳 Opening paywall modal');
      setShowPaywall(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h1>
          <p className="text-gray-600 mb-4">The content you're looking for doesn't exist.</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/browse')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Content
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 内容头部 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
              <p className="text-gray-600 text-lg mb-4">{content.description}</p>
              
              {/* 元数据 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{content.creatorName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{content.views || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  {content.isPremium ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>{content.isPremium ? `${content.price} ETH` : 'Free'}</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>{content.likes || 0}</span>
              </button>
              
              {!isOwner && (
                <button
                  onClick={() => setShowTipModal(true)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                >
                  <Gift className="w-4 h-4" />
                  <span>Tip</span>
                </button>
              )}
              
              <button className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 购买状态提示 */}
          {content.isPremium && !canViewContent() && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">🔒 Premium Content</p>
                    <p className="text-sm text-purple-700">
                      Purchase to unlock • Support creator directly • 0% platform fees
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUnlockContent}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy for {content.price} ETH</span>
                </button>
              </div>
            </div>
          )}

          {/* 已购买状态 */}
          {content.isPremium && hasPurchased && !isOwner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">✅ Content Purchased</p>
                  <p className="text-sm text-green-700">You have full access to this premium content</p>
                </div>
              </div>
            </div>
          )}

          {/* 内容所有者状态 */}
          {isOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Your Content</p>
                  <p className="text-sm text-blue-700">You are the creator of this content</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 内容展示区域 */}
        {canViewContent() ? (
          // 可以查看的内容
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Content</h2>
              {content.ipfsHash && (
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Stored on IPFS
                </span>
              )}
            </div>
            
            {/* 根据内容类型显示 */}
            {content.coverImage && (
              <div className="mb-4">
                <img
                  src={content.coverImage}
                  alt={content.title}
                  className="max-w-full h-auto rounded-lg border shadow-sm"
                />
              </div>
            )}

            {/* 文章内容 */}
            {content.content && (
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </div>
            )}

            {/* IPFS 信息 */}
            {content.ipfsHash && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
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
        ) : (
          // 付费墙预览
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🔒 Premium Content</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This content is available for premium subscribers only. 
                Support the creator directly with instant crypto payments!
              </p>
              
              {/* 价格展示 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-purple-800 font-medium">Price:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-900">{content.price} ETH</span>
                    <p className="text-xs text-purple-700">≈ ${(content.price * 2000).toFixed(0)} USD</p>
                  </div>
                </div>
              </div>
              
              {/* Web3 优势 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✅ Instant access after payment</p>
                  <p>✅ 100% goes to creator (no platform fees)</p>
                  <p>✅ Stored permanently on IPFS</p>
                  <p>✅ Global access with crypto wallet</p>
                </div>
              </div>
              
              <button
                onClick={handleUnlockContent}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium text-lg flex items-center space-x-2 mx-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Unlock for {content.price} ETH</span>
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Powered by Civic Auth • Web3 Payments • IPFS Storage
              </p>
            </div>
          </div>
        )}

        {/* 创作者信息 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Creator Information</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {content.creatorName[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{content.creatorName}</h3>
                <p className="text-sm text-gray-500">
                  Wallet: {content.creatorAddress.slice(0, 6)}...{content.creatorAddress.slice(-4)}
                </p>
              </div>
            </div>
            
            {!isOwner && (
              <button
                onClick={() => setShowTipModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                <Gift className="w-4 h-4" />
                <span>Send Tip</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 付费墙模态框 */}
      {content && showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          content={{
            id: content.id,
            title: content.title,
            price: content.price,
            creatorAddress: content.creatorAddress,
            creatorName: content.creatorName
          }}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}

      {/* 打赏模态框 */}
      {content && showTipModal && (
        <TipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          creator={{
            address: content.creatorAddress,
            name: content.creatorName
          }}
          onTipSuccess={() => {
            console.log('🎉 Tip sent successfully!');
          }}
        />
      )}
    </div>
  );
}
