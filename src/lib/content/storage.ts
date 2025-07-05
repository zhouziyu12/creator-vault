import { ContentItem, PaymentRecord } from '@/types/content';

// 简单的本地存储服务（MVP版本）
class ContentStorageService {
  private readonly STORAGE_KEY = 'creator_vault_content';
  private readonly PAYMENTS_KEY = 'creator_vault_payments';

  // 获取所有内容
  getAllContent(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // 根据创作者获取内容
  getContentByCreator(creatorAddress: string): ContentItem[] {
    return this.getAllContent().filter(
      item => item.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
    );
  }

  // 获取已发布的内容
  getPublishedContent(): ContentItem[] {
    return this.getAllContent().filter(item => item.status === 'published');
  }

  // 根据ID获取内容
  getContentById(id: string): ContentItem | null {
    const content = this.getAllContent();
    return content.find(item => item.id === id) || null;
  }

  // 保存内容
  saveContent(content: ContentItem): void {
    if (typeof window === 'undefined') return;
    
    const allContent = this.getAllContent();
    const existingIndex = allContent.findIndex(item => item.id === content.id);
    
    if (existingIndex >= 0) {
      allContent[existingIndex] = { ...content, updatedAt: new Date() };
    } else {
      allContent.push(content);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent));
  }

  // 删除内容
  deleteContent(id: string): void {
    if (typeof window === 'undefined') return;
    
    const allContent = this.getAllContent();
    const filtered = allContent.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // 增加浏览量
  incrementViews(id: string): void {
    const content = this.getContentById(id);
    if (content) {
      content.views += 1;
      this.saveContent(content);
    }
  }

  // 记录支付
  recordPayment(payment: PaymentRecord): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.PAYMENTS_KEY);
      const payments = stored ? JSON.parse(stored) : [];
      payments.push(payment);
      localStorage.setItem(this.PAYMENTS_KEY, JSON.stringify(payments));

      // 更新内容收益
      const content = this.getContentById(payment.contentId);
      if (content) {
        content.earnings += payment.amount;
        this.saveContent(content);
      }
    } catch (error) {
      console.error('记录支付失败:', error);
    }
  }

  // 获取支付记录
  getPayments(contentId?: string): PaymentRecord[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.PAYMENTS_KEY);
      const payments = stored ? JSON.parse(stored) : [];
      
      if (contentId) {
        return payments.filter((p: PaymentRecord) => p.contentId === contentId);
      }
      return payments;
    } catch {
      return [];
    }
  }

  // 生成内容统计
  getContentStats(creatorAddress: string) {
    const creatorContent = this.getContentByCreator(creatorAddress);
    const totalViews = creatorContent.reduce((sum, item) => sum + item.views, 0);
    const totalEarnings = creatorContent.reduce((sum, item) => sum + item.earnings, 0);
    const topContent = creatorContent
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);

    return {
      totalViews,
      totalEarnings,
      totalContent: creatorContent.length,
      topContent
    };
  }
}

export const contentStorage = new ContentStorageService();
