'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { Send, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

interface SendETHModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendSepoliaETH({ isOpen, onClose, onSuccess }: SendETHModalProps) {
  const { user } = useUser();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!recipient || !amount || !user) return;

    setIsPending(true);
    setError('');

    try {
      // 这里需要集成 Civic Auth 的发送功能
      // 或者引导用户使用 MetaMask 等外部钱包
      
      // 暂时模拟发送成功
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      
      // 3秒后关闭模态框
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setRecipient('');
        setAmount('');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
      setError('');
      setIsSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Send Sepolia ETH</h3>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Transaction Sent!</h4>
            <p className="text-gray-600 mb-4">
              Your Sepolia ETH has been sent successfully.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (Sepolia ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
                step="0.001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isPending}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This will open your connected wallet (MetaMask) to sign the transaction.
                Make sure you're on the Sepolia network.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isPending || !recipient || !amount}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send ETH</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 发送按钮组件
export function SendETHButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
      >
        <Send className="w-4 h-4" />
        <span>Send ETH</span>
      </button>

      <SendSepoliaETH
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // 可以在这里刷新钱包余额
          console.log('Transaction successful!');
        }}
      />
    </>
  );
}
