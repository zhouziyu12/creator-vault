export interface PaymentRequest {
  amount: number;
  recipient: string;
  contentId?: string;
  type: 'purchase' | 'tip';
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface Purchase {
  id: string;
  contentId: string;
  amount: number;
  txHash: string;
  timestamp: string;
  type: 'purchase';
  buyerAddress: string;
}

export interface Tip {
  id: string;
  creatorAddress: string;
  amount: number;
  message?: string;
  txHash: string;
  timestamp: string;
  type: 'tip';
  senderAddress: string;
}

class PaymentService {
  private async simulatePayment(request: PaymentRequest): Promise<PaymentResult> {
    console.log('🔄 Processing payment:', request);
    
    // 模拟支付延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟成功率90%
    const success = Math.random() > 0.1;
    
    if (success) {
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      console.log('✅ Payment successful:', mockTxHash);
      return {
        success: true,
        transactionHash: mockTxHash
      };
    } else {
      console.log('❌ Payment failed');
      return {
        success: false,
        error: 'Transaction failed. Please try again.'
      };
    }
  }

  async purchaseContent(contentId: string, amount: number, recipient: string): Promise<PaymentResult> {
    console.log('💰 Processing content purchase:', { contentId, amount, recipient });
    
    const request: PaymentRequest = {
      amount,
      recipient,
      contentId,
      type: 'purchase',
      description: `Purchase content: ${contentId}`
    };

    const result = await this.simulatePayment(request);
    
    if (result.success) {
      // 保存购买记录
      this.savePurchaseRecord(contentId, amount, result.transactionHash!, recipient);
      console.log('✅ Purchase saved to localStorage');
    }
    
    return result;
  }

  async tipCreator(creatorAddress: string, amount: number, message?: string): Promise<PaymentResult> {
    console.log('🎁 Processing tip:', { creatorAddress, amount, message });
    
    const request: PaymentRequest = {
      amount,
      recipient: creatorAddress,
      type: 'tip',
      description: `Tip to creator: ${creatorAddress}`
    };

    const result = await this.simulatePayment(request);
    
    if (result.success) {
      // 保存打赏记录
      this.saveTipRecord(creatorAddress, amount, message, result.transactionHash!);
      console.log('✅ Tip saved to localStorage');
    }
    
    return result;
  }

  private savePurchaseRecord(contentId: string, amount: number, txHash: string, recipient: string) {
    const purchases = this.getPurchases();
    const newPurchase: Purchase = {
      id: `purchase_${Date.now()}`,
      contentId,
      amount,
      txHash,
      timestamp: new Date().toISOString(),
      type: 'purchase',
      buyerAddress: 'current_user_address' // 在实际应用中会是真实地址
    };
    
    purchases.push(newPurchase);
    localStorage.setItem('user-purchases', JSON.stringify(purchases));
    console.log('💾 Purchase saved:', newPurchase);
  }

  private saveTipRecord(creatorAddress: string, amount: number, message: string | undefined, txHash: string) {
    const tips = this.getTips();
    const newTip: Tip = {
      id: `tip_${Date.now()}`,
      creatorAddress,
      amount,
      message,
      txHash,
      timestamp: new Date().toISOString(),
      type: 'tip',
      senderAddress: 'current_user_address' // 在实际应用中会是真实地址
    };
    
    tips.push(newTip);
    localStorage.setItem('user-tips', JSON.stringify(tips));
    console.log('💾 Tip saved:', newTip);
  }

  getPurchases(): Purchase[] {
    try {
      const data = localStorage.getItem('user-purchases');
      const purchases = data ? JSON.parse(data) : [];
      console.log('📊 Current purchases:', purchases.length);
      return purchases;
    } catch {
      return [];
    }
  }

  getTips(): Tip[] {
    try {
      const data = localStorage.getItem('user-tips');
      const tips = data ? JSON.parse(data) : [];
      console.log('📊 Current tips:', tips.length);
      return tips;
    } catch {
      return [];
    }
  }

  hasPurchased(contentId: string): boolean {
    const purchases = this.getPurchases();
    const purchased = purchases.some(p => p.contentId === contentId);
    console.log(`🔍 Has purchased ${contentId}:`, purchased);
    return purchased;
  }

  getUserBalance(): number {
    // 模拟用户余额
    return 0.5;
  }

  // 调试方法
  clearAllData(): void {
    localStorage.removeItem('user-purchases');
    localStorage.removeItem('user-tips');
    console.log('🗑️ All payment data cleared');
  }

  // 获取总收益
  getTotalEarnings(): number {
    const purchases = this.getPurchases();
    const tips = this.getTips();
    const total = purchases.reduce((sum, p) => sum + p.amount, 0) + 
                 tips.reduce((sum, t) => sum + t.amount, 0);
    console.log('💰 Total earnings:', total);
    return total;
  }
}

export const paymentService = new PaymentService();

// 全局调试方法
if (typeof window !== 'undefined') {
  (window as any).paymentService = paymentService;
  (window as any).clearPaymentData = () => paymentService.clearAllData();
  (window as any).showPaymentData = () => {
    console.log('Purchases:', paymentService.getPurchases());
    console.log('Tips:', paymentService.getTips());
    console.log('Total earnings:', paymentService.getTotalEarnings());
  };
}
