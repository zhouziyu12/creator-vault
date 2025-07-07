'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface MediaPreviewProps {
  src: string;
  type: 'image' | 'video' | 'audio';
  title?: string;
  className?: string;
}

export function MediaPreview({ src, type, title, className = '' }: MediaPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (type === 'image') {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={src}
          alt={title || 'Preview'}
          className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 p-2 rounded-full shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`relative group ${className}`}>
        <video
          src={src}
          className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
          controls
          poster={src} // 使用视频第一帧作为封面
        />
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Video Content
          </div>
        </div>
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className={`bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <audio
          src={src}
          controls
          className="w-full"
        />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Audio Content</p>
          {title && <p className="text-xs text-gray-500">{title}</p>}
        </div>
      </div>
    );
  }

  return null;
}
