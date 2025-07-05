import { contentStorage } from '@/lib/content/storage';

export class EarningsCalculator {
  
  // 计算创作者的总收益（基于真实支付记录）
  calculateCreatorEarnings(creatorAddress: string): number {
    if (typeof window === 'undefined') return 0;
    
    const payments = contentStorage.getPayments();
    
    // 获取创作者的所有内容
    const creatorContent = contentStorage.getContentByCreator(creatorAddress);
    const contentIds = creatorContent.map(content => content.id);
    
    // 计算来自这些内容的所有支付
    const creatorPayments = payments.filter(payment => 
      contentIds.includes(payment.contentId)
    );
    
    // 累计总收益
    const totalEarnings = creatorPayments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);
    
    return totalEarnings;
  }
  
  // 计算今日收益
  calculateTodayEarnings(creatorAddress: string): number {
    if (typeof window === 'undefined') return 0;
    
    const payments = contentStorage.getPayments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const creatorContent = contentStorage.getContentByCreator(creatorAddress);
    const contentIds = creatorContent.map(content => content.id);
    
    const todayPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.timestamp);
      paymentDate.setHours(0, 0, 0, 0);
      return contentIds.includes(payment.contentId) && 
             paymentDate.getTime() === today.getTime();
    });
    
    return todayPayments.reduce((total, payment) => total + payment.amount, 0);
  }
  
  // 获取收益详细统计
  getEarningsStats(creatorAddress: string) {
    const totalEarnings = this.calculateCreatorEarnings(creatorAddress);
    const todayEarnings = this.calculateTodayEarnings(creatorAddress);
    const payments = this.getCreatorPayments(creatorAddress);
    
    return {
      totalEarnings,
      todayEarnings,
      totalTransactions: payments.length,
      averagePerTransaction: payments.length > 0 ? totalEarnings / payments.length : 0,
      recentPayments: payments.slice(0, 5) // 最近5笔
    };
  }
  
  // 获取创作者的支付记录
  getCreatorPayments(creatorAddress: string) {
    if (typeof window === 'undefined') return [];
    
    const payments = contentStorage.getPayments();
    const creatorContent = contentStorage.getContentByCreator(creatorAddress);
    const contentIds = creatorContent.map(content => content.id);
    
    return payments
      .filter(payment => contentIds.includes(payment.contentId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const earningsCalculator = new EarningsCalculator();
