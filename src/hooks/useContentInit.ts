'use client';

import { useEffect, useState } from 'react';
import { contentStorage } from '@/lib/content/storage';

export function useContentInit() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 只在客户端初始化示例内容
    if (typeof window !== 'undefined') {
      try {
        contentStorage.initializeSampleContents();
        setIsInitialized(true);
        console.log('✅ Content storage initialized on client side');
      } catch (error) {
        console.error('❌ Failed to initialize content storage:', error);
        setIsInitialized(true); // 即使失败也标记为已初始化
      }
    }
  }, []);

  return isInitialized;
}
