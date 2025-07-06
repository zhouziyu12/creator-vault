'use client';

import { useState } from 'react';
import { paymentService } from '@/lib/payments/paymentService';
import { PaywallModal } from '@/components/payments/PaywallModal';
import { TipModal } from '@/components/payments/TipModal';

export function QuickPaymentTest() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);

  const testContent = {
    id: 'quick_test_content',
    title: 'Quick Payment Test',
    price: 0.001,
    creatorAddress: 'test_creator_address',
    creatorName: 'Test Creator'
  };

  const testCreator = {
    address: 'test_creator_address',
    name: 'Test Creator'
  };

  const handleDirectTest = async () => {
    try {
      // 测试购买
      const purchaseResult = await paymentService.purchaseContent(
        'test_content_123',
        0.001,
        'test_creator'
      );
      
      // 测试打赏
      const tipResult = await paymentService.tipCreator(
        'test_creator',
        0.001,
        'Test tip message'
      );

      if (purchaseResult.success && tipResult.success) {
        alert('✅ Both purchase and tip tests successful! Check Analytics.');
        console.log('Purchase:', purchaseResult);
        console.log('Tip:', tipResult);
        console.log('All payments:', paymentService.getPurchases(), paymentService.getTips());
      }
    } catch (error) {
      alert('❌ Test failed: ' + error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">🧪 Quick Payment Tests</h3>
        <div className="space-y-2">
          <button
            onClick={() => setShowPaywall(true)}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            💰 Test Paywall
          </button>
          <button
            onClick={() => setShowTipModal(true)}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            🎁 Test Tip
          </button>
          <button
            onClick={handleDirectTest}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            ⚡ Quick Test Both
          </button>
          <button
            onClick={() => {
              console.log('💰 Payment Data:', {
                purchases: paymentService.getPurchases(),
                tips: paymentService.getTips(),
                total: paymentService.getTotalEarnings()
              });
              alert('Check console for payment data!');
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            📊 View Data
          </button>
        </div>
      </div>

      {/* Modals */}
      {showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          content={testContent}
          onPurchaseSuccess={() => {
            setShowPaywall(false);
            alert('🎉 Purchase test completed!');
          }}
        />
      )}

      {showTipModal && (
        <TipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          creator={testCreator}
          onTipSuccess={() => {
            setShowTipModal(false);
            alert('🎉 Tip test completed!');
          }}
        />
      )}
    </div>
  );
}
