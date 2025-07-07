'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ComponentType<any>;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon: FallbackIcon = ImageIcon 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 如果没有 src 或图片加载失败，显示回退内容
  if (!src || imageError) {
    return (
      <div className={`bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center ${className}`}>
        <FallbackIcon className="w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center animate-pulse">
          <FallbackIcon className="w-8 h-8 text-purple-600" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
