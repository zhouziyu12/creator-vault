'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  X, 
  Check,
  AlertCircle,
  Play,
  Loader2
} from 'lucide-react';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileUpload: (file: File, dataUrl: string) => void;
  onFileRemove?: () => void;
  currentFile?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  className?: string;
}

export function FileUploader({ 
  accept, 
  maxSize = 50, 
  onFileUpload, 
  onFileRemove,
  currentFile,
  type,
  className = '' 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    switch (type) {
      case 'image':
        return accept || 'image/*';
      case 'video':
        return accept || 'video/*';
      case 'audio':
        return accept || 'audio/*';
      default:
        return accept || '*/*';
    }
  };

  const getIconForType = () => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  const validateFile = (file: File): string | null => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // 检查文件类型
    const acceptedTypes = getAcceptString().split(',').map(t => t.trim());
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    const isValidType = acceptedTypes.some(acceptType => {
      if (acceptType === '*/*') return true;
      if (acceptType.endsWith('/*')) {
        return fileType.startsWith(acceptType.slice(0, -1));
      }
      return acceptType === fileType || acceptType === fileExtension;
    });

    if (!isValidType) {
      return `Invalid file type. Accepted: ${getAcceptString()}`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError('');
    setIsUploading(true);

    try {
      // 验证文件
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setIsUploading(false);
        return;
      }

      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onFileUpload(file, dataUrl);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setError('Upload failed');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const Icon = getIconForType();

  // 如果已有文件，显示预览
  if (currentFile) {
    return (
      <div className={`relative ${className}`}>
        {type === 'image' && (
          <div className="relative group">
            <img
              src={currentFile}
              alt="Uploaded content"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
                {onFileRemove && (
                  <button
                    onClick={onFileRemove}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {type === 'video' && (
          <div className="relative group">
            <video
              src={currentFile}
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              controls
            />
            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Upload className="w-4 h-4" />
              </button>
              {onFileRemove && (
                <button
                  onClick={onFileRemove}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-purple-400 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          )}

          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {isUploading ? 'Uploading...' : `Upload ${type}`}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-500">
              Max size: {maxSize}MB • Formats: {getAcceptString()}
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
