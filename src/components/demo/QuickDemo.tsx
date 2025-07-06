'use client';

import { useRouter } from 'next/navigation';
import { Zap, Lock, Gift } from 'lucide-react';

export function QuickDemo() {
  const router = useRouter();

  const handleDemoPaywall = () => {
    // 直接跳转到演示内容
    router.push('/content/demo_premium');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleDemoPaywall}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2"
      >
        <Zap className="w-4 h-4" />
        <span>Demo Web3 Payments</span>
      </button>
    </div>
  );
}
