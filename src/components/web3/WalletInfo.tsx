'use client';

import { useUser } from '@civic/auth-web3/react';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useState } from 'react';

interface WalletInfoProps {
  compact?: boolean;
}

export function WalletInfo({ compact = false }: WalletInfoProps) {
  const { user, isLoading } = useUser();
  const [copied, setCopied] = useState(false);

  // 模拟钱包数据
  const mockWalletData = {
    balance: '0.5234',
    address: user?.wallet?.address || user?.id || '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E',
    network: 'Sepolia Testnet',
    transactions: [
      { hash: '0x123...abc', amount: '+0.001', type: 'received', time: '2 hours ago' },
      { hash: '0x456...def', amount: '-0.005', type: 'sent', time: '1 day ago' },
      { hash: '0x789...ghi', amount: '+0.01', type: 'received', time: '3 days ago' },
    ]
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(mockWalletData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">Please login to view wallet information</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Balance */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Balance:</span>
          <span className="font-medium text-gray-900">{mockWalletData.balance} ETH</span>
        </div>
        
        {/* Address */}
        <div>
          <span className="text-sm text-gray-600">Address:</span>
          <div className="flex items-center space-x-2 mt-1">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {mockWalletData.address.slice(0, 6)}...{mockWalletData.address.slice(-4)}
            </code>
            <button
              onClick={copyAddress}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network:</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {mockWalletData.network}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Wallet Connected</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Your Civic Auth wallet is ready for Web3 transactions
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Balance</h3>
          <div className="flex items-center space-x-2 text-blue-600">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{mockWalletData.network}</span>
          </div>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {mockWalletData.balance} ETH
        </div>
        <p className="text-gray-500 text-sm">
          ≈ $1,047.30 USD
        </p>
      </div>

      {/* Address Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Address</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <code className="text-sm text-gray-700 break-all">
              {mockWalletData.address}
            </code>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={copyAddress}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Address"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => window.open(`https://sepolia.etherscan.io/address/${mockWalletData.address}`, '_blank')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        
        <div className="space-y-3">
          {mockWalletData.transactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-xs font-medium ${
                    tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'received' ? '↓' : '↑'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.type === 'received' ? 'Received' : 'Sent'}
                  </p>
                  <p className="text-xs text-gray-500">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.amount} ETH
                </p>
                <button
                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, '_blank')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium">
          Add Funds
        </button>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium">
          Send ETH
        </button>
      </div>

      {/* Web3 Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Web3 Features</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✅ Decentralized transactions</p>
          <p>✅ No traditional banking required</p>
          <p>✅ Global payment capabilities</p>
          <p>✅ Smart contract interactions</p>
        </div>
      </div>
    </div>
  );
}
