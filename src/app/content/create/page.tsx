'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Web3CreateContentForm } from '@/components/content/Web3CreateContentForm';

export default function CreateContentPage() {
  return (
    <PageLayout 
      title="Create Web3 Content" 
      description="Upload to IPFS and start earning Sepolia ETH"
      showBackButton={true}
    >
      <Web3CreateContentForm />
    </PageLayout>
  );
}
