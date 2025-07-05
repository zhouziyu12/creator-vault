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
  RefreshCw,
  Send,
  Download,
  CheckCircle,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { sepoliaWallet } from '@/lib/wallet/sepoliaService';
import { earningsCalculator } from '@/lib/earnings/calculator';
import { contentStorage } from '@/lib/content/storage';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export function RealSepoliaWallet() {
  const { user, isLoading } = useUser();
  const [balance, setBalance] = useState('0.000000');
  const [creatorEarnings, setCreatorEarnings] = useState(0);
  const [earningsStats, setEarningsStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletStatus, setWalletStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  // 从 Civic Auth 获取钱包地址
  const walletAddress = '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E';

  // 加载钱包数据
  const loadWalletData = async () => {
    if (!walletAddress) return;
    
    setIsRefreshing(true);
    try {
      // 获取区块链余额
      const balanceResult = await sepoliaWallet.getBalance(walletAddress);
      setBalance(balanceResult);
      
      // 获取区块链交易历史
      const txHistory = await sepoliaWallet.getTransactionHistory(walletAddress);
      setTransactions(txHistory);
      
      // 计算真实的创作者收益（仅在客户端）
      if (typeof window !== 'undefined' && user?.wallet?.address) {
        try {
          const earnings = earningsCalculator.calculateCreatorEarnings(user.wallet.address);
          const stats = earningsCalculator.getEarningsStats(user.wallet.address);
          setCreatorEarnings(earnings);
          setEarningsStats(stats);
        } catch (error) {
          console.error('计算收益失败:', error);
          setCreatorEarnings(0);
          setEarningsStats(null);
        }
      }
      
      setWalletStatus('connected');
    } catch (error) {
      console.error('加载钱包数据失败:', error);
      setWalletStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    if (user && walletAddress) {
      loadWalletData();
    }
  }, [user, walletAddress]);

  // 复制地址
  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 打开 Etherscan
  const openEtherscan = () => {
    if (walletAddress) {
      window.open(sepoliaWallet.getEtherscanUrl(walletAddress), '_blank');
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // 格式化金额
  const formatAmount = (wei: string) => {
    const eth = Number(wei) / 1e18;
    return eth.toFixed(6);
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
            {isLoading ? 'Connecting to Civic Auth...' : 'Please login with Civic Auth to access your Sepolia wallet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 主钱包卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sepolia ETH Wallet</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="w-3 h-3" />
                  <span className="text-xs">Live Network</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Sepolia Testnet
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadWalletData}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh wallet data"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Civic Auth 验证状态 */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Civic Auth Verified</p>
              <p className="text-xs text-green-600">
                Identity verified • Real Sepolia wallet active
              </p>
            </div>
          </div>
        </div>

        {/* 钱包地址 */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Wallet Address</label>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
            <code className="text-sm text-gray-600 flex-1 font-mono">
              {sepoliaWallet.formatAddress(walletAddress)}
            </code>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy full address"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Coins className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Sepolia ETH Balance</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {balance} SepoliaETH
            </div>
            <div className="text-sm text-gray-500">
              Test Network (No USD value)
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Creator Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {creatorEarnings.toFixed(6)} ETH
            </div>
            <div className={`text-sm ${creatorEarnings > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {creatorEarnings > 0 ? 'Ready to withdraw' : 'No earnings yet'}
            </div>
          </div>
        </div>

        {/* 收益统计 */}
        {earningsStats && earningsStats.totalTransactions > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Earnings Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Today</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {earningsStats.todayEarnings.toFixed(6)} ETH
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Purchases</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {earningsStats.totalTransactions}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg/Sale</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {earningsStats.averagePerTransaction.toFixed(6)} ETH
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
            <Send className="w-4 h-4" />
            <span>Send ETH</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Download className="w-4 h-4" />
            <span>Receive</span>
          </button>
        </div>
      </div>

      {/* 交易历史 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button
            onClick={loadWalletData}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.to.toLowerCase() === walletAddress.toLowerCase() 
                      ? 'bg-green-100' 
                      : 'bg-blue-100'
                  }`}>
                    {tx.to.toLowerCase() === walletAddress.toLowerCase() ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.to.toLowerCase() === walletAddress.toLowerCase() ? 'Received' : 'Sent'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(tx.timeStamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.to.toLowerCase() === walletAddress.toLowerCase() 
                      ? 'text-green-600' 
                      : 'text-gray-900'
                  }`}>
                    {tx.to.toLowerCase() === walletAddress.toLowerCase() ? '+' : '-'}
                    {formatAmount(tx.value)} ETH
                  </p>
                  <button
                    onClick={() => window.open(sepoliaWallet.getTxUrl(tx.hash), '_blank')}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-xs text-gray-400">Your transaction history will appear here</p>
          </div>
        )}
      </div>

      {/* 创作者收益详情 */}
      {earningsStats && earningsStats.recentPayments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content Sales</h3>
          <div className="space-y-3">
            {earningsStats.recentPayments.map((payment: any) => {
              const content = contentStorage.getContentById(payment.contentId);
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {content?.title || 'Unknown Content'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{payment.amount.toFixed(6)} ETH
                    </p>
                    <p className="text-xs text-gray-400">
                      Content sale
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 快速链接 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          href="https://sepoliafaucet.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-blue-700"
        >
          <Coins className="w-5 h-5" />
          <span>Get More Test ETH</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        
        <button
          onClick={openEtherscan}
          className="flex items-center justify-center space-x-2 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
        >
          <ExternalLink className="w-5 h-5" />
          <span>View on Etherscan</span>
        </button>
      </div>
    </div>
  );
}
