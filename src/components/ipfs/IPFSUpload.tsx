'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, Video, Music, AlertCircle, CheckCircle, Globe, Loader2 } from 'lucide-react';
import { pinataService } from '@/lib/ipfs/pinataService';

interface IPFSUploadProps {
  onUploadComplete: (ipfsHash: string, ipfsUrl: string, file: File) => void;
  onUploadError: (error: string) => void;
  acceptedTypes: string[];
  maxSize: number; // MB
  disabled?: boolean;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string;
  ipfsHash: string;
  ipfsUrl: string;
}

export function IPFSUpload({ 
  onUploadComplete, 
  onUploadError, 
  acceptedTypes, 
  maxSize,
  disabled = false
}: IPFSUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: '',
    ipfsHash: '',
    ipfsUrl: ''
  });
  const [dragActive, setDragActive] = useState(false);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    // 检查文件类型
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === type;
    });

    if (!isValidType) {
      const error = `File type not supported. Accepted: ${acceptedTypes.join(', ')}`;
      setUploadState(prev => ({ ...prev, error }));
      onUploadError(error);
      return false;
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      const error = `File too large. Maximum size: ${maxSize}MB`;
      setUploadState(prev => ({ ...prev, error }));
      onUploadError(error);
      return false;
    }

    setUploadState(prev => ({ ...prev, error: '' }));
    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file) || disabled) return;

    setSelectedFile(file);
    
    // 创建预览URL
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }

    // 自动开始上传到IPFS
    uploadToIPFS(file);
  }, [acceptedTypes, maxSize, disabled]);

  const uploadToIPFS = async (file: File) => {
    setUploadState(prev => ({ ...prev, isUploading: true, progress: 0, error: '' }));

    try {
      // 模拟上传进度（Pinata不提供真实进度）
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90)
        }));
      }, 500);

      const result = await pinataService.uploadFile(file, {
        uploader: 'CreatorVault',
        category: 'content'
      });

      clearInterval(progressInterval);

      const ipfsUrl = pinataService.getPinataUrl(result.IpfsHash);
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        ipfsHash: result.IpfsHash,
        ipfsUrl
      }));

      onUploadComplete(result.IpfsHash, ipfsUrl, file);

    } catch (error: any) {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: error.message || 'Upload failed'
      }));
      onUploadError(error.message || 'Upload failed');
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || !e.dataTransfer.files || !e.dataTransfer.files[0]) return;
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files || !e.target.files[0]) return;
    handleFileSelect(e.target.files[0]);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setUploadState({
      isUploading: false,
      progress: 0,
      error: '',
      ipfsHash: '',
      ipfsUrl: ''
    });
  };

  // 显示上传完成状态
  if (uploadState.ipfsHash && !uploadState.isUploading) {
    const FileIcon = selectedFile ? getFileIcon(selectedFile) : FileText;
    
    return (
      <div className="border border-green-300 bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Uploaded to IPFS Successfully!</p>
              <p className="text-sm text-green-600">File is now permanently stored on IPFS</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-green-600" />
          </button>
        </div>

        {selectedFile && (
          <div className="flex items-center space-x-3 mb-3">
            <FileIcon className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">IPFS Hash:</span>
          </div>
          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
            {uploadState.ipfsHash}
          </code>
        </div>

        <div className="flex space-x-2">
          <a
            href={uploadState.ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-center text-sm hover:bg-blue-700 transition-colors"
          >
            View on IPFS
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(uploadState.ipfsHash)}
            className="bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-300 transition-colors"
          >
            Copy Hash
          </button>
        </div>

        {/* 预览 */}
        {previewUrl && selectedFile && (
          <div className="mt-4">
            {selectedFile.type.startsWith('image/') && (
              <img
                src={uploadState.ipfsUrl}
                alt="IPFS Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={() => {
                  // 如果IPFS URL失败，回退到本地预览
                  const img = document.querySelector('img[alt="IPFS Preview"]') as HTMLImageElement;
                  if (img) img.src = previewUrl;
                }}
              />
            )}
            {selectedFile.type.startsWith('video/') && (
              <video
                src={uploadState.ipfsUrl}
                controls
                className="w-full h-48 rounded-lg"
                onError={() => {
                  // 如果IPFS URL失败，回退到本地预览
                  const video = document.querySelector('video') as HTMLVideoElement;
                  if (video) video.src = previewUrl;
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // 显示上传中状态
  if (uploadState.isUploading) {
    return (
      <div className="border border-blue-300 bg-blue-50 rounded-lg p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Uploading to IPFS...
          </h3>
          <p className="text-blue-600 mb-4">
            Your file is being stored on the decentralized web
          </p>
          
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
          <p className="text-sm text-blue-600">
            {uploadState.progress.toFixed(0)}% complete
          </p>

          {selectedFile && (
            <div className="mt-4 text-left bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{selectedFile.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 显示上传区域
  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadState.error
            ? 'border-red-300 bg-red-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="ipfs-file-upload"
          disabled={disabled}
        />
        
        <Globe className={`w-12 h-12 mx-auto mb-4 ${
          uploadState.error ? 'text-red-400' : 
          disabled ? 'text-gray-300' : 'text-blue-500'
        }`} />
        
        <label htmlFor="ipfs-file-upload" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <span className={`font-medium ${
            disabled ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'
          }`}>
            Upload to IPFS
          </span>
          <span className="text-gray-500"> or drag and drop</span>
        </label>
        
        <p className="text-sm text-gray-500 mt-2">
          Decentralized storage • Permanent • Censorship resistant
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max: {maxSize}MB • Types: {acceptedTypes.join(', ')}
        </p>
      </div>

      {uploadState.error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{uploadState.error}</span>
        </div>
      )}
    </div>
  );
}
