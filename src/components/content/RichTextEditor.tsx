// src/components/content/RichTextEditor.tsx
'use client';

import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image,
  Eye,
  Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const formatPreview = (html: string) => {
    return html
      .replace(/<div>/g, '<p>')
      .replace(/<\/div>/g, '</p>')
      .replace(/<br>/g, '<br />')
      .replace(/&nbsp;/g, ' ');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            type="button"
            onClick={() => formatText('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('formatBlock', 'blockquote')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            type="button"
            onClick={insertLink}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
              isPreview
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-200'
            }`}
          >
            {isPreview ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 编辑器/预览区域 */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: formatPreview(value) }}
          />
        ) : (
          <div
            contentEditable
            onInput={handleContentChange}
            className="p-4 min-h-[300px] focus:outline-none"
            style={{ whiteSpace: 'pre-wrap' }}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
          />
        )}
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}