'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { WalletInfo } from '@/components/web3/WalletInfo';

export default function WalletPage() {
  return (
    <PageLayout 
      title="Web3 Wallet" 
      description="Manage your Sepolia ETH wallet and track your earnings"
    >
      <WalletInfo />
    </PageLayout>
  );
}
