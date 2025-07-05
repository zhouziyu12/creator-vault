'use client';

import { useUser } from '@civic/auth-web3/react';
import { NetworkDiagnostic } from '@/components/debug/NetworkDiagnostic';

export default function DebugPage() {
  const { user, isLoading, error, accessToken, idToken } = useUser();
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CreatorVault Pro 调试页面</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Civic Auth 状态</h2>
          <div className="space-y-2">
            <p><strong>加载中:</strong> <span className={isLoading ? 'text-orange-600' : 'text-green-600'}>{isLoading ? '是' : '否'}</span></p>
            <p><strong>已登录:</strong> <span className={user ? 'text-green-600' : 'text-red-600'}>{user ? '是' : '否'}</span></p>
            <p><strong>错误:</strong> <span className={error ? 'text-red-600' : 'text-green-600'}>{error ? error.message : '无错误'}</span></p>
            <p><strong>Access Token:</strong> <span className={accessToken ? 'text-green-600' : 'text-gray-500'}>{accessToken ? '已获取' : '未获取'}</span></p>
            <p><strong>ID Token:</strong> <span className={idToken ? 'text-green-600' : 'text-gray-500'}>{idToken ? '已获取' : '未获取'}</span></p>
          </div>
        </div>

        <NetworkDiagnostic />

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">环境配置</h2>
          <div className="space-y-2 text-sm">
            <p><strong>SDK:</strong> @civic/auth-web3</p>
            <p><strong>Client ID:</strong> dcabc3f5-8fb6-4fc9-ae3d-72f63762ee36</p>
            <p><strong>环境:</strong> development</p>
            <p><strong>当前 URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Web3 配置</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Sepolia Chain ID:</strong> 11155111</p>
            <p><strong>Infura Key:</strong> 315dbedded6b4b37a95b73281cb81e22</p>
            <p><strong>WalletConnect ID:</strong> 4f8e0411705d8593b875a29097a41c7a</p>
            <p><strong>网络:</strong> Sepolia Testnet</p>
          </div>
        </div>

        {user && (
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">用户信息</h2>
            <div className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">🔧 故障排除</h3>
        <div className="space-y-1 text-blue-800 text-sm">
          <p>• 如果 Civic Auth 服务离线，应用会使用演示模式</p>
          <p>• 网络连接问题可能导致某些功能不可用</p>
          <p>• 钱包功能在演示模式下显示模拟数据</p>
          <p>• 刷新页面可能解决临时连接问题</p>
        </div>
      </div>
    </div>
  );
}
