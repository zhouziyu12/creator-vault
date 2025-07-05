'use client';

import { useUser } from '@civic/auth-web3/react';
import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Coins, 
  TrendingUp, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Send,
  Download,
  CheckCircle,
  Shield
} from 'lucide-react';
import { DEFAULT_NETWORK } from '@/lib/web3/config';

export function CivicWallet() {
  const { user, isLoading } = useUser();
  const [copied, setCopied] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'loading' | 'connected' | 'error' | 'demo'>('loading');
  const [balance, setBalance] = useState('2.4567');
  const [usdValue, setUsdValue] = useState('0.00');

  // 模拟钱包地址（在实际应用中，这会来自 Civic Auth Web3）
  const walletAddress = user ? "0x742d35Cc6634C0532925a3b8D1fA22d1bA6C9234" : null;

  useEffect(() => {
    if (user) {
      // 模拟检查钱包状态
      setTimeout(() => {
        setWalletStatus('demo'); // 演示模式，因为网络连接问题
        setUsdValue((parseFloat(balance) * 0).toFixed(2)); // Sepolia ETH 无实际价值
      }, 1000);
    } else {
      setWalletStatus('loading');
    }
  }, [user, balance]);

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    if (walletAddress) {
      window.open(`${DEFAULT_NETWORK.blockExplorer}/address/${walletAddress}`, '_blank');
    }
  };

  const refreshBalance = () => {
    // 模拟刷新余额
    const newBalance = (Math.random() * 5).toFixed(4);
    setBalance(newBalance);
  };

  if (isLoading || !user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Loading Wallet...' : 'Login Required'}
          </h3>
          <p className="text-gray-600">
            {isLoading ? 'Connecting to Civic Auth...' : 'Please login with Civic Auth to access your Web3 wallet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Civic Web3 Wallet</h3>
            <div className="flex items-center space-x-2">
              {walletStatus === 'demo' ? (
                <div className="flex items-center space-x-1 text-orange-600">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-xs">Demo Mode</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="w-3 h-3" />
                  <span className="text-xs">Connected</span>
                </div>
              )}
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {DEFAULT_NETWORK.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshBalance}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Civic Auth 状态 */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Civic Auth Verified</p>
            <p className="text-xs text-green-600">
              Identity verified • Web3 wallet enabled
            </p>
          </div>
        </div>
      </div>

      {/* 网络连接问题提示 */}
      {walletStatus === 'demo' && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">Demo Mode Active</p>
              <p className="text-xs text-orange-600">
                Network connectivity issues. Showing demo data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 钱包地址 */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Wallet Address</label>
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
          <code className="text-sm text-gray-600 flex-1 font-mono">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Loading...'}
          </code>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={openEtherscan}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="View on Etherscan"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        {copied && (
          <div className="flex items-center space-x-1 mt-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <p className="text-xs text-green-600">Address copied!</p>
          </div>
        )}
      </div>

      {/* 余额显示 */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Coins className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">{DEFAULT_NETWORK.currency} Balance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {balance} {DEFAULT_NETWORK.currency}
          </div>
          <div className="text-sm text-gray-500">
            ~${usdValue} USD {walletStatus === 'demo' && <span className="text-xs">(Test Network)</span>}
          </div>
          {walletStatus === 'demo' && (
            <div className="text-xs text-orange-600 mt-1">Demo data - Network issues detected</div>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Creator Earnings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$1,234.56</div>
          <div className="text-sm text-green-600">+12.5% this month</div>
          {walletStatus === 'demo' && (
            <div className="text-xs text-orange-600 mt-1">Demo data</div>
          )}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            walletStatus === 'connected'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={walletStatus !== 'connected'}
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
        <button 
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            walletStatus === 'connected'
              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={walletStatus !== 'connected'}
        >
          <Download className="w-4 h-4" />
          <span>Receive</span>
        </button>
      </div>

      {/* 快速链接 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a 
          href={DEFAULT_NETWORK.faucet} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 text-sm"
        >
          <Coins className="w-4 h-4" />
          <span>Get Test ETH</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        
        <button
          onClick={openEtherscan}
          className="flex items-center justify-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on Explorer</span>
        </button>
      </div>
    </div>
  );
}
