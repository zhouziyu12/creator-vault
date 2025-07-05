'use client';

import { useUser } from '@civic/auth-web3/react';
import { RealSepoliaWallet } from './RealSepoliaWallet';

export function WalletInfo() {
  const { user } = useUser();

  // 直接使用真实的 Sepolia 钱包组件
  return <RealSepoliaWallet />;
}
