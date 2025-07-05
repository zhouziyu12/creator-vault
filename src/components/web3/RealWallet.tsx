'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Coins, 
  TrendingUp, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  Power,
  RefreshCw,
  Send,
  Download
} from 'lucide-react';
import { formatEther } from 'viem';

export function RealWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading: balanceLoading, refetch } = useBalance({
    address: address,
  });

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const openEtherscan = () => {
    if (address && chain?.id === 11155111) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-6">Connect your Web3 wallet to start earning with Sepolia ETH</p>
          
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50"
              >
                <span>Connect {connector.name}</span>
                <Wallet className="w-5 h-5" />
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Using Sepolia Testnet:</strong> Get free test ETH from{' '}
              <a 
                href="https://sepoliafaucet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                Sepolia Faucet
              </a>
            </p>
          </div>
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
            <h3 className="text-lg font-semibold text-gray-900">Sepolia Wallet</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-3 h-3" />
                <span className="text-xs">Connected</span>
              </div>
              {chain && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {chain.name}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshBalance}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => disconnect()}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            title="Disconnect wallet"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 钱包地址 */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Wallet Address</label>
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
          <code className="text-sm text-gray-600 flex-1 font-mono">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
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
          <p className="text-xs text-green-600 mt-1">Address copied!</p>
        )}
      </div>

      {/* 余额显示 */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Coins className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Sepolia ETH Balance</span>
          </div>
          {balanceLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} ETH
              </div>
              <div className="text-sm text-gray-500">
                ~${balance ? (parseFloat(formatEther(balance.value)) * 2000).toFixed(2) : '0.00'} USD
              </div>
            </>
          )}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-4 h-4" />
          <span>Receive</span>
        </button>
      </div>

      {/* 获取测试 ETH */}
      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Need Sepolia ETH?</p>
            <p className="text-xs text-orange-600 mb-2">
              Get free test ETH to try out the platform
            </p>
            <a 
              href="https://sepoliafaucet.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Get Test ETH</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
