import { ContentItem } from '@/types/content';

export class ContentStorage {
  private STORAGE_KEY = 'creator_vault_all_contents';
  private USER_CONTENTS_KEY = 'creator_vault_user_contents';

  // 检查是否在客户端环境
  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // 获取当前用户ID
  private getCurrentUserId(): string {
    if (!this.isClient()) {
      return 'ssr_user';
    }

    try {
      // 尝试从多个来源获取用户ID
      const civicUser = localStorage.getItem('auth_user');
      if (civicUser) {
        const parsed = JSON.parse(civicUser);
        return parsed.id || 'demo_user';
      }
      
      // 从 Civic Auth 存储中获取
      const civicData = Object.keys(localStorage).find(key => 
        key.includes('civic') && localStorage.getItem(key)?.includes('user')
      );
      if (civicData) {
        try {
          const data = JSON.parse(localStorage.getItem(civicData) || '{}');
          if (data.id) return data.id;
        } catch (e) {}
      }
      
      return 'anonymous_user_' + Date.now();
    } catch (error) {
      return 'anonymous_user_' + Date.now();
    }
  }

  // 获取当前用户名
  private getCurrentUserName(): string {
    if (!this.isClient()) {
      return 'SSR User';
    }

    try {
      const civicUser = localStorage.getItem('auth_user');
      if (civicUser) {
        const parsed = JSON.parse(civicUser);
        return parsed.name || parsed.id?.slice(0, 8) + '...' || 'Demo User';
      }
      
      return 'Demo Creator';
    } catch (error) {
      return 'Anonymous Creator';
    }
  }

  // 保存内容（全局存储）
  saveContent(content: ContentItem): void {
    if (!this.isClient()) {
      console.warn('Cannot save content on server side');
      return;
    }

    try {
      // 获取所有内容
      const allContents = this.getAllContents();
      
      // 添加/更新内容
      const existingIndex = allContents.findIndex(c => c.id === content.id);
      if (existingIndex >= 0) {
        allContents[existingIndex] = content;
      } else {
        allContents.push(content);
      }
      
      // 保存到全局存储
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContents));
      
      // 同时保存到用户专属存储（用于快速查找）
      this.saveToUserStorage(content);
      
      console.log('✅ Content saved globally:', content.title, 'Total contents:', allContents.length);
    } catch (error) {
      console.error('❌ Failed to save content:', error);
    }
  }

  // 保存到用户专属存储
  private saveToUserStorage(content: ContentItem): void {
    if (!this.isClient()) return;

    try {
      const userId = this.getCurrentUserId();
      const userKey = `${this.USER_CONTENTS_KEY}_${userId}`;
      const userContents = JSON.parse(localStorage.getItem(userKey) || '[]');
      
      const existingIndex = userContents.findIndex((c: ContentItem) => c.id === content.id);
      if (existingIndex >= 0) {
        userContents[existingIndex] = content;
      } else {
        userContents.push(content);
      }
      
      localStorage.setItem(userKey, JSON.stringify(userContents));
    } catch (error) {
      console.error('❌ Failed to save to user storage:', error);
    }
  }

  // 获取所有内容（全局）
  getAllContents(): ContentItem[] {
    if (!this.isClient()) {
      // 服务端返回示例内容
      return this.getMockContents();
    }

    try {
      const contents = localStorage.getItem(this.STORAGE_KEY);
      const parsed = contents ? JSON.parse(contents) : [];
      
      // 如果没有内容，返回示例内容
      if (parsed.length === 0) {
        return this.getMockContents();
      }
      
      // 确保每个内容都有必需的字段
      return parsed.map((content: any) => ({
        ...content,
        views: content.views || 0,
        likes: content.likes || 0,
        createdAt: content.createdAt || new Date().toISOString(),
        updatedAt: content.updatedAt || new Date().toISOString(),
        status: content.status || 'published',
        creatorName: content.creatorName || this.getCurrentUserName(),
        creatorAddress: content.creatorAddress || this.getCurrentUserId()
      }));
    } catch (error) {
      console.error('❌ Failed to get all contents:', error);
      return this.getMockContents();
    }
  }

  // 获取当前用户的内容
  getUserContents(userId?: string): ContentItem[] {
    if (!this.isClient()) {
      return [];
    }

    const targetUserId = userId || this.getCurrentUserId();
    return this.getAllContents().filter(content => 
      content.creatorAddress === targetUserId ||
      content.creatorName === this.getCurrentUserName()
    );
  }

  // 获取单个内容
  getContent(id: string): ContentItem | null {
    if (!this.isClient()) {
      // 服务端查找示例内容
      const mockContents = this.getMockContents();
      return mockContents.find(c => c.id === id) || null;
    }

    try {
      const allContents = this.getAllContents();
      const content = allContents.find(c => c.id === id);
      
      if (content) {
        console.log('✅ Content found:', content.title, 'by', content.creatorName);
        return content;
      }
      
      console.log('❌ Content not found with ID:', id);
      return null;
    } catch (error) {
      console.error('❌ Failed to get content:', error);
      return null;
    }
  }

  // 增加浏览量
  incrementViews(id: string): void {
    if (!this.isClient()) return;

    try {
      const allContents = this.getAllContents();
      const contentIndex = allContents.findIndex(c => c.id === id);
      
      if (contentIndex >= 0) {
        allContents[contentIndex].views = (allContents[contentIndex].views || 0) + 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContents));
        console.log('📈 Views incremented for:', allContents[contentIndex].title);
      }
    } catch (error) {
      console.error('❌ Failed to increment views:', error);
    }
  }

  // 增加点赞
  incrementLikes(id: string): void {
    if (!this.isClient()) return;

    try {
      const allContents = this.getAllContents();
      const contentIndex = allContents.findIndex(c => c.id === id);
      
      if (contentIndex >= 0) {
        allContents[contentIndex].likes = (allContents[contentIndex].likes || 0) + 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContents));
        console.log('❤️ Likes incremented for:', allContents[contentIndex].title);
      }
    } catch (error) {
      console.error('❌ Failed to increment likes:', error);
    }
  }

  // 删除内容
  deleteContent(id: string): void {
    if (!this.isClient()) return;

    try {
      const allContents = this.getAllContents();
      const filteredContents = allContents.filter(c => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredContents));
      
      // 同时从用户存储中删除
      const userId = this.getCurrentUserId();
      const userKey = `${this.USER_CONTENTS_KEY}_${userId}`;
      const userContents = JSON.parse(localStorage.getItem(userKey) || '[]');
      const filteredUserContents = userContents.filter((c: ContentItem) => c.id !== id);
      localStorage.setItem(userKey, JSON.stringify(filteredUserContents));
      
      console.log('🗑️ Content deleted:', id);
    } catch (error) {
      console.error('❌ Failed to delete content:', error);
    }
  }

  // 初始化示例内容（只在客户端执行）
  initializeSampleContents(): void {
    if (!this.isClient()) {
      console.log('🔄 Skipping sample content initialization on server side');
      return;
    }

    try {
      const allContents = this.getAllContents();
      // 检查是否已有存储的内容（不是示例内容）
      const hasStoredContent = allContents.some(content => 
        localStorage.getItem(this.STORAGE_KEY) && 
        JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]').length > 0
      );
      
      if (!hasStoredContent) {
        console.log('🎯 Initializing sample contents...');
        const sampleContents = this.getMockContents();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleContents));
      }
    } catch (error) {
      console.error('❌ Failed to initialize sample contents:', error);
    }
  }

  // 获取示例内容
  private getMockContents(): ContentItem[] {
    return [
      {
        id: 'sample-1',
        title: 'Getting Started with Web3 Development',
        description: 'A comprehensive guide to blockchain development and smart contracts',
        content: `
          <h2>Introduction to Web3</h2>
          <p>Web3 represents the next evolution of the internet, built on blockchain technology and decentralization principles...</p>
          <h3>Key Concepts</h3>
          <ul>
            <li>Decentralization</li>
            <li>Smart Contracts</li>
            <li>Digital Ownership</li>
            <li>Cryptocurrency</li>
          </ul>
          <p>This guide will walk you through the fundamental concepts and help you build your first Web3 application.</p>
        `,
        contentType: 'article',
        category: 'Technology',
        tags: ['Web3', 'Blockchain', 'Development', 'Tutorial'],
        isPremium: false,
        price: 0,
        status: 'published',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        creatorName: 'Web3 Academy',
        creatorAddress: '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E',
        views: 145,
        likes: 23,
        coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop'
      },
      {
        id: 'sample-2',
        title: 'The Future of Creator Economy',
        description: 'How blockchain technology is revolutionizing content creation and monetization',
        content: `
          <h2>Creator Economy Revolution</h2>
          <p>The creator economy is undergoing a massive transformation with Web3 technologies...</p>
          <h3>Benefits for Creators</h3>
          <ul>
            <li>Direct monetization</li>
            <li>No platform fees</li>
            <li>Global reach</li>
            <li>Ownership of content</li>
          </ul>
        `,
        contentType: 'article',
        category: 'Education',
        tags: ['Creator Economy', 'Web3', 'NFT', 'Monetization'],
        isPremium: true,
        price: 0.01,
        status: 'published',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        creatorName: 'Digital Pioneers',
        creatorAddress: '0x73Ef140D180e7CcA7C92C94861bbe5D182eD703F',
        views: 89,
        likes: 34,
        coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
      },
      {
        id: 'sample-3',
        title: 'NFT Art Creation Masterclass',
        description: 'Learn how to create, mint, and sell your digital art as NFTs',
        content: `
          <h2>NFT Art Creation</h2>
          <p>Non-Fungible Tokens have opened new possibilities for digital artists...</p>
          <h3>Steps to Success</h3>
          <ol>
            <li>Create unique digital art</li>
            <li>Choose the right blockchain</li>
            <li>Mint your NFT</li>
            <li>Market your work</li>
          </ol>
        `,
        contentType: 'video',
        category: 'Art',
        tags: ['NFT', 'Digital Art', 'Blockchain', 'Tutorial'],
        isPremium: true,
        price: 0.025,
        status: 'published',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        creatorName: 'Crypto Artist',
        creatorAddress: '0x95Gf240D180e7CcA7C92C94861bbe5D182eD703G',
        views: 267,
        likes: 45,
        coverImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=400&fit=crop'
      },
      {
        id: 'sample-4',
        title: 'DeFi Basics: Understanding Decentralized Finance',
        description: 'A beginner-friendly introduction to DeFi protocols and yield farming',
        content: `
          <h2>Decentralized Finance (DeFi)</h2>
          <p>DeFi is transforming traditional financial services using blockchain technology...</p>
          <h3>Core DeFi Concepts</h3>
          <ul>
            <li>Lending and Borrowing</li>
            <li>Yield Farming</li>
            <li>Automated Market Makers</li>
            <li>Governance Tokens</li>
          </ul>
        `,
        contentType: 'article',
        category: 'Technology',
        tags: ['DeFi', 'Finance', 'Yield Farming', 'Crypto'],
        isPremium: false,
        price: 0,
        status: 'published',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
        creatorName: 'DeFi Expert',
        creatorAddress: '0x42Hf350D180e7CcA7C92C94861bbe5D182eD703H',
        views: 423,
        likes: 67,
        coverImage: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop'
      },
      {
        id: 'sample-5',
        title: 'Building Your First Smart Contract',
        description: 'Step-by-step guide to writing and deploying smart contracts on Ethereum',
        content: `
          <h2>Smart Contract Development</h2>
          <p>Smart contracts are self-executing contracts with terms directly written into code...</p>
          <h3>Development Tools</h3>
          <ul>
            <li>Solidity Programming Language</li>
            <li>Truffle Framework</li>
            <li>MetaMask Wallet</li>
            <li>Remix IDE</li>
          </ul>
        `,
        contentType: 'article',
        category: 'Technology',
        tags: ['Smart Contracts', 'Solidity', 'Ethereum', 'Programming'],
        isPremium: true,
        price: 0.02,
        status: 'published',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
        creatorName: 'Blockchain Dev',
        creatorAddress: '0x77If450D180e7CcA7C92C94861bbe5D182eD703I',
        views: 178,
        likes: 28,
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop'
      }
    ];
  }

  // 清除所有内容（调试用）
  clearAllContents(): void {
    if (!this.isClient()) return;

    localStorage.removeItem(this.STORAGE_KEY);
    // 清除所有用户存储
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.USER_CONTENTS_KEY))
      .forEach(key => localStorage.removeItem(key));
    console.log('🗑️ All contents cleared');
  }

  // 导出内容数据（用于备份）
  exportContents(): string {
    return JSON.stringify(this.getAllContents(), null, 2);
  }

  // 导入内容数据（用于恢复）
  importContents(data: string): void {
    if (!this.isClient()) return;

    try {
      const contents = JSON.parse(data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contents));
      console.log('📥 Contents imported successfully');
    } catch (error) {
      console.error('❌ Failed to import contents:', error);
    }
  }
}

export const contentStorage = new ContentStorage();
