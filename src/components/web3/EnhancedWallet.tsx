'use client';

import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
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
  Download,
  ChevronDown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatEther } from 'viem';
import { sepolia, mainnet } from 'wagmi/chains';

export function EnhancedWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading: balanceLoading, refetch } = useBalance({
    address: address,
  });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [networkWarning, setNetworkWarning] = useState(false);

  // 检查是否在正确的网络
  useEffect(() => {
    if (isConnected && chainId !== sepolia.id) {
      setNetworkWarning(true);
    } else {
      setNetworkWarning(false);
    }
  }, [isConnected, chainId]);

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
    if (address) {
      const baseUrl = chainId === sepolia.id 
        ? 'https://sepolia.etherscan.io' 
        : 'https://etherscan.io';
      window.open(`${baseUrl}/address/${address}`, '_blank');
    }
  };

  const switchToSepolia = () => {
    switchChain({ chainId: sepolia.id });
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Web3 Wallet</h3>
          <p className="text-gray-600 mb-6">Connect your wallet to start earning with Sepolia ETH</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowConnectors(!showConnectors)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <span>Choose Wallet</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showConnectors ? 'rotate-180' : ''}`} />
            </button>
            
            {showConnectors && (
              <div className="space-y-2 mt-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={connectPending}
                    className="w-full flex items-center justify-between bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    <span>{connector.name}</span>
                    <Wallet className="w-5 h-5" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">🌊 Get Test ETH</h4>
              <p className="text-blue-600 mb-2">Need Sepolia ETH for testing?</p>
              <a 
                href="https://sepoliafaucet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 underline"
              >
                <span>Visit Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">🔒 Safe Testing</h4>
              <p className="text-green-600">Using Sepolia testnet - no real money at risk!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 网络警告 */}
      {networkWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Wrong Network</p>
              <p className="text-xs text-yellow-600">Switch to Sepolia testnet to use all features</p>
            </div>
            <button
              onClick={switchToSepolia}
              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              Switch to Sepolia
            </button>
          </div>
        </div>
      )}

      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Web3 Wallet</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-3 h-3" />
                <span className="text-xs">Connected</span>
              </div>
              {chain && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  chainId === sepolia.id 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
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
            <span className="text-sm font-medium text-gray-700">
              {chainId === sepolia.id ? 'Sepolia ETH' : 'ETH'} Balance
            </span>
          </div>
          {balanceLoading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} ETH
              </div>
              <div className="text-sm text-gray-500">
                ~${balance ? (parseFloat(formatEther(balance.value)) * (chainId === sepolia.id ? 0 : 2000)).toFixed(2) : '0.00'} USD
                {chainId === sepolia.id && <span className="text-xs ml-1">(Test ETH)</span>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            chainId === sepolia.id
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={chainId !== sepolia.id}
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-4 h-4" />
          <span>Receive</span>
        </button>
      </div>

      {/* 快速链接 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a 
          href="https://sepoliafaucet.com/" 
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
