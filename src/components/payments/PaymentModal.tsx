'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { ContentItem } from '@/types/content';
import { PaywallModal } from '@/components/payments/PaywallModal';
import { TipModal } from '@/components/payments/TipModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
  paymentType: 'purchase' | 'tip';
  onPaymentSuccess: () => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  content, 
  paymentType, 
  onPaymentSuccess 
}: PaymentModalProps) {
  if (paymentType === 'purchase') {
    return (
      <PaywallModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          id: content.id,
          title: content.title,
          price: content.price,
          creatorAddress: content.creatorAddress,
          creatorName: content.creatorName
        }}
        onPurchaseSuccess={onPaymentSuccess}
      />
    );
  }

  return (
    <TipModal
      isOpen={isOpen}
      onClose={onClose}
      creator={{
        address: content.creatorAddress,
        name: content.creatorName
      }}
      onTipSuccess={onPaymentSuccess}
    />
  );
}
