'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { 
  X, 
  Heart, 
  Wallet, 
  Send,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { paymentService } from '@/lib/payments/paymentService';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: {
    address: string;
    name: string;
  };
  onTipSuccess?: () => void;
}

const PRESET_AMOUNTS = [0.001, 0.005, 0.01, 0.05];

export function TipModal({ isOpen, onClose, creator, onTipSuccess }: TipModalProps) {
  const { user } = useUser();
  const [amount, setAmount] = useState(0.001);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const userBalance = paymentService.getUserBalance();

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleTip = async () => {
    if (!user) {
      setErrorMessage('Please login to send tips');
      setPaymentStatus('error');
      return;
    }

    if (amount <= 0) {
      setErrorMessage('Please enter a valid tip amount');
      setPaymentStatus('error');
      return;
    }

    if (userBalance < amount) {
      setErrorMessage('Insufficient balance. Please add funds to your wallet.');
      setPaymentStatus('error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const result = await paymentService.tipCreator(
        creator.address,
        amount,
        message
      );

      if (result.success) {
        setPaymentStatus('success');
        setTxHash(result.transactionHash!);
        onTipSuccess?.();
        setTimeout(() => {
          onClose();
          alert(`🎉 Successfully sent ${amount} ETH tip to ${creator.name}!`);
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.error || 'Tip failed');
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Send Tip</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Sending tip to:</p>
          <p className="font-medium text-gray-900">{creator.name}</p>
          <p className="text-xs text-gray-500">
            {creator.address.slice(0, 6)}...{creator.address.slice(-4)}
          </p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Amount (ETH)
          </label>
          
          {/* Preset Amounts */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <button
                key={presetAmount}
                onClick={() => handleAmountSelect(presetAmount)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  amount === presetAmount && !customAmount
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } border`}
              >
                {presetAmount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Custom Amount</label>
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.000"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Thanks for the great content!"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm resize-none"
          />
        </div>

        {/* Wallet Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Your Balance:</span>
            <span className="font-medium text-gray-900">{userBalance} ETH</span>
          </div>
          {userBalance < amount && (
            <p className="text-xs text-red-600 mt-1">
              Insufficient balance for this tip
            </p>
          )}
        </div>

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-800">Sending tip...</span>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Tip Sent Successfully!</span>
            </div>
            <p className="text-xs text-green-700">
              Transaction: {txHash}
            </p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{errorMessage}</span>
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
            onClick={handleTip}
            disabled={isProcessing || amount <= 0 || userBalance < amount || paymentStatus === 'success'}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : paymentStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>
              {isProcessing ? 'Sending...' : 
               paymentStatus === 'success' ? 'Sent!' : 
               `Send ${amount} ETH`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
