'use client';

import { useState, useRef } from 'react';
import { FileUploader } from './FileUploader';
import { 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Link, 
  Image as ImageIcon,
  Video,
  Code,
  Eye,
  Edit3,
  Type,
  Heading1,
  Heading2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) +
      before + textToInsert + after +
      value.substring(end);
    
    onChange(newValue);
    
    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleFileUpload = (file: File, url: string) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    let insertHTML = '';
    
    if (isImage) {
      insertHTML = `\n<div class="my-4 text-center">
  <img src="${url}" alt="${file.name}" class="max-w-full h-auto rounded-lg shadow-md mx-auto" />
  <p class="text-sm text-gray-600 mt-2">${file.name}</p>
</div>\n`;
    } else if (isVideo) {
      insertHTML = `\n<div class="my-4 text-center">
  <video controls class="max-w-full h-auto rounded-lg shadow-md mx-auto">
    <source src="${url}" type="${file.type}">
    Your browser does not support the video tag.
  </video>
  <p class="text-sm text-gray-600 mt-2">${file.name}</p>
</div>\n`;
    }
    
    onChange(value + insertHTML);
    setShowUploader(false);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertText('<h1>', '</h1>', 'Heading 1')
    },
    {
      icon: Heading2,
      label: 'Heading 2', 
      action: () => insertText('<h2>', '</h2>', 'Heading 2')
    },
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertText('<strong>', '</strong>', 'bold text')
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertText('<em>', '</em>', 'italic text')
    },
    {
      icon: List,
      label: 'List',
      action: () => insertText('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>', 'Item 1')
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertText('<blockquote>', '</blockquote>', 'Your quote here')
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertText('<a href="URL">', '</a>', 'link text')
    },
    {
      icon: Code,
      label: 'Code',
      action: () => insertText('<code>', '</code>', 'code')
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* 工具栏 */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  onClick={button.action}
                  title={button.label}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-700" />
                </button>
              );
            })}
            
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            <button
              onClick={() => setShowUploader(!showUploader)}
              title="Upload Media"
              className={`p-2 rounded transition-colors ${
                showUploader ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                previewMode 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {previewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="text-xs font-medium">
                {previewMode ? 'Edit' : 'Preview'}
              </span>
            </button>
          </div>
        </div>

        {/* 文件上传器 */}
        {showUploader && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <FileUploader
              onFileSelect={handleFileUpload}
              className="min-h-[120px]"
            />
          </div>
        )}
      </div>

      {/* 编辑器内容 */}
      <div className="relative">
        {previewMode ? (
          <div className="p-4 min-h-[300px] prose max-w-none">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <p className="text-gray-500 italic">Content preview will appear here...</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Write your content here... You can use the toolbar above for formatting."}
              className="w-full p-4 border-0 focus:ring-0 resize-none font-mono text-sm min-h-[300px]"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace' }}
            />
            
            {/* 格式提示 */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
              HTML supported
            </div>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Use the toolbar for quick formatting or write HTML directly
          </span>
          <span>
            {value.length} characters
          </span>
        </div>
      </div>
    </div>
  );
}
