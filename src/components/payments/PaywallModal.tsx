'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { 
  X, 
  Lock, 
  Wallet, 
  Zap, 
  CheckCircle,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { paymentService } from '@/lib/payments/paymentService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    price: number;
    creatorAddress: string;
    creatorName: string;
  };
  onPurchaseSuccess: () => void;
}

export function PaywallModal({ isOpen, onClose, content, onPurchaseSuccess }: PaywallModalProps) {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const userBalance = paymentService.getUserBalance();

  const handlePurchase = async () => {
    console.log('🚀 Starting purchase process...');
    
    if (!user) {
      setErrorMessage('Please login to purchase content');
      setPaymentStatus('error');
      return;
    }

    if (userBalance < content.price) {
      setErrorMessage('Insufficient balance. Please add funds to your wallet.');
      setPaymentStatus('error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      console.log('💳 Processing payment for content:', content.id);
      
      const result = await paymentService.purchaseContent(
        content.id,
        content.price,
        content.creatorAddress
      );

      if (result.success) {
        console.log('✅ Payment successful!');
        setPaymentStatus('success');
        setTxHash(result.transactionHash!);
        
        // 延迟后关闭模态框并通知成功
        setTimeout(() => {
          onPurchaseSuccess();
          onClose();
          // 显示成功提示
          alert(`🎉 Successfully purchased "${content.title}" for ${content.price} ETH!`);
        }, 2000);
      } else {
        console.log('❌ Payment failed:', result.error);
        setPaymentStatus('error');
        setErrorMessage(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('💥 Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Premium Content</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Info */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">{content.title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            By {content.creatorName}
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Price:</span>
              <div className="text-right">
                <span className="font-bold text-purple-900 text-lg">{content.price} ETH</span>
                <p className="text-xs text-purple-700">≈ ${(content.price * 2000).toFixed(0)} USD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Your Balance:</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{userBalance} ETH</span>
              <span className="text-xs text-gray-500">≈ ${(userBalance * 2000).toFixed(0)} USD</span>
            </div>
            {userBalance < content.price && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Insufficient balance for this purchase
              </p>
            )}
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-800 font-medium">Processing payment...</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Please wait while we process your transaction</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Payment Successful! 🎉</span>
            </div>
            <p className="text-xs text-green-700 mb-2">
              Transaction: {txHash}
            </p>
            <p className="text-xs text-green-700">
              Content unlocked! Redirecting...
            </p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isProcessing || userBalance < content.price || paymentStatus === 'success'}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Purchased</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Buy for {content.price} ETH</span>
              </>
            )}
          </button>
        </div>

        {/* Web3 Benefits */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>✅ Instant payment processing</p>
            <p>✅ No platform fees (100% to creator)</p>
            <p>✅ Blockchain verified transaction</p>
            <p>✅ Global access with crypto wallet</p>
</div>
       </div>
     </div>
   </div>
 );
}
