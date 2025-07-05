export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'article' | 'video' | 'audio' | 'image';
  coverImage?: string;
  tags: string[];
  price: number; // Sepolia ETH
  isPremium: boolean;
  creatorAddress: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  earnings: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
  
  // IPFS 相关字段
  ipfsHash?: string;
  fileSize?: number;
  mimeType?: string;
  category?: string;
}

export interface ContentStats {
  totalViews: number;
  totalEarnings: number;
  totalContent: number;
  topContent: ContentItem[];
}

export interface PaymentRecord {
  id: string;
  contentId: string;
  buyerAddress: string;
  amount: number;
  txHash: string;
  timestamp: Date;
}
