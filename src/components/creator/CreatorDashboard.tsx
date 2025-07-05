'use client';

import { useState } from 'react';
import { CustomUserButton } from '@/components/auth/UserButton';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { 
  Search,
  Menu,
  Video,
  Coins,
  Home,
  FileText,
  BarChart3,
  Wallet,
  Users,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function CreatorDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 使用 usePathname 获取当前路径

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'content', label: 'Content', icon: FileText, path: '/content' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
    { id: 'audience', label: 'Audience', icon: Users, path: '/audience' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const stats = [
    { label: 'Total Views', value: '1.2M', icon: Eye, color: 'blue' },
    { label: 'Total Earnings', value: '$5,432.10', icon: DollarSign, color: 'green' },
    { label: 'Subscribers', value: '45.6K', icon: Users, color: 'purple' },
    { label: 'Videos', value: '127', icon: Video, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          <Link href="/" className="flex items-center space-x-3 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="text-xl font-bold">CreatorVault</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Pro</span>
              </>
            )}
          </Link>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              // 修复：使用 pathname 来正确检测当前页面
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your content..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
                <Video className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">+</span>
              </button>
              <NotificationBell />
              <CustomUserButton />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, ziyu zhou! 👋</h2>
              <p className="text-gray-600">Here's what's happening with your content and earnings today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'purple' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sepolia ETH Wallet Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sepolia ETH Wallet</h3>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-gray-900">0.200000 SepoliaETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Creator Earnings</p>
                    <p className="text-2xl font-bold text-green-600">0.000000 ETH</p>
                    <p className="text-sm text-gray-500">No earnings yet</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Live Network</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">
                    Sepolia Testnet
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/content/create"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Content</span>
                </Link>
                
                <Link
                  href="/analytics"
                  className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Analytics</span>
                </Link>
                
                <Link
                  href="/wallet"
                  className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Manage Wallet</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
