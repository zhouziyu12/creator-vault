'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  File,
  Check,
  AlertCircle 
} from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File, url: string) => void;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
}

export function FileUploader({ 
  onFileSelect, 
  accept = "image/*,video/*", 
  maxSize = 10,
  className = ""
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(null);
    
    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    setUploading(true);

    try {
      // 创建预览URL
      const url = URL.createObjectURL(file);
      
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onFileSelect(file, url);
      setSuccess(`${isImage ? 'Image' : 'Video'} uploaded successfully!`);
      
      // 清除成功消息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        onDrag={handleDrag}
        onDragStart={handleDrag}
        onDragEnd={handleDrag}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragging ? 'Drop your file here' : 'Upload media files'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop or click to select images and videos
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports: JPG, PNG, GIF, MP4, MOV (Max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 状态消息 */}
      {(error || success) && (
        <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
          error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {error ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm">{error || success}</span>
          {error && (
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
