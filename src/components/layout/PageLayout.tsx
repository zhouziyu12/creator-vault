'use client';

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
  ArrowLeft,
  Globe,
  Plus,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function PageLayout({ 
  children, 
  title, 
  description, 
  showBackButton = true,
  actions 
}: PageLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', badge: null },
    { id: 'content', label: 'Content', icon: FileText, path: '/content', badge: null },
    { id: 'browse', label: 'Browse', icon: Globe, path: '/browse', badge: 'New' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', badge: null },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet', badge: null },
    { id: 'audience', label: 'Audience', icon: Users, path: '/audience', badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', badge: null },
  ];

  const handleQuickCreate = () => {
    router.push('/content/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-200 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">CreatorVault</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">Pro</span>
              </div>
            )}
          </Link>
        </div>

        {/* Quick Create Button */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <button
              onClick={handleQuickCreate}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Content</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || 
                             (item.path !== '/' && pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                    {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Web3 Status */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-900">Web3 Connected</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p>✅ Civic Auth Verified</p>
                <p>✅ Wallet Active</p>
                <p>✅ IPFS Connected</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {showBackButton && pathname !== '/' && (
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              )}
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search content, creators..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Quick Actions */}
              <button 
                onClick={handleQuickCreate}
                className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors group"
                title="Create New Content"
              >
                <Video className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">+</span>
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <CustomUserButton />
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {description && (
                <p className="text-gray-600 mt-1 text-sm">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3 flex-shrink-0 ml-6">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}