import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CivicAuthProvider } from '@civic/auth-web3/react';
import { CivicAuthWrapper } from '@/components/providers/CivicAuthWrapper';
import { Web3Provider } from '@/components/providers/Web3Provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CreatorVault Pro - Web3 Creator Economy',
  description: 'Empower creators with Web3 wallets, Civic Auth identity verification, and zero platform fees.',
  keywords: ['Web3', 'Creator Economy', 'Civic Auth', 'Web3 Wallets', 'Decentralized'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <CivicAuthProvider clientId="dcabc3f5-8fb6-4fc9-ae3d-72f63762ee36">
            <CivicAuthWrapper>
              {children}
            </CivicAuthWrapper>
          </CivicAuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
