'use client';

import { useState } from 'react';
import { contentStorage } from '@/lib/content/storage';
import { ContentItem } from '@/types/content';

export function CreatePaidContent() {
  const [isCreating, setIsCreating] = useState(false);

  const createDemoPaidContent = () => {
    setIsCreating(true);
    
    const demoContent: ContentItem = {
      id: `premium_demo_${Date.now()}`,
      title: 'Advanced Web3 Development Masterclass',
      description: 'Learn cutting-edge Web3 development techniques with real-world projects. Includes smart contracts, DeFi protocols, and NFT marketplace development.',
      content: `
        <h2>Welcome to the Advanced Web3 Development Masterclass!</h2>
        <p>This comprehensive course covers:</p>
        <ul>
          <li>Smart Contract Development with Solidity</li>
          <li>DeFi Protocol Architecture</li>
          <li>NFT Marketplace Implementation</li>
          <li>Web3 Integration Best Practices</li>
          <li>Security Auditing Techniques</li>
        </ul>
        <p>You'll build real projects and learn from industry experts.</p>
        <h3>Course Materials Include:</h3>
        <ul>
          <li>30+ Video Lessons (10+ hours)</li>
          <li>Source Code Repository</li>
          <li>Live Q&A Sessions</li>
          <li>Certificate of Completion</li>
        </ul>
      `,
      contentType: 'article',
      tags: ['web3', 'solidity', 'defi', 'nft', 'blockchain', 'premium'],
      price: 0.01, // 0.01 ETH = ~$20
      isPremium: true,
      creatorAddress: '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E',
      creatorName: 'Web3 Academy',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 156,
      earnings: 0,
      likes: 23,
      status: 'published',
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
    };

    contentStorage.saveContent(demoContent);
    setIsCreating(false);
    
    alert('✅ Demo paid content created! Check /browse to see it.');
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-medium text-yellow-800 mb-2">🧪 Demo Tools</h3>
      <p className="text-sm text-yellow-700 mb-3">
        Create demo paid content to test the payment system
      </p>
      <button
        onClick={createDemoPaidContent}
        disabled={isCreating}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
      >
        {isCreating ? 'Creating...' : 'Create Demo Paid Content'}
      </button>
    </div>
  );
}
